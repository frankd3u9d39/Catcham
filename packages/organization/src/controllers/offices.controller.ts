import { Controller, Get, Param } from '@nestjs/common';

@Controller('offices')
export class OfficesController {
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return { officeId: id };
  }
}
