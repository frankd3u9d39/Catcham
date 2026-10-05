import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import type { AuthenticatedUser } from '../decorators/current-user.decorator';
import type { PermissionSlug } from '../constants';

/**
 * Runs after AuthGuard. Requires the caller to hold every permission declared
 * by @RequirePermissions on the handler or its controller.
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndMerge<PermissionSlug[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const held = new Set(request.user?.permissions ?? []);
    const missing = required.filter((permission) => !held.has(permission));

    if (missing.length > 0) {
      throw new ForbiddenException(`Missing required permission: ${missing.join(', ')}`);
    }

    return true;
  }
}
