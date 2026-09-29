import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { ResolutionTimeMetric } from './metrics/resolution-time.metric';
import { AgencyWorkloadReport } from './reports/agency-workload.report';
import { OverviewDashboard } from './dashboards/overview.dashboard';

@Module({
  controllers: [AnalyticsController],
  providers: [ResolutionTimeMetric, AgencyWorkloadReport, OverviewDashboard],
  exports: [ResolutionTimeMetric, AgencyWorkloadReport, OverviewDashboard],
})
export class AnalyticsModule {}
