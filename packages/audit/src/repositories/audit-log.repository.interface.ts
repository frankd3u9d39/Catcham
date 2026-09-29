import { AuditLogEntity } from '../domain/entities/audit-log.entity';

export interface IAuditLogRepository {
  append(entry: AuditLogEntity): Promise<void>;
  query(filters: any): Promise<AuditLogEntity[]>;
}
