import type { PrismaClient } from '@prisma/client';
import { Algorithm, hash } from '@node-rs/argon2';
import { randomBytes } from 'node:crypto';

/**
 * Accounts, reports and cases for a usable local environment.
 *
 * Only runs when the database has no users, so a re-seed does not duplicate
 * demonstration data or reset a password that has been changed. Every account
 * shares one password, taken from SEED_ADMIN_PASSWORD.
 */

/** Must match ARGON2_OPTIONS in apps/api/src/common/utils/crypto.util.ts. */
const ARGON2_OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
} as const;

interface SeedAccount {
  email: string;
  fullName: string;
  agencyCode: string;
  roleCode: string;
}

const ACCOUNTS: SeedAccount[] = [
  { email: 'admin@catcham.local', fullName: 'Amina Yusuf', agencyCode: 'EFCC', roleCode: 'SYSTEM_ADMIN' },
  { email: 'supervisor.efcc@catcham.local', fullName: 'Chidi Okonkwo', agencyCode: 'EFCC', roleCode: 'SUPERVISOR' },
  { email: 'investigator.efcc@catcham.local', fullName: 'Folake Adeleke', agencyCode: 'EFCC', roleCode: 'INVESTIGATOR' },
  { email: 'investigator2.efcc@catcham.local', fullName: 'Ibrahim Bello', agencyCode: 'EFCC', roleCode: 'INVESTIGATOR' },
  { email: 'intake@catcham.local', fullName: 'Grace Eze', agencyCode: 'EFCC', roleCode: 'INTAKE_OFFICER' },
  { email: 'auditor@catcham.local', fullName: 'Tunde Bakare', agencyCode: 'EFCC', roleCode: 'AUDITOR' },
  { email: 'supervisor.nosdra@catcham.local', fullName: 'Blessing Otu', agencyCode: 'NOSDRA', roleCode: 'SUPERVISOR' },
  { email: 'investigator.nosdra@catcham.local', fullName: 'Emeka Nwosu', agencyCode: 'NOSDRA', roleCode: 'INVESTIGATOR' },
  { email: 'supervisor.npf@catcham.local', fullName: 'Hauwa Danladi', agencyCode: 'NPF', roleCode: 'SUPERVISOR' },
];

const REPORTS = [
  {
    title: 'Suspected crude oil diversion at an Eleme manifold',
    description:
      'Tanker trucks have been loading at an unmarked manifold off the Eleme–Onne road between 01:00 and 04:00 for the past three weeks. No NNPC markings on the vehicles and no visible loading documentation. Approximately six trucks per night.',
    categoryCode: 'OIL_PIPELINE',
    stateCode: 'RI',
    lgaCode: 'RI-ELEME',
    latitude: 4.79,
    longitude: 7.12,
    isAnonymous: true,
    daysAgo: 12,
  },
  {
    title: 'Procurement irregularities in a river basin authority contract',
    description:
      'A borehole construction contract was awarded at roughly four times the prevailing market rate to a company incorporated two weeks before the tender closed. The evaluation committee chair is listed as a director of the winning company.',
    categoryCode: 'CORRUPTION',
    stateCode: 'FC',
    lgaCode: 'FC-AMAC',
    isAnonymous: true,
    daysAgo: 9,
  },
  {
    title: 'Distribution of substandard distribution transformers',
    description:
      'Three transformers installed in the last quarter have failed within weeks. The nameplate ratings do not match the delivered units and there is no evidence of factory acceptance testing.',
    categoryCode: 'POWER_INFRASTRUCTURE',
    stateCode: 'KD',
    lgaCode: 'KD-KADUNA-N',
    isAnonymous: false,
    contactEmail: 'reporter@example.com',
    daysAgo: 6,
  },
  {
    title: 'Unreported spill in a creek near Bonny',
    description:
      'A sheen covering roughly two hundred metres of creek has been visible for four days. Fishing nets set in the area are coated. No containment booms have been deployed and no notice has been posted locally.',
    categoryCode: 'ENVIRONMENTAL',
    stateCode: 'RI',
    lgaCode: 'RI-BONNY',
    latitude: 4.45,
    longitude: 7.17,
    isAnonymous: true,
    daysAgo: 4,
  },
  {
    title: 'Counterfeit pharmaceuticals sold at a market stall',
    description:
      'A stall is selling antimalarials in packaging that differs from the registered product: the batch number font is inconsistent and the holographic seal is missing. Several buyers have reported no therapeutic effect.',
    categoryCode: 'CONSUMER_PROTECTION',
    stateCode: 'LA',
    lgaCode: 'LA-ALIMOSHO',
    isAnonymous: true,
    daysAgo: 3,
  },
  {
    title: 'Structural cracks in an occupied three-storey building',
    description:
      'Vertical cracks have widened noticeably over two weeks on a building housing about forty residents. Spalling concrete has exposed reinforcement on the ground-floor columns.',
    categoryCode: 'PUBLIC_SAFETY',
    stateCode: 'LA',
    lgaCode: 'LA-ETIOSA',
    latitude: 6.44,
    longitude: 3.52,
    isAnonymous: true,
    daysAgo: 1,
  },
];

