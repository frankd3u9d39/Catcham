import type { PrismaClient } from '@prisma/client';
import { ALL_JURISDICTIONS } from '../data/jurisdictions';

/** Permission catalogue. Must stay in step with PERMISSIONS in the API constants. */
const PERMISSIONS = [
  ['report:read', 'report', 'read', 'View reports in the triage queue'],
  ['report:triage', 'report', 'triage', 'Set priority and route a report'],
  ['report:reject', 'report', 'reject', 'Reject a report with a reason'],
  ['investigation:read', 'investigation', 'read', 'View cases in own agencies'],
  ['investigation:create', 'investigation', 'create', 'Open a case from a report'],
  ['investigation:assign', 'investigation', 'assign', 'Assign and unassign investigators'],
  ['investigation:transition', 'investigation', 'transition', 'Move a case through the workflow'],
  ['investigation:close', 'investigation', 'close', 'Close a case'],
  ['investigation:escalate', 'investigation', 'escalate', 'Escalate a case'],
  ['evidence:read', 'evidence', 'read', 'View evidence metadata and custody'],
  ['evidence:upload', 'evidence', 'upload', 'Upload evidence and annotate it'],
  ['evidence:download', 'evidence', 'download', 'Download the stored file'],
  ['evidence:transfer', 'evidence', 'transfer', 'Transfer custody and archive evidence'],
  ['audit:read', 'audit', 'read', 'Read the activity log'],
  ['analytics:read', 'analytics', 'read', 'View dashboards and SLA reports'],
  ['organization:read', 'organization', 'read', 'View the agency hierarchy'],
  ['organization:manage', 'organization', 'manage', 'Create and edit agencies'],
  ['user:read', 'user', 'read', 'View personnel accounts'],
  ['user:manage', 'user', 'manage', 'Create accounts and grant roles'],
  ['rule:manage', 'rule', 'manage', 'Create and edit business rules'],
  ['workflow:manage', 'workflow', 'manage', 'Publish workflow definitions'],
] as const;

/** Role to permission mapping. A role holds exactly the slugs listed here. */
const ROLES: Array<{
  code: string;
  name: string;
  description: string;
  permissions: readonly string[];
}> = [
  {
    code: 'SYSTEM_ADMIN',
    name: 'System administrator',
    description: 'Platform configuration and personnel administration',
    permissions: PERMISSIONS.map(([slug]) => slug),
  },
  {
    code: 'AGENCY_ADMIN',
    name: 'Agency administrator',
    description: 'Manages one agency: its structure, personnel and rules',
    permissions: [
      'report:read',
      'investigation:read',
      'investigation:assign',
      'analytics:read',
      'audit:read',
      'organization:read',
      'organization:manage',
      'user:read',
      'user:manage',
      'rule:manage',
      'evidence:read',
    ],
  },
  {
    code: 'SUPERVISOR',
    name: 'Investigation supervisor',
    description: 'Opens, assigns, reviews and closes cases',
    permissions: [
      'report:read',
      'report:triage',
      'investigation:read',
      'investigation:create',
      'investigation:assign',
      'investigation:transition',
      'investigation:close',
      'investigation:escalate',
      'evidence:read',
      'evidence:upload',
      'evidence:download',
      'evidence:transfer',
      'analytics:read',
      'organization:read',
      'user:read',
    ],
  },
  {
    code: 'INVESTIGATOR',
    name: 'Investigator',
    description: 'Works assigned cases and handles evidence',
    permissions: [
      'report:read',
      'investigation:read',
      'investigation:transition',
      'evidence:read',
      'evidence:upload',
      'evidence:download',
      'organization:read',
    ],
  },
  {
    code: 'INTAKE_OFFICER',
    name: 'Intake officer',
    description: 'Triages the incoming report queue',
    permissions: ['report:read', 'report:triage', 'report:reject', 'evidence:read', 'organization:read'],
  },
  {
    code: 'AUDITOR',
    name: 'Auditor',
    description: 'Read-only oversight across reports, cases and the activity log',
    permissions: [
      'report:read',
      'investigation:read',
      'evidence:read',
      'audit:read',
      'analytics:read',
      'organization:read',
      'user:read',
    ],
  },
  {
    code: 'CITIZEN',
    name: 'Citizen',
    description: 'Submits and tracks their own reports',
    permissions: [],
  },
];

