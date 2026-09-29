import { Controller, Post, Body } from '@nestjs/common';

@Controller('memberships')
export class MembershipsController {
  @Post('assign')
  async assign(@Body() body: any) {
    return { status: 'assigned' };
  }
}
