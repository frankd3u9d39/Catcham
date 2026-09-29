import { Controller, Get, Query } from '@nestjs/common';

@Controller('search')
export class SearchController {
  @Get()
  async search(@Query('q') query: string) {
    return { results: [], query };
  }
}
