import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';
import { ReportingService } from './reporting.service';
import {
  RejectReportDto,
  ReportQueryDto,
  SaveDraftDto,
  SubmitReportDto,
  TrackReportDto,
  TriageReportDto,
} from './dto/report.dto';
import { Public, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants';

/** Citizen-facing endpoints. No authentication, so every route here is rate limited. */
@ApiTags('Public reporting')
@Controller('public/reports')
export class PublicReportingController {
  constructor(private readonly reporting: ReportingService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Categories available on the report form' })
  categories() {
    return this.reporting.listCategories();
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 600_000 } })
  @Post()
  @ApiOperation({
    summary: 'Submit a report',
    description:
      'An anonymous submission returns a one-time tracking code. It is not stored in plaintext and cannot be recovered.',
  })
  submit(@Body() dto: SubmitReportDto, @Req() request: Request) {
    return this.reporting.submit(dto, { ipAddress: request.ip });
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('track')
  @ApiOperation({ summary: 'Look up a report with its reference number and tracking code' })
  track(@Body() dto: TrackReportDto) {
    return this.reporting.track(dto);
  }

  @Public()
  @Post('drafts')
  @ApiOperation({ summary: 'Save a partially completed form so it survives a reload' })
  saveDraft(@Body() dto: SaveDraftDto) {
    return this.reporting.saveDraft(dto);
  }

  @Public()
  @Get('drafts/:ownerKey')
  loadDraft(@Param('ownerKey') ownerKey: string) {
    return this.reporting.loadDraft(ownerKey);
  }

  @Public()
  @Delete('drafts/:ownerKey')
  @HttpCode(HttpStatus.NO_CONTENT)
  discardDraft(@Param('ownerKey') ownerKey: string) {
    return this.reporting.discardDraft(ownerKey);
  }
}

/** Officer-facing report queue. */
@ApiBearerAuth()
@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reporting: ReportingService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.REPORT_READ)
  @ApiOperation({ summary: 'Search the report queue' })
  list(@Query() query: ReportQueryDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.reporting.list(query, actor);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.REPORT_READ)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reporting.findById(id);
  }

  @Post(':id/triage')
  @RequirePermissions(PERMISSIONS.REPORT_TRIAGE)
  @ApiOperation({ summary: 'Set the priority and optionally override the routed agency' })
  triage(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TriageReportDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.reporting.triage(id, dto, actor);
  }

  @Post(':id/reject')
  @RequirePermissions(PERMISSIONS.REPORT_REJECT)
  @ApiOperation({ summary: 'Reject a report that has no investigation' })
  reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectReportDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.reporting.reject(id, dto, actor);
  }
}
