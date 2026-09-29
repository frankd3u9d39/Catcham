import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return { id, email: 'investigator@agency.gov.ng' };
  }
}
