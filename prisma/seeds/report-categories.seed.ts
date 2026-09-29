import { PrismaClient } from '@prisma/client';

export async function seedReportCategories(prisma: PrismaClient) {
  const categories = [
    { code: 'CORRUPTION', name: 'Public Sector Corruption & Bribery', description: 'Embezzlement, extortion, official misconduct' },
    { code: 'FINANCIAL_FRAUD', name: 'Financial Crimes & Cyber Fraud', description: 'Money laundering, banking malpractice, advance-fee fraud' },
    { code: 'DRUG_TRAFFICKING', name: 'Narcotics & Illicit Substance Trafficking', description: 'Distribution, manufacture, and illicit trafficking' },
    { code: 'INFRASTRUCTURE_VANDALISM', name: 'Critical National Infrastructure Vandalism', description: 'Power grid, telecommunication, and pipeline sabotage' },
    { code: 'ENVIRONMENTAL_HAZARD', name: 'Environmental Degradation & Spills', description: 'Illegal mining, toxic waste, oil bunkering' },
    { code: 'PUBLIC_SAFETY', name: 'Emergency & Public Safety Threat', description: 'Imminent danger, violence, emergency calls' },
  ];

  for (const cat of categories) {
    await prisma.reportCategory.upsert({
      where: { code: cat.code },
      update: {},
      create: cat,
    });
  }
}
