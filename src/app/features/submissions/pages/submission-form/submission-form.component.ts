import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  template: `
    <div class="bg-white shadow rounded-lg px-6 py-8 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Submit Your Information</h1>

      <form [formGroup]="submissionForm" (ngSubmit)="onSubmit()">
        <!-- Personal Information Section -->
        <div class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>

          <!-- Full Name -->
          <div class="mb-4">
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              formControlName="fullName"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your full name"
            />
            <div *ngIf="fullName?.invalid && (fullName?.dirty || fullName?.touched)" class="mt-1 text-sm text-red-600">
              <div *ngIf="fullName?.errors?.['required']">Full name is required</div>
              <div *ngIf="fullName?.errors?.['maxlength']">Full name cannot exceed 100 characters</div>
            </div>
          </div>

          <!-- TE ID -->
          <div class="mb-4">
            <label for="teId" class="block text-sm font-medium text-gray-700 mb-1">TE ID</label>
            <input
              type="text"
              id="teId"
              formControlName="teId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your TE ID"
            />
            <div *ngIf="teId?.invalid && (teId?.dirty || teId?.touched)" class="mt-1 text-sm text-red-600">
              <div *ngIf="teId?.errors?.['required']">TE ID is required</div>
              <div *ngIf="teId?.errors?.['maxlength']">TE ID cannot exceed 50 characters</div>
            </div>
          </div>

          <!-- CIN -->
          <div class="mb-4">
            <label for="cin" class="block text-sm font-medium text-gray-700 mb-1">CIN</label>
            <input
              type="text"
              id="cin"
              formControlName="cin"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your CIN"
            />
            <div *ngIf="cin?.invalid && (cin?.dirty || cin?.touched)" class="mt-1 text-sm text-red-600">
              <div *ngIf="cin?.errors?.['required']">CIN is required</div>
              <div *ngIf="cin?.errors?.['maxlength']">CIN cannot exceed 50 characters</div>
              <div *ngIf="cin?.errors?.['pattern']">CIN format is invalid (e.g. AB12345)</div>
            </div>
          </div>

          <!-- Date of Birth -->
          <div class="mb-4">
            <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              formControlName="dateOfBirth"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div *ngIf="dateOfBirth?.invalid && (dateOfBirth?.dirty || dateOfBirth?.touched)" class="mt-1 text-sm text-red-600">
              <div *ngIf="dateOfBirth?.errors?.['required']">Date of birth is required</div>
            </div>
          </div>

          <!-- Plant -->
          <div class="mb-4">
            <label for="plantId" class="block text-sm font-medium text-gray-700 mb-1">Plant</label>
            <select
              id="plantId"
              formControlName="plantId"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option [ngValue]="null" disabled>Select a plant</option>
              <option *ngFor="let plant of plants" [value]="plant.id">{{ plant.name }}</option>
            </select>
            <div *ngIf="plantId?.invalid && (plantId?.dirty || plantId?.touched)" class="mt-1 text-sm text-red-600">
              <div *ngIf="plantId?.errors?.['required']">Plant is required</div>
            </div>
          </div>

          <!-- Grey Card (Optional) -->
          <div class="mb-4">
            <label for="greyCard" class="block text-sm font-medium text-gray-700 mb-1">Grey Card Number (Optional)</label>
            <input
              type="text"
              id="greyCard"
              formControlName="greyCard"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your grey card number (if available)"
            />
            <div *ngIf="greyCard?.invalid && (greyCard?.dirty || greyCard?.touched)" class="mt-1 text-sm text-red-600">
              <div *ngIf="greyCard?.errors?.['pattern']">Grey card number format is invalid (e.g. 12345-A-67890)</div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Documents</h2>

          <!-- CIN Image -->
          <div class="mb-4">
            <label for="cinImage" class="block text-sm font-medium text-gray-700 mb-1">CIN Document</label>
            <input
              type="file"
              id="cinImage"
              (change)="onFileChange($event, 'cinImage')"
              accept="image/jpeg,image/png"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div *ngIf="cinImageError" class="mt-1 text-sm text-red-600">
              {{ cinImageError }}
            </div>
          </div>

          <!-- Personal Photo -->
          <div class="mb-4">
            <label for="picImage" class="block text-sm font-medium text-gray-700 mb-1">Personal Photo</label>
            <input
              type="file"
              id="picImage"
              (change)="onFileChange($event, 'picImage')"
              accept="image/jpeg,image/png"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div *ngIf="picImageError" class="mt-1 text-sm text-red-600">
              {{ picImageError }}
            </div>
          </div>

          <!-- Grey Card Image (Optional) -->
          <div class="mb-4" *ngIf="greyCard?.value">
            <label for="greyCardImage" class="block text-sm font-medium text-gray-700 mb-1">Grey Card Document</label>
            <input
              type="file"
              id="greyCardImage"
              (change)="onFileChange($event, 'greyCardImage')"
              accept="image/jpeg,image/png"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <div *ngIf="greyCardImageError" class="mt-1 text-sm text-red-600">
              {{ greyCardImageError }}
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
            Submit
          </app-button>
        </div>
      </form>
    </div>
  `
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
    private readonly formBuilder: FormBuilder,
    private readonly plantService: PlantService,
    private readonly submissionService: SubmissionService,
    private readonly notificationService: NotificationService
  ) {
    this.submissionForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      teId: ['', [Validators.required, Validators.maxLength(50)]],
      cin: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[A-Za-z]{1,2}\d+$/)
      ]],
      dateOfBirth: ['', Validators.required],
      plantId: [null, Validators.required],
      greyCard: ['', Validators.pattern(/^\d+-[A-Za-z]-\d+$/)]
    });
  }

  ngOnInit(): void {
    // Load plants
    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
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

    // Prepare submission data
    const submissionData = {
      ...this.submissionForm.value,
      cinImage: this.cinImage,
      picImage: this.picImage,
      greyCardImage: this.greyCardImage
    };

    this.submissionService.createSubmission(submissionData).subscribe({
      next: (response) => {
        this.loading = false;
        this.notificationService.success('Submission created successfully');
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        // Error is already handled by the interceptor
      }
    });
  }

  resetForm(): void {
    this.submissionForm.reset();
    this.cinImage = null;
    this.picImage = null;
    this.greyCardImage = null;
    this.cinImageError = '';
    this.picImageError = '';
    this.greyCardImageError = '';
  }
}
