import { Controller, Get, Param } from '@nestjs/common';

@Controller('notifications')
export class NotificationController {
  @Get('user/:userId')
  async listForUser(@Param('userId') userId: string) {
    return { notifications: [] };
  }
}
