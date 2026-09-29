import { PrismaClient } from '@prisma/client';
import { seedRoles } from './seeds/roles.seed';
import { seedPermissions } from './seeds/permissions.seed';
import { seedOrganizationTypes } from './seeds/organization-types.seed';
import { seedReportCategories } from './seeds/report-categories.seed';
import { seedWorkflowDefinitions } from './seeds/workflow-definitions.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CATCHAM sovereign database...');
  await seedPermissions(prisma);
  await seedRoles(prisma);
  await seedOrganizationTypes(prisma);
  await seedReportCategories(prisma);
  await seedWorkflowDefinitions(prisma);
  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
