import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Export Data</h1>

      <div class="bg-white shadow rounded-lg px-6 py-8">
        <form [formGroup]="exportForm" (ngSubmit)="onSubmit()">
          <!-- Export Format -->
          <div class="mb-6">
            <label class="block text-lg font-medium text-gray-900 mb-4">Select Export Format</label>
            <div class="space-y-4">
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary-400 transition-colors cursor-pointer"
                   (click)="selectFormat(1)"
                   [ngClass]="{'border-primary-500 ring-2 ring-primary-500 ring-opacity-50': exportForm.value.format === 1}">
                <div class="flex items-center">
                  <input
                    id="formatAll"
                    type="radio"
                    formControlName="format"
                    [value]="1"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label for="formatAll" class="ml-3">
                    <span class="block text-sm font-medium text-gray-900">All Submissions</span>
                    <span class="block text-sm text-gray-500 mt-1">Export all submissions with names, CIN, TE ID, date of birth, and plant information</span>
                  </label>
                </div>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-primary-400 transition-colors cursor-pointer"
                   (click)="selectFormat(2)"
                   [ngClass]="{'border-primary-500 ring-2 ring-primary-500 ring-opacity-50': exportForm.value.format === 2}">
                <div class="flex items-center">
                  <input
                    id="formatGreyCard"
                    type="radio"
                    formControlName="format"
                    [value]="2"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label for="formatGreyCard" class="ml-3">
                    <span class="block text-sm font-medium text-gray-900">Grey Card Submissions Only</span>
                    <span class="block text-sm text-gray-500 mt-1">Export only submissions that have grey card information</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Plant Selection (Super Admins only) -->
          <div class="mb-6" *ngIf="isSuperAdmin">
            <label class="block text-lg font-medium text-gray-900 mb-4">Select Plant</label>
            <select
              id="plantId"
              formControlName="plantId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option [value]="null">All Plants</option>
              <option *ngFor="let plant of plants" [value]="plant.id">{{ plant.name }}</option>
            </select>
            <p class="mt-2 text-sm text-gray-500">
              As a Super Admin, you can export data from all plants or select a specific plant.
            </p>
          </div>

          <!-- Plant Display (Regular Admins) -->
          <div class="mb-6" *ngIf="!isSuperAdmin && currentPlantName">
            <label class="block text-lg font-medium text-gray-900 mb-4">Your Plant</label>
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span class="text-gray-900 font-medium">{{ currentPlantName }}</span>
              </div>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              You can export data only from your assigned plant.
            </p>
          </div>

          <!-- Export Button -->
          <div class="flex justify-end">
            <app-button
              type="submit"
              [loading]="loading"
              [disabled]="exportForm.invalid || loading"
              variant="primary"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to Excel
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ExportComponent implements OnInit {
  exportForm: FormGroup;
  plants: Plant[] = [];
  loading = false;
  isSuperAdmin = false;
  userPlantId?: number;
  currentPlantName = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly submissionService: SubmissionService,
    private readonly plantService: PlantService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly route: ActivatedRoute
  ) {
    this.exportForm = this.formBuilder.group({
      format: [1, Validators.required],
      plantId: [null]
    });
  }

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isSuperAdmin = user.isSuperAdmin;
        this.userPlantId = user.plantId;
        this.currentPlantName = user.plantName ?? '';

        // Set the plant ID for regular admins
        if (!this.isSuperAdmin && this.userPlantId) {
          this.exportForm.patchValue({ plantId: this.userPlantId });
          this.exportForm.get('plantId')?.disable();
        }
      }
    });

    // Load plants
    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
    });

    // Check if there's a plant ID in the query params (e.g., coming from plant detail page)
    this.route.queryParams.subscribe(params => {
      if (params['plantId']) {
        this.exportForm.patchValue({ plantId: +params['plantId'] });
      }
    });
  }

  // Helper function to select format with a click anywhere on the option
  selectFormat(format: number): void {
    this.exportForm.patchValue({ format });
  }

  onSubmit(): void {
    if (this.exportForm.invalid) {
      return;
    }

    this.loading = true;

    // Prepare the request (ensuring we use the userPlantId for regular admins)
    const exportRequest = {
      format: this.exportForm.value.format,
      plantId: this.isSuperAdmin ? this.exportForm.value.plantId : this.userPlantId
    };

    this.submissionService.exportData(exportRequest).subscribe({
      next: (blob) => {
        this.loading = false;
        this.downloadFile(blob);
        this.notificationService.success('Export completed successfully');
      },
      error: () => {
        this.loading = false;
        // Error is already handled by the interceptor
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
    const format = this.exportForm.value.format === 1 ? 'All' : 'GreyCards';

    let plantName = 'AllPlants';
    if (this.exportForm.value.plantId) {
      const plant = this.plants.find(p => p.id === this.exportForm.value.plantId);
      if (plant) {
        plantName = plant.name.replace(/\s+/g, '_');
      }
    } else if (!this.isSuperAdmin && this.currentPlantName) {
      plantName = this.currentPlantName.replace(/\s+/g, '_');
    }

    return `TE_Export_${format}_${plantName}_${date}.xlsx`;
  }
}
