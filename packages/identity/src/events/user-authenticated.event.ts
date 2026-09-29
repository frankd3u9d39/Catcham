export class UserAuthenticatedEvent {
  constructor(public readonly userId: string, public readonly ipAddress: string) {}
}
