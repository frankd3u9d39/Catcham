import { Controller, Get, Query } from '@nestjs/common';
import { GeoPointDto } from '../dto/geo-point.dto';

@Controller('gis')
export class GisController {
  @Get('resolve-jurisdiction')
  async resolve(@Query() point: GeoPointDto) {
    return { state: 'FCT', lga: 'Municipal', jurisdictionId: 'jur-fct' };
  }
}
