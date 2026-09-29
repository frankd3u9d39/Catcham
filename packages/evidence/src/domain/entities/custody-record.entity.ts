export class CustodyRecordEntity {
  id!: string;
  evidenceId!: string;
  action!: 'INTAKE' | 'TRANSFERRED' | 'VIEWED' | 'EXPORTED' | 'EVALUATED_BY_AI' | 'SEALED';
  performedById!: string;
  transferredToId?: string;
  reason!: string;
  timestamp!: Date;
  ipAddress?: string;
}
