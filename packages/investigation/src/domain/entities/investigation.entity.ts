export class InvestigationEntity {
  id!: string;
  caseNumber!: string;
  reportId!: string;
  agencyId!: string;
  departmentId?: string;
  supervisorId!: string;
  leadInvestigatorId?: string;
  priority!: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status!: string;
  closedAt?: Date;
  closedReason?: string;
  createdAt!: Date;
  updatedAt!: Date;
}
