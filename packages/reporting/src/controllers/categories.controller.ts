import { Controller, Get } from '@nestjs/common';

@Controller('report-categories')
export class CategoriesController {
  @Get()
  async listCategories() {
    return { categories: [] };
  }
}
