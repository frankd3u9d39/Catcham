import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EvidenceController } from './controllers/evidence.controller';
import { AnnotationsController } from './controllers/annotations.controller';
import { DownloadsController } from './controllers/downloads.controller';
import { ChainOfCustodyController } from './controllers/chain-of-custody.controller';
import { RegisterEvidenceHandler } from './application/handlers/register-evidence.handler';
import { ChainOfCustodyService } from './domain/services/chain-of-custody.service';

@Module({
  imports: [CqrsModule],
  controllers: [
    EvidenceController,
    AnnotationsController,
    DownloadsController,
    ChainOfCustodyController,
  ],
  providers: [RegisterEvidenceHandler, ChainOfCustodyService],
  exports: [ChainOfCustodyService],
})
export class EvidenceModule {}
