export class ReportSubmittedEvent {
  constructor(public readonly reportId: string, public readonly referenceNumber: string) {}
}