const CATEGORIES = [
  {
    code: 'CORRUPTION',
    name: 'Public sector corruption',
    description: 'Bribery, embezzlement, procurement fraud and official misconduct',
    severity: 'HIGH',
  },
  {
    code: 'FINANCIAL_CRIME',
    name: 'Financial crime',
    description: 'Money laundering, banking malpractice and advance-fee fraud',
    severity: 'HIGH',
  },
  {
    code: 'NARCOTICS',
    name: 'Narcotics',
    description: 'Manufacture, distribution and trafficking of controlled substances',
    severity: 'HIGH',
  },
  {
    code: 'OIL_PIPELINE',
    name: 'Petroleum and pipeline offences',
    description: 'Crude oil theft, illegal refining and pipeline vandalism',
    severity: 'CRITICAL',
  },
  {
    code: 'POWER_INFRASTRUCTURE',
    name: 'Electricity infrastructure',
    description: 'Transformer and cable theft, metering fraud, substandard equipment',
    severity: 'HIGH',
  },
  {
    code: 'ENVIRONMENTAL',
    name: 'Environmental harm',
    description: 'Spills, toxic dumping and unlicensed mining',
    severity: 'HIGH',
  },
  {
    code: 'PUBLIC_SAFETY',
    name: 'Public safety emergency',
    description: 'Imminent threat to life, fire, flooding or structural collapse',
    severity: 'CRITICAL',
  },
  {
    code: 'CONSUMER_PROTECTION',
    name: 'Consumer protection',
    description: 'Counterfeit goods, unsafe products and deceptive trade practices',
    severity: 'MEDIUM',
  },
];

const AGENCIES = [
  {
    code: 'EFCC',
    name: 'Economic and Financial Crimes Commission',
    acronym: 'EFCC',
    category: 'LAW_ENFORCEMENT',
    departments: [
      { code: 'FCU', name: 'Financial crimes unit', offices: [
        { name: 'Lagos zonal office', stateCode: 'LA', lgaCode: 'LA-IKEJA', latitude: 6.6, longitude: 3.34 },
        { name: 'Port Harcourt zonal office', stateCode: 'RI', lgaCode: 'RI-PHALGA', latitude: 4.81, longitude: 7.02 },
      ] },
      { code: 'ACU', name: 'Anti-corruption unit', offices: [
        { name: 'Abuja headquarters', stateCode: 'FC', lgaCode: 'FC-AMAC', latitude: 9.06, longitude: 7.49 },
      ] },
    ],
  },
  {
    code: 'NPF',
    name: 'Nigeria Police Force',
    acronym: 'NPF',
    category: 'LAW_ENFORCEMENT',
    departments: [
      { code: 'CID', name: 'Criminal investigation department', offices: [
        { name: 'Rivers State command', stateCode: 'RI', lgaCode: 'RI-PHALGA', latitude: 4.79, longitude: 7.0 },
        { name: 'Lagos State command', stateCode: 'LA', lgaCode: 'LA-IKEJA', latitude: 6.58, longitude: 3.35 },
      ] },
    ],
  },
  {
    code: 'NDLEA',
    name: 'National Drug Law Enforcement Agency',
    acronym: 'NDLEA',
    category: 'LAW_ENFORCEMENT',
    departments: [
      { code: 'OPS', name: 'Operations and intelligence', offices: [
        { name: 'Abuja headquarters', stateCode: 'FC', lgaCode: 'FC-AMAC', latitude: 9.05, longitude: 7.45 },
      ] },
    ],
  },
  {
    code: 'NEMA',
    name: 'National Emergency Management Agency',
    acronym: 'NEMA',
    category: 'EMERGENCY',
    departments: [
      { code: 'RESP', name: 'Disaster response', offices: [
        { name: 'South-South zonal office', stateCode: 'RI', lgaCode: 'RI-PHALGA', latitude: 4.82, longitude: 7.04 },
      ] },
    ],
  },
  {
    code: 'NERC',
    name: 'Nigerian Electricity Regulatory Commission',
    acronym: 'NERC',
    category: 'ENERGY',
    departments: [
      { code: 'ENF', name: 'Enforcement and compliance', offices: [
        { name: 'Abuja headquarters', stateCode: 'FC', lgaCode: 'FC-AMAC', latitude: 9.07, longitude: 7.49 },
      ] },
    ],
  },
  {
    code: 'NOSDRA',
    name: 'National Oil Spill Detection and Response Agency',
    acronym: 'NOSDRA',
    category: 'REGULATORY',
    departments: [
      { code: 'OSR', name: 'Oil spill response', offices: [
        { name: 'Port Harcourt field office', stateCode: 'RI', lgaCode: 'RI-ELEME', latitude: 4.79, longitude: 7.12 },
      ] },
    ],
  },
  {
    code: 'FCCPC',
    name: 'Federal Competition and Consumer Protection Commission',
    acronym: 'FCCPC',
    category: 'REGULATORY',
    departments: [
      { code: 'CP', name: 'Consumer protection', offices: [
        { name: 'Abuja headquarters', stateCode: 'FC', lgaCode: 'FC-AMAC', latitude: 9.08, longitude: 7.47 },
      ] },
    ],
  },
];

