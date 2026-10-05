import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { PUBLIC_KEY } from '../decorators/permissions.decorator';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';
import { PrismaService } from '../../database/prisma.service';
import type { PermissionSlug } from '../constants';

interface AccessTokenPayload {
  sub: string;
  email: string;
}

/**
 * Verifies the bearer access token and loads the caller's memberships so that
 * agency scoping and permission checks work from a single resolved identity.
 * Applied globally; opt out with @Public().
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    let payload: AccessTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Access token is invalid or expired.');
    }

    request.user = await this.resolveUser(payload.sub);
    return true;
  }

  private async resolveUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        memberships: {
          where: {
            OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }],
          },
          include: {
            role: { include: { permissions: { include: { permission: true } } } },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Account no longer exists.');
    }
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException(`Account is ${user.status.toLowerCase()}.`);
    }

    const permissions = new Set<PermissionSlug>();
    for (const membership of user.memberships) {
      for (const link of membership.role.permissions) {
        permissions.add(link.permission.slug as PermissionSlug);
      }
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      agencyIds: [...new Set(user.memberships.map((membership) => membership.agencyId))],
      roleCodes: [...new Set(user.memberships.map((membership) => membership.role.code))],
      permissions: [...permissions],
    };
  }
}

function extractBearerToken(request: Request): string | undefined {
  const header = request.headers.authorization;
  if (!header) {
    return undefined;
  }

  const [scheme, value] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' && value ? value : undefined;
}
