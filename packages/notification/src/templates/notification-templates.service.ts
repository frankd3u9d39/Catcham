import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationTemplatesService {
  renderReportSubmitted(referenceNumber: string): string {
    return `Your report ${referenceNumber} has been received and routed for review.`;
  }
}
