import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async initUpload(fileName: string, mimeType: string) {
    return { fileId: 'temp-id', key: 'uploads/temp-key' };
  }
}
