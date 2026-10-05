import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { hashSecret, sha256Hex, verifySecret } from '../../common/utils/crypto.util';
import type { LoginDto } from './dto/auth.dto';
import type { PermissionSlug } from '../../common/constants';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

/**
 * Matches the shape AuthGuard resolves for GET /auth/me, so a client can use
 * the login response and a later profile fetch interchangeably.
 */
export interface AuthenticatedProfile {
  id: string;
  email: string;
  fullName: string;
  agencyIds: string[];
  roleCodes: string[];
  permissions: PermissionSlug[];
  memberships: Array<{ agencyId: string; agencyName: string; roleCode: string }>;
}

interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  async login(
    dto: LoginDto,
    context: RequestContext,
  ): Promise<{ tokens: TokenPair; profile: AuthenticatedProfile }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        memberships: {
          // Same filter AuthGuard applies, so an expired membership does not
          // grant access at login that a later request would refuse.
          where: { OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }] },
          include: {
            agency: true,
            role: { include: { permissions: { include: { permission: true } } } },
          },
        },
      },
    });

    // Verify against a dummy hash when the account is absent so that response
    // timing does not reveal whether an email is registered.
    const passwordMatches = user
      ? await verifySecret(user.passwordHash, dto.password)
      : await verifySecret(await hashSecret(randomBytes(16).toString('hex')), dto.password);

    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect.');
    }

    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException(`Account is ${user.status.toLowerCase()}.`);
    }

    const tokens = await this.issueTokens(user.id, user.email, context);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.audit.record({
      actorId: user.id,
      actorLabel: user.email,
      action: 'USER_LOGIN',
      resource: 'user',
      resourceId: user.id,
      ipAddress: context.ipAddress,
    });

    const permissions = new Set<PermissionSlug>();
    for (const membership of user.memberships) {
      for (const link of membership.role.permissions) {
        permissions.add(link.permission.slug as PermissionSlug);
      }
    }

    return {
      tokens,
      profile: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        agencyIds: [...new Set(user.memberships.map((m) => m.agencyId))],
        roleCodes: [...new Set(user.memberships.map((m) => m.role.code))],
        permissions: [...permissions],
        memberships: user.memberships.map((membership) => ({
          agencyId: membership.agencyId,
          agencyName: membership.agency.name,
          roleCode: membership.role.code,
        })),
      },
    };
  }

  /**
   * Rotates the refresh token: the presented session is revoked and a new one
   * issued, so a replayed token cannot be used twice.
   */
  async refresh(refreshToken: string, context: RequestContext): Promise<TokenPair> {
    try {
      await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash: sha256Hex(refreshToken) },
      include: { user: true },
    });

    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session is no longer valid.');
    }
    if (session.user.status !== 'ACTIVE') {
      throw new ForbiddenException(`Account is ${session.user.status.toLowerCase()}.`);
    }

    await this.prisma.session.update({
      where: { id: session.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(session.userId, session.user.email, context);
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { refreshTokenHash: sha256Hex(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllSessions(userId: string): Promise<number> {
    const result = await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return result.count;
  }

  private async issueTokens(
    userId: string,
    email: string,
    context: RequestContext,
  ): Promise<TokenPair> {
    const accessTtl = this.config.getOrThrow<string>('JWT_ACCESS_TTL');
    const refreshTtl = this.config.getOrThrow<string>('JWT_REFRESH_TTL');

    const accessToken = await this.jwt.signAsync(
      { sub: userId, email },
      { secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), expiresIn: accessTtl },
    );

    // jti keeps otherwise-identical refresh tokens distinct, which matters
    // because the session row is keyed by the token hash.
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, jti: randomBytes(16).toString('hex') },
      { secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'), expiresIn: refreshTtl },
    );

    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: sha256Hex(refreshToken),
        ipAddress: context.ipAddress,
        userAgent: context.userAgent?.slice(0, 255),
        expiresAt: new Date(Date.now() + parseDuration(refreshTtl)),
      },
    });

    return { accessToken, refreshToken, expiresIn: accessTtl };
  }
}

/** Parses the `15m` / `7d` form used by the JWT TTL settings into milliseconds. */
export function parseDuration(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value.trim());
  if (!match) {
    throw new Error(`Unsupported duration: ${value}. Use a form such as 15m, 12h or 7d.`);
  }

  const amount = Number(match[1]);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';
  const multipliers = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 } as const;

  return amount * multipliers[unit];
}
