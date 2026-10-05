import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { WorkflowService } from './workflow.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PERMISSIONS } from '../../common/constants';

class PublishWorkflowDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsString()
  @IsNotEmpty()
  initialState!: string;

  @IsString()
  @IsNotEmpty()
  statesJson!: string;
}

@ApiBearerAuth()
@ApiTags('Workflows')
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflow: WorkflowService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.WORKFLOW_MANAGE)
  @ApiOperation({ summary: 'List workflow definitions and their versions' })
  list() {
    return this.workflow.listDefinitions();
  }

  @Get(':name/active')
  @RequirePermissions(PERMISSIONS.WORKFLOW_MANAGE)
  @ApiOperation({ summary: 'Return the active definition with its parsed state machine' })
  active(@Param('name') name: string) {
    return this.workflow.activeDefinition(name);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.WORKFLOW_MANAGE)
  @ApiOperation({ summary: 'Publish a new version and deactivate the previous one' })
  publish(@Body() dto: PublishWorkflowDto) {
    return this.workflow.publishDefinition(dto);
  }
}
