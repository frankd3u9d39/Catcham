import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { GeoService } from '../geo/geo.service';
import { ReportRoutingService } from './report-routing.service';
import { references } from '../../common/utils/reference-generator.util';
import { hashSecret, verifySecret } from '../../common/utils/crypto.util';
import { type Page, toPage } from '../../common/pagination';
import type {
  RejectReportDto,
  ReportQueryDto,
  SaveDraftDto,
  SubmitReportDto,
  TrackReportDto,
  TriageReportDto,
} from './dto/report.dto';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

export interface SubmissionReceipt {
  referenceNumber: string;
  /** Returned once, at submission. Anonymous submitters need it to track the report. */
  trackingCode?: string;
  status: string;
  routedTo: string | null;
  submittedAt: Date;
}

export interface PublicReportStatus {
  referenceNumber: string;
  title: string;
  categoryName: string;
  status: string;
  submittedAt: Date;
  updatedAt: Date;
  /** Only non-confidential entries, so tracking cannot leak investigation detail. */
  timeline: Array<{ action: string; description: string; at: Date }>;
}

const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class ReportingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly geo: GeoService,
    private readonly routing: ReportRoutingService,
  ) {}

  listCategories() {
    return this.prisma.reportCategory.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      select: { id: true, code: true, name: true, description: true, severity: true },
    });
  }

  async submit(
    dto: SubmitReportDto,
    context: { ipAddress?: string; submitterId?: string },
  ): Promise<SubmissionReceipt> {
    const isAnonymous = dto.isAnonymous ?? true;

    if (!isAnonymous && !dto.contactEmail && !dto.contactPhone && !context.submitterId) {
      throw new BadRequestException(
        'A non-anonymous report needs contactEmail or contactPhone, or an authenticated submitter.',
      );
    }

    const category = await this.prisma.reportCategory.findFirst({
      where: { id: dto.categoryId, isActive: true },
    });
    if (!category) {
      throw new BadRequestException('That report category does not exist or is inactive.');
    }

    // Coordinates take precedence over submitted codes, since they are measured
    // rather than chosen from a dropdown.
    let { stateCode, lgaCode } = dto;
    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      const resolved = await this.geo.resolve({
        latitude: dto.latitude,
        longitude: dto.longitude,
      });
      stateCode = resolved.state?.code ?? stateCode;
      lgaCode = resolved.lga?.code ?? lgaCode;
    }

    const decision = await this.routing.decide({
      categoryId: category.id,
      categoryCode: category.code,
      categorySeverity: category.severity,
      stateCode,
      lgaCode,
      isAnonymous,
      title: dto.title,
    });

    const trackingCode = isAnonymous ? references.trackingCode() : undefined;

    const report = await this.prisma.$transaction(async (tx) => {
      const created = await tx.report.create({
        data: {
          referenceNumber: references.reportReference(),
          trackingCodeHash: trackingCode ? await hashSecret(trackingCode) : null,
          title: dto.title.trim(),
          description: dto.description.trim(),
          categoryId: category.id,
          isAnonymous,
          submitterId: isAnonymous ? null : context.submitterId ?? null,
          contactEmail: isAnonymous ? null : dto.contactEmail?.toLowerCase(),
          contactPhone: isAnonymous ? null : dto.contactPhone,
          stateCode,
          lgaCode,
          addressText: dto.addressText,
          latitude: dto.latitude,
          longitude: dto.longitude,
          occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : null,
          status: decision.agencyId ? 'ROUTED' : 'SUBMITTED',
          priority: decision.priority,
        },
      });

      await tx.reportTimeline.create({
        data: {
          reportId: created.id,
          action: 'SUBMITTED',
          description: isAnonymous
            ? 'Report received through the anonymous channel.'
            : 'Report received.',
          actorType: isAnonymous ? 'ANONYMOUS' : context.submitterId ? 'CITIZEN' : 'ANONYMOUS',
          actorId: context.submitterId ?? null,
        },
      });

      await tx.reportTimeline.create({
        data: {
          reportId: created.id,
          action: decision.agencyId ? 'ROUTED' : 'AWAITING_ROUTING',
          description: decision.reason,
          actorType: 'SYSTEM',
        },
      });

      return created;
    });

    await this.audit.record({
      actorId: context.submitterId ?? null,
      actorLabel: isAnonymous ? 'anonymous' : context.submitterId ?? dto.contactEmail ?? 'citizen',
      action: 'REPORT_SUBMITTED',
      resource: 'report',
      resourceId: report.id,
      metadata: {
        referenceNumber: report.referenceNumber,
        categoryCode: category.code,
        priority: decision.priority,
        appliedRules: decision.appliedRules,
        routedTo: decision.agencyName,
      },
      ipAddress: context.ipAddress,
    });

    return {
      referenceNumber: report.referenceNumber,
      trackingCode,
      status: report.status,
      routedTo: decision.agencyName,
      submittedAt: report.createdAt,
    };
  }

  /**
   * Public tracking. Requires both the reference number and the tracking code,
   * so a guessed reference alone discloses nothing. A non-anonymous report has
   * no tracking code and is readable only through the authenticated endpoints.
   */
  async track(dto: TrackReportDto): Promise<PublicReportStatus> {
    const report = await this.prisma.report.findUnique({
      where: { referenceNumber: dto.referenceNumber },
      include: {
        category: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    });

    const notFound = new NotFoundException('No report matches that reference and tracking code.');

    if (!report?.trackingCodeHash) {
      throw notFound;
    }
    if (!(await verifySecret(report.trackingCodeHash, dto.trackingCode))) {
      throw notFound;
    }

    return {
      referenceNumber: report.referenceNumber,
      title: report.title,
      categoryName: report.category.name,
      status: report.status,
      submittedAt: report.createdAt,
      updatedAt: report.updatedAt,
      timeline: report.timeline
        .filter((entry) => PUBLIC_TIMELINE_ACTIONS.has(entry.action))
        .map((entry) => ({
          action: entry.action,
          description: entry.description,
          at: entry.createdAt,
        })),
    };
  }

  async list(query: ReportQueryDto, actor: AuthenticatedUser): Promise<Page<ReportListItem>> {
    const term = query.search?.trim();

    const where: Prisma.ReportWhereInput = {
      status: query.status,
      priority: query.priority,
      categoryId: query.categoryId,
      stateCode: query.stateCode,
      ...(term
        ? {
            OR: [
              { referenceNumber: { contains: term.toUpperCase() } },
              { title: { contains: term } },
              { description: { contains: term } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: [{ createdAt: 'desc' }],
        include: {
          category: { select: { name: true, code: true } },
          investigations: { select: { id: true, caseNumber: true, agencyId: true } },
          _count: { select: { evidence: true } },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    // Reports are visible agency-wide before assignment, by design: triage
    // officers need to see the unrouted queue. Once a case exists, only members
    // of the owning agency see the case link.
    const agencyIds = new Set(actor.agencyIds);

    return toPage(
      rows.map((row) => ({
        id: row.id,
        referenceNumber: row.referenceNumber,
        title: row.title,
        categoryName: row.category.name,
        categoryCode: row.category.code,
        status: row.status,
        priority: row.priority,
        isAnonymous: row.isAnonymous,
        stateCode: row.stateCode,
        lgaCode: row.lgaCode,
        evidenceCount: row._count.evidence,
        createdAt: row.createdAt,
        caseNumber:
          row.investigations.find((investigation) => agencyIds.has(investigation.agencyId))
            ?.caseNumber ?? null,
      })),
      total,
      query,
    );
  }

  async findById(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        category: true,
        timeline: { orderBy: { createdAt: 'asc' } },
        investigations: {
          select: { id: true, caseNumber: true, status: true, agencyId: true, agency: true },
        },
        evidence: {
          select: {
            id: true,
            originalFileName: true,
            mimeType: true,
            sizeBytes: true,
            sha256Hash: true,
            classification: true,
            createdAt: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException(`No report with id ${id}.`);
    }

    return report;
  }

  async triage(id: string, dto: TriageReportDto, actor: AuthenticatedUser) {
    const report = await this.findById(id);

    if (report.status === 'REJECTED' || report.status === 'CLOSED') {
      throw new BadRequestException(`A ${report.status.toLowerCase()} report cannot be triaged.`);
    }

    if (dto.agencyId && !actor.agencyIds.includes(dto.agencyId)) {
      const target = await this.prisma.agency.findUnique({ where: { id: dto.agencyId } });
      if (!target) {
        throw new BadRequestException('That agency does not exist.');
      }
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.report.update({
        where: { id },
        data: { status: 'TRIAGED', priority: dto.priority },
      });

      await tx.reportTimeline.create({
        data: {
          reportId: id,
          action: 'TRIAGED',
          description:
            dto.note?.trim() ||
            `Triaged at ${dto.priority} priority${dto.agencyId ? ' with a manual agency override' : ''}.`,
          actorType: 'OFFICER',
          actorId: actor.id,
        },
      });

      return result;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'REPORT_TRIAGED',
      resource: 'report',
      resourceId: id,
      metadata: { priority: dto.priority, agencyId: dto.agencyId },
    });

    return updated;
  }

  async reject(id: string, dto: RejectReportDto, actor: AuthenticatedUser) {
    const report = await this.findById(id);

    if (report.investigations.length > 0) {
      throw new ForbiddenException(
        'This report already has an investigation and cannot be rejected. Close the case instead.',
      );
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.report.update({ where: { id }, data: { status: 'REJECTED' } });

      await tx.reportTimeline.create({
        data: {
          reportId: id,
          action: 'REJECTED',
          description: dto.reason.trim(),
          actorType: 'OFFICER',
          actorId: actor.id,
        },
      });

      return result;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'REPORT_REJECTED',
      resource: 'report',
      resourceId: id,
      metadata: { reason: dto.reason },
    });

    return updated;
  }

  async saveDraft(dto: SaveDraftDto) {
    const expiresAt = new Date(Date.now() + DRAFT_TTL_MS);

    const existing = await this.prisma.reportDraft.findFirst({ where: { ownerKey: dto.ownerKey } });

    const draft = existing
      ? await this.prisma.reportDraft.update({
          where: { id: existing.id },
          data: { payload: dto.payload, expiresAt },
        })
      : await this.prisma.reportDraft.create({
          data: { ownerKey: dto.ownerKey, payload: dto.payload, expiresAt },
        });

    return { id: draft.id, expiresAt: draft.expiresAt };
  }

  async loadDraft(ownerKey: string) {
    const draft = await this.prisma.reportDraft.findFirst({
      where: { ownerKey, expiresAt: { gt: new Date() } },
      orderBy: { updatedAt: 'desc' },
    });

    if (!draft) {
      throw new NotFoundException('No draft found for that key, or it has expired.');
    }

    return { payload: draft.payload, expiresAt: draft.expiresAt, updatedAt: draft.updatedAt };
  }

  async discardDraft(ownerKey: string): Promise<void> {
    await this.prisma.reportDraft.deleteMany({ where: { ownerKey } });
  }

  /** Removes expired drafts. Called on a timer by ReportingCleanupTask. */
  async purgeExpiredDrafts(): Promise<number> {
    const result = await this.prisma.reportDraft.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return result.count;
  }
}

/** Timeline actions a citizen may see when tracking their own report. */
const PUBLIC_TIMELINE_ACTIONS = new Set([
  'SUBMITTED',
  'ROUTED',
  'AWAITING_ROUTING',
  'TRIAGED',
  'INVESTIGATION_OPENED',
  'RESOLVED',
  'REJECTED',
  'CLOSED',
]);

export interface ReportListItem {
  id: string;
  referenceNumber: string;
  title: string;
  categoryName: string;
  categoryCode: string;
  status: string;
  priority: string;
  isAnonymous: boolean;
  stateCode: string | null;
  lgaCode: string | null;
  evidenceCount: number;
  createdAt: Date;
  caseNumber: string | null;
}
