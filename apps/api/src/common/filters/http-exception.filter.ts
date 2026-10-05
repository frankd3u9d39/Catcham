import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

interface ErrorBody {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  path: string;
  timestamp: string;
}

/**
 * Normalises every failure into one error shape. Prisma constraint errors are
 * mapped to 409/404/400 so clients never see a driver-level message.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, details } = this.describe(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    const body: ErrorBody = {
      statusCode: status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };
    if (details !== undefined) {
      body.details = details;
    }

    response.status(status).json({ success: false, error: body });
  }

  private describe(exception: unknown): {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'object' && payload !== null) {
        const record = payload as Record<string, unknown>;
        const isValidationList = Array.isArray(record.message);

        return {
          status,
          code: typeof record.code === 'string' ? record.code : httpCodeName(status),
          message: isValidationList
            ? 'Request validation failed.'
            : String(record.message ?? exception.message),
          details: isValidationList ? record.message : undefined,
        };
      }

      return { status, code: httpCodeName(status), message: String(payload) };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return {
            status: HttpStatus.CONFLICT,
            code: 'DUPLICATE_RESOURCE',
            message: 'A record with these unique values already exists.',
            details: exception.meta?.target,
          };
        case 'P2003':
          return {
            status: HttpStatus.BAD_REQUEST,
            code: 'INVALID_REFERENCE',
            message: 'A referenced record does not exist.',
          };
        case 'P2025':
          return {
            status: HttpStatus.NOT_FOUND,
            code: 'NOT_FOUND',
            message: 'The requested record does not exist.',
          };
        default:
          break;
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred.',
    };
  }
}

/** Turns 404 into NOT_FOUND, so the error code is stable for clients to switch on. */
function httpCodeName(status: number): string {
  const name = (HttpStatus as unknown as Record<number, string | undefined>)[status];
  return name ?? 'ERROR';
}
