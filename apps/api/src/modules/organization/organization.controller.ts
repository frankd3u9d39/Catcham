import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import {
  CreateAgencyDto,
  CreateDepartmentDto,
  CreateOfficeDto,
  UpdateAgencyDto,
} from './dto/organization.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS, type AgencyCategory } from '../../common/constants';

@ApiBearerAuth()
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizations: OrganizationService) {}

  @Get('tree')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_READ)
  @ApiOperation({ summary: 'Agency hierarchy with personnel and case counts' })
  tree(@Query('category') category?: AgencyCategory) {
    return this.organizations.tree(category);
  }

  @Get('agencies')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_READ)
  listAgencies(@Query('category') category?: AgencyCategory) {
    return this.organizations.listAgencies(category);
  }

  @Get('agencies/:id')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_READ)
  findAgency(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizations.findAgency(id);
  }

  @Get('routing-rules')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_READ)
  @ApiOperation({ summary: 'Category-to-agency routing rules' })
  listRoutingRules(@Query('agencyId') agencyId?: string) {
    return this.organizations.listRoutingRules(agencyId);
  }

  @Post('agencies')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_MANAGE)
  createAgency(@Body() dto: CreateAgencyDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.organizations.createAgency(dto, actor);
  }

  @Patch('agencies/:id')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_MANAGE)
  updateAgency(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgencyDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.organizations.updateAgency(id, dto, actor);
  }

  @Post('agencies/:id/departments')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_MANAGE)
  createDepartment(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateDepartmentDto) {
    return this.organizations.createDepartment(id, dto);
  }

  @Post('departments/:id/offices')
  @RequirePermissions(PERMISSIONS.ORGANIZATION_MANAGE)
  createOffice(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateOfficeDto) {
    return this.organizations.createOffice(id, dto);
  }
}
