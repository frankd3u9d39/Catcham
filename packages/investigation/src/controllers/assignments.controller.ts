import { Controller, Post, Body } from '@nestjs/common';

@Controller('investigations/assignments')
export class AssignmentsController {
  @Post()
  async assignLead(@Body() body: any) {
    return { status: 'assigned' };
  }
}
