import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessRuleViolationException extends HttpException {
  constructor(message: string, public readonly ruleCode?: string) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'Business Rule Violation',
        message,
        ruleCode,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
