// Updated Add-Admin Component with Improved Mobile Responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControlOptions } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { PlantService } from '../../../../core/services/plant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent,
    FormFieldComponent
  ],
  template: `
    <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-6 sm:pb-8 max-w-2xl mx-auto transition-colors duration-200">
      <!-- Header with back button - improved for touch targets -->
      <div class="flex items-center mb-6">
        <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 -ml-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Add New Admin User</h1>
      </div>

      <form [formGroup]="adminForm" (ngSubmit)="onSubmit()">
        <!-- Responsive form grid - stacks on mobile, 2 columns on larger screens -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Full Name -->
          <div class="col-span-1 sm:col-span-2">
            <app-form-field
              label="Full Name"
              [control]="fullName!"
              [required]="true"
              id="fullName"
              [customErrors]="{
                'maxlength': 'Full name cannot exceed 100 characters'
              }"
            >
              <input
                type="text"
                id="fullName"
                formControlName="fullName"
                class="form-input"
                placeholder="Enter full name"
              />
            </app-form-field>
          </div>

          <!-- TE ID -->
          <div>
            <app-form-field
              label="TE ID"
              [control]="teid!"
              [required]="true"
              id="teid"
              [customErrors]="{
                'maxlength': 'TE ID cannot exceed 50 characters',
                'pattern': 'TE ID must be in the format TE followed by numbers (e.g. TE12345)'
              }"
            >
              <input
                type="text"
                id="teid"
                formControlName="teid"
                class="form-input"
                placeholder="Enter TE ID (format: TE12345)"
              />
            </app-form-field>
          </div>

          <!-- Email -->
          <div>
            <app-form-field
              label="Email"
              [control]="email!"
              [required]="true"
              id="email"
              [customErrors]="{
                'email': 'Please enter a valid email address'
              }"
            >
              <input
                type="email"
                id="email"
                formControlName="email"
                class="form-input"
                placeholder="Enter email address"
              />
            </app-form-field>
          </div>

          <!-- Password (Optional) -->
          <div class="col-span-1 sm:col-span-2">
            <app-form-field
              label="Password (Optional)"
              [control]="password!"
              [required]="false"
              id="password"
              [customErrors]="{
                'minlength': 'Password must be at least 8 characters',
                'pattern': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
              }"
              tooltip="If left blank, TE ID + '_i' will be used as initial password."
            >
              <input
                type="password"
                id="password"
                formControlName="password"
                class="form-input"
                placeholder="Enter password (optional)"
              />
            </app-form-field>

            <!-- Password hints -->
            <div *ngIf="password?.value" class="mt-2 text-xs text-gray-500 dark:text-gray-400 px-1">
              Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.
            </div>
            <div *ngIf="!password?.value" class="mt-2 text-xs text-gray-500 dark:text-gray-400 px-1">
              When left empty, the user will log in with their TE ID + "_i" as the initial password.
              They will be required to change it on first login.
            </div>
          </div>

          <!-- Plant -->
          <div>
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
          </div>

          <!-- User Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Role</label>
            <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-6 p-3 bg-gray-50 dark:bg-dark-700/50 rounded-md">
              <div class="flex items-center">
                <input
                  id="regularAdmin"
                  type="radio"
                  [value]="false"
                  formControlName="isSuperAdmin"
                  class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 dark:bg-dark-700"
                />
                <label for="regularAdmin" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  Regular Admin
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="superAdmin"
                  type="radio"
                  [value]="true"
                  formControlName="isSuperAdmin"
                  class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 dark:bg-dark-700"
                />
                <label for="superAdmin" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  Super Admin
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button - Full width on mobile, right-aligned on desktop -->
        <div class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0">
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
            [disabled]="adminForm.invalid || loading"
            variant="primary"
            class="w-full sm:w-auto"
          >
            Create Admin User
          </app-button>
        </div>
      </form>

      <!-- Password Display Modal - improved for mobile -->
      <div *ngIf="showPasswordModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 dark:bg-dark-900 opacity-75 dark:opacity-80 backdrop-blur-sm"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-dark-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Admin User Created Successfully
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      The admin user has been created. Please save the generated password for the user.
                    </p>
                    <div class="bg-gray-100 dark:bg-dark-700 p-3 rounded-md overflow-x-auto">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Generated Password:</p>
                      <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-mono mt-1">{{ generatedPassword }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6">
              <app-button
                type="button"
                variant="primary"
                (onClick)="closePasswordModal()"
                [fullWidth]="true"
                class="justify-center"
              >
                Done
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddAdminComponent implements OnInit {
  adminForm: FormGroup;
  plants: Plant[] = [];
  loading = false;
  showPasswordModal = false;
  generatedPassword = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly plantService: PlantService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    // Define password pattern for validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,100}$/;

    this.adminForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      teid: ['', [
        Validators.required,
        Validators.pattern(/^TE\d+$/) // Ensure TE followed by numbers
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        // Password is optional, but if provided, it must follow the pattern
        Validators.minLength(8),
        Validators.maxLength(100),
        Validators.pattern(passwordPattern)
      ]],
      plantId: [null, Validators.required],
      isSuperAdmin: [false, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
    });
  }

  get fullName() { return this.adminForm.get('fullName'); }
  get teid() { return this.adminForm.get('teid'); }
  get email() { return this.adminForm.get('email'); }
  get password() { return this.adminForm.get('password'); }
  get plantId() { return this.adminForm.get('plantId'); }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.adminForm.controls).forEach(key => {
        const control = this.adminForm.get(key);
        control?.markAsTouched();
      });
      
      // Find first invalid control and scroll to it
      setTimeout(() => {
        const firstInvalidControl = document.querySelector('.ng-invalid.ng-touched');
        if (firstInvalidControl) {
          firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    this.loading = true;

    // Create a copy of the form values
    const adminData = {...this.adminForm.value};

    this.authService.registerAdmin(adminData).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.password) {
          this.generatedPassword = response.password;
          this.showPasswordModal = true;
        } else {
          this.notificationService.success('Admin user created successfully');
          this.router.navigate(['/admin/users']);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.router.navigate(['/admin/users']);
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}