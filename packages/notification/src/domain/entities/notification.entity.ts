export class NotificationEntity {
  id!: string;
  recipientId!: string;
  title!: string;
  body!: string;
  channel!: 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';
  status!: 'PENDING' | 'SENT' | 'FAILED';
  createdAt!: Date;
}
