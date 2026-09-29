import { Controller, Post, Body } from '@nestjs/common';

@Controller('investigations/escalations')
export class EscalationsController {
  @Post()
  async escalateCase(@Body() body: any) {
    return { escalated: true };
  }
}
