import { PrismaClient } from '@prisma/client';

export async function seedOrganizationTypes(prisma: PrismaClient) {
  // Demonstration agencies (dynamic and fully configurable, not hardcoded into business rules)
  const initialAgencies = [
    { code: 'NPF', name: 'Nigeria Police Force', acronym: 'NPF', category: 'LAW_ENFORCEMENT' as const },
    { code: 'EFCC', name: 'Economic and Financial Crimes Commission', acronym: 'EFCC', category: 'LAW_ENFORCEMENT' as const },
    { code: 'NDLEA', name: 'National Drug Law Enforcement Agency', acronym: 'NDLEA', category: 'LAW_ENFORCEMENT' as const },
    { code: 'NEMA', name: 'National Emergency Management Agency', acronym: 'NEMA', category: 'EMERGENCY' as const },
    { code: 'NERC', name: 'Nigerian Electricity Regulatory Commission', acronym: 'NERC', category: 'ENERGY' as const },
  ];

  for (const agency of initialAgencies) {
    await prisma.agency.upsert({
      where: { code: agency.code },
      update: {},
      create: agency,
    });
  }
}
