import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';

@Controller('reports')
export class ReportsController {
  @Post()
  async submit(@Body() dto: CreateReportDto) {
    return { referenceNumber: 'CTM-2026-9021', status: 'SUBMITTED' };
  }

  @Get(':ref')
  async getByRef(@Param('ref') ref: string) {
    return { referenceNumber: ref };
  }
}
