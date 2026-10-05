import { SetMetadata } from '@nestjs/common';
import type { PermissionSlug } from '../constants';

export const PERMISSIONS_KEY = 'catcham:permissions';

/**
 * Requires the caller to hold every listed permission through at least one of
 * their agency memberships. Enforced by PermissionsGuard.
 */
export const RequirePermissions = (...permissions: PermissionSlug[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const PUBLIC_KEY = 'catcham:public';

/** Skips authentication for an endpoint that citizens must reach unauthenticated. */
export const Public = () => SetMetadata(PUBLIC_KEY, true);
