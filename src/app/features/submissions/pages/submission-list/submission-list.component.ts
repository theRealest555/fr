import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Submission, Plant } from '../../../../core/models/data.models';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-submission-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DataTableComponent,
    ButtonComponent
  ],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Submissions</h1>

        <div class="flex items-center space-x-4">
          <a routerLink="/submission-form" class="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Submission
          </a>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white shadow rounded-lg p-4 mb-6">
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Plant Filter (For super admins only) -->
            <div *ngIf="isSuperAdmin">
              <label for="plantFilter" class="block text-sm font-medium text-gray-700 mb-1">Plant</label>
              <select
                id="plantFilter"
                formControlName="plantId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option [value]="null">All Plants</option>
                <option *ngFor="let plant of plants" [value]="plant.id">{{ plant.name }}</option>
              </select>
            </div>

            <!-- Search Filter -->
            <div>
              <label for="searchFilter" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                id="searchFilter"
                formControlName="search"
                placeholder="Search by name, TE ID, or CIN"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <!-- Grey Card Filter -->
            <div>
              <label for="greyCardFilter" class="block text-sm font-medium text-gray-700 mb-1">Grey Card</label>
              <select
                id="greyCardFilter"
                formControlName="hasGreyCard"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option [value]="null">All</option>
                <option [value]="true">With Grey Card</option>
                <option [value]="false">Without Grey Card</option>
              </select>
            </div>

            <!-- Filter Button -->
            <div class="flex items-end">
              <app-button type="submit" variant="primary" size="md">
                Apply Filters
              </app-button>
            </div>
          </div>
        </form>
      </div>

      <!-- Submissions Table -->
      <div class="bg-white shadow rounded-lg">
        <app-data-table
          [columns]="submissionColumns"
          [data]="filteredSubmissions"
          [actionTemplate]="actionTemplate"
          emptyMessage="No submissions found"
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
  `
})
export class SubmissionListComponent implements OnInit {
  submissions: Submission[] = [];
  filteredSubmissions: Submission[] = [];
  plants: Plant[] = [];
  filterForm: FormGroup;
  isSuperAdmin = false;
  userPlantId?: number;

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
    private readonly formBuilder: FormBuilder,
    private readonly submissionService: SubmissionService,
    private readonly plantService: PlantService,
    private readonly authService: AuthService
  ) {
    this.filterForm = this.formBuilder.group({
      plantId: [null],
      search: [''],
      hasGreyCard: [null]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isSuperAdmin = user.isSuperAdmin;
        this.userPlantId = user.plantId;

        if (!this.isSuperAdmin) {
          this.filterForm.get('plantId')?.setValue(user.plantId);
          this.filterForm.get('plantId')?.disable();
        }

        this.loadSubmissions();
      }
    });

    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
    });
  }

  loadSubmissions(): void {
    if (this.isSuperAdmin) {
      this.submissionService.getAllSubmissions().subscribe(submissions => {
        this.submissions = submissions;
        this.applyFilters();
      });
    } else if (this.userPlantId) {
      this.submissionService.getSubmissionsByPlant(this.userPlantId).subscribe(submissions => {
        this.submissions = submissions;
        this.applyFilters();
      });
    }
  }

  applyFilters(): void {
    let filtered = [...this.submissions];
    const formValues = this.filterForm.value;

    if (formValues.plantId) {
      filtered = filtered.filter(s => s.plantId === Number(formValues.plantId));
    }

    if (formValues.search) {
      const searchTerm = formValues.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.firstName.toLowerCase().includes(searchTerm) ||
        s.lastName.toLowerCase().includes(searchTerm) ||
        s.teId.toLowerCase().includes(searchTerm) ||
        s.cin.toLowerCase().includes(searchTerm)
      );
    }

    if (formValues.hasGreyCard !== null) {
      if (formValues.hasGreyCard) {
        filtered = filtered.filter(s => s.greyCard && s.greyCard.trim() !== '');
      } else {
        filtered = filtered.filter(s => !s.greyCard || s.greyCard.trim() === '');
      }
    }

    this.filteredSubmissions = filtered;
  }

  greyCardTemplate(submission: Submission) {
    return submission.greyCard ?? 'N/A';
  }

  dateTemplate(submission: Submission, field: string) {
    const dateValue = submission[field as keyof Submission] as string;
    return dateValue ? new Date(dateValue).toLocaleDateString() : 'N/A';
  }
}
