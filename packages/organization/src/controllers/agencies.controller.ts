import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('agencies')
export class AgenciesController {
  @Get()
  async findAll() {
    return { agencies: [] };
  }

  @Post()
  async create(@Body() body: any) {
    return { id: 'new-agency-id', ...body };
  }
}
