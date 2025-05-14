import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { SubmissionService } from '../../../../core/services/submission.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Plant, Submission } from '../../../../core/models/data.models';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

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
      <!-- Header with back button -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">{{ plant.name }}</h1>
        </div>

        <div>
          <a
            routerLink="/exports"
            [queryParams]="{plantId: plant.id}"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </a>
        </div>
      </div>

      <!-- Plant information -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Plant Information</h2>
        </div>
        <div class="px-6 py-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Plant ID</div>
              <div class="text-base text-gray-900">{{ plant.id }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Name</div>
              <div class="text-base text-gray-900">{{ plant.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plant statistics -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Plant Statistics</h2>
        </div>
        <div class="px-6 py-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-1">Total Submissions</div>
              <div class="text-2xl font-semibold text-gray-900">{{ submissions.length }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-1">With Grey Card</div>
              <div class="text-2xl font-semibold text-gray-900">{{ getGreyCardCount() }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="text-sm font-medium text-gray-500 mb-1">Without Grey Card</div>
              <div class="text-2xl font-semibold text-gray-900">{{ submissions.length - getGreyCardCount() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Submissions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Recent Submissions</h2>
        </div>
        <div>
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
                class="text-blue-600 hover:text-blue-900"
              >
                View
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div *ngIf="!plant && !error" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="bg-white shadow rounded-lg p-6 text-center">
      <svg class="h-16 w-16 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-medium text-gray-900 mb-2">Plant Not Found</h2>
      <p class="text-gray-500 mb-4">The requested plant could not be found or you don't have permission to view it.</p>
      <app-button (onClick)="goBack()">Go Back</app-button>
    </div>
  `,
  styles: []
})
export class PlantDetailComponent implements OnInit {
  plantId!: number;
  plant: Plant | null = null;
  submissions: Submission[] = [];
  error = false;
  isSuperAdmin = false;

  submissionColumns = [
    { field: 'fullName', title: 'Name' },
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
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check super admin status
    this.authService.currentUser$.subscribe(user => {
      this.isSuperAdmin = user?.isSuperAdmin || false;
    });

    // Get plant ID from route
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
        // Just show empty submissions if there's an error
        this.submissions = [];
      }
    });
  }

  getGreyCardCount(): number {
    return this.submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;
  }

  // Custom template for grey card
  greyCardTemplate(submission: Submission) {
    return submission.greyCard ?? 'N/A';
  }

  // Custom template for date
  dateTemplate(submission: Submission) {
    return new Date(submission.createdAt).toLocaleDateString();
  }

  goBack(): void {
    this.router.navigate(['/plants']);
  }
}
