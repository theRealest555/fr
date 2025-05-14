import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AdminRoles } from '../../core/models/auth.models';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./pages/admin-users/admin-users.component').then(c => c.AdminUsersComponent),
    canActivate: [roleGuard],
    data: { role: AdminRoles.SuperAdmin }
  },
  {
    path: 'users/add',
    loadComponent: () => import('./pages/add-admin/add-admin.component').then(c => c.AddAdminComponent),
    canActivate: [roleGuard],
    data: { role: AdminRoles.SuperAdmin }
  }
];
