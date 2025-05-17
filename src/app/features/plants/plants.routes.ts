import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AdminRoles } from '../../core/models/auth.models';

export const PLANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/plant-list/plant-list.component').then(c => c.PlantListComponent)
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/plant-form/plant-form.component').then(c => c.PlantFormComponent),
    canActivate: [roleGuard],
    data: { role: AdminRoles.SuperAdmin }
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/plant-form/plant-form.component').then(c => c.PlantFormComponent),
    canActivate: [roleGuard],
    data: { role: AdminRoles.SuperAdmin }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/plant-detail/plant-detail.component').then(c => c.PlantDetailComponent)
  }
];
