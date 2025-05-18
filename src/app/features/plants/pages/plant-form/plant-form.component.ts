// Updated Plant-Form Component with Improved Mobile Responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-plant-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent
  ],
  template: `
    <div class="max-w-2xl mx-auto">
      <!-- Header with back button - improved touch target -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{{ isEditMode ? 'Edit Plant' : 'Add New Plant' }}</h1>
        </div>
      </div>

      <!-- Plant Form - improved padding and spacing -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200">
        <form [formGroup]="plantForm" (ngSubmit)="onSubmit()">
          <!-- Name Field - using improved FormFieldComponent -->
          <app-form-field
            label="Plant Name"
            [control]="name!"
            [required]="true"
            id="name"
            [customErrors]="{
              'maxlength': 'Plant name cannot exceed 100 characters'
            }"
          >
            <input
              type="text"
              id="name"
              formControlName="name"
              class="form-input"
              placeholder="Enter plant name"
            />
          </app-form-field>

          <!-- Description Field - using improved FormFieldComponent -->
          <app-form-field
            label="Description"
            [control]="description!"
            [required]="false"
            id="description"
            [customErrors]="{
              'maxlength': 'Description cannot exceed 500 characters'
            }"
            tooltip="Provide details about this plant's location, purpose, or other relevant information."
          >
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="form-input"
              placeholder="Enter plant description"
            ></textarea>
          </app-form-field>

          <!-- Action Buttons - stacked on mobile, side by side on larger screens -->
          <div class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end space-y-4 space-y-reverse sm:space-y-0 sm:space-x-4">
            <app-button
              type="button"
              variant="outline"
              (onClick)="goBack()"
              class="w-full sm:w-auto"
            >
              Cancel
            </app-button>
            
            <app-button
              type="submit"
              [loading]="loading"
              [disabled]="plantForm.invalid || loading"
              variant="primary"
              class="w-full sm:w-auto"
            >
              {{ isEditMode ? 'Update Plant' : 'Create Plant' }}
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Extra responsive styling */
    @media (max-width: 640px) {
      textarea {
        min-height: 100px;
      }
      
      /* Increase touch targets on mobile */
      :host ::ng-deep button {
        min-height: 44px;
      }
    }
  `]
})
export class PlantFormComponent implements OnInit {
  plantForm: FormGroup;
  loading = false;
  isEditMode = false;
  plantId?: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly plantService: PlantService,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.plantForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.plantId = +idParam;
        this.isEditMode = true;
        this.loadPlantData();
      }
    });
  }

  // Getters for form controls
  get name() { return this.plantForm.get('name'); }
  get description() { return this.plantForm.get('description'); }

  loadPlantData(): void {
    if (!this.plantId) return;

    this.loading = true;
    this.plantService.getPlantById(this.plantId).subscribe({
      next: (plant) => {
        this.plantForm.patchValue({
          name: plant.name,
          description: plant.description
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Failed to load plant data');
        this.router.navigate(['/plants']);
      }
    });
  }

  onSubmit(): void {
    if (this.plantForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.plantForm.controls).forEach(key => {
        const control = this.plantForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    if (this.isEditMode && this.plantId) {
      this.updatePlant();
    } else {
      this.createPlant();
    }
  }

  createPlant(): void {
    this.plantService.createPlant(this.plantForm.value).subscribe({
      next: (plant) => {
        this.loading = false;
        this.notificationService.success('Plant created successfully');
        this.router.navigate(['/plants', plant.id]);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updatePlant(): void {
    if (!this.plantId) return;

    this.plantService.updatePlant(this.plantId, this.plantForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Plant updated successfully');
        this.router.navigate(['/plants', this.plantId]);
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.isEditMode && this.plantId) {
      this.router.navigate(['/plants', this.plantId]);
    } else {
      this.router.navigate(['/plants']);
    }
  }
}