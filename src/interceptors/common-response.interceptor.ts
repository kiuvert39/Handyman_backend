import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class CommonResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        status: 'success',
        message: 'Operation successful',
        data,
      })),
      catchError(err => {
        if (err instanceof BadRequestException) {
          // Skip the interceptor for BadRequestException (typically used for validation errors)
          return throwError(() => err);
        }

        if (err instanceof HttpException) {
          const status = err.getStatus();
          return throwError(() => ({
            statusCode: status,
            status: 'error',
            message: err.message || 'Internal server error',
            error: err.name || 'InternalServerError',
          }));
        }

        // Handle other types of errors (e.g., non-HTTP exceptions)
        return throwError(() => ({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'error',
          message: err.message || 'Internal server error',
          error: err.name || 'InternalServerError',
        }));
      })
    );
  }
}
