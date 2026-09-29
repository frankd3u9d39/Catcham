import { Controller, Get, Param } from '@nestjs/common';

@Controller('evidence/downloads')
export class DownloadsController {
  @Get(':id/signed-url')
  async getSecureDownload(@Param('id') id: string) {
    return { downloadUrl: 'https://secure.catcham.ng/evidence/key' };
  }
}
