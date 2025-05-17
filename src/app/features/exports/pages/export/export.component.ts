// Updated Export Component (src/app/features/exports/pages/export/export.component.ts)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FilterComponent, FilterField } from '../../../../shared/components/filter/filter.component';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FilterComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Export Data</h1>

      <!-- Export Filter Configuration -->
      <app-filter
        [filterConfig]="filterConfig"
        (filtersApplied)="onFilterApplied($event)"
      ></app-filter>

      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-6 py-8 mt-6 transition-colors duration-200">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Export Settings</h2>

        <!-- Export Format Options -->
        <div class="mb-6">
          <label class="block text-md font-medium text-gray-900 dark:text-white mb-4">Select Export Format</label>
          <div class="space-y-4">
            <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-400 transition-colors cursor-pointer"
                (click)="selectFormat(1)"
                [ngClass]="{'border-primary-500 ring-2 ring-primary-500 ring-opacity-50': selectedFormat === 1}">
              <div class="flex items-center">
                <input
                  id="formatAll"
                  type="radio"
                  [checked]="selectedFormat === 1"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-500"
                />
                <label for="formatAll" class="ml-3">
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">All Submissions</span>
                  <span class="block text-sm text-gray-500 dark:text-gray-400 mt-1">Export all submissions with names, CIN, TE ID, date of birth, and plant information</span>
                </label>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-400 transition-colors cursor-pointer"
                (click)="selectFormat(2)"
                [ngClass]="{'border-primary-500 ring-2 ring-primary-500 ring-opacity-50': selectedFormat === 2}">
              <div class="flex items-center">
                <input
                  id="formatGreyCard"
                  type="radio"
                  [checked]="selectedFormat === 2"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-500"
                />
                <label for="formatGreyCard" class="ml-3">
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">Grey Card Submissions Only</span>
                  <span class="block text-sm text-gray-500 dark:text-gray-400 mt-1">Export only submissions that have grey card information</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Plant Display -->
        <div class="mb-6">
          <label class="block text-md font-medium text-gray-900 dark:text-white mb-2">Plant</label>
          <div class="bg-gray-50 dark:bg-dark-700 p-3 rounded-md border border-gray-200 dark:border-dark-600">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ getSelectedPlantName() }}
              </span>
            </div>
          </div>
          <p *ngIf="!isSuperAdmin" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You can export data only from your assigned plant.
          </p>
        </div>

        <!-- Export Button -->
        <div class="flex justify-end">
          <app-button
            type="button"
            [loading]="loading"
            [disabled]="loading"
            variant="primary"
            (onClick)="exportData()"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class ExportComponent implements OnInit {
  plants: Plant[] = [];
  loading = false;
  isSuperAdmin = false;
  userPlantId?: number;
  currentPlantName = '';
  selectedPlantId?: number | null; // Changed to allow null
  selectedFormat = 1;
  filterConfig: FilterField[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly submissionService: SubmissionService,
    private readonly plantService: PlantService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isSuperAdmin = user.isSuperAdmin;
        this.userPlantId = user.plantId;
        this.currentPlantName = user.plantName ?? '';

        // For regular admins, set the selected plant to user's plant
        if (!this.isSuperAdmin && this.userPlantId) {
          this.selectedPlantId = this.userPlantId;
        }
      }
    });

    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
      this.setupFilterConfig();
    });

    this.route.queryParams.subscribe(params => {
      if (params['plantId']) {
        this.selectedPlantId = +params['plantId'];
      }
    });
  }

  setupFilterConfig(): void {
    // Only super admins can select different plants
    if (this.isSuperAdmin && this.plants.length > 0) {
      this.filterConfig = [
        {
          name: 'plantId',
          label: 'Plant',
          type: 'select',
          placeholder: 'All Plants',
          defaultValue: this.selectedPlantId,
          options: [
            { value: null, label: 'All Plants' },
            ...this.plants.map(plant => ({
              value: plant.id,
              label: plant.name
            }))
          ]
        }
      ];
    } else {
      this.filterConfig = [];
    }
  }

  onFilterApplied(filters: any): void {
    console.log('Filters applied:', filters); // Debug log

    // Correctly handle the plantId filter for both null and numeric values
    if (filters.plantId !== undefined) {
      // If it's "All Plants" (null) or a specific plant ID
      this.selectedPlantId = filters.plantId === null ? null : Number(filters.plantId);
    }
  }

  selectFormat(format: number): void {
    this.selectedFormat = format;
  }

  getSelectedPlantName(): string {
    if (this.selectedPlantId === null || this.selectedPlantId === undefined) {
      return 'All Plants';
    }

    const plant = this.plants.find(p => p.id === this.selectedPlantId);
    return plant ? plant.name : this.currentPlantName;
  }

  exportData(): void {
    this.loading = true;

    const exportRequest = {
      format: this.selectedFormat,
      plantId: this.selectedPlantId === null ? undefined : this.selectedPlantId
    };

    this.submissionService.exportData(exportRequest).subscribe({
      next: (blob) => {
        this.loading = false;
        this.downloadFile(blob);
        this.notificationService.success('Export completed successfully');
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  downloadFile(blob: Blob): void {
    const url = window.URL.createObjectURL(blob);
    const fileName = this.getFileName();

    // Create a link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  getFileName(): string {
    const date = new Date().toISOString().split('T')[0];
    const format = this.selectedFormat === 1 ? 'All' : 'GreyCards';

    let plantName = 'AllPlants';
    if (this.selectedPlantId) {
      const plant = this.plants.find(p => p.id === this.selectedPlantId);
      if (plant) {
        plantName = plant.name.replace(/\s+/g, '_');
      }
    } else if (!this.isSuperAdmin && this.currentPlantName) {
      plantName = this.currentPlantName.replace(/\s+/g, '_');
    }

    return `TE_Export_${format}_${plantName}_${date}.xlsx`;
  }
}
