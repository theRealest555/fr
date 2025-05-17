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
      <!-- Header with back button -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center">
          <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-2xl font-semibold text-gray-900">{{ isEditMode ? 'Edit Plant' : 'Add New Plant' }}</h1>
        </div>
      </div>

      <!-- Plant Form -->
      <div class="bg-white shadow rounded-lg px-6 py-8">
        <form [formGroup]="plantForm" (ngSubmit)="onSubmit()">
          <!-- Name Field -->
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

          <!-- Description Field -->
          <app-form-field
            label="Description"
            [control]="description!"
            [required]="false"
            id="description"
            [customErrors]="{
              'maxlength': 'Description cannot exceed 500 characters'
            }"
          >
            <textarea
              id="description"
              formControlName="description"
              rows="4"
              class="form-input"
              placeholder="Enter plant description"
            ></textarea>
          </app-form-field>

          <!-- Action Buttons -->
          <div class="mt-8 flex justify-end space-x-4">
            <app-button
              type="button"
              variant="outline"
              (onClick)="goBack()"
            >
              Cancel
            </app-button>
            <app-button
              type="submit"
              [loading]="loading"
              [disabled]="plantForm.invalid || loading"
              variant="primary"
            >
              {{ isEditMode ? 'Update Plant' : 'Create Plant' }}
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `
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
