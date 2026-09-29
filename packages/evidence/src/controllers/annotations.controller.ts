import { Controller, Post, Body } from '@nestjs/common';

@Controller('evidence/annotations')
export class AnnotationsController {
  @Post()
  async annotate(@Body() body: any) {
    return { annotationId: 'ann-1' };
  }
}
