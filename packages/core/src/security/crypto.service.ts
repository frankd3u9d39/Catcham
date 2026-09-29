import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  hashSha256(data: Buffer | string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateSecureRandom(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
