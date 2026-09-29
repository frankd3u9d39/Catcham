import { Controller, Post, Body } from '@nestjs/common';

@Controller('rules')
export class RulesController {
  @Post('evaluate')
  async evaluate(@Body() body: { context: Record<string, unknown> }) {
    return { passed: true, results: [] };
  }
}
