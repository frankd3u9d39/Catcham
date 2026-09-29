import { Controller, Post, Get, Body, Param } from '@nestjs/common';

@Controller('workflows')
export class WorkflowController {
  @Get('definitions')
  async listDefinitions() {
    return { definitions: [] };
  }

  @Post('instances/:id/transition')
  async transition(@Param('id') id: string, @Body() body: { transition: string }) {
    return { status: 'transitioned', instanceId: id, transition: body.transition };
  }
}
