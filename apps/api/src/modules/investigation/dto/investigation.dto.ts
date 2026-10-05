import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  ASSIGNMENT_ROLES,
  ESCALATION_LEVELS,
  INVESTIGATION_STATUSES,
  PRIORITIES,
  TASK_STATUSES,
  type AssignmentRole,
  type EscalationLevel,
  type InvestigationStatus,
  type Priority,
  type TaskStatus,
} from '../../../common/constants';
import { PageQueryDto } from '../../../common/pagination';

export class OpenInvestigationDto {
  @ApiProperty({ description: 'The report this case is opened from' })
  @IsUUID()
  reportId!: string;

  @ApiProperty({ description: 'Owning agency. Must be one the caller is a member of.' })
  @IsUUID()
  agencyId!: string;

  @ApiProperty({ description: 'Supervisor accountable for the case' })
  @IsUUID()
  supervisorId!: string;

  @ApiPropertyOptional({ enum: PRIORITIES, description: 'Defaults to the report priority' })
  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Target completion date' })
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}

export class TransitionInvestigationDto {
  @ApiProperty({ enum: INVESTIGATION_STATUSES })
  @IsIn(INVESTIGATION_STATUSES)
  toState!: InvestigationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

export class CloseInvestigationDto {
  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'reason must explain the outcome' })
  @MaxLength(2000)
  reason!: string;
}

export class AssignInvestigatorDto {
  @ApiProperty()
  @IsUUID()
  investigatorId!: string;

  @ApiProperty({ enum: ASSIGNMENT_ROLES })
  @IsIn(ASSIGNMENT_ROLES)
  role!: AssignmentRole;
}

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(200)
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ enum: TASK_STATUSES })
  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;
}

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  content!: string;

  @ApiPropertyOptional({
    default: false,
    description: 'Confidential notes are visible only to supervisors and the case lead.',
  })
  @IsOptional()
  @IsBoolean()
  isConfidential?: boolean;
}

export class EscalateInvestigationDto {
  @ApiProperty()
  @IsUUID()
  escalatedToId!: string;

  @ApiProperty({ enum: ESCALATION_LEVELS })
  @IsIn(ESCALATION_LEVELS)
  level!: EscalationLevel;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  reason!: string;
}

export class InvestigationQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ enum: INVESTIGATION_STATUSES })
  @IsOptional()
  @IsIn(INVESTIGATION_STATUSES)
  status?: InvestigationStatus;

  @ApiPropertyOptional({ enum: PRIORITIES })
  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: Priority;

  @ApiPropertyOptional({ description: 'Restrict to one agency the caller belongs to' })
  @IsOptional()
  @IsUUID()
  agencyId?: string;

  @ApiPropertyOptional({ description: 'Only cases the caller is assigned to' })
  @IsOptional()
  // Query strings carry "true"/"false" as text and implicit conversion is off.
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  assignedToMe?: boolean;

  @ApiPropertyOptional({ description: 'Matches the case number or report title' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}
