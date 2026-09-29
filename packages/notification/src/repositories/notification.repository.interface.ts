import { NotificationEntity } from '../domain/entities/notification.entity';

export interface INotificationRepository {
  save(notification: NotificationEntity): Promise<void>;
  findByUser(userId: string): Promise<NotificationEntity[]>;
}
