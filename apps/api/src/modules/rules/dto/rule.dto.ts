import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

/** Rule categories, each evaluated at a specific point in the report lifecycle. */
export const RULE_CATEGORIES = ['REPORT_TRIAGE', 'CASE_PRIORITY', 'ESCALATION'] as const;
export type RuleCategory = (typeof RULE_CATEGORIES)[number];

/** Actions the engine can return. Each is interpreted by the calling service. */
export const RULE_ACTIONS = [
  'SET_PRIORITY',
  'ROUTE_TO_AGENCY',
  'REQUIRE_SUPERVISOR_REVIEW',
  'FLAG_FOR_ESCALATION',
] as const;
export type RuleAction = (typeof RULE_ACTIONS)[number];

export class CreateRuleDto {
  @ApiProperty({ example: 'Critical priority for pipeline incidents' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @ApiProperty({ enum: RULE_CATEGORIES })
  @IsIn(RULE_CATEGORIES)
  category!: RuleCategory;

  @ApiProperty({
    description: 'Condition set as JSON',
    example: '{"all":[{"field":"categoryCode","op":"eq","value":"OIL_PIPELINE"}]}',
  })
  @IsString()
  @IsNotEmpty()
  conditionsJson!: string;

  @ApiProperty({ enum: RULE_ACTIONS })
  @IsIn(RULE_ACTIONS)
  action!: RuleAction;

  @ApiPropertyOptional({ example: { priority: 'CRITICAL' } })
  @IsOptional()
  @IsObject()
  actionParams?: Record<string, unknown>;

  @ApiPropertyOptional({ default: 100, description: 'Higher values are evaluated first' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  priority?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class UpdateRuleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  conditionsJson?: string;

  @ApiPropertyOptional({ enum: RULE_ACTIONS })
  @IsOptional()
  @IsIn(RULE_ACTIONS)
  action?: RuleAction;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  actionParams?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class SimulateRuleDto {
  @ApiProperty({ enum: RULE_CATEGORIES })
  @IsIn(RULE_CATEGORIES)
  category!: RuleCategory;

  @ApiProperty({ example: { categoryCode: 'OIL_PIPELINE', severityScore: 8 } })
  @IsObject()
  facts!: Record<string, unknown>;
}
