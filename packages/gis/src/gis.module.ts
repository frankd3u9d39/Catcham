import { Module } from '@nestjs/common';
import { GisController } from './controllers/gis.controller';
import { JurisdictionService } from './services/jurisdiction.service';
import { GeocodingService } from './services/geocoding.service';
import { SpatialQueryService } from './services/spatial-query.service';

@Module({
  controllers: [GisController],
  providers: [JurisdictionService, GeocodingService, SpatialQueryService],
  exports: [JurisdictionService, GeocodingService, SpatialQueryService],
})
export class GisModule {}
