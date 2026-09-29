import { Injectable } from '@nestjs/common';

@Injectable()
export class JurisdictionService {
  async resolveJurisdictionByPoint(lat: number, lng: number): Promise<string | null> {
    return 'jur-default';
  }
}
