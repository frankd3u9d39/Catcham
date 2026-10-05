import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, type Transporter } from 'nodemailer';
import { PrismaService } from '../../database/prisma.service';
import { type Page, type PageQueryDto, toPage } from '../../common/pagination';
import type { NotificationChannel } from '../../common/constants';

export interface NotificationRequest {
  recipientId: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
}

/**
 * Notification delivery. In-app notifications are a database row; email goes
 * out over SMTP when SMTP_HOST is configured and is otherwise logged, which is
 * the development default.
 *
 * Sending happens inline rather than through a queue: a single-process
 * deployment has nowhere to run a worker, and a failed send is recorded on the
 * row so it can be retried.
 */
@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);
  private transporter?: Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  onModuleInit(): void {
    const host = this.config.get<string>('SMTP_HOST');

    if (!host) {
      this.logger.warn('SMTP_HOST is not set; email notifications will be logged, not sent.');
      return;
    }

    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');

    this.transporter = createTransport({
      host,
      port: this.config.get<number>('SMTP_PORT'),
      secure: this.config.get<boolean>('SMTP_SECURE'),
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  /** Queues and attempts a notification. Never throws: delivery is best-effort. */
  async send(request: NotificationRequest): Promise<void> {
    const notification = await this.prisma.notification.create({
      data: {
        recipientId: request.recipientId,
        channel: request.channel,
        subject: request.subject,
        body: request.body,
      },
    });

    if (request.channel === 'IN_APP') {
      await this.markSent(notification.id);
      return;
    }

    try {
      await this.deliverEmail(request.recipientId, request.subject, request.body);
      await this.markSent(notification.id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Email delivery failed for notification ${notification.id}: ${message}`);

      await this.prisma.notification.update({
        where: { id: notification.id },
        data: { status: 'FAILED', attempts: { increment: 1 }, lastError: message.slice(0, 500) },
      });
    }
  }

  /** Fans one notification out to several recipients, skipping duplicates. */
  async sendToMany(
    recipientIds: readonly string[],
    notification: Omit<NotificationRequest, 'recipientId'>,
  ): Promise<void> {
    await Promise.all(
      [...new Set(recipientIds)].map((recipientId) =>
        this.send({ ...notification, recipientId }),
      ),
    );
  }

  async listForRecipient(
    recipientId: string,
    query: PageQueryDto,
    unreadOnly = false,
  ): Promise<Page<InboxItem>> {
    const where = { recipientId, ...(unreadOnly ? { readAt: null } : {}) };

    const [rows, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return toPage(
      rows.map((row) => ({
        id: row.id,
        channel: row.channel,
        subject: row.subject,
        body: row.body,
        readAt: row.readAt,
        createdAt: row.createdAt,
      })),
      total,
      query,
    );
  }

  countUnread(recipientId: string): Promise<number> {
    return this.prisma.notification.count({ where: { recipientId, readAt: null } });
  }

  /** Scoped by recipient so a caller cannot mark someone else's notification read. */
  async markRead(recipientId: string, notificationId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id: notificationId, recipientId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(recipientId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { recipientId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  private async markSent(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date(), attempts: { increment: 1 } },
    });
  }

  private async deliverEmail(recipientId: string, subject: string, body: string): Promise<void> {
    const recipient = await this.prisma.user.findUnique({
      where: { id: recipientId },
      select: { email: true },
    });

    if (!recipient) {
      throw new Error(`No user with id ${recipientId}.`);
    }

    if (!this.transporter) {
      this.logger.log(`[email not sent: no SMTP_HOST] to=${recipient.email} subject=${subject}`);
      return;
    }

    await this.transporter.sendMail({
      from: this.config.getOrThrow<string>('MAIL_FROM'),
      to: recipient.email,
      subject,
      text: body,
    });
  }
}

export interface InboxItem {
  id: string;
  channel: string;
  subject: string;
  body: string;
  readAt: Date | null;
  createdAt: Date;
}