/**
 * Which agency owns which category. A rule with a jurisdictionCode and a higher
 * priority beats the national default for the same category, which is how
 * state-level routing is expressed.
 */
const ROUTING: Array<{
  categoryCode: string;
  agencyCode: string;
  jurisdictionCode?: string;
  priority: number;
}> = [
  { categoryCode: 'CORRUPTION', agencyCode: 'EFCC', priority: 100 },
  { categoryCode: 'FINANCIAL_CRIME', agencyCode: 'EFCC', priority: 100 },
  { categoryCode: 'NARCOTICS', agencyCode: 'NDLEA', priority: 100 },
  { categoryCode: 'OIL_PIPELINE', agencyCode: 'NPF', priority: 100 },
  // Rivers and Bayelsa pipeline reports go to the spill agency instead.
  { categoryCode: 'OIL_PIPELINE', agencyCode: 'NOSDRA', jurisdictionCode: 'RI', priority: 200 },
  { categoryCode: 'OIL_PIPELINE', agencyCode: 'NOSDRA', jurisdictionCode: 'BY', priority: 200 },
  { categoryCode: 'POWER_INFRASTRUCTURE', agencyCode: 'NERC', priority: 100 },
  { categoryCode: 'ENVIRONMENTAL', agencyCode: 'NOSDRA', priority: 100 },
  { categoryCode: 'PUBLIC_SAFETY', agencyCode: 'NEMA', priority: 100 },
  { categoryCode: 'CONSUMER_PROTECTION', agencyCode: 'FCCPC', priority: 100 },
];

const BUSINESS_RULES = [
  {
    name: 'Pipeline offences are critical',
    category: 'REPORT_TRIAGE',
    conditionsJson: JSON.stringify({
      all: [{ field: 'categoryCode', op: 'eq', value: 'OIL_PIPELINE' }],
    }),
    action: 'SET_PRIORITY',
    actionParams: JSON.stringify({ priority: 'CRITICAL' }),
    priority: 300,
  },
  {
    name: 'Public safety reports are critical',
    category: 'REPORT_TRIAGE',
    conditionsJson: JSON.stringify({
      all: [{ field: 'categoryCode', op: 'eq', value: 'PUBLIC_SAFETY' }],
    }),
    action: 'SET_PRIORITY',
    actionParams: JSON.stringify({ priority: 'CRITICAL' }),
    priority: 300,
  },
  {
    name: 'Anonymous corruption reports need supervisor review',
    category: 'REPORT_TRIAGE',
    conditionsJson: JSON.stringify({
      all: [
        { field: 'isAnonymous', op: 'eq', value: true },
        { field: 'categoryCode', op: 'in', value: ['CORRUPTION', 'FINANCIAL_CRIME'] },
      ],
    }),
    action: 'REQUIRE_SUPERVISOR_REVIEW',
    actionParams: null,
    priority: 200,
  },
  {
    name: 'Critical reports open as high-priority cases',
    category: 'CASE_PRIORITY',
    conditionsJson: JSON.stringify({
      all: [{ field: 'reportPriority', op: 'eq', value: 'CRITICAL' }],
    }),
    action: 'SET_PRIORITY',
    actionParams: JSON.stringify({ priority: 'CRITICAL' }),
    priority: 100,
  },
];

