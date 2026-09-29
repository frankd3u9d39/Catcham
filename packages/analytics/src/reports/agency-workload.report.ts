import { Injectable } from '@nestjs/common';

@Injectable()
export class AgencyWorkloadReport {
  async generateSummary(): Promise<any> {
    return { agencies: [] };
  }
}
