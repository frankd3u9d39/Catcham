export class CustodyTransferredEvent {
  constructor(public readonly evidenceId: string, public readonly newCustodianId: string) {}
}