export async function seedDemoData(prisma: PrismaClient): Promise<void> {
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('  skipped: the database already has user accounts');
    return;
  }

  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await hash(password, ARGON2_OPTIONS);

  const agencies = new Map(
    (await prisma.agency.findMany({ select: { id: true, code: true, name: true } })).map((row) => [
      row.code,
      row,
    ]),
  );
  const roles = new Map(
    (await prisma.role.findMany({ select: { id: true, code: true } })).map((row) => [
      row.code,
      row.id,
    ]),
  );
  const categories = new Map(
    (await prisma.reportCategory.findMany({ select: { id: true, code: true } })).map((row) => [
      row.code,
      row.id,
    ]),
  );

  const usersByEmail = new Map<string, string>();

  for (const account of ACCOUNTS) {
    const agency = agencies.get(account.agencyCode);
    const roleId = roles.get(account.roleCode);

    if (!agency || !roleId) {
      throw new Error(
        `Account ${account.email} references unknown agency "${account.agencyCode}" or role "${account.roleCode}".`,
      );
    }

    const user = await prisma.user.create({
      data: {
        email: account.email,
        fullName: account.fullName,
        passwordHash,
        memberships: { create: { agencyId: agency.id, roleId } },
      },
    });

    usersByEmail.set(account.email, user.id);
  }

  console.log(`  accounts: ${ACCOUNTS.length} (password from SEED_ADMIN_PASSWORD)`);

  const trackingCodes: Array<{ reference: string; code: string }> = [];
  const reportIds: string[] = [];

  for (const [index, report] of REPORTS.entries()) {
    const categoryId = categories.get(report.categoryCode);
    if (!categoryId) {
      throw new Error(`Report references unknown category "${report.categoryCode}".`);
    }

    const createdAt = new Date(Date.now() - report.daysAgo * 86_400_000);
    const reference = `CTM-${createdAt.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`;
    const trackingCode = report.isAnonymous ? randomTrackingCode() : null;

    const created = await prisma.report.create({
      data: {
        referenceNumber: reference,
        trackingCodeHash: trackingCode ? await hash(trackingCode, ARGON2_OPTIONS) : null,
        title: report.title,
        description: report.description,
        categoryId,
        isAnonymous: report.isAnonymous,
        contactEmail: 'contactEmail' in report ? report.contactEmail : null,
        stateCode: report.stateCode,
        lgaCode: report.lgaCode,
        latitude: 'latitude' in report ? report.latitude : null,
        longitude: 'longitude' in report ? report.longitude : null,
        status: index < 4 ? 'ROUTED' : 'SUBMITTED',
        priority: priorityFor(report.categoryCode),
        createdAt,
        updatedAt: createdAt,
        timeline: {
          create: [
            {
              action: 'SUBMITTED',
              description: report.isAnonymous
                ? 'Report received through the anonymous channel.'
                : 'Report received.',
              actorType: report.isAnonymous ? 'ANONYMOUS' : 'CITIZEN',
              createdAt,
            },
          ],
        },
      },
    });

    reportIds.push(created.id);
    if (trackingCode) {
      trackingCodes.push({ reference, code: trackingCode });
    }
  }

  console.log(`  reports: ${REPORTS.length}`);

  await seedCases(prisma, {
    reportIds,
    agencies,
    userIds: usersByEmail,
  });

  console.log('\n  Anonymous tracking codes (shown once, as in the real flow):');
  for (const entry of trackingCodes) {
    console.log(`    ${entry.reference}  ${entry.code}`);
  }
}

