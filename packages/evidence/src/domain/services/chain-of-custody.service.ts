import { Injectable } from '@nestjs/common';
import { CustodyRecordEntity } from '../entities/custody-record.entity';

@Injectable()
export class ChainOfCustodyService {
  async recordTransfer(evidenceId: string, fromId: string, toId: string, reason: string): Promise<CustodyRecordEntity> {
    const record = new CustodyRecordEntity();
    record.id = 'custody-' + Date.now();
    record.evidenceId = evidenceId;
    record.action = 'TRANSFERRED';
    record.performedById = fromId;
    record.transferredToId = toId;
    record.reason = reason;
    record.timestamp = new Date();
    return record;
  }
}
