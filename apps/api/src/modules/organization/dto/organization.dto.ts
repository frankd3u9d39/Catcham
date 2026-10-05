import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AGENCY_CATEGORIES, type AgencyCategory } from '../../../common/constants';

const CODE_PATTERN = /^[A-Z0-9_-]{2,20}$/i;

export class CreateAgencyDto {
  @ApiProperty({ example: 'EFCC' })
  @Matches(CODE_PATTERN, { message: 'code must be 2-20 letters, digits, hyphens or underscores' })
  code!: string;

  @ApiProperty({ example: 'Economic and Financial Crimes Commission' })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  name!: string;

  @ApiProperty({ example: 'EFCC' })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  acronym!: string;

  @ApiProperty({ enum: AGENCY_CATEGORIES })
  @IsIn(AGENCY_CATEGORIES)
  category!: AgencyCategory;

  @ApiPropertyOptional({ default: 'NATIONAL', example: 'NATIONAL' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  jurisdictionScope?: string;
}

export class UpdateAgencyDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  acronym?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  jurisdictionScope?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Financial Crimes Unit' })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  name!: string;

  @ApiProperty({ example: 'FCU' })
  @Matches(CODE_PATTERN)
  code!: string;
}

export class CreateOfficeDto {
  @ApiProperty({ example: 'Port Harcourt Zonal Office' })
  @IsString()
  @MinLength(3)
  @MaxLength(160)
  name!: string;

  @ApiProperty({ example: 'RI' })
  @IsString()
  @MaxLength(16)
  stateCode!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(16)
  lgaCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @ApiPropertyOptional({ description: 'Enables the nearest-office lookup' })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;
}
