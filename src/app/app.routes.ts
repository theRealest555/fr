import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminRoles } from './core/models/auth.models';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./features/public/pages/home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'submission-form',
    loadComponent: () => import('./features/submissions/pages/submission-form/submission-form.component').then(c => c.SubmissionFormComponent)
  },
  {
    path: 'submission-confirm/:id',
    loadComponent: () => import('./features/submissions/pages/submission-confirm/submission-confirm.component').then(c => c.SubmissionConfirmComponent)
  },

  // Auth routes
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Admin routes - protected
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'submissions',
    loadChildren: () => import('./features/submissions/submissions.routes').then(m => m.SUBMISSIONS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'plants',
    loadChildren: () => import('./features/plants/plants.routes').then(m => m.PLANTS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, roleGuard],
    data: { role: AdminRoles.SuperAdmin }
  },
  {
    path: 'exports',
    loadComponent: () => import('./features/exports/pages/export/export.component').then(c => c.ExportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/profile/profile.component').then(c => c.ProfileComponent),
    canActivate: [authGuard]
  },

  // Error pages
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/error/pages/unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/error/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
