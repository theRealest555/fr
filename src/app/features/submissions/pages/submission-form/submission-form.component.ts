// Updated Submission Form Component with improved responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { SubmissionService } from '../../../../core/services/submission.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant, GenderType } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-submission-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent,
    FileUploadComponent
  ],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-4 sm:px-6 py-6 sm:py-8 transition-colors duration-200">
        <!-- Header -->
        <div class="mb-6 sm:mb-8 text-center">
          <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Submit Your Information</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-300">
            Please complete all required fields and upload the necessary documents.
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="submissionForm" (ngSubmit)="onSubmit()">
          <!-- Personal Information Section -->
          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-dark-700">
              Personal Information
            </h2>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- First Name -->
              <app-form-field
                label="First Name"
                [control]="firstName!"
                [required]="true"
                id="firstName"
                [customErrors]="{
                  'maxlength': 'First name cannot exceed 50 characters'
                }"
              >
                <input
                  type="text"
                  id="firstName"
                  formControlName="firstName"
                  class="form-input"
                  placeholder="Enter your first name"
                />
              </app-form-field>

              <!-- Last Name -->
              <app-form-field
                label="Last Name"
                [control]="lastName!"
                [required]="true"
                id="lastName"
                [customErrors]="{
                  'maxlength': 'Last name cannot exceed 50 characters'
                }"
              >
                <input
                  type="text"
                  id="lastName"
                  formControlName="lastName"
                  class="form-input"
                  placeholder="Enter your last name"
                />
              </app-form-field>

              <!-- Gender -->
              <app-form-field
                label="Gender"
                [control]="gender!"
                [required]="true"
                id="gender"
              >
                <select
                  id="gender"
                  formControlName="gender"
                  class="form-input"
                >
                  <option [ngValue]="null" disabled>Select gender</option>
                  <option [ngValue]="GenderType.Male">Male</option>
                  <option [ngValue]="GenderType.Female">Female</option>
                </select>
              </app-form-field>

              <!-- TE ID -->
              <app-form-field
                label="TE ID"
                [control]="teId!"
                [required]="true"
                id="teId"
                [customErrors]="{
                  'maxlength': 'TE ID cannot exceed 50 characters',
                  'pattern': 'TE ID must be in the format TE followed by numbers (e.g. TE12345)'
                }"
              >
                <input
                  type="text"
                  id="teId"
                  formControlName="teId"
                  class="form-input"
                  placeholder="Enter your TE ID (format: TE12345)"
                />
              </app-form-field>

              <!-- CIN -->
              <app-form-field
                label="CIN"
                [control]="cin!"
                [required]="true"
                id="cin"
                [customErrors]="{
                  'maxlength': 'CIN cannot exceed 50 characters',
                  'pattern': 'CIN format is invalid (e.g. AB12345)'
                }"
              >
                <input
                  type="text"
                  id="cin"
                  formControlName="cin"
                  class="form-input"
                  placeholder="Example: AB12345"
                />
              </app-form-field>

              <!-- Date of Birth -->
              <app-form-field
                label="Date of Birth"
                [control]="dateOfBirth!"
                [required]="true"
                id="dateOfBirth"
              >
                <input
                  type="date"
                  id="dateOfBirth"
                  formControlName="dateOfBirth"
                  class="form-input"
                />
              </app-form-field>

              <!-- Plant -->
              <app-form-field
                label="Plant"
                [control]="plantId!"
                [required]="true"
                id="plantId"
              >
                <select
                  id="plantId"
                  formControlName="plantId"
                  class="form-input"
                >
                  <option [ngValue]="null" disabled>Select a plant</option>
                  <option *ngFor="let plant of plants" [value]="plant.id">{{ plant.name }}</option>
                </select>
              </app-form-field>

              <!-- Grey Card (Optional) -->
              <app-form-field
                label="Grey Card Number"
                [control]="greyCard!"
                [required]="false"
                id="greyCard"
                [customErrors]="{
                  'pattern': 'Grey card number format is invalid (e.g. 12345-A-67890)'
                }"
                hint="Optional - Format: 12345-A-67890"
              >
                <input
                  type="text"
                  id="greyCard"
                  formControlName="greyCard"
                  class="form-input"
                  placeholder="Example: 12345-A-67890"
                />
              </app-form-field>
            </div>
          </div>

          <!-- Documents Section -->
          <div class="mb-6 sm:mb-8">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-dark-700">
              Document Upload
            </h2>

            <div class="space-y-6">
              <!-- CIN Image -->
              <div>
                <label class="form-label">CIN Document <span class="text-red-500">*</span></label>
                <app-file-upload
                  inputId="cinImage"
                  accept="image/jpeg,image/png"
                  [maxSizeInMB]="1"
                  helperText="JPG or PNG, max 1MB"
                  [errorMessage]="cinImageError"
                  (fileSelected)="onCinFileSelected($event)"
                ></app-file-upload>
              </div>

              <!-- Personal Photo -->
              <div>
                <label class="form-label">Personal Photo <span class="text-red-500">*</span></label>
                <app-file-upload
                  inputId="picImage"
                  accept="image/jpeg,image/png"
                  [maxSizeInMB]="1"
                  helperText="JPG or PNG, max 1MB"
                  [errorMessage]="picImageError"
                  (fileSelected)="onPicFileSelected($event)"
                ></app-file-upload>
              </div>

              <!-- Grey Card Image (Only shown when Grey Card number is provided) -->
              <div *ngIf="greyCard?.value">
                <label class="form-label">Grey Card Document <span class="text-red-500">*</span></label>
                <app-file-upload
                  inputId="greyCardImage"
                  accept="image/jpeg,image/png"
                  [maxSizeInMB]="1"
                  helperText="JPG or PNG, max 1MB"
                  [errorMessage]="greyCardImageError"
                  (fileSelected)="onGreyCardFileSelected($event)"
                ></app-file-upload>
              </div>
            </div>
          </div>

          <!-- Submit Button - Full width on mobile -->
          <div class="flex justify-center sm:justify-end">
            <app-button
              type="submit"
              [loading]="loading"
              [disabled]="submissionForm.invalid || loading || !cinImage || !picImage || (greyCard?.value && !greyCardImage)"
              variant="primary"
              class="w-full sm:w-auto"
            >
              Submit Information
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    @media (max-width: 640px) {
      input[type="date"] {
        min-height: 38px;
      }
      input::-webkit-date-and-time-value {
        text-align: left;
      }
      .grid-cols-1 {
        grid-template-columns: 1fr !important;
      }
      .w-full {
        width: 100% !important;
      }
    }
  `]
})
export class SubmissionFormComponent implements OnInit {
  submissionForm: FormGroup;
  plants: Plant[] = [];
  loading = false;
  GenderType = GenderType; // Expose enum to template
  window = window; // Expose window to template for responsive checks

  cinImage: File | null = null;
  picImage: File | null = null;
  greyCardImage: File | null = null;

  cinImageError = '';
  picImageError = '';
  greyCardImageError = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly plantService: PlantService,
    private readonly submissionService: SubmissionService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {
    this.submissionForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      gender: [null, Validators.required],
      teId: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^TE\d+$/) // Updated to enforce TE format
      ]],
      cin: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z]{1,2}\d+$/)
      ]],
      dateOfBirth: [null, Validators.required],
      plantId: [null, Validators.required],
      greyCard: ['', Validators.pattern(/^\d+-[A-Za-z]-\d+$/)]
    });

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

    // Add listener for orientation changes to improve mobile experience
    window.addEventListener('orientationchange', () => {
      // Give time for the DOM to update
      setTimeout(() => this.checkMobileLayout(), 300);
    });

    // Initial check
    this.checkMobileLayout();
  }

  // Handle mobile-specific layout adjustments
  checkMobileLayout(): void {
    // If in a very narrow screen or landscape on mobile,
    // we might want to make some specific adjustments
    const isMobile = window.innerWidth < 640;
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isMobile && isLandscape) {
      // Make adjustments for landscape mobile if needed
      // This helps with virtual keyboard handling
    }
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
  get firstName() { return this.submissionForm.get('firstName'); }
  get lastName() { return this.submissionForm.get('lastName'); }
  get gender() { return this.submissionForm.get('gender'); }
  get teId() { return this.submissionForm.get('teId'); }
  get cin() { return this.submissionForm.get('cin'); }
  get dateOfBirth() { return this.submissionForm.get('dateOfBirth'); }
  get plantId() { return this.submissionForm.get('plantId'); }
  get greyCard() { return this.submissionForm.get('greyCard'); }

  onCinFileSelected(file: File | null): void {
    this.cinImage = file;
    this.cinImageError = file ? '' : 'CIN document is required';
  }

  onPicFileSelected(file: File | null): void {
    this.picImage = file;
    this.picImageError = file ? '' : 'Personal photo is required';
  }

  onGreyCardFileSelected(file: File | null): void {
    this.greyCardImage = file;
    this.greyCardImageError = file ? '' : 'Grey card document is required when grey card number is provided';
  }

  validateFile(file: File): boolean {
    // If on mobile, we might want to be more lenient with file sizes
    const isMobile = window.innerWidth < 640;
    const maxSize = isMobile ? 2 * 1024 * 1024 : 1 * 1024 * 1024; // 2MB on mobile, 1MB on desktop

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    if (file.size > maxSize) {
      return false;
    }

    return true;
  }

  onSubmit(): void {
    // Additional validation for mobile - ensure form is scrolled to top to see any errors
    if (this.submissionForm.invalid) {
      // Mark all fields as touched to show all validation errors
      Object.keys(this.submissionForm.controls).forEach(key => {
        const control = this.submissionForm.get(key);
        control?.markAsTouched();
      });

      // Find the first invalid control and scroll to it
      const firstInvalidControl = document.querySelector('.ng-invalid.ng-touched');
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

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

    const formValue = { ...this.submissionForm.value };
    if (formValue.dateOfBirth) {
      formValue.dateOfBirth = new Date(formValue.dateOfBirth).toISOString().split('T')[0];
    }

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
