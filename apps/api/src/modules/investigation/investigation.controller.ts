import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InvestigationService } from './investigation.service';
import {
  AssignInvestigatorDto,
  CloseInvestigationDto,
  CreateNoteDto,
  CreateTaskDto,
  EscalateInvestigationDto,
  InvestigationQueryDto,
  OpenInvestigationDto,
  TransitionInvestigationDto,
  UpdateTaskDto,
} from './dto/investigation.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, type AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { PERMISSIONS } from '../../common/constants';

@ApiBearerAuth()
@ApiTags('Investigations')
@Controller('investigations')
export class InvestigationController {
  constructor(private readonly investigations: InvestigationService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.INVESTIGATION_READ)
  @ApiOperation({ summary: 'List cases in the caller’s agencies' })
  list(@Query() query: InvestigationQueryDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.investigations.list(query, actor);
  }

  @Get('my-workload')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_READ)
  @ApiOperation({ summary: 'Case and task counts for the caller’s dashboard' })
  myWorkload(@CurrentUser() actor: AuthenticatedUser) {
    return this.investigations.myWorkload(actor);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_READ)
  @ApiOperation({ summary: 'Case detail with the transitions available to the caller' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.investigations.findById(id, actor);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.INVESTIGATION_CREATE)
  @ApiOperation({ summary: 'Open a case from a report' })
  open(@Body() dto: OpenInvestigationDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.investigations.open(dto, actor);
  }

  @Post(':id/transition')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_TRANSITION)
  @ApiOperation({ summary: 'Move the case to another workflow state' })
  transition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionInvestigationDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.transition(id, dto, actor);
  }

  @Post(':id/close')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_CLOSE)
  @ApiOperation({ summary: 'Close the case; requires every task to be resolved' })
  close(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CloseInvestigationDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.close(id, dto, actor);
  }

  @Post(':id/assignments')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_ASSIGN)
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignInvestigatorDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.assign(id, dto, actor);
  }

  @Delete(':id/assignments/:assignmentId')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_ASSIGN)
  unassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.unassign(id, assignmentId, actor);
  }

  @Post(':id/tasks')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_READ)
  createTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateTaskDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.createTask(id, dto, actor);
  }

  @Patch(':id/tasks/:taskId')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_READ)
  updateTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.updateTask(id, taskId, dto, actor);
  }

  @Post(':id/notes')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_READ)
  addNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateNoteDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.addNote(id, dto, actor);
  }

  @Post(':id/escalations')
  @RequirePermissions(PERMISSIONS.INVESTIGATION_ESCALATE)
  @ApiOperation({ summary: 'Escalate the case and raise its priority' })
  escalate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EscalateInvestigationDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.investigations.escalate(id, dto, actor);
  }
}
