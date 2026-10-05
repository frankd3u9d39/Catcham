import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { StorageService } from './storage.service';
import { validateUpload } from './file-validation';
import { computeEntryHash, verifyChain, type ChainVerdict } from './custody';
import { type Page, type PageQueryDto, toPage } from '../../common/pagination';
import type { CustodyAction, EvidenceClassification } from '../../common/constants';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import type { AnnotateEvidenceDto, TransferCustodyDto } from './dto/evidence.dto';

export interface EvidenceRecord {
  id: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  classification: string;
  isArchived: boolean;
  reportId: string | null;
  investigationId: string | null;
  createdAt: Date;
  custodyEntries: number;
}

@Injectable()
export class EvidenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  async upload(
    file: { buffer: Buffer; originalname: string },
    target: { reportId?: string; investigationId?: string; classification?: EvidenceClassification },
    actor: AuthenticatedUser,
    ipAddress?: string,
  ): Promise<EvidenceRecord> {
    if (!target.reportId && !target.investigationId) {
      throw new BadRequestException('Evidence must be attached to a report or an investigation.');
    }

    await this.assertTargetAccessible(target, actor);

    const { mimeType, safeFileName } = validateUpload(
      file.buffer,
      file.originalname,
      this.config.getOrThrow<number>('UPLOAD_MAX_BYTES'),
    );

    const stored = await this.storage.put(file.buffer, safeFileName);

    const evidence = await this.prisma.$transaction(async (tx) => {
      const created = await tx.evidence.create({
        data: {
          originalFileName: safeFileName,
          storageKey: stored.storageKey,
          mimeType,
          sizeBytes: stored.sizeBytes,
          sha256Hash: stored.sha256Hash,
          reportId: target.reportId ?? null,
          investigationId: target.investigationId ?? null,
          uploadedById: actor.id,
          classification: target.classification ?? 'CONFIDENTIAL',
        },
      });

      await this.appendCustodyEntry(tx, {
        evidenceId: created.id,
        action: 'INTAKE',
        performedById: actor.id,
        reason: `Uploaded by ${actor.fullName}.`,
        ipAddress,
      });

      return created;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'EVIDENCE_UPLOADED',
      resource: 'evidence',
      resourceId: evidence.id,
      metadata: {
        fileName: safeFileName,
        mimeType,
        sizeBytes: stored.sizeBytes,
        sha256: stored.sha256Hash,
      },
      ipAddress,
    });

    return { ...toEvidenceRecord(evidence), custodyEntries: 1 };
  }

  async list(
    query: PageQueryDto,
    filters: { reportId?: string; investigationId?: string; includeArchived?: boolean },
  ): Promise<Page<EvidenceRecord>> {
    const where = {
      reportId: filters.reportId,
      investigationId: filters.investigationId,
      ...(filters.includeArchived ? {} : { isArchived: false }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.evidence.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { custodyRecords: true } } },
      }),
      this.prisma.evidence.count({ where }),
    ]);

    return toPage(
      rows.map((row) => ({ ...toEvidenceRecord(row), custodyEntries: row._count.custodyRecords })),
      total,
      query,
    );
  }

  /** Reading evidence metadata is itself a custody event, so it is recorded. */
  async findById(
    id: string,
    actor: AuthenticatedUser,
    ipAddress?: string,
  ): Promise<EvidenceRecord & { annotations: unknown[]; integrity: ChainVerdict }> {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id },
      include: {
        annotations: { orderBy: { createdAt: 'desc' } },
        custodyRecords: { orderBy: { sequence: 'asc' } },
      },
    });

    if (!evidence) {
      throw new NotFoundException(`No evidence with id ${id}.`);
    }

    await this.appendCustodyEntry(this.prisma, {
      evidenceId: id,
      action: 'VIEWED',
      performedById: actor.id,
      reason: `Metadata viewed by ${actor.fullName}.`,
      ipAddress,
    });

    return {
      ...toEvidenceRecord(evidence),
      custodyEntries: evidence.custodyRecords.length,
      annotations: evidence.annotations,
      integrity: verifyChain(id, evidence.custodyRecords),
    };
  }

  /**
   * Re-reads the blob, re-hashes it and compares against the hash recorded at
   * intake, then verifies the custody chain. Both must hold for the evidence to
   * be presentable.
   */
  async verifyIntegrity(id: string): Promise<{
    fileIntact: boolean;
    storedHash: string;
    currentHash: string | null;
    chain: ChainVerdict;
  }> {
    const evidence = await this.prisma.evidence.findUnique({
      where: { id },
      include: { custodyRecords: { orderBy: { sequence: 'asc' } } },
    });

    if (!evidence) {
      throw new NotFoundException(`No evidence with id ${id}.`);
    }

    const currentHash = await this.hashStoredObject(evidence.storageKey);

    return {
      fileIntact: currentHash === evidence.sha256Hash,
      storedHash: evidence.sha256Hash,
      currentHash,
      chain: verifyChain(id, evidence.custodyRecords),
    };
  }

  async openDownload(
    id: string,
    actor: AuthenticatedUser,
    ipAddress?: string,
  ): Promise<{ stream: NodeJS.ReadableStream; fileName: string; mimeType: string; sizeBytes: number }> {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });

    if (!evidence) {
      throw new NotFoundException(`No evidence with id ${id}.`);
    }
    if (evidence.isArchived) {
      throw new ForbiddenException('This evidence has been archived and its file removed.');
    }
    if (!(await this.storage.exists(evidence.storageKey))) {
      throw new NotFoundException('The stored file is missing. Report this to the administrator.');
    }

    await this.appendCustodyEntry(this.prisma, {
      evidenceId: id,
      action: 'DOWNLOADED',
      performedById: actor.id,
      reason: `Downloaded by ${actor.fullName}.`,
      ipAddress,
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'EVIDENCE_DOWNLOADED',
      resource: 'evidence',
      resourceId: id,
      ipAddress,
    });

    return {
      stream: this.storage.createReadStream(evidence.storageKey),
      fileName: evidence.originalFileName,
      mimeType: evidence.mimeType,
      sizeBytes: evidence.sizeBytes,
    };
  }

  async transferCustody(
    id: string,
    dto: TransferCustodyDto,
    actor: AuthenticatedUser,
    ipAddress?: string,
  ) {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });
    if (!evidence) {
      throw new NotFoundException(`No evidence with id ${id}.`);
    }

    const recipient = await this.prisma.user.findUnique({ where: { id: dto.transferredToId } });
    if (!recipient) {
      throw new BadRequestException('The recipient account does not exist.');
    }
    if (recipient.id === actor.id) {
      throw new BadRequestException('Evidence cannot be transferred to its current holder.');
    }

    const entry = await this.appendCustodyEntry(this.prisma, {
      evidenceId: id,
      action: 'TRANSFERRED',
      performedById: actor.id,
      transferredToId: recipient.id,
      reason: dto.reason.trim(),
      ipAddress,
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'EVIDENCE_CUSTODY_TRANSFERRED',
      resource: 'evidence',
      resourceId: id,
      metadata: { to: recipient.email, reason: dto.reason },
      ipAddress,
    });

    return entry;
  }

  async annotate(id: string, dto: AnnotateEvidenceDto, actor: AuthenticatedUser) {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });
    if (!evidence) {
      throw new NotFoundException(`No evidence with id ${id}.`);
    }

    const annotation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.evidenceAnnotation.create({
        data: {
          evidenceId: id,
          authorId: actor.id,
          annotationText: dto.text.trim(),
          metadataJson: dto.metadata ? JSON.stringify(dto.metadata) : null,
        },
      });

      await this.appendCustodyEntry(tx, {
        evidenceId: id,
        action: 'ANNOTATED',
        performedById: actor.id,
        reason: `Annotated by ${actor.fullName}.`,
      });

      return created;
    });

    return annotation;
  }

  async custodyTrail(id: string) {
    const records = await this.prisma.custodyRecord.findMany({
      where: { evidenceId: id },
      orderBy: { sequence: 'asc' },
    });

    if (records.length === 0) {
      // An evidence record always has at least an INTAKE entry, so an empty
      // trail means the id is wrong rather than that nothing has happened.
      const exists = await this.prisma.evidence.count({ where: { id } });
      if (exists === 0) {
        throw new NotFoundException(`No evidence with id ${id}.`);
      }
    }

    // Resolve actor names in one query rather than per row.
    const actorIds = [
      ...new Set(
        records.flatMap((record) =>
          [record.performedById, record.transferredToId].filter((value): value is string => !!value),
        ),
      ),
    ];
    const actors = await this.prisma.user.findMany({
      where: { id: { in: actorIds } },
      select: { id: true, fullName: true, email: true },
    });
    const byId = new Map(actors.map((actor) => [actor.id, actor]));

    return {
      entries: records.map((record) => ({
        sequence: record.sequence,
        action: record.action,
        reason: record.reason,
        performedBy: record.performedById ? byId.get(record.performedById) ?? null : null,
        transferredTo: record.transferredToId ? byId.get(record.transferredToId) ?? null : null,
        ipAddress: record.ipAddress,
        entryHash: record.entryHash,
        createdAt: record.createdAt,
      })),
      integrity: verifyChain(id, records),
    };
  }

  /**
   * Archives the record and removes the blob. The database row and its custody
   * chain are kept, so the trail remains auditable after the file is gone.
   */
  async archive(id: string, reason: string, actor: AuthenticatedUser) {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });
    if (!evidence) {
      throw new NotFoundException(`No evidence with id ${id}.`);
    }
    if (evidence.isArchived) {
      throw new BadRequestException('This evidence is already archived.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.evidence.update({ where: { id }, data: { isArchived: true } });
      await this.appendCustodyEntry(tx, {
        evidenceId: id,
        action: 'ARCHIVED',
        performedById: actor.id,
        reason: reason.trim(),
      });
    });

    await this.storage.remove(evidence.storageKey);

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'EVIDENCE_ARCHIVED',
      resource: 'evidence',
      resourceId: id,
      metadata: { reason },
    });

    return { id, isArchived: true };
  }

  /**
   * Appends to the custody chain. The read of the last sequence and the insert
   * share a transaction, and the (evidenceId, sequence) unique index is the
   * backstop that rejects a concurrent append rather than silently forking the
   * chain.
   */
  private async appendCustodyEntry(
    client: PrismaTransactionClient,
    input: {
      evidenceId: string;
      action: CustodyAction;
      performedById: string | null;
      transferredToId?: string | null;
      reason: string;
      ipAddress?: string;
    },
  ) {
    const last = await client.custodyRecord.findFirst({
      where: { evidenceId: input.evidenceId },
      orderBy: { sequence: 'desc' },
    });

    const sequence = (last?.sequence ?? 0) + 1;
    const createdAt = new Date();
    const previousHash = last?.entryHash ?? null;

    const entryHash = computeEntryHash({
      evidenceId: input.evidenceId,
      sequence,
      action: input.action,
      performedById: input.performedById,
      transferredToId: input.transferredToId ?? null,
      reason: input.reason,
      createdAt,
      previousHash,
    });

    return client.custodyRecord.create({
      data: {
        evidenceId: input.evidenceId,
        sequence,
        action: input.action,
        performedById: input.performedById,
        transferredToId: input.transferredToId ?? null,
        reason: input.reason,
        ipAddress: input.ipAddress,
        previousHash,
        entryHash,
        createdAt,
      },
    });
  }

  private async assertTargetAccessible(
    target: { reportId?: string; investigationId?: string },
    actor: AuthenticatedUser,
  ): Promise<void> {
    if (target.investigationId) {
      const investigation = await this.prisma.investigation.findUnique({
        where: { id: target.investigationId },
        select: { agencyId: true, status: true },
      });

      if (!investigation) {
        throw new BadRequestException('That investigation does not exist.');
      }
      if (!actor.agencyIds.includes(investigation.agencyId)) {
        throw new ForbiddenException('You are not a member of the agency that owns this case.');
      }
      if (investigation.status === 'CLOSED') {
        throw new BadRequestException('Evidence cannot be added to a closed case.');
      }
    }

    if (target.reportId) {
      const report = await this.prisma.report.count({ where: { id: target.reportId } });
      if (report === 0) {
        throw new BadRequestException('That report does not exist.');
      }
    }
  }

  private async hashStoredObject(storageKey: string): Promise<string | null> {
    if (!(await this.storage.exists(storageKey))) {
      return null;
    }

    const { createHash } = await import('node:crypto');
    const hash = createHash('sha256');

    return new Promise((resolve, reject) => {
      this.storage
        .createReadStream(storageKey)
        .on('data', (chunk) => hash.update(chunk))
        .on('end', () => resolve(hash.digest('hex')))
        .on('error', reject);
    });
  }
}

/** Either the Prisma client or an interactive transaction client. */
type PrismaTransactionClient = Pick<PrismaService, 'custodyRecord'>;

function toEvidenceRecord(row: {
  id: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  classification: string;
  isArchived: boolean;
  reportId: string | null;
  investigationId: string | null;
  createdAt: Date;
}): Omit<EvidenceRecord, 'custodyEntries'> {
  return {
    id: row.id,
    originalFileName: row.originalFileName,
    mimeType: row.mimeType,
    sizeBytes: row.sizeBytes,
    sha256Hash: row.sha256Hash,
    classification: row.classification,
    isArchived: row.isArchived,
    reportId: row.reportId,
    investigationId: row.investigationId,
    createdAt: row.createdAt,
  };
}
