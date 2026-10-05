import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { type Page, type PageQueryDto, toPage } from '../../common/pagination';

export interface AuditEntry {
  actorId?: string | null;
  /** Human-readable actor, retained even if the account is later removed. */
  actorLabel: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export interface AuditQuery {
  resource?: string;
  resourceId?: string;
  actorId?: string;
  action?: string;
  from?: Date;
  to?: Date;
}

/**
 * Append-only activity log. Writes are deliberately non-throwing: a failed
 * audit write must not roll back the operation it describes, but it is logged
 * at error level so the gap is visible in the server log.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: entry.actorId ?? null,
          actorLabel: entry.actorLabel,
          action: entry.action,
          resource: entry.resource,
          resourceId: entry.resourceId,
          metadataJson: entry.metadata ? JSON.stringify(entry.metadata) : null,
          ipAddress: entry.ipAddress,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to write audit entry ${entry.action} on ${entry.resource}/${entry.resourceId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async list(query: PageQueryDto, filters: AuditQuery): Promise<Page<AuditRecord>> {
    const where = {
      resource: filters.resource,
      resourceId: filters.resourceId,
      actorId: filters.actorId,
      action: filters.action,
      createdAt:
        filters.from || filters.to
          ? { gte: filters.from, lte: filters.to }
          : undefined,
    };

    const [rows, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return toPage(rows.map(toAuditRecord), total, query);
  }

  /** Full history for one record, oldest first, for the detail timelines. */
  async trailFor(resource: string, resourceId: string): Promise<AuditRecord[]> {
    const rows = await this.prisma.auditLog.findMany({
      where: { resource, resourceId },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map(toAuditRecord);
  }
}

export interface AuditRecord {
  id: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  resource: string;
  resourceId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
}

function toAuditRecord(row: {
  id: string;
  actorId: string | null;
  actorLabel: string;
  action: string;
  resource: string;
  resourceId: string;
  metadataJson: string | null;
  ipAddress: string | null;
  createdAt: Date;
}): AuditRecord {
  return {
    id: row.id,
    actorId: row.actorId,
    actorLabel: row.actorLabel,
    action: row.action,
    resource: row.resource,
    resourceId: row.resourceId,
    metadata: parseMetadata(row.metadataJson),
    ipAddress: row.ipAddress,
    createdAt: row.createdAt,
  };
}

function parseMetadata(value: string | null): Record<string, unknown> | null {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}
