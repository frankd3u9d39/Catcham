import { Injectable } from '@nestjs/common';

@Injectable()
export class PushChannel {
  async send(deviceToken: string, title: string, body: string): Promise<boolean> {
    return true;
  }
}
