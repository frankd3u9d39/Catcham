import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EVIDENCE_CLASSIFICATIONS,
  type EvidenceClassification,
} from '../../../common/constants';

export class UploadEvidenceDto {
  @ApiPropertyOptional({ description: 'Attach to a report. One of reportId or investigationId.' })
  @IsOptional()
  @IsUUID()
  reportId?: string;

  @ApiPropertyOptional({ description: 'Attach to an investigation.' })
  @IsOptional()
  @IsUUID()
  investigationId?: string;

  @ApiPropertyOptional({ enum: EVIDENCE_CLASSIFICATIONS, default: 'CONFIDENTIAL' })
  @IsOptional()
  @IsIn(EVIDENCE_CLASSIFICATIONS)
  classification?: EvidenceClassification;
}

export class TransferCustodyDto {
  @ApiProperty({ description: 'The officer taking custody' })
  @IsUUID()
  transferredToId!: string;

  @ApiProperty({ description: 'Why custody is changing hands. Recorded in the chain permanently.' })
  @IsString()
  @MinLength(10, { message: 'reason must explain the transfer' })
  @MaxLength(1000)
  reason!: string;
}

export class AnnotateEvidenceDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  text!: string;

  @ApiPropertyOptional({
    description: 'Optional structured context, e.g. a timestamp or region of interest',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

export class ArchiveEvidenceDto {
  @ApiProperty({ description: 'Retention or disposal justification' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  reason!: string;
}
