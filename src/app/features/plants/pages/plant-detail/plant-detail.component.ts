// Updated Plant-Detail Component with Improved Mobile Responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { SubmissionService } from '../../../../core/services/submission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant, Submission } from '../../../../core/models/data.models';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DataTableComponent,
    ButtonComponent
  ],
  template: `
    <div *ngIf="plant">
      <!-- Header with back button - improved for mobile -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
        <div class="flex items-center">
          <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{{ plant.name }}</h1>
        </div>

        <!-- Action Buttons - Stack on mobile, row on desktop -->
        <div class="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
          <a
            routerLink="/exports"
            [queryParams]="{plantId: plant.id}"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </a>

          <a
            routerLink="/plants/edit/{{plant.id}}"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-dark-900"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Plant
          </a>

          <button
            (click)="confirmDelete()"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-dark-900"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Plant
          </button>
        </div>
      </div>

      <!-- Plant information - Better padding on mobile -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg mb-6 transition-colors duration-200">
        <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Plant Information</h2>
        </div>
        <div class="px-4 sm:px-6 py-4 sm:py-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 rounded-md">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plant ID</div>
              <div class="text-base text-gray-900 dark:text-white">{{ plant.id }}</div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 rounded-md">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Name</div>
              <div class="text-base text-gray-900 dark:text-white">{{ plant.name }}</div>
            </div>
            <div class="md:col-span-2 bg-gray-50 dark:bg-dark-700/50 p-3 rounded-md">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</div>
              <div class="text-base text-gray-900 dark:text-white">{{ plant.description || 'No description provided' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plant statistics - Better visualization on mobile -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg mb-6 transition-colors duration-200">
        <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Plant Statistics</h2>
        </div>
        <div class="px-4 sm:px-6 py-4 sm:py-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Total Submissions -->
            <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-100 dark:border-dark-600 hover:shadow-sm transition-shadow">
              <div class="flex items-center">
                <div class="p-2 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 mr-3">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Submissions</div>
                  <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ submissions.length }}</div>
                </div>
              </div>
            </div>

            <!-- With Grey Card -->
            <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-100 dark:border-dark-600 hover:shadow-sm transition-shadow">
              <div class="flex items-center">
                <div class="p-2 rounded-md bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 mr-3">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">With Grey Card</div>
                  <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ getGreyCardCount() }}</div>
                </div>
              </div>
            </div>

            <!-- Without Grey Card -->
            <div class="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg border border-gray-100 dark:border-dark-600 hover:shadow-sm transition-shadow">
              <div class="flex items-center">
                <div class="p-2 rounded-md bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 mr-3">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Without Grey Card</div>
                  <div class="text-2xl font-semibold text-gray-900 dark:text-white">{{ submissions.length - getGreyCardCount() }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Submissions - Card view on mobile, table on desktop -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
        <div class="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Submissions</h2>
        </div>
        
        <!-- Mobile View: Card Layout -->
        <div class="md:hidden">
          <div *ngIf="submissions.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No submissions found for this plant
          </div>
          
          <div *ngIf="submissions.length > 0" class="divide-y divide-gray-200 dark:divide-dark-700">
            <div *ngFor="let submission of submissions" 
                 class="p-4 hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors duration-150">
              <div class="flex flex-col">
                <!-- Name and ID Info -->
                <div class="mb-3">
                  <a [routerLink]="['/submissions', submission.id]"
                     class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                    {{ submission.firstName }} {{ submission.lastName }}
                  </a>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    TE ID: {{ submission.teId }} | CIN: {{ submission.cin }}
                  </p>
                </div>
                
                <!-- Grey Card & Date -->
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div class="bg-gray-50 dark:bg-dark-700/50 p-2 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Grey Card</div>
                    <div class="text-sm text-gray-900 dark:text-white">{{ submission.greyCard || 'N/A' }}</div>
                  </div>
                  <div class="bg-gray-50 dark:bg-dark-700/50 p-2 rounded">
                    <div class="text-xs text-gray-500 dark:text-gray-400">Date</div>
                    <div class="text-sm text-gray-900 dark:text-white truncate">{{ formatDate(submission.createdAt) }}</div>
                  </div>
                </div>
                
                <!-- Action -->
                <div class="mt-2 flex justify-end">
                  <a [routerLink]="['/submissions', submission.id]"
                     class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50">
                    View Details
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
            [data]="submissions"
            [actionTemplate]="actionTemplate"
            emptyMessage="No submissions found for this plant"
          ></app-data-table>

          <!-- Action template for data table -->
          <ng-template #actionTemplate let-submission>
            <div class="flex space-x-2 justify-end">
              <a
                [routerLink]="['/submissions', submission.id]"
                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <!-- Loading state - improved for mobile -->
    <div *ngIf="!plant && !error" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 sm:border-b-3 border-primary-500 dark:border-primary-400"></div>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg p-4 sm:p-6 text-center transition-colors duration-200">
      <svg class="h-14 w-14 sm:h-16 sm:w-16 text-red-500 dark:text-red-400 mx-auto mb-3 sm:mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">Plant Not Found</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-4">The requested plant could not be found or you don't have permission to view it.</p>
      <app-button 
        variant="primary"
        (onClick)="goBack()"
        class="w-full sm:w-auto"
      >
        Go Back
      </app-button>
    </div>

    <!-- Delete Confirmation Modal - improved for mobile -->
    <div *ngIf="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-dark-900 opacity-75 dark:opacity-80 backdrop-blur-sm"></div>
        </div>

        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-dark-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div class="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Delete Plant
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the plant "{{ plant?.name }}"? This action cannot be undone.
                  </p>
                  <p class="text-sm text-red-500 dark:text-red-400 mt-2">
                    Note: You cannot delete a plant that has associated users or submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <app-button
              type="button"
              variant="danger"
              [loading]="deleting"
              (onClick)="deletePlant()"
              class="w-full sm:w-auto mb-3 sm:mb-0 sm:ml-3"
            >
              Delete
            </app-button>
            <app-button
              type="button"
              variant="outline"
              (onClick)="cancelDelete()"
              class="w-full sm:w-auto"
            >
              Cancel
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlantDetailComponent implements OnInit {
  plantId!: number;
  plant: Plant | null = null;
  submissions: Submission[] = [];
  error = false;
  isSuperAdmin = false;
  showDeleteModal = false;
  deleting = false;

  submissionColumns = [
    { field: 'firstName', title: 'First Name' },
    { field: 'lastName', title: 'Last Name' },
    { field: 'teId', title: 'TE ID' },
    { field: 'cin', title: 'CIN' },
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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly plantService: PlantService,
    private readonly submissionService: SubmissionService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isSuperAdmin = user?.isSuperAdmin || false;
    });

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.plantId = +idParam;
        this.loadPlant();
        this.loadSubmissions();
      } else {
        this.error = true;
      }
    });
  }

  loadPlant(): void {
    this.plantService.getPlantById(this.plantId).subscribe({
      next: (plant) => {
        this.plant = plant;
      },
      error: () => {
        this.error = true;
      }
    });
  }

  loadSubmissions(): void {
    this.submissionService.getSubmissionsByPlant(this.plantId).subscribe({
      next: (submissions) => {
        this.submissions = submissions;
      },
      error: () => {
        this.submissions = [];
      }
    });
  }

  getGreyCardCount(): number {
    return this.submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;
  }

  greyCardTemplate(submission: Submission) {
    return submission.greyCard ?? 'N/A';
  }

  dateTemplate(submission: Submission) {
    return this.formatDate(submission.createdAt);
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  }

  confirmDelete(): void {
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  deletePlant(): void {
    if (!this.plant) return;

    this.deleting = true;

    this.plantService.deletePlant(this.plant.id).subscribe({
      next: (response) => {
        this.deleting = false;
        this.showDeleteModal = false;
        this.notificationService.success('Plant deleted successfully');
        this.router.navigate(['/plants']);
      },
      error: (error) => {
        this.deleting = false;
        if (error?.error?.message) {
          this.notificationService.error(error.error.message);
        } else {
          this.notificationService.error('Failed to delete plant. It may have associated users or submissions.');
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/plants']);
  }
}