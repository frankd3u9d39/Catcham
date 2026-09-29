import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  const roles = [
    { code: 'SUPER_ADMIN', name: 'Super Administrator', description: 'Platform oversight and system governance', isSystem: true },
    { code: 'AGENCY_ADMIN', name: 'Agency Administrator', description: 'Agency-level administrator and configuration', isSystem: true },
    { code: 'SUPERVISOR', name: 'Investigation Supervisor', description: 'Assigns and reviews multi-agency investigations', isSystem: true },
    { code: 'INVESTIGATOR', name: 'Lead / Field Investigator', description: 'Conducts investigations, gathers evidence', isSystem: true },
    { code: 'TRIAGE_OFFICER', name: 'Incident Triage Officer', description: 'Assesses incoming whistleblower and incident reports', isSystem: true },
    { code: 'CITIZEN', name: 'Registered Citizen Whistleblower', description: 'Authenticated report submitter', isSystem: true },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {},
      create: role,
    });
  }
}
