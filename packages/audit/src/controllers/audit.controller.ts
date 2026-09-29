import { Controller, Get, Query } from '@nestjs/common';

@Controller('audit-logs')
export class AuditController {
  @Get()
  async getLogs(@Query('resource') resource?: string) {
    return { logs: [] };
  }
}
