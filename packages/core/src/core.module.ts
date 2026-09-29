import { Module, Global } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkflowExecutionService } from './workflow/domain/services/workflow-execution.service';
import { RulesEvaluatorService } from './rules/services/rules-evaluator.service';
import { UploadService } from './upload/services/upload.service';
import { CryptoService } from './security/crypto.service';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    WorkflowExecutionService,
    RulesEvaluatorService,
    UploadService,
    CryptoService,
  ],
  exports: [
    WorkflowExecutionService,
    RulesEvaluatorService,
    UploadService,
    CryptoService,
  ],
})
export class CoreModule {}
