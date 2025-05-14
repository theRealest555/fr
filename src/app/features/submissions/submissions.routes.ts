import { Routes } from '@angular/router';

export const SUBMISSIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/submission-list/submission-list.component').then(c => c.SubmissionListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/submission-detail/submission-detail.component').then(c => c.SubmissionDetailComponent)
  }
];
