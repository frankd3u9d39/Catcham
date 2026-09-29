import { Controller, Post, Body } from '@nestjs/common';

@Controller('reports/anonymous')
export class AnonymousController {
  @Post()
  async submitAnonymous(@Body() body: any) {
    return {
      referenceCode: 'CTM-ANON-784912',
      trackingSecret: 'sec-8192-token',
      message: 'Keep this secret to track your report securely without identifying yourself.',
    };
  }
}
