import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PageQueryDto } from '../../../common/pagination';

export class AuditQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ example: 'evidence' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  resource?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  resourceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  actorId?: string;

  @ApiPropertyOptional({ example: 'EVIDENCE_DOWNLOADED' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  action?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 lower bound, inclusive' })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 upper bound, inclusive' })
  @IsOptional()
  @IsISO8601()
  to?: string;
}
