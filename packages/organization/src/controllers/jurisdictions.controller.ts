import { Controller, Get } from '@nestjs/common';

@Controller('jurisdictions')
export class JurisdictionsController {
  @Get()
  async findAll() {
    return { jurisdictions: [] };
  }
}
