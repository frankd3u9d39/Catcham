import { Module } from '@nestjs/common';
import { InvestigationController } from './investigation.controller';
import { InvestigationService } from './investigation.service';
import { WorkflowModule } from '../workflow/workflow.module';
import { RulesModule } from '../rules/rules.module';

@Module({
  imports: [WorkflowModule, RulesModule],
  controllers: [InvestigationController],
  providers: [InvestigationService],
  exports: [InvestigationService],
})
export class InvestigationModule {}
