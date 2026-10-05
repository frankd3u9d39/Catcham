import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants';

@ApiBearerAuth()
@ApiTags('Analytics')
@Controller('analytics')
@RequirePermissions(PERMISSIONS.ANALYTICS_READ)
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Platform-wide counts and resolution times' })
  overview() {
    return this.analytics.overview();
  }

  @Get('agency-workload')
  @ApiOperation({ summary: 'Open, closed and overdue case counts per agency' })
  agencyWorkload() {
    return this.analytics.agencyWorkload();
  }

  @Get('report-volume')
  @ApiOperation({ summary: 'Daily report counts over a window, with empty days filled' })
  reportVolume(@Query('days', new ParseIntPipe({ optional: true })) days?: number) {
    return this.analytics.reportVolume(clampDays(days));
  }

  @Get('category-breakdown')
  categoryBreakdown() {
    return this.analytics.categoryBreakdown();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Open cases past their due date, in the caller’s agencies' })
  overdue(@CurrentUser() actor: AuthenticatedUser) {
    return this.analytics.overdueCases(actor.agencyIds);
  }
}

function clampDays(days?: number): number {
  if (days === undefined || Number.isNaN(days)) {
    return 30;
  }
  return Math.min(365, Math.max(1, days));
}