async function seedCases(
  prisma: PrismaClient,
  context: {
    reportIds: string[];
    agencies: Map<string, { id: string; code: string; name: string }>;
    userIds: Map<string, string>;
  },
): Promise<void> {
  const definition = await prisma.workflowDefinition.findFirst({
    where: { name: 'investigation-default', isActive: true },
    orderBy: { version: 'desc' },
  });
  if (!definition) {
    throw new Error('No active case workflow. Seed the reference data first.');
  }

  const efcc = context.agencies.get('EFCC')!;
  const nosdra = context.agencies.get('NOSDRA')!;

  const efccSupervisor = context.userIds.get('supervisor.efcc@catcham.local')!;
  const efccLead = context.userIds.get('investigator.efcc@catcham.local')!;
  const efccAssistant = context.userIds.get('investigator2.efcc@catcham.local')!;
  const nosdraSupervisor = context.userIds.get('supervisor.nosdra@catcham.local')!;
  const nosdraLead = context.userIds.get('investigator.nosdra@catcham.local')!;

  const cases = [
    {
      reportIndex: 1,
      agency: efcc,
      supervisorId: efccSupervisor,
      priority: 'HIGH',
      status: 'EVIDENCE_COLLECTION',
      dueInDays: 10,
      assignments: [
        { investigatorId: efccLead, role: 'LEAD' },
        { investigatorId: efccAssistant, role: 'ASSISTANT' },
      ],
      tasks: [
        { title: 'Obtain the tender evaluation file', status: 'DONE', dueInDays: -2 },
        { title: 'Interview the evaluation committee chair', status: 'IN_PROGRESS', dueInDays: 2 },
        { title: 'Verify the winning company’s incorporation record', status: 'PENDING', dueInDays: 5 },
      ],
      notes: [
        {
          authorId: efccLead,
          content:
            'Corporate registry search confirms incorporation 11 days before tender close. Director list matches the committee chair.',
          isConfidential: false,
        },
        {
          authorId: efccSupervisor,
          content: 'Hold the interview until the registry certificate is in hand.',
          isConfidential: true,
        },
      ],
      transitions: [{ from: 'INITIATED', to: 'EVIDENCE_COLLECTION', actorId: efccSupervisor }],
    },
    {
      reportIndex: 3,
      agency: nosdra,
      supervisorId: nosdraSupervisor,
      priority: 'CRITICAL',
      status: 'EVIDENCE_REVIEW',
      dueInDays: 3,
      assignments: [{ investigatorId: nosdraLead, role: 'LEAD' }],
      tasks: [
        { title: 'Collect water samples at three points', status: 'DONE', dueInDays: -1 },
        { title: 'Photograph the affected shoreline', status: 'DONE', dueInDays: -1 },
        { title: 'Identify the operator of the nearest flowline', status: 'IN_PROGRESS', dueInDays: 1 },
      ],
      notes: [
        {
          authorId: nosdraLead,
          content:
            'Sheen extends roughly 230 m. Samples taken at the creek mouth, mid-channel and 500 m downstream.',
          isConfidential: false,
        },
      ],
      transitions: [
        { from: 'INITIATED', to: 'EVIDENCE_COLLECTION', actorId: nosdraSupervisor },
        { from: 'EVIDENCE_COLLECTION', to: 'EVIDENCE_REVIEW', actorId: nosdraLead },
      ],
    },
    {
      reportIndex: 0,
      agency: nosdra,
      supervisorId: nosdraSupervisor,
      priority: 'CRITICAL',
      status: 'INITIATED',
      dueInDays: 14,
      assignments: [],
      tasks: [{ title: 'Schedule a night observation of the manifold', status: 'PENDING', dueInDays: 3 }],
      notes: [],
      transitions: [],
    },
  ];

  let created = 0;

  for (const entry of cases) {
    const reportId = context.reportIds[entry.reportIndex];
    if (!reportId) {
      continue;
    }

    const createdAt = new Date(Date.now() - 5 * 86_400_000);

    const investigation = await prisma.investigation.create({
      data: {
        caseNumber: `CAS-${createdAt.getFullYear()}-${randomBytes(3).toString('hex').toUpperCase()}`,
        reportId,
        agencyId: entry.agency.id,
        supervisorId: entry.supervisorId,
        priority: entry.priority,
        status: entry.status,
        dueAt: new Date(Date.now() + entry.dueInDays * 86_400_000),
        createdAt,
        updatedAt: createdAt,
        assignments: { create: entry.assignments },
        tasks: {
          create: entry.tasks.map((task) => ({
            title: task.title,
            status: task.status,
            dueAt: new Date(Date.now() + task.dueInDays * 86_400_000),
            completedAt: task.status === 'DONE' ? new Date(Date.now() - 86_400_000) : null,
          })),
        },
        notes: { create: entry.notes },
      },
    });

    for (const transition of entry.transitions) {
      await prisma.workflowTransition.create({
        data: {
          definitionId: definition.id,
          investigationId: investigation.id,
          fromState: transition.from,
          toState: transition.to,
          actorId: transition.actorId,
        },
      });
    }

    await prisma.report.update({
      where: { id: reportId },
      data: { status: 'UNDER_INVESTIGATION' },
    });
    await prisma.reportTimeline.create({
      data: {
        reportId,
        action: 'INVESTIGATION_OPENED',
        description: `Case ${investigation.caseNumber} opened by ${entry.agency.name}.`,
        actorType: 'OFFICER',
        actorId: entry.supervisorId,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: entry.supervisorId,
        actorLabel: 'seed',
        action: 'INVESTIGATION_OPENED',
        resource: 'investigation',
        resourceId: investigation.id,
        metadataJson: JSON.stringify({ caseNumber: investigation.caseNumber, source: 'seed' }),
        createdAt,
      },
    });

    created += 1;
  }

  console.log(`  cases: ${created}`);
}

function priorityFor(categoryCode: string): string {
  if (categoryCode === 'OIL_PIPELINE' || categoryCode === 'PUBLIC_SAFETY') {
    return 'CRITICAL';
  }
  if (categoryCode === 'CONSUMER_PROTECTION') {
    return 'MEDIUM';
  }
  return 'HIGH';
}

function randomTrackingCode(): string {
  const alphabet = 'ACDEFGHJKLMNPQRSTUVWXY34679';
  const bytes = randomBytes(10);

  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join('');
}
