import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailChannel {
  async send(to: string, subject: string, html: string): Promise<boolean> {
    return true;
  }
}
