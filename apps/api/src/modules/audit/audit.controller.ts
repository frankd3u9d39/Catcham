import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditQueryDto } from './dto/audit-query.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants';

@ApiBearerAuth()
@ApiTags('Audit')
@Controller('audit')
@RequirePermissions(PERMISSIONS.AUDIT_READ)
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Search the activity log' })
  list(@Query() query: AuditQueryDto) {
    return this.audit.list(query, {
      resource: query.resource,
      resourceId: query.resourceId,
      actorId: query.actorId,
      action: query.action,
      from: query.from ? new Date(query.from) : undefined,
      to: query.to ? new Date(query.to) : undefined,
    });
  }

  @Get(':resource/:resourceId')
  @ApiOperation({ summary: 'Full chronological trail for one record' })
  trail(@Param('resource') resource: string, @Param('resourceId') resourceId: string) {
    return this.audit.trailFor(resource, resourceId);
  }
}
