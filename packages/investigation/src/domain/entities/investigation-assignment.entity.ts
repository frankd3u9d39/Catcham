export class InvestigationAssignmentEntity {
  id!: string;
  investigationId!: string;
  investigatorId!: string;
  role!: 'LEAD' | 'ASSISTANT' | 'SPECIALIST' | 'LEGAL_OFFICER';
  assignedAt!: Date;
  isActive!: boolean;
}
