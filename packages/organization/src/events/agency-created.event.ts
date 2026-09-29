export class AgencyCreatedEvent {
  constructor(public readonly agencyId: string, public readonly name: string) {}
}
