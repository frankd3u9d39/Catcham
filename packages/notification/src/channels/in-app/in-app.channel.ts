import { Injectable } from '@nestjs/common';

@Injectable()
export class InAppChannel {
  async dispatch(userId: string, message: string): Promise<boolean> {
    return true;
  }
}
