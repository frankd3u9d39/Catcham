import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportRoutingService {
  async determineRouting(categoryId: string, lat?: number, lng?: number): Promise<string> {
    // Delegated to rules & GIS engine
    return 'default-agency-id';
  }
}
