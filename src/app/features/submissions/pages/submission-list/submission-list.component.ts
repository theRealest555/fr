// src/app/features/submissions/pages/submission-list/submission-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Submission, Plant } from '../../../../core/models/data.models';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { FilterComponent, FilterField } from '../../../../shared/components/filter/filter.component';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DataTableComponent,
    FilterComponent
  ],
  template: `
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Submissions</h1>

        <div class="flex items-center w-full sm:w-auto">
          <a routerLink="/submission-form" class="flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800 w-full sm:w-auto justify-center">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Submission
          </a>
        </div>
      </div>

      <!-- Filters - collapsible on mobile -->
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
              Filters
            </h2>
            <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200" 
                [class.rotate-180]="!filtersCollapsed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div [class.hidden]="filtersCollapsed" class="px-4 py-4 sm:px-6 sm:py-5">
          <app-filter
            [filterConfig]="filterConfig"
            (filtersApplied)="applyFilters($event)"
          ></app-filter>
        </div>
      </div>

      <!-- Submissions data display - cards on mobile, table on desktop -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
        <!-- Mobile View: Card Layout -->
        <div class="md:hidden">
          <div class="px-4 py-4 border-b border-gray-200 dark:border-dark-700">
            <h3 class="text-base font-medium text-gray-900 dark:text-white">
              {{ filteredSubmissions.length }} Submissions
            </h3>
          </div>
          
          <div *ngIf="filteredSubmissions.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No submissions found
          </div>
          
          <div *ngIf="filteredSubmissions.length > 0" class="divide-y divide-gray-200 dark:divide-dark-700">
            <div *ngFor="let submission of filteredSubmissions" 
                 class="p-4 hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors duration-150">
              <div class="flex justify-between items-start">
                <div>
                  <a [routerLink]="['/submissions', submission.id]"
                     class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                    {{ submission.firstName }} {{ submission.lastName }}
                  </a>
                  <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    TE ID: {{ submission.teId }} | CIN: {{ submission.cin }}
                  </div>
                  <div class="mt-1 flex flex-wrap gap-2">
                    <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200">
                      {{ submission.plantName }}
                    </span>
                    <span *ngIf="submission.greyCard" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      Grey Card: {{ submission.greyCard }}
                    </span>
                  </div>
                </div>
                <div class="text-right text-xs text-gray-500 dark:text-gray-400 flex flex-col items-end">
                  <span>{{ formatDate(submission.createdAt) }}</span>
                  <a [routerLink]="['/submissions', submission.id]"
                     class="mt-3 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50">
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- Desktop View: Table Layout -->
        <div class="hidden md:block">
          <app-data-table
            [columns]="submissionColumns"
            [data]="filteredSubmissions"
            [actionTemplate]="actionTemplate"
            emptyMessage="No submissions found"
            [pagination]="true"
            [pageSize]="10"
          ></app-data-table>

          <!-- Action template for data table -->
          <ng-template #actionTemplate let-submission>
            <div class="flex space-x-2 justify-end">
              <a
                [routerLink]="['/submissions', submission.id]"
                class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                View
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `
})
export class SubmissionListComponent implements OnInit {
  submissions: Submission[] = [];
  filteredSubmissions: Submission[] = [];
  plants: Plant[] = [];
  filterConfig: FilterField[] = [];
  isSuperAdmin = false;
  userPlantId?: number;
  filtersCollapsed = true; // For mobile filter toggle

  submissionColumns = [
    { field: 'firstName', title: 'First Name' },
    { field: 'lastName', title: 'Last Name' },
    { field: 'teId', title: 'TE ID' },
    { field: 'cin', title: 'CIN' },
    { field: 'dateOfBirth', title: 'Date of Birth', template: this.dateTemplate },
    { field: 'plantName', title: 'Plant' },
    {
      field: 'greyCard',
      title: 'Grey Card',
      template: this.greyCardTemplate
    },
    {
      field: 'createdAt',
      title: 'Submission Date',
      template: this.dateTemplate
    }
  ];

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly plantService: PlantService,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isSuperAdmin = user.isSuperAdmin;
        this.userPlantId = user.plantId;

        this.loadSubmissions();
        this.loadPlants();
      }
    });
  }

  loadPlants(): void {
    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
      this.setupFilterConfig();
    });
  }

  setupFilterConfig(): void {
    let filterFields: FilterField[] = [];

    // Only super admins can filter by plant
    if (this.isSuperAdmin) {
      filterFields.push({
        name: 'plantId',
        label: 'Plant',
        type: 'select',
        placeholder: 'All Plants',
        options: this.plants.map(plant => ({
          value: plant.id,
          label: plant.name
        }))
      });
    }

    // Add remaining filter fields
    filterFields = [
      ...filterFields,
      {
        name: 'search',
        label: 'Search',
        type: 'text',
        placeholder: 'Search by name, TE ID, or CIN'
      },
      {
        name: 'hasGreyCard',
        label: 'Grey Card',
        type: 'select',
        placeholder: 'All',
        options: [
          { value: 'true', label: 'With Grey Card' },
          { value: 'false', label: 'Without Grey Card' }
        ]
      }
    ];

    this.filterConfig = filterFields;
  }

  loadSubmissions(): void {
    if (this.isSuperAdmin) {
      this.submissionService.getAllSubmissions().subscribe(submissions => {
        this.submissions = submissions;
        this.filteredSubmissions = [...submissions];
      });
    } else if (this.userPlantId) {
      this.submissionService.getSubmissionsByPlant(this.userPlantId).subscribe(submissions => {
        this.submissions = submissions;
        this.filteredSubmissions = [...submissions];
      });
    }
  }

  applyFilters(filters: any): void {
    let filtered = [...this.submissions];

    // Filter by plant
    if (filters.plantId) {
      filtered = filtered.filter(s => s.plantId === Number(filters.plantId));
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm) ||
        s.lastName.toLowerCase().includes(searchTerm) ||
        s.teId.toLowerCase().includes(searchTerm) ||
        s.cin.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by grey card
    if (filters.hasGreyCard !== null && filters.hasGreyCard !== undefined) {
      const hasCard = filters.hasGreyCard === 'true';
      if (hasCard) {
        filtered = filtered.filter(s => s.greyCard && s.greyCard.trim() !== '');
      } else {
        filtered = filtered.filter(s => !s.greyCard || s.greyCard.trim() === '');
      }
    }

    this.filteredSubmissions = filtered;
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  greyCardTemplate(submission: Submission): string {
    return submission.greyCard ?? 'N/A';
  }

  dateTemplate(submission: Submission, field: string): string {
    const dateValue = submission[field as keyof Submission] as string;
    return dateValue ? new Date(dateValue).toLocaleDateString() : 'N/A';
  }

  formatDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }
}
