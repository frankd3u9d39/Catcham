import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { hashSecret, verifySecret } from '../../common/utils/crypto.util';
import { type Page, type PageQueryDto, toPage } from '../../common/pagination';
import type {
  ChangePasswordDto,
  CreateUserDto,
  GrantMembershipDto,
  UpdateUserDto,
} from './dto/auth.dto';
import type { AuthenticatedUser } from '../../common/decorators/current-user.decorator';

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  status: string;
  isMfaEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  memberships: Array<{ agencyId: string; agencyName: string; roleCode: string; roleName: string }>;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: PageQueryDto, search?: string): Promise<Page<UserSummary>> {
    // SQLite has no case-insensitive `mode` for `contains`, so email is stored
    // lower-cased and the search term is lower-cased to match.
    const term = search?.trim().toLowerCase();
    const where = term
      ? { OR: [{ email: { contains: term } }, { fullName: { contains: term } }] }
      : {};

    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: query.skip,
        take: query.take,
        orderBy: { createdAt: 'desc' },
        include: { memberships: { include: { agency: true, role: true } } },
      }),
      this.prisma.user.count({ where }),
    ]);

    return toPage(rows.map(toUserSummary), total, query);
  }

  async findById(id: string): Promise<UserSummary> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { memberships: { include: { agency: true, role: true } } },
    });

    if (!user) {
      throw new NotFoundException(`No user with id ${id}.`);
    }

    return toUserSummary(user);
  }

  async create(dto: CreateUserDto, actor: AuthenticatedUser): Promise<UserSummary> {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('An account with that email already exists.');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        fullName: dto.fullName.trim(),
        phoneNumber: dto.phoneNumber,
        passwordHash: await hashSecret(dto.password),
      },
      include: { memberships: { include: { agency: true, role: true } } },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'USER_CREATED',
      resource: 'user',
      resourceId: user.id,
      metadata: { email },
    });

    return toUserSummary(user);
  }

  async register(dto: CreateUserDto): Promise<UserSummary> {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('An account with that email already exists.');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        fullName: dto.fullName.trim(),
        phoneNumber: dto.phoneNumber,
        passwordHash: await hashSecret(dto.password),
        status: 'ACTIVE',
      },
      include: { memberships: { include: { agency: true, role: true } } },
    });

    await this.audit.record({
      actorId: user.id,
      actorLabel: user.email,
      action: 'USER_REGISTERED',
      resource: 'user',
      resourceId: user.id,
      metadata: { email },
    });

    return toUserSummary(user);
  }

  async update(id: string, dto: UpdateUserDto, actor: AuthenticatedUser): Promise<UserSummary> {
    await this.findById(id);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullName: dto.fullName?.trim(),
        status: dto.status,
        isMfaEnabled: dto.isMfaEnabled,
      },
      include: { memberships: { include: { agency: true, role: true } } },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'USER_UPDATED',
      resource: 'user',
      resourceId: id,
      metadata: { ...dto },
    });

    return toUserSummary(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`No user with id ${userId}.`);
    }

    if (!(await verifySecret(user.passwordHash, dto.currentPassword))) {
      throw new ForbiddenException('Current password is incorrect.');
    }
    if (await verifySecret(user.passwordHash, dto.newPassword)) {
      throw new BadRequestException('New password must differ from the current one.');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: await hashSecret(dto.newPassword) },
      }),
      // A password change invalidates every existing session.
      this.prisma.session.updateMany({
        where: { userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    await this.audit.record({
      actorId: userId,
      actorLabel: user.email,
      action: 'PASSWORD_CHANGED',
      resource: 'user',
      resourceId: userId,
    });
  }

  async grantMembership(
    userId: string,
    dto: GrantMembershipDto,
    actor: AuthenticatedUser,
  ): Promise<UserSummary> {
    await this.findById(userId);

    await this.prisma.membership.upsert({
      where: { userId_agencyId_roleId: { userId, agencyId: dto.agencyId, roleId: dto.roleId } },
      create: { userId, agencyId: dto.agencyId, roleId: dto.roleId },
      update: { validUntil: null },
    });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'MEMBERSHIP_GRANTED',
      resource: 'user',
      resourceId: userId,
      metadata: { agencyId: dto.agencyId, roleId: dto.roleId },
    });

    return this.findById(userId);
  }

  async revokeMembership(
    userId: string,
    membershipId: string,
    actor: AuthenticatedUser,
  ): Promise<UserSummary> {
    const membership = await this.prisma.membership.findFirst({
      where: { id: membershipId, userId },
    });
    if (!membership) {
      throw new NotFoundException('No such membership for this user.');
    }

    await this.prisma.membership.delete({ where: { id: membershipId } });

    await this.audit.record({
      actorId: actor.id,
      actorLabel: actor.email,
      action: 'MEMBERSHIP_REVOKED',
      resource: 'user',
      resourceId: userId,
      metadata: { membershipId },
    });

    return this.findById(userId);
  }

  listRoles() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
      include: { permissions: { include: { permission: true } } },
    });
  }
}

type UserRow = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  status: string;
  isMfaEnabled: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  memberships: Array<{
    agencyId: string;
    agency: { name: string };
    role: { code: string; name: string };
  }>;
};

function toUserSummary(user: UserRow): UserSummary {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phoneNumber: user.phoneNumber,
    status: user.status,
    isMfaEnabled: user.isMfaEnabled,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    memberships: user.memberships.map((membership) => ({
      agencyId: membership.agencyId,
      agencyName: membership.agency.name,
      roleCode: membership.role.code,
      roleName: membership.role.name,
    })),
  };
}
