import { Controller, Get } from '@nestjs/common';

@Controller('analytics')
export class AnalyticsController {
  @Get('overview')
  async getOverview() {
    return { totalReports: 0, openInvestigations: 0, avgResolutionDays: 0 };
  }
}
