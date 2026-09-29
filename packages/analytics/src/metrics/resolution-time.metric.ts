import { Injectable } from '@nestjs/common';

@Injectable()
export class ResolutionTimeMetric {
  async calculateAverage(agencyId?: string): Promise<number> {
    return 14.5; // Average days
  }
}
