import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { NotificationService } from '../notification/notification.service';
import { WorkflowService } from '../workflow/workflow.service';
import { RulesService } from '../rules/rules.service';
import { references } from '../../common/utils/reference-generator.util';
import { type Page, toPage } from '../../common/pagination';
import { ROLE_CODES } from '../../common/constants';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import type {
  AssignInvestigatorDto,
  CloseInvestigationDto,
  CreateNoteDto,
  CreateTaskDto,
  EscalateInvestigationDto,
  InvestigationQueryDto,
  OpenInvestigationDto,
  TransitionInvestigationDto,
  UpdateTaskDto,
} from './dto/investigation.dto';

export interface CaseListItem {
  id: string;
  caseNumber: string;
  title: string;
  agencyName: string;
  priority: string;
  status: string;
  dueAt: Date | null;
  openTasks: number;
  evidenceCount: number;
  leadInvestigator: string | null;
  createdAt: Date;
}

@Injectable()
export class InvestigationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly notifications: NotificationService,
    private readonly workflow: WorkflowService,
    private readonly rules: RulesService,
  ) {}

  async open(dto: OpenInvestigationDto, actor: AuthenticatedUser) {
    this.assertAgencyMember(dto.agencyId, actor);

    const report = await this.prisma.report.findUnique({
      where: { id: dto.reportId },
      include: { category: true },
    });
    if (!report) {
      throw new BadRequestException('That report does not exist.');
    }
    if (report.status === 'REJECTED') {
      throw new BadRequestException('A rejected report cannot be opened as a case.');
    }

    const existing = await this.prisma.investigation.findFirst({
      where: { reportId: dto.reportId, agencyId: dto.agencyId },
    });
    if (existing) {
      throw new BadRequestException(
        `This agency already has case ${existing.caseNumber} for that report.`,
      );
    }

    const supervisor = await this.prisma.membership.findFirst({
      where: { userId: dto.supervisorId, agencyId: dto.agencyId },
    });
    if (!supervisor) {
      throw new BadRequestException('The supervisor must be a member of the owning agency.');
    }

    const definition = await this.workflow.activeDefinition();

    // The rules engine can raise the priority inherited from the report.
    const outcomes = await this.rules.evaluate('CASE_PRIORITY', {
      categoryCode: report.category.code,
      reportPriority: report.priority,
      stateCode: report.stateCode,
      isAnonymous: report.isAnonymous,
    });
    const ruledPriority = outcomes.find((outcome) => outcome.action === 'SET_PRIORITY')?.params
      .priority;

    const investigation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.investigation.create({
        data: {
          caseNumber: references.caseNumber(),
          reportId: dto.reportId,
          agencyId: dto.agencyId,
          supervisorId: dto.supervisorId,
          priority:
            dto.priority ??
            (typeof ruledPriority === 'string' ? ruledPriority : report.priority),
          status: definition.initialState,
          dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
        },
      });

      await tx.report.update({
        where: { id: dto.reportId },
        data: { status: 'UNDER_INVESTIGATION' },
      });

      await tx.reportTimeline.create({
        data: {
          reportId: dto.reportId,
          action: 'INVESTIGATION_OPENED',
          description: `Case ${created.caseNumber} opened.`,
          actorType: 'OFFICER',
          actorId: actor.id,
        },
      });

      return created;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'INVESTIGATION_OPENED',
      resource: 'investigation',
      resourceId: investigation.id,
      metadata: { caseNumber: investigation.caseNumber, reportId: dto.reportId },
    });

    await this.notifications.send({
      recipientId: dto.supervisorId,
      channel: 'IN_APP',
      subject: `You supervise case ${investigation.caseNumber}`,
      body: `${actor.fullName} opened ${investigation.caseNumber} from report ${report.referenceNumber}: ${report.title}`,
    });

    return investigation;
  }

  async list(query: InvestigationQueryDto, actor: AuthenticatedUser): Promise<Page<CaseListItem>> {
    if (query.agencyId) {
      this.assertAgencyMember(query.agencyId, actor);
    }

    const term = query.search?.trim();

    // Cases are always scoped to the caller's agencies; there is no cross-agency
    // read without an explicit inter-agency referral.
    const where: Prisma.InvestigationWhereInput = {
      agencyId: query.agencyId ?? { in: actor.agencyIds },
      status: query.status,
      priority: query.priority,
      ...(query.assignedToMe
        ? { assignments: { some: { investigatorId: actor.id, isActive: true } } }
        : {}),
      ...(term
        ? {
            OR: [
              { caseNumber: { contains: term.toUpperCase() } },
              { report: { title: { contains: term } } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.investigation.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        include: {
          agency: { select: { name: true } },
          report: { select: { title: true } },
          assignments: {
            where: { isActive: true, role: 'LEAD' },
            include: { investigator: { select: { fullName: true } } },
          },
          tasks: { where: { status: { in: ['PENDING', 'IN_PROGRESS'] } }, select: { id: true } },
          _count: { select: { evidence: true } },
        },
      }),
      this.prisma.investigation.count({ where }),
    ]);

    return toPage(
      rows.map((row) => ({
        id: row.id,
        caseNumber: row.caseNumber,
        title: row.report.title,
        agencyName: row.agency.name,
        priority: row.priority,
        status: row.status,
        dueAt: row.dueAt,
        openTasks: row.tasks.length,
        evidenceCount: row._count.evidence,
        leadInvestigator: row.assignments[0]?.investigator.fullName ?? null,
        createdAt: row.createdAt,
      })),
      total,
      query,
    );
  }

  /** Full case detail, including the transitions the caller may take next. */
  async findById(id: string, actor: AuthenticatedUser) {
    const investigation = await this.prisma.investigation.findUnique({
      where: { id },
      include: {
        agency: true,
        report: { include: { category: true } },
        assignments: {
          where: { isActive: true },
          include: { investigator: { select: { id: true, fullName: true, email: true } } },
        },
        tasks: { orderBy: [{ status: 'asc' }, { dueAt: 'asc' }] },
        escalations: { orderBy: { createdAt: 'desc' } },
        evidence: {
          where: { isArchived: false },
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

    if (!investigation) {
      throw new NotFoundException(`No investigation with id ${id}.`);
    }
    this.assertAgencyMember(investigation.agencyId, actor);

    const [definition, notes, history] = await Promise.all([
      this.workflow.activeDefinition(),
      this.visibleNotes(id, investigation.supervisorId, investigation.assignments, actor),
      this.workflow.historyFor(id),
    ]);

    return {
      ...investigation,
      notes,
      workflow: this.workflow.nextStatesFor(
        definition.machine,
        investigation.status,
        actor.permissions,
      ),
      transitions: history,
    };
  }

  async transition(id: string, dto: TransitionInvestigationDto, actor: AuthenticatedUser) {
    const investigation = await this.loadForWrite(id, actor);
    const definition = await this.workflow.activeDefinition();

    await this.workflow.assertTransitionAllowed(
      definition.machine,
      investigation.status,
      dto.toState,
      actor.permissions,
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.investigation.update({
        where: { id },
        data: { status: dto.toState },
      });

      await tx.workflowTransition.create({
        data: {
          definitionId: definition.id,
          investigationId: id,
          fromState: investigation.status,
          toState: dto.toState,
          actorId: actor.id,
          note: dto.note?.trim(),
        },
      });

      return result;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'INVESTIGATION_TRANSITIONED',
      resource: 'investigation',
      resourceId: id,
      metadata: { from: investigation.status, to: dto.toState, note: dto.note },
    });

    const recipients = [
      investigation.supervisorId,
      ...investigation.assignments.map((assignment) => assignment.investigatorId),
    ].filter((recipientId) => recipientId !== actor.id);

    await this.notifications.sendToMany(recipients, {
      channel: 'IN_APP',
      subject: `${investigation.caseNumber} moved to ${dto.toState}`,
      body: `${actor.fullName} moved the case from ${investigation.status} to ${dto.toState}.${
        dto.note ? ` Note: ${dto.note}` : ''
      }`,
    });

    return updated;
  }

  async close(id: string, dto: CloseInvestigationDto, actor: AuthenticatedUser) {
    const investigation = await this.loadForWrite(id, actor);

    if (investigation.status === 'CLOSED') {
      throw new BadRequestException('This case is already closed.');
    }

    const openTasks = await this.prisma.investigationTask.count({
      where: { investigationId: id, status: { in: ['PENDING', 'IN_PROGRESS'] } },
    });
    if (openTasks > 0) {
      throw new BadRequestException(
        `${openTasks} task(s) are still open. Complete or cancel them before closing the case.`,
      );
    }

    const definition = await this.workflow.activeDefinition();
    await this.workflow.assertTransitionAllowed(
      definition.machine,
      investigation.status,
      'CLOSED',
      actor.permissions,
    );

    const updated = await this.prisma.$transaction(async (tx) => {
      const result = await tx.investigation.update({
        where: { id },
        data: { status: 'CLOSED', closedAt: new Date(), closedReason: dto.reason.trim() },
      });

      await tx.workflowTransition.create({
        data: {
          definitionId: definition.id,
          investigationId: id,
          fromState: investigation.status,
          toState: 'CLOSED',
          actorId: actor.id,
          note: dto.reason.trim(),
        },
      });

      // The report closes with its last open case.
      const stillOpen = await tx.investigation.count({
        where: { reportId: investigation.reportId, status: { not: 'CLOSED' }, id: { not: id } },
      });
      if (stillOpen === 0) {
        await tx.report.update({
          where: { id: investigation.reportId },
          data: { status: 'RESOLVED' },
        });
        await tx.reportTimeline.create({
          data: {
            reportId: investigation.reportId,
            action: 'RESOLVED',
            description: 'All investigations into this report have been closed.',
            actorType: 'SYSTEM',
          },
        });
      }

      return result;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'INVESTIGATION_CLOSED',
      resource: 'investigation',
      resourceId: id,
      metadata: { reason: dto.reason },
    });

    return updated;
  }

  async assign(id: string, dto: AssignInvestigatorDto, actor: AuthenticatedUser) {
    const investigation = await this.loadForWrite(id, actor);

    const membership = await this.prisma.membership.findFirst({
      where: { userId: dto.investigatorId, agencyId: investigation.agencyId },
    });
    if (!membership) {
      throw new BadRequestException('The investigator must be a member of the owning agency.');
    }

    // Only one active lead at a time; promoting a new lead steps the old one down.
    if (dto.role === 'LEAD') {
      await this.prisma.investigationAssignment.updateMany({
        where: { investigationId: id, role: 'LEAD', isActive: true },
        data: { isActive: false, unassignedAt: new Date() },
      });
    }

    const assignment = await this.prisma.investigationAssignment.create({
      data: { investigationId: id, investigatorId: dto.investigatorId, role: dto.role },
      include: { investigator: { select: { fullName: true, email: true } } },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'INVESTIGATION_ASSIGNED',
      resource: 'investigation',
      resourceId: id,
      metadata: { investigatorId: dto.investigatorId, role: dto.role },
    });

    await this.notifications.send({
      recipientId: dto.investigatorId,
      channel: 'IN_APP',
      subject: `Assigned to ${investigation.caseNumber} as ${dto.role}`,
      body: `${actor.fullName} assigned you to case ${investigation.caseNumber}.`,
    });

    return assignment;
  }

  async unassign(id: string, assignmentId: string, actor: AuthenticatedUser) {
    await this.loadForWrite(id, actor);

    const assignment = await this.prisma.investigationAssignment.findFirst({
      where: { id: assignmentId, investigationId: id, isActive: true },
    });
    if (!assignment) {
      throw new NotFoundException('No active assignment with that id on this case.');
    }

    return this.prisma.investigationAssignment.update({
      where: { id: assignmentId },
      data: { isActive: false, unassignedAt: new Date() },
    });
  }

  async createTask(id: string, dto: CreateTaskDto, actor: AuthenticatedUser) {
    const investigation = await this.loadForWrite(id, actor);

    if (investigation.status === 'CLOSED') {
      throw new BadRequestException('Tasks cannot be added to a closed case.');
    }

    const task = await this.prisma.investigationTask.create({
      data: {
        investigationId: id,
        title: dto.title.trim(),
        description: dto.description?.trim(),
        assignedToId: dto.assignedToId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
      },
    });

    if (dto.assignedToId) {
      await this.notifications.send({
        recipientId: dto.assignedToId,
        channel: 'IN_APP',
        subject: `New task on ${investigation.caseNumber}`,
        body: `${actor.fullName} assigned you: ${task.title}`,
      });
    }

    return task;
  }

  async updateTask(id: string, taskId: string, dto: UpdateTaskDto, actor: AuthenticatedUser) {
    await this.loadForWrite(id, actor);

    const task = await this.prisma.investigationTask.findFirst({
      where: { id: taskId, investigationId: id },
    });
    if (!task) {
      throw new NotFoundException('No task with that id on this case.');
    }

    return this.prisma.investigationTask.update({
      where: { id: taskId },
      data: {
        status: dto.status,
        assignedToId: dto.assignedToId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        completedAt: dto.status === 'DONE' ? new Date() : dto.status ? null : undefined,
      },
    });
  }

  async addNote(id: string, dto: CreateNoteDto, actor: AuthenticatedUser) {
    await this.loadForWrite(id, actor);

    return this.prisma.investigationNote.create({
      data: {
        investigationId: id,
        authorId: actor.id,
        content: dto.content.trim(),
        isConfidential: dto.isConfidential ?? false,
      },
    });
  }

  async escalate(id: string, dto: EscalateInvestigationDto, actor: AuthenticatedUser) {
    const investigation = await this.loadForWrite(id, actor);

    const recipient = await this.prisma.user.findUnique({ where: { id: dto.escalatedToId } });
    if (!recipient) {
      throw new BadRequestException('The escalation recipient does not exist.');
    }

    const escalation = await this.prisma.$transaction(async (tx) => {
      const created = await tx.investigationEscalation.create({
        data: {
          investigationId: id,
          raisedById: actor.id,
          escalatedToId: dto.escalatedToId,
          level: dto.level,
          reason: dto.reason.trim(),
        },
      });

      // Escalation raises the priority unless it is already at the ceiling.
      if (investigation.priority !== 'CRITICAL') {
        await tx.investigation.update({
          where: { id },
          data: { priority: dto.level === 'INTER_AGENCY' ? 'CRITICAL' : 'HIGH' },
        });
      }

      return created;
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'INVESTIGATION_ESCALATED',
      resource: 'investigation',
      resourceId: id,
      metadata: { level: dto.level, to: recipient.email, reason: dto.reason },
    });

    await this.notifications.send({
      recipientId: dto.escalatedToId,
      channel: 'EMAIL',
      subject: `Escalation on case ${investigation.caseNumber}`,
      body: `${actor.fullName} escalated ${investigation.caseNumber} to you at ${dto.level} level.\n\nReason: ${dto.reason}`,
    });

    return escalation;
  }

  /** Cases assigned to the caller, for the dashboard. */
  async myWorkload(actor: AuthenticatedUser) {
    const [assigned, supervising, dueSoon, openTasks] = await Promise.all([
      this.prisma.investigation.count({
        where: {
          status: { not: 'CLOSED' },
          assignments: { some: { investigatorId: actor.id, isActive: true } },
        },
      }),
      this.prisma.investigation.count({
        where: { supervisorId: actor.id, status: { not: 'CLOSED' } },
      }),
      this.prisma.investigation.count({
        where: {
          status: { not: 'CLOSED' },
          dueAt: { lte: new Date(Date.now() + 86_400_000) },
          assignments: { some: { investigatorId: actor.id, isActive: true } },
        },
      }),
      this.prisma.investigationTask.count({
        where: { assignedToId: actor.id, status: { in: ['PENDING', 'IN_PROGRESS'] } },
      }),
    ]);

    return { assigned, supervising, dueWithin24h: dueSoon, openTasks };
  }

  /**
   * Confidential notes are restricted to the supervisor, the case lead and
   * anyone holding the supervisor or agency-admin role.
   */
  private async visibleNotes(
    investigationId: string,
    supervisorId: string,
    assignments: Array<{ investigatorId: string; role: string }>,
    actor: AuthenticatedUser,
  ) {
    const isLead = assignments.some(
      (assignment) => assignment.investigatorId === actor.id && assignment.role === 'LEAD',
    );
    const isPrivileged =
      supervisorId === actor.id ||
      isLead ||
      actor.roleCodes.includes(ROLE_CODES.SUPERVISOR) ||
      actor.roleCodes.includes(ROLE_CODES.AGENCY_ADMIN);

    return this.prisma.investigationNote.findMany({
      where: { investigationId, ...(isPrivileged ? {} : { isConfidential: false }) },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async loadForWrite(id: string, actor: AuthenticatedUser) {
    const investigation = await this.prisma.investigation.findUnique({
      where: { id },
      include: { assignments: { where: { isActive: true } } },
    });

    if (!investigation) {
      throw new NotFoundException(`No investigation with id ${id}.`);
    }
    this.assertAgencyMember(investigation.agencyId, actor);

    return investigation;
  }

  private assertAgencyMember(agencyId: string, actor: AuthenticatedUser): void {
    if (!actor.agencyIds.includes(agencyId)) {
      throw new ForbiddenException('You are not a member of the agency that owns this case.');
    }
  }
}
