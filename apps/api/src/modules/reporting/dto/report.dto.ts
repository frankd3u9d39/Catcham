import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PRIORITIES,
  REPORT_STATUSES,
  type Priority,
  type ReportStatus,
} from '../../../common/constants';
import { PageQueryDto } from '../../../common/pagination';

export class SubmitReportDto {
  @ApiProperty({ example: 'Suspected diversion of petroleum products' })
  @IsString()
  @MinLength(8)
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(30, { message: 'description must be at least 30 characters so it can be triaged' })
  @MaxLength(10_000)
  description!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({
    default: true,
    description: 'When false, contactEmail or contactPhone is required.',
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/)
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Jurisdiction code, e.g. RI for Rivers State' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  stateCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  lgaCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  addressText?: string;

  @ApiPropertyOptional({ description: 'Used to resolve the jurisdiction when codes are omitted' })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'When the incident happened, if known' })
  @IsOptional()
  @IsDateString()
  occurredAt?: string;
}

export class TrackReportDto {
  @ApiProperty({ example: 'CTM-2026-7F3A91' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  referenceNumber!: string;

  @ApiProperty({ description: 'The code shown once at submission' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  trackingCode!: string;
}

export class TriageReportDto {
  @ApiProperty({ enum: PRIORITIES })
  @IsIn(PRIORITIES)
  priority!: Priority;

  @ApiPropertyOptional({ description: 'Overrides the agency chosen by the routing rules' })
  @IsOptional()
  @IsUUID()
  agencyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

export class RejectReportDto {
  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'reason must explain the rejection' })
  @MaxLength(1000)
  reason!: string;
}

export class ReportQueryDto extends PageQueryDto {
  @ApiPropertyOptional({ enum: REPORT_STATUSES })
  @IsOptional()
  @IsIn(REPORT_STATUSES)
  status?: ReportStatus;

  @ApiPropertyOptional({ enum: PRIORITIES })
  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: Priority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stateCode?: string;

  @ApiPropertyOptional({ description: 'Matches the title, description or reference number' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;
}

export class SaveDraftDto {
  @ApiProperty({ description: 'Opaque client-generated key identifying the draft owner' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  ownerKey!: string;

  @ApiProperty({ description: 'Partial SubmitReportDto, serialised' })
  @IsString()
  @MaxLength(20_000)
  payload!: string;
}
