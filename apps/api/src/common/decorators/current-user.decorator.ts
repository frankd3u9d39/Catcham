import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import type { PermissionSlug } from '../constants';

/** The authenticated caller, resolved by AuthGuard from a verified access token. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  /** Agency ids the caller holds a membership in. Scopes every agency-bound query. */
  agencyIds: string[];
  roleCodes: string[];
  permissions: PermissionSlug[];
}

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();

  if (!request.user) {
    throw new UnauthorizedException('No authenticated user on the request.');
  }

  return request.user;
});
