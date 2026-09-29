export class InvestigationAssignedEvent {
  constructor(public readonly caseId: string, public readonly investigatorId: string) {}
}
