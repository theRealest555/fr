import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  // First check if the user is authenticated
  if (!authService.isAuthenticated()) {
    // Redirect to login page with return URL
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    notificationService.warning('Please log in to access this page');
    return false;
  }

  const requiredRole = route.data['role'] as string;

  // If no role is required, just check authentication
  if (!requiredRole) {
    return true;
  }

  // Check if user has the required role
  if (authService.hasRole(requiredRole)) {
    return true;
  }

  // Redirect to unauthorized page
  router.navigate(['/unauthorized']);
  notificationService.error('You don\'t have permission to access this page');
  return false;
};
