import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('investigations')
export class InvestigationsController {
  @Get()
  async list() {
    return { cases: [] };
  }

  @Post()
  async createCase(@Body() body: any) {
    return { caseNumber: 'CAS-2026-0042', status: 'OPEN' };
  }

  @Get(':id')
  async getDetails(@Param('id') id: string) {
    return { id, caseNumber: 'CAS-2026-0042' };
  }
}
