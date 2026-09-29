import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('evidence')
export class EvidenceController {
  @Post()
  async registerEvidence(@Body() body: any) {
    return { evidenceId: 'evi-uuid', hashVerified: true };
  }

  @Get(':id')
  async getDetails(@Param('id') id: string) {
    return { id, isOriginalImmutable: true };
  }
}
