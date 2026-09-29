export class NotificationDispatchedEvent {
  constructor(public readonly notificationId: string, public readonly channel: string) {}
}