/**
 * The case state machine. Permissions are enforced per transition, so a
 * supervisor and an investigator see different available actions on the same case.
 */
const CASE_WORKFLOW = {
  INITIATED: {
    transitions: [
      {
        to: 'EVIDENCE_COLLECTION',
        label: 'Begin evidence collection',
        permissions: ['investigation:transition'],
      },
      { to: 'CLOSED', label: 'Close without action', permissions: ['investigation:close'] },
    ],
  },
  EVIDENCE_COLLECTION: {
    transitions: [
      { to: 'EVIDENCE_REVIEW', label: 'Submit for review', permissions: ['investigation:transition'] },
      { to: 'CLOSED', label: 'Close case', permissions: ['investigation:close'] },
    ],
  },
  EVIDENCE_REVIEW: {
    transitions: [
      {
        to: 'EVIDENCE_COLLECTION',
        label: 'Return for more evidence',
        permissions: ['investigation:transition'],
      },
      {
        to: 'SUPERVISOR_REVIEW',
        label: 'Escalate to supervisor',
        permissions: ['investigation:transition'],
      },
      { to: 'CLOSED', label: 'Close case', permissions: ['investigation:close'] },
    ],
  },
  SUPERVISOR_REVIEW: {
    transitions: [
      {
        to: 'EVIDENCE_COLLECTION',
        label: 'Return to the investigator',
        permissions: ['investigation:transition'],
      },
      { to: 'REFERRED', label: 'Refer for prosecution', permissions: ['investigation:close'] },
      { to: 'CLOSED', label: 'Close case', permissions: ['investigation:close'] },
    ],
  },
  REFERRED: {
    transitions: [{ to: 'CLOSED', label: 'Close case', permissions: ['investigation:close'] }],
  },
  CLOSED: { transitions: [], terminal: true },
};

export async function seedReferenceData(prisma: PrismaClient): Promise<void> {
  await seedPermissionsAndRoles(prisma);
  await seedJurisdictions(prisma);
  await seedCategories(prisma);
  await seedAgencies(prisma);
  await seedRouting(prisma);
  await seedBusinessRules(prisma);
  await seedWorkflow(prisma);
}

async function seedPermissionsAndRoles(prisma: PrismaClient): Promise<void> {
  for (const [slug, resource, action, description] of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug },
      update: { resource, action, description },
      create: { slug, resource, action, description },
    });
  }

  const permissionIds = new Map(
    (await prisma.permission.findMany({ select: { id: true, slug: true } })).map((row) => [
      row.slug,
      row.id,
    ]),
  );

  for (const role of ROLES) {
    const record = await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name, description: role.description, isSystem: true },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        isSystem: true,
      },
    });

    // Replace rather than merge, so removing a permission from this file removes
    // it from the role on the next seed.
    await prisma.rolePermission.deleteMany({ where: { roleId: record.id } });

    if (role.permissions.length > 0) {
      await prisma.rolePermission.createMany({
        data: role.permissions.flatMap((slug) => {
          const permissionId = permissionIds.get(slug);
          if (!permissionId) {
            throw new Error(`Role ${role.code} references unknown permission "${slug}".`);
          }
          return [{ roleId: record.id, permissionId }];
        }),
      });
    }
  }

  console.log(`  permissions: ${PERMISSIONS.length}, roles: ${ROLES.length}`);
}

