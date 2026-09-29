import { Controller, Post, Body } from '@nestjs/common';

@Controller('reports/drafts')
export class DraftsController {
  @Post()
  async saveDraft(@Body() body: any) {
    return { draftId: 'draft-uuid' };
  }
}
