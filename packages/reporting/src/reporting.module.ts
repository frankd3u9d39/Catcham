import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ReportsController } from './controllers/reports.controller';
import { AnonymousController } from './controllers/anonymous.controller';
import { CategoriesController } from './controllers/categories.controller';
import { DraftsController } from './controllers/drafts.controller';
import { SubmitReportHandler } from './application/handlers/submit-report.handler';
import { ReportRoutingService } from './domain/services/report-routing.service';

@Module({
  imports: [CqrsModule],
  controllers: [
    ReportsController,
    AnonymousController,
    CategoriesController,
    DraftsController,
  ],
  providers: [SubmitReportHandler, ReportRoutingService],
  exports: [ReportRoutingService],
})
export class ReportingModule {}