async function seedJurisdictions(prisma: PrismaClient): Promise<void> {
  for (const jurisdiction of ALL_JURISDICTIONS) {
    await prisma.jurisdiction.upsert({
      where: { code: jurisdiction.code },
      update: jurisdiction,
      create: jurisdiction,
    });
  }

  console.log(`  jurisdictions: ${ALL_JURISDICTIONS.length}`);
}

async function seedCategories(prisma: PrismaClient): Promise<void> {
  for (const category of CATEGORIES) {
    await prisma.reportCategory.upsert({
      where: { code: category.code },
      update: category,
      create: category,
    });
  }

  console.log(`  report categories: ${CATEGORIES.length}`);
}

async function seedAgencies(prisma: PrismaClient): Promise<void> {
  for (const agency of AGENCIES) {
    const record = await prisma.agency.upsert({
      where: { code: agency.code },
      update: { name: agency.name, acronym: agency.acronym, category: agency.category },
      create: {
        code: agency.code,
        name: agency.name,
        acronym: agency.acronym,
        category: agency.category,
      },
    });

    for (const department of agency.departments) {
      const departmentRecord = await prisma.department.upsert({
        where: { agencyId_code: { agencyId: record.id, code: department.code } },
        update: { name: department.name },
        create: { agencyId: record.id, code: department.code, name: department.name },
      });

      for (const office of department.offices) {
        const existing = await prisma.office.findFirst({
          where: { departmentId: departmentRecord.id, name: office.name },
        });

        if (existing) {
          await prisma.office.update({ where: { id: existing.id }, data: office });
        } else {
          await prisma.office.create({ data: { ...office, departmentId: departmentRecord.id } });
        }
      }
    }
  }

  console.log(`  agencies: ${AGENCIES.length}`);
}

async function seedRouting(prisma: PrismaClient): Promise<void> {
  const categories = new Map(
    (await prisma.reportCategory.findMany({ select: { id: true, code: true } })).map((row) => [
      row.code,
      row.id,
    ]),
  );
  const agencies = new Map(
    (await prisma.agency.findMany({ select: { id: true, code: true } })).map((row) => [
      row.code,
      row.id,
    ]),
  );

  // Routing is fully derived from this file, so clear it before re-inserting.
  await prisma.routingRule.deleteMany();

  await prisma.routingRule.createMany({
    data: ROUTING.map((rule) => {
      const categoryId = categories.get(rule.categoryCode);
      const agencyId = agencies.get(rule.agencyCode);

      if (!categoryId || !agencyId) {
        throw new Error(
          `Routing rule references unknown category "${rule.categoryCode}" or agency "${rule.agencyCode}".`,
        );
      }

      return {
        categoryId,
        agencyId,
        jurisdictionCode: rule.jurisdictionCode ?? null,
        priority: rule.priority,
      };
    }),
  });

  console.log(`  routing rules: ${ROUTING.length}`);
}

async function seedBusinessRules(prisma: PrismaClient): Promise<void> {
  for (const rule of BUSINESS_RULES) {
    const existing = await prisma.businessRule.findFirst({ where: { name: rule.name } });

    if (existing) {
      await prisma.businessRule.update({ where: { id: existing.id }, data: rule });
    } else {
      await prisma.businessRule.create({ data: rule });
    }
  }

  console.log(`  business rules: ${BUSINESS_RULES.length}`);
}

async function seedWorkflow(prisma: PrismaClient): Promise<void> {
  const name = 'investigation-default';
  const statesJson = JSON.stringify(CASE_WORKFLOW);

  const existing = await prisma.workflowDefinition.findFirst({
    where: { name },
    orderBy: { version: 'desc' },
  });

  if (existing?.statesJson === statesJson) {
    console.log(`  workflow: ${name} v${existing.version} unchanged`);
    return;
  }

  await prisma.workflowDefinition.updateMany({
    where: { name, isActive: true },
    data: { isActive: false },
  });

  const published = await prisma.workflowDefinition.create({
    data: {
      name,
      version: (existing?.version ?? 0) + 1,
      initialState: 'INITIATED',
      statesJson,
      isActive: true,
    },
  });

  console.log(`  workflow: ${name} v${published.version} published`);
}
