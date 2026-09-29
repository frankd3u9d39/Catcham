import { Controller, Get, Param } from '@nestjs/common';

@Controller('departments')
export class DepartmentsController {
  @Get('agency/:agencyId')
  async findByAgency(@Param('agencyId') agencyId: string) {
    return { agencyId, departments: [] };
  }
}
