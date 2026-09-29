import { Module, Global } from '@nestjs/common';
import { AuditController } from './controllers/audit.controller';
import { AuditLoggerService } from './services/audit-logger.service';

@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditLoggerService],
  exports: [AuditLoggerService],
})
export class AuditModule {}
