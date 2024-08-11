import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError, map, catchError } from 'rxjs';

@Injectable()
export class CommonResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => ({
        status: 'success',
        message: 'Operation successful',
        data,
        statusCode,
      })),
      catchError(err => {
        const response = {
          status: 'error',
          message: err.message || 'Internal server error',
          statusCode: err.status || HttpStatus.INTERNAL_SERVER_ERROR,
        };
        return throwError(() => response); // Updated to use throwError
      })
    );
  }
}
