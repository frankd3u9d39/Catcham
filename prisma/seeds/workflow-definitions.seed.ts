import { PrismaClient } from '@prisma/client';

export async function seedWorkflowDefinitions(prisma: PrismaClient) {
  const defaultWorkflow = {
    name: 'STANDARD_INCIDENT_WORKFLOW',
    version: 1,
    initialState: 'SUBMITTED',
    statesJson: JSON.stringify([
      'SUBMITTED',
      'TRIAGED',
      'UNDER_INVESTIGATION',
      'PENDING_SUPERVISOR_REVIEW',
      'ESCALATED',
      'RESOLVED',
      'ARCHIVED',
    ]),
    isActive: true,
  };

  await prisma.workflowDefinition.upsert({
    where: { name: defaultWorkflow.name },
    update: {},
    create: defaultWorkflow,
  });
}
