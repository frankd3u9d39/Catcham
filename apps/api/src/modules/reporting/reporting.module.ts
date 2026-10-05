import { Module } from '@nestjs/common';
import { PublicReportingController, ReportsController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { ReportRoutingService } from './report-routing.service';
import { GeoModule } from '../geo/geo.module';
import { RulesModule } from '../rules/rules.module';

@Module({
  imports: [GeoModule, RulesModule],
  controllers: [PublicReportingController, ReportsController],
  providers: [ReportingService, ReportRoutingService],
  exports: [ReportingService],
})
export class ReportingModule {}
