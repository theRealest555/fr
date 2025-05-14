import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage: string;

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            // Bad request
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else if (error.error?.errors) {
              const validationErrors = Object.values(error.error.errors).flat();
              errorMessage = validationErrors.join(', ');
            } else {
              errorMessage = 'Invalid request';
            }
            break;

          case 401:
            // Unauthorized
            errorMessage = 'You need to log in to access this resource';
            // Clear authentication and redirect to login
            localStorage.removeItem('auth_token');
            router.navigate(['/auth/login']);
            break;

          case 403:
            // Forbidden
            errorMessage = 'You don\'t have permission to access this resource';
            break;

          case 404:
            // Not found
            errorMessage = 'The requested resource was not found';
            break;

          case 500:
            // Server error
            errorMessage = 'A server error occurred. Please try again later.';
            break;

          default:
            errorMessage = `Error ${error.status}: ${error.statusText}`;
        }
      }

      // Show error notification
      notificationService.error(errorMessage);

      // Pass the error on for component handling
      return throwError(() => error);
    })
  );
};
