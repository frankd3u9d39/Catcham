export class InvestigationEscalationEntity {
  id!: string;
  investigationId!: string;
  reason!: string;
  escalatedById!: string;
  targetAgencyId?: string;
  targetRole?: string;
  status!: 'OPEN' | 'RESOLVED';
  createdAt!: Date;
}
