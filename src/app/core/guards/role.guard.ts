import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const requiredRole = route.data['role'] as string;

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  // Redirect to unauthorized page or dashboard
  router.navigate(['/unauthorized']);

  // Show notification
  notificationService.error('You don\'t have permission to access this page');

  return false;
};
