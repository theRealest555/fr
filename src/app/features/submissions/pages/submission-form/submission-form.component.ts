import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { SubmissionService } from '../../../../core/services/submission.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-submission-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow rounded-lg px-6 py-8">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-gray-900">Submit Your Information</h1>
          <p class="mt-2 text-gray-600">
            Please complete all required fields and upload the necessary documents.
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="submissionForm" (ngSubmit)="onSubmit()">
          <!-- Personal Information Section -->
          <div class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Personal Information
            </h2>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Full Name -->
              <div>
                <label for="fullName" class="form-label">Full Name <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  formControlName="fullName"
                  class="form-input"
                  [ngClass]="{'border-red-500': fullName?.invalid && (fullName?.dirty || fullName?.touched)}"
                  placeholder="Enter your full name"
                />
                <div *ngIf="fullName?.invalid && (fullName?.dirty || fullName?.touched)" class="form-error">
                  <div *ngIf="fullName?.errors?.['required']">Full name is required</div>
                  <div *ngIf="fullName?.errors?.['maxlength']">Full name cannot exceed 100 characters</div>
                </div>
              </div>

              <!-- TE ID -->
              <div>
                <label for="teId" class="form-label">TE ID <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="teId"
                  formControlName="teId"
                  class="form-input"
                  [ngClass]="{'border-red-500': teId?.invalid && (teId?.dirty || teId?.touched)}"
                  placeholder="Enter your TE ID"
                />
                <div *ngIf="teId?.invalid && (teId?.dirty || teId?.touched)" class="form-error">
                  <div *ngIf="teId?.errors?.['required']">TE ID is required</div>
                  <div *ngIf="teId?.errors?.['maxlength']">TE ID cannot exceed 50 characters</div>
                </div>
              </div>

              <!-- CIN -->
              <div>
                <label for="cin" class="form-label">CIN <span class="text-red-500">*</span></label>
                <input
                  type="text"
                  id="cin"
                  formControlName="cin"
                  class="form-input"
                  [ngClass]="{'border-red-500': cin?.invalid && (cin?.dirty || cin?.touched)}"
                  placeholder="Example: AB12345"
                />
                <div *ngIf="cin?.invalid && (cin?.dirty || cin?.touched)" class="form-error">
                  <div *ngIf="cin?.errors?.['required']">CIN is required</div>
                  <div *ngIf="cin?.errors?.['maxlength']">CIN cannot exceed 50 characters</div>
                  <div *ngIf="cin?.errors?.['pattern']">CIN format is invalid (e.g. AB12345)</div>
                </div>
              </div>

              <!-- Date of Birth -->
              <div>
                <label for="dateOfBirth" class="form-label">Date of Birth <span class="text-red-500">*</span></label>
                <input
                  type="date"
                  id="dateOfBirth"
                  formControlName="dateOfBirth"
                  class="form-input"
                  [ngClass]="{'border-red-500': dateOfBirth?.invalid && (dateOfBirth?.dirty || dateOfBirth?.touched)}"
                />
                <div *ngIf="dateOfBirth?.invalid && (dateOfBirth?.dirty || dateOfBirth?.touched)" class="form-error">
                  <div *ngIf="dateOfBirth?.errors?.['required']">Date of birth is required</div>
                </div>
              </div>

              <!-- Plant -->
              <div>
                <label for="plantId" class="form-label">Plant <span class="text-red-500">*</span></label>
                <select
                  id="plantId"
                  formControlName="plantId"
                  class="form-input"
                  [ngClass]="{'border-red-500': plantId?.invalid && (plantId?.dirty || plantId?.touched)}"
                >
                  <option [ngValue]="null" disabled>Select a plant</option>
                  <option *ngFor="let plant of plants" [value]="plant.id">{{ plant.name }}</option>
                </select>
                <div *ngIf="plantId?.invalid && (plantId?.dirty || plantId?.touched)" class="form-error">
                  <div *ngIf="plantId?.errors?.['required']">Plant is required</div>
                </div>
              </div>

              <!-- Grey Card (Optional) -->
              <div>
                <label for="greyCard" class="form-label">Grey Card Number (Optional)</label>
                <input
                  type="text"
                  id="greyCard"
                  formControlName="greyCard"
                  class="form-input"
                  [ngClass]="{'border-red-500': greyCard?.invalid && (greyCard?.dirty || greyCard?.touched)}"
                  placeholder="Example: 12345-A-67890"
                />
                <div *ngIf="greyCard?.invalid && (greyCard?.dirty || greyCard?.touched)" class="form-error">
                  <div *ngIf="greyCard?.errors?.['pattern']">Grey card number format is invalid (e.g. 12345-A-67890)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="mb-8">
            <h2 class="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Document Upload
            </h2>

            <div class="space-y-6">
              <!-- CIN Image -->
              <div>
                <label for="cinImage" class="form-label">CIN Document <span class="text-red-500">*</span></label>
                <div class="mt-1 flex items-center">
                  <input
                    type="file"
                    id="cinImage"
                    (change)="onFileChange($event, 'cinImage')"
                    accept="image/jpeg,image/png"
                    class="hidden"
                    #cinImageInput
                  />
                  <button
                    type="button"
                    (click)="cinImageInput.click()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose file
                  </button>
                  <span class="ml-3 text-sm text-gray-500">
                    {{ cinImage ? cinImage.name : 'No file chosen' }}
                  </span>
                </div>
                <div *ngIf="cinImageError" class="mt-1 text-sm text-red-600">
                  {{ cinImageError }}
                </div>
                <p class="mt-1 text-xs text-gray-500">JPG or PNG, max 5MB</p>
              </div>

              <!-- Personal Photo -->
              <div>
                <label for="picImage" class="form-label">Personal Photo <span class="text-red-500">*</span></label>
                <div class="mt-1 flex items-center">
                  <input
                    type="file"
                    id="picImage"
                    (change)="onFileChange($event, 'picImage')"
                    accept="image/jpeg,image/png"
                    class="hidden"
                    #picImageInput
                  />
                  <button
                    type="button"
                    (click)="picImageInput.click()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose file
                  </button>
                  <span class="ml-3 text-sm text-gray-500">
                    {{ picImage ? picImage.name : 'No file chosen' }}
                  </span>
                </div>
                <div *ngIf="picImageError" class="mt-1 text-sm text-red-600">
                  {{ picImageError }}
                </div>
                <p class="mt-1 text-xs text-gray-500">JPG or PNG, max 5MB</p>
              </div>

              <!-- Grey Card Image (Only shown when Grey Card number is provided) -->
              <div *ngIf="greyCard?.value">
                <label for="greyCardImage" class="form-label">Grey Card Document <span class="text-red-500">*</span></label>
                <div class="mt-1 flex items-center">
                  <input
                    type="file"
                    id="greyCardImage"
                    (change)="onFileChange($event, 'greyCardImage')"
                    accept="image/jpeg,image/png"
                    class="hidden"
                    #greyCardImageInput
                  />
                  <button
                    type="button"
                    (click)="greyCardImageInput.click()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg class="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose file
                  </button>
                  <span class="ml-3 text-sm text-gray-500">
                    {{ greyCardImage ? greyCardImage.name : 'No file chosen' }}
                  </span>
                </div>
                <div *ngIf="greyCardImageError" class="mt-1 text-sm text-red-600">
                  {{ greyCardImageError }}
                </div>
                <p class="mt-1 text-xs text-gray-500">JPG or PNG, max 5MB</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <app-button
              type="submit"
              [loading]="loading"
              [disabled]="submissionForm.invalid || loading || !cinImage || !picImage || (greyCard?.value && !greyCardImage)"
              variant="primary"
            >
              Submit Information
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-error {
      @apply text-sm text-red-600 mt-1;
    }
  `]
})
export class SubmissionFormComponent implements OnInit {
  submissionForm: FormGroup;
  plants: Plant[] = [];
  loading = false;

  // File variables
  cinImage: File | null = null;
  picImage: File | null = null;
  greyCardImage: File | null = null;

  // File error messages
  cinImageError = '';
  picImageError = '';
  greyCardImageError = '';

  constructor(
    private formBuilder: FormBuilder,
    private plantService: PlantService,
    private submissionService: SubmissionService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.submissionForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      teId: ['', [Validators.required, Validators.maxLength(50)]],
      cin: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z]{1,2}\d+$/)
      ]],
      dateOfBirth: [null, Validators.required],
      plantId: [null, Validators.required],
      greyCard: ['', Validators.pattern(/^\d+-[A-Za-z]-\d+$/)]
    });

    // Subscribe to grey card changes to reset the file when grey card is removed
    this.submissionForm.get('greyCard')?.valueChanges.subscribe(value => {
      if (!value && this.greyCardImage) {
        this.greyCardImage = null;
        this.greyCardImageError = '';
      }
    });
  }

  ngOnInit(): void {
    // Load plants
    this.loadPlants();
  }

  loadPlants(): void {
    this.plantService.getAllPlants().subscribe({
      next: plants => {
        this.plants = plants;
      },
      error: () => {
        this.notificationService.error('Failed to load plants. Please try again later.');
      }
    });
  }

  // Getters for form controls
  get fullName() { return this.submissionForm.get('fullName'); }
  get teId() { return this.submissionForm.get('teId'); }
  get cin() { return this.submissionForm.get('cin'); }
  get dateOfBirth() { return this.submissionForm.get('dateOfBirth'); }
  get plantId() { return this.submissionForm.get('plantId'); }
  get greyCard() { return this.submissionForm.get('greyCard'); }

  onFileChange(event: Event, fileType: string): void {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      const file = element.files[0];

      // Validate file type and size
      if (!this.validateFile(file)) {
        switch (fileType) {
          case 'cinImage':
            this.cinImageError = 'Invalid file. Only JPG/PNG files under 5MB are allowed.';
            this.cinImage = null;
            break;
          case 'picImage':
            this.picImageError = 'Invalid file. Only JPG/PNG files under 5MB are allowed.';
            this.picImage = null;
            break;
          case 'greyCardImage':
            this.greyCardImageError = 'Invalid file. Only JPG/PNG files under 5MB are allowed.';
            this.greyCardImage = null;
            break;
        }
        return;
      }

      // Clear previous error and set the file
      switch (fileType) {
        case 'cinImage':
          this.cinImageError = '';
          this.cinImage = file;
          break;
        case 'picImage':
          this.picImageError = '';
          this.picImage = file;
          break;
        case 'greyCardImage':
          this.greyCardImageError = '';
          this.greyCardImage = file;
          break;
      }
    }
  }

  validateFile(file: File): boolean {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation
    Object.keys(this.submissionForm.controls).forEach(key => {
      const control = this.submissionForm.get(key);
      control?.markAsTouched();
    });

    if (this.submissionForm.invalid) {
      return;
    }

    // Validate required files
    if (!this.cinImage) {
      this.cinImageError = 'CIN document is required';
      return;
    }

    if (!this.picImage) {
      this.picImageError = 'Personal photo is required';
      return;
    }

    if (this.submissionForm.value.greyCard && !this.greyCardImage) {
      this.greyCardImageError = 'Grey card document is required when grey card number is provided';
      return;
    }

    this.loading = true;

    // Format date correctly for the API
    const formValue = { ...this.submissionForm.value };
    if (formValue.dateOfBirth) {
      // Ensure date is in ISO format (YYYY-MM-DD)
      formValue.dateOfBirth = new Date(formValue.dateOfBirth).toISOString().split('T')[0];
    }

    // Prepare submission data
    const submissionData = {
      ...formValue,
      cinImage: this.cinImage,
      picImage: this.picImage,
      greyCardImage: this.greyCardImage
    };

    this.submissionService.createSubmission(submissionData).subscribe({
      next: (response) => {
        this.loading = false;
        this.notificationService.success('Submission created successfully');

        // Navigate to confirmation page
        this.router.navigate(['/submission-confirm', response.id]);
      },
      error: (error) => {
        this.loading = false;
        if (error?.error?.message) {
          this.notificationService.error(error.error.message);
        } else {
          this.notificationService.error('Failed to create submission. Please try again later.');
        }
      }
    });
  }
}
