import { PrismaClient } from '@prisma/client';
import { seedReferenceData } from './seeds/reference.seed';
import { seedDemoData } from './seeds/demo.seed';

/**
 * Reference data is idempotent and safe to re-run on any environment.
 * Demonstration data runs only on an empty database, and is skipped entirely
 * when SEED_DEMO=false or NODE_ENV=production.
 */
const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Reference data:');
  await seedReferenceData(prisma);

  const includeDemo =
    process.env.SEED_DEMO !== 'false' && process.env.NODE_ENV !== 'production';

  if (includeDemo) {
    console.log('\nDemonstration data:');
    await seedDemoData(prisma);
  } else {
    console.log('\nDemonstration data: skipped');
  }

  console.log('\nSeed complete.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
