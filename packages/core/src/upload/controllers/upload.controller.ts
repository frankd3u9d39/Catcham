import { Controller, Post, Body } from '@nestjs/common';

@Controller('uploads')
export class UploadController {
  @Post('presign')
  async generatePresignedUrl(@Body() body: { fileName: string; mimeType: string }) {
    return { uploadUrl: 'https://storage.catcham.ng/bucket/key', fileKey: 'uuid' };
  }
}
