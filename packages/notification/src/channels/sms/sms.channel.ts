import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsChannel {
  async send(phone: string, text: string): Promise<boolean> {
    return true;
  }
}
