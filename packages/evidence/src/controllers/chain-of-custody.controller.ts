import { Controller, Get, Param } from '@nestjs/common';

@Controller('evidence/:id/custody')
export class ChainOfCustodyController {
  @Get()
  async getTrail(@Param('id') id: string) {
    return { evidenceId: id, trail: [] };
  }
}
