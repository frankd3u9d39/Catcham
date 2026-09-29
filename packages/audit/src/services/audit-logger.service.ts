import { Injectable } from '@nestjs/common';
import { AuditLogEntity } from '../domain/entities/audit-log.entity';

@Injectable()
export class AuditLoggerService {
  async log(action: string, resource: string, resourceId: string, actorId: string, metadata?: any): Promise<void> {
    // Append-only persistence logic
  }
}
