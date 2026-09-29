import { Injectable } from '@nestjs/common';

@Injectable()
export class GeocodingService {
  async reverseGeocode(lat: number, lng: number): Promise<{ state: string; lga: string }> {
    return { state: 'Lagos', lga: 'Ikeja' };
  }
}
