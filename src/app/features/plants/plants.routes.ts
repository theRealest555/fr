import { Routes } from '@angular/router';

export const PLANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/plant-list/plant-list.component').then(c => c.PlantListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/plant-detail/plant-detail.component').then(c => c.PlantDetailComponent)
  }
];
