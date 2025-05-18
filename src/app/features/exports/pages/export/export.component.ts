// Updated Export Component with Improved Mobile Responsiveness
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
      <!-- Heading with better mobile spacing -->
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Export Data</h1>

      <!-- Filter Section - collapsible on mobile -->
      <div class="mb-6 bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg overflow-hidden transition-colors duration-200">
        <div class="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 dark:border-dark-700">
          <button 
            type="button" 
            class="w-full flex justify-between items-center text-left"
            (click)="toggleFilters()"
          >
            <h2 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <svg class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Plant Selection</span>
            </h2>
            <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200" 
                [class.rotate-180]="!filtersCollapsed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div [class.hidden]="filtersCollapsed" class="px-4 py-4 sm:px-6 sm:py-5">
          <!-- Export Filter Configuration -->
          <app-filter
            [filterConfig]="filterConfig"
            (filtersApplied)="onFilterApplied($event)"
          ></app-filter>
        </div>
      </div>

      <!-- Export Settings Card - improved for mobile -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">Export Settings</h2>

        <!-- Export Format Options - improved touch targets -->
        <div class="mb-6">
          <label class="block text-md font-medium text-gray-900 dark:text-white mb-3 sm:mb-4">Select Export Format</label>
          <div class="space-y-3 sm:space-y-4">
            <!-- All Submissions Option - better touch target -->
            <div class="bg-gray-50 dark:bg-dark-700 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-400 transition-colors cursor-pointer"
                (click)="selectFormat(1)"
                [ngClass]="{'border-primary-500 ring-2 ring-primary-500 ring-opacity-50': selectedFormat === 1}">
              <div class="flex items-center">
                <div class="flex items-center justify-center h-6 w-6">
                  <input
                    id="formatAll"
                    type="radio"
                    [checked]="selectedFormat === 1"
                    class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-500"
                  />
                </div>
                <label for="formatAll" class="ml-3 flex-1 cursor-pointer">
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">All Submissions</span>
                  <span class="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Export all submissions with names, CIN, TE ID, date of birth, and plant information</span>
                </label>
              </div>
            </div>
            
            <!-- Grey Card Submissions Option - better touch target -->
            <div class="bg-gray-50 dark:bg-dark-700 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-dark-600 hover:border-primary-400 dark:hover:border-primary-400 transition-colors cursor-pointer"
                (click)="selectFormat(2)"
                [ngClass]="{'border-primary-500 ring-2 ring-primary-500 ring-opacity-50': selectedFormat === 2}">
              <div class="flex items-center">
                <div class="flex items-center justify-center h-6 w-6">
                  <input
                    id="formatGreyCard"
                    type="radio"
                    [checked]="selectedFormat === 2"
                    class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-500"
                  />
                </div>
                <label for="formatGreyCard" class="ml-3 flex-1 cursor-pointer">
                  <span class="block text-sm font-medium text-gray-900 dark:text-white">Grey Card Submissions Only</span>
                  <span class="block text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Export only submissions that have grey card information</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Plant Display - improved visualization -->
        <div class="mb-6">
          <label class="block text-md font-medium text-gray-900 dark:text-white mb-2">Current Plant Selection</label>
          <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-md border border-gray-200 dark:border-dark-600">
            <div class="flex items-center">
              <div class="p-2 rounded-md bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mr-3">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span class="text-gray-900 dark:text-white font-medium">
                {{ getSelectedPlantName() }}
              </span>
            </div>
          </div>
          <p *ngIf="!isSuperAdmin" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            You can export data only from your assigned plant.
          </p>
        </div>

        <!-- Export Button - full width on mobile -->
        <div class="flex justify-center sm:justify-end">
          <app-button
            type="button"
            [loading]="loading"
            [disabled]="loading"
            variant="primary"
            (onClick)="exportData()"
            class="w-full sm:w-auto"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export to Excel
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Improved touch targets on mobile */
    @media (max-width: 640px) {
      :host ::ng-deep input[type="radio"] {
        width: 20px;
        height: 20px;
      }
    }
  `]
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
  filtersCollapsed = true; // For mobile filter toggle

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
        // Auto-expand filters if a specific plant was selected
        this.filtersCollapsed = false;
      }
    });

    // Check screen width to determine initial filters state
    this.filtersCollapsed = window.innerWidth < 768;
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

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  onFilterApplied(filters: any): void {
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
    
    // For mobile browsers, open in a new window instead of using hidden anchor
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
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