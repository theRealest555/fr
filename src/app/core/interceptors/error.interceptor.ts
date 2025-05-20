import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network error: ${error.error.message}`;
        notificationService.error(errorMessage);
        return throwError(() => error);
      }

      switch (error.status) {
        case HttpStatusCode.BadRequest: // 400
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.errors && Array.isArray(error.error.errors)) {
            errorMessage = error.error.errors.join(', ');
          } else if (typeof error.error?.errors === 'object') {
            const validationErrors = Object.values(error.error.errors).flat();
            errorMessage = Array.isArray(validationErrors)
              ? validationErrors.join(', ')
              : 'Validation error';
          } else {
            errorMessage = 'Bad request - invalid input data';
          }
          break;

        case HttpStatusCode.Unauthorized: // 401
          errorMessage = 'Your session has expired. Please log in again.';

          // Clear authentication data and redirect to login
          localStorage.removeItem('auth_token');
          router.navigate(['/auth/login']);
          break;

        case HttpStatusCode.Forbidden: // 403
          errorMessage = 'You don\'t have permission to access this resource';
          break;

        case HttpStatusCode.NotFound: // 404
          errorMessage = 'The requested resource was not found';
          break;

        case HttpStatusCode.Conflict: // 409
          errorMessage = error.error?.message ?? 'A conflict occurred with your request';
          break;

        case HttpStatusCode.UnprocessableEntity: // 422
          errorMessage = error.error?.message ?? 'Unprocessable entity';
          break;

        case HttpStatusCode.TooManyRequests: // 429
          errorMessage = 'Too many requests. Please try again later.';
          break;

        case HttpStatusCode.InternalServerError: // 500
        case HttpStatusCode.BadGateway: // 502
        case HttpStatusCode.ServiceUnavailable: // 503
        case HttpStatusCode.GatewayTimeout: // 504
          errorMessage = 'A server error occurred. Please try again later or contact support.';
          break;

        default:
          errorMessage = `Error ${error.status}: ${error.statusText ?? 'Unknown error'}`;
      }

      notificationService.error(errorMessage);

      if (error.status === HttpStatusCode.Unauthorized) {
        return EMPTY;
      }

      return throwError(() => error);
    })
  );
};
