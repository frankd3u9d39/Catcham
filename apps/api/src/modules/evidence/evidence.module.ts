import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { EvidenceController } from './evidence.controller';
import { EvidenceService } from './evidence.service';
import { StorageService } from './storage.service';

@Module({
  imports: [
    // Buffered in memory so the file can be hashed and its magic bytes checked
    // before anything reaches disk. The size limit keeps that bounded.
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: memoryStorage(),
        limits: {
          fileSize: config.getOrThrow<number>('UPLOAD_MAX_BYTES'),
          files: 1,
        },
      }),
    }),
  ],
  controllers: [EvidenceController],
  providers: [EvidenceService, StorageService],
  exports: [EvidenceService],
})
export class EvidenceModule {}
