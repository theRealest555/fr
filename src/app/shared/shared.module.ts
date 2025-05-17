// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { ButtonComponent } from './components/button/button.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { InputComponent } from './components/input/input.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalComponent } from './components/modals/modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { SubmissionsChartComponent } from './components/submissions-chart/submissions-chart.component';
import { FilterComponent } from './components/filter/filter.component';
import { AdminStatusComponent } from './components/admin-status/admin-status.component';

const components = [
  ButtonComponent,
  DataTableComponent,
  FileUploadComponent,
  FormFieldComponent,
  InputComponent,
  LoadingComponent,
  ModalComponent,
  NotificationComponent,
  StatsCardComponent,
  SubmissionsChartComponent,
  FilterComponent,
  AdminStatusComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ...components // Import all standalone components
  ],
  exports: [
    // Re-export Angular modules
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Export all components
    ...components
  ]
})
export class SharedModule {}