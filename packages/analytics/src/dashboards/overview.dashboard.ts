import { Injectable } from '@nestjs/common';

@Injectable()
export class OverviewDashboard {
  async getKpis() {
    return { incidentCount: 0, clearanceRate: 0 };
  }
}
