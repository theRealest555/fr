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
      <app-filter 
        [filterConfig]="filterConfig" 
        (filtersApplied)="applyFilters($event)"
      ></app-filter>

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
  filterConfig: FilterField[] = [];
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

  greyCardTemplate(submission: Submission): string {
    return submission.greyCard ?? 'N/A';
  }

  dateTemplate(submission: Submission, field: string): string {
    const dateValue = submission[field as keyof Submission] as string;
    return dateValue ? new Date(dateValue).toLocaleDateString() : 'N/A';
  }
}