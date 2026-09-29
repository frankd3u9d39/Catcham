import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { NotificationController } from './controllers/notification.controller';
import { EmailChannel } from './channels/email/email.channel';
import { SmsChannel } from './channels/sms/sms.channel';
import { PushChannel } from './channels/push/push.channel';
import { InAppChannel } from './channels/in-app/in-app.channel';

@Module({
  imports: [CqrsModule],
  controllers: [NotificationController],
  providers: [EmailChannel, SmsChannel, PushChannel, InAppChannel],
  exports: [EmailChannel, SmsChannel, PushChannel, InAppChannel],
})
export class NotificationModule {}
