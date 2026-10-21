const { PrismaClient } = require('@prisma/client');
const { hash, Algorithm } = require('@node-rs/argon2');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash('ChangeMe123!', {
    algorithm: Algorithm.Argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const citizen = await prisma.user.upsert({
    where: { email: 'citizen@catcham.local' },
    update: { passwordHash, status: 'ACTIVE' },
    create: {
      email: 'citizen@catcham.local',
      fullName: 'Tariq Mohammed (Citizen Reporter)',
      phoneNumber: '+234 803 123 4567',
      passwordHash,
      status: 'ACTIVE',
    },
  });

  // Link 3 sample reports to this citizen's email and submitterId
  await prisma.report.updateMany({
    where: {
      referenceNumber: {
        in: ['CTM-2026-700CF0', 'CTM-2026-B7ABA1', 'CTM-2026-3ECE67'],
      },
    },
    data: {
      submitterId: citizen.id,
      contactEmail: citizen.email,
    },
  });

  console.log('Seeded citizen and linked reports for:', citizen.email);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
