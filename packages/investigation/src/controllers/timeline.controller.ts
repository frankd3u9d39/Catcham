import { Controller, Get, Param } from '@nestjs/common';

@Controller('investigations/:id/timeline')
export class TimelineController {
  @Get()
  async getTimeline(@Param('id') id: string) {
    return { caseId: id, events: [] };
  }
}
