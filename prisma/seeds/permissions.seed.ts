import { PrismaClient } from '@prisma/client';

export async function seedPermissions(prisma: PrismaClient) {
  const permissions = [
    { slug: 'report:create', resource: 'report', action: 'create', description: 'Create an incident report' },
    { slug: 'report:read', resource: 'report', action: 'read', description: 'View assigned reports' },
    { slug: 'report:route', resource: 'report', action: 'route', description: 'Route reports across jurisdictions' },
    { slug: 'investigation:create', resource: 'investigation', action: 'create', description: 'Open new investigation' },
    { slug: 'investigation:assign', resource: 'investigation', action: 'assign', description: 'Assign case investigators' },
    { slug: 'evidence:upload', resource: 'evidence', action: 'upload', description: 'Intake and register evidence' },
    { slug: 'evidence:audit', resource: 'evidence', action: 'audit', description: 'Inspect chain of custody' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: {},
      create: perm,
    });
  }
}
