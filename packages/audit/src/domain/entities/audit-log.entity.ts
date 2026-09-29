export class AuditLogEntity {
  id!: string;
  actorId!: string;
  actorEmail?: string;
  action!: string;
  resource!: string;
  resourceId!: string;
  metadataJson!: string;
  ipAddress!: string;
  timestamp!: Date;
}
