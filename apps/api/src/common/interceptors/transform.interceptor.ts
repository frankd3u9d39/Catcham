import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export const RAW_RESPONSE = Symbol('catcham:raw-response');

/**
 * Wraps successful payloads in { success, data } to match the error shape from
 * AllExceptionsFilter. Handlers that stream a file set RAW_RESPONSE to opt out.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiEnvelope<T> | T> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiEnvelope<T> | T> {
    return next.handle().pipe(
      map((data) => {
        if (data !== null && typeof data === 'object' && RAW_RESPONSE in data) {
          return data as T;
        }
        return { success: true as const, data };
      }),
    );
  }
}
