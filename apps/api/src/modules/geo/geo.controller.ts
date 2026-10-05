import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsLatitude, IsLongitude, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { GeoService } from './geo.service';
import { Public } from '../../common/decorators/permissions.decorator';
import { JURISDICTION_LEVELS, type JurisdictionLevel } from '../../common/constants';

class PointQueryDto {
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @Type(() => Number)
  @IsLongitude()
  longitude!: number;
}

class NearbyQueryDto extends PointQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  radiusKm = 50;
}

class JurisdictionQueryDto {
  @IsOptional()
  @IsIn(JURISDICTION_LEVELS)
  level?: JurisdictionLevel;

  @IsOptional()
  @IsString()
  parentCode?: string;
}

@ApiTags('Geography')
@Controller('geo')
export class GeoController {
  constructor(private readonly geo: GeoService) {}

  // Public: the anonymous report form needs the state and LGA lists before the
  // submitter has any credentials.
  @Public()
  @Get('jurisdictions')
  @ApiOperation({ summary: 'List jurisdictions, optionally filtered by level or parent' })
  listJurisdictions(@Query() query: JurisdictionQueryDto) {
    return this.geo.listJurisdictions(query.level, query.parentCode);
  }

  @Public()
  @Get('resolve')
  @ApiOperation({ summary: 'Resolve a coordinate pair to its state and LGA' })
  resolve(@Query() query: PointQueryDto) {
    return this.geo.resolve(query);
  }

  @Public()
  @Get('offices/nearby')
  @ApiOperation({ summary: 'List agency offices near a coordinate pair' })
  nearbyOffices(@Query() query: NearbyQueryDto) {
    return this.geo.nearestOffices(query, query.radiusKm);
  }
}
