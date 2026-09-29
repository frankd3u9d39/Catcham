import { Injectable } from '@nestjs/common';

@Injectable()
export class SpatialQueryService {
  async findWithinRadius(lat: number, lng: number, radiusMeters: number): Promise<any[]> {
    return [];
  }
}
