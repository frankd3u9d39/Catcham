import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { AgencyCategory } from '../../common/constants';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import type {
  CreateAgencyDto,
  CreateDepartmentDto,
  CreateOfficeDto,
  UpdateAgencyDto,
} from './dto/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  /** The agency tree, with department and office counts for the org chart. */
  async tree(category?: AgencyCategory) {
    const agencies = await this.prisma.agency.findMany({
      where: { category, isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      include: {
        departments: {
          orderBy: { name: 'asc' },
          include: { _count: { select: { offices: true } } },
        },
        _count: { select: { memberships: true, investigations: true } },
      },
    });

    return agencies.map((agency) => ({
      id: agency.id,
      code: agency.code,
      name: agency.name,
      acronym: agency.acronym,
      category: agency.category,
      jurisdictionScope: agency.jurisdictionScope,
      personnel: agency._count.memberships,
      openCases: agency._count.investigations,
      departments: agency.departments.map((department) => ({
        id: department.id,
        name: department.name,
        code: department.code,
        offices: department._count.offices,
      })),
    }));
  }

  listAgencies(category?: AgencyCategory) {
    return this.prisma.agency.findMany({
      where: { category, isActive: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        code: true,
        name: true,
        acronym: true,
        category: true,
        jurisdictionScope: true,
      },
    });
  }

  async findAgency(id: string) {
    const agency = await this.prisma.agency.findUnique({
      where: { id },
      include: {
        departments: { include: { offices: true } },
        routingRules: { include: { category: { select: { code: true, name: true } } } },
      },
    });

    if (!agency) {
      throw new NotFoundException(`No agency with id ${id}.`);
    }

    return agency;
  }

  async createAgency(dto: CreateAgencyDto, actor: AuthenticatedUser) {
    const agency = await this.prisma.agency.create({
      data: {
        code: dto.code.toUpperCase(),
        name: dto.name.trim(),
        acronym: dto.acronym.toUpperCase(),
        category: dto.category,
        jurisdictionScope: dto.jurisdictionScope ?? 'NATIONAL',
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'AGENCY_CREATED',
      resource: 'agency',
      resourceId: agency.id,
      metadata: { code: agency.code, name: agency.name },
    });

    return agency;
  }

  async updateAgency(id: string, dto: UpdateAgencyDto, actor: AuthenticatedUser) {
    await this.findAgency(id);

    const agency = await this.prisma.agency.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        acronym: dto.acronym?.toUpperCase(),
        jurisdictionScope: dto.jurisdictionScope,
        isActive: dto.isActive,
      },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'AGENCY_UPDATED',
      resource: 'agency',
      resourceId: id,
      metadata: { ...dto },
    });

    return agency;
  }

  async createDepartment(agencyId: string, dto: CreateDepartmentDto) {
    await this.findAgency(agencyId);

    return this.prisma.department.create({
      data: { agencyId, name: dto.name.trim(), code: dto.code.toUpperCase() },
    });
  }

  async createOffice(departmentId: string, dto: CreateOfficeDto) {
    const department = await this.prisma.department.findUnique({ where: { id: departmentId } });
    if (!department) {
      throw new NotFoundException(`No department with id ${departmentId}.`);
    }

    return this.prisma.office.create({
      data: {
        departmentId,
        name: dto.name.trim(),
        stateCode: dto.stateCode.toUpperCase(),
        lgaCode: dto.lgaCode?.toUpperCase(),
        address: dto.address?.trim(),
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
  }

  listRoutingRules(agencyId?: string) {
    return this.prisma.routingRule.findMany({
      where: { agencyId },
      orderBy: { priority: 'desc' },
      include: {
        agency: { select: { name: true, acronym: true } },
        category: { select: { code: true, name: true } },
      },
    });
  }
}
