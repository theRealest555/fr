import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControlOptions } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { PlantService } from '../../../../core/services/plant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-add-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  template: `
    <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-8 pt-6 pb-8 max-w-2xl mx-auto transition-colors duration-200">
      <!-- Header with back button -->
      <div class="flex items-center mb-6">
        <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Add New Admin User</h1>
      </div>

      <form [formGroup]="adminForm" (ngSubmit)="onSubmit()">
        <!-- Full Name -->
        <div class="mb-4">
          <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            id="fullName"
            formControlName="fullName"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
            placeholder="Enter full name"
          />
          <div *ngIf="fullName?.invalid && (fullName?.dirty || fullName?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
            <div *ngIf="fullName?.errors?.['required']">Full name is required</div>
            <div *ngIf="fullName?.errors?.['maxlength']">Full name cannot exceed 100 characters</div>
          </div>
        </div>

        <!-- TE ID -->
        <div class="mb-4">
          <label for="teid" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">TE ID</label>
          <input
            type="text"
            id="teid"
            formControlName="teid"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
            placeholder="Enter TE ID (format: TE12345)"
          />
          <div *ngIf="teid?.invalid && (teid?.dirty || teid?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
            <div *ngIf="teid?.errors?.['required']">TE ID is required</div>
            <div *ngIf="teid?.errors?.['pattern']">TE ID must be in the format TE followed by numbers (e.g. TE12345)</div>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
            placeholder="Enter email address"
          />
          <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
            <div *ngIf="email?.errors?.['required']">Email is required</div>
            <div *ngIf="email?.errors?.['email']">Please enter a valid email address</div>
          </div>
        </div>

        <!-- Password (Optional) -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password (Optional)
            <span class="text-gray-500 dark:text-gray-400 font-normal"> - If left blank, TE ID + "_i" will be used as initial password</span>
          </label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
            placeholder="Enter password (optional)"
          />
          <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
            <div *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</div>
            <div *ngIf="password?.errors?.['pattern']">
              Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
            </div>
          </div>
          <div *ngIf="password?.value" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            The password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.
          </div>
          <div *ngIf="!password?.value" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            When left empty, the user will log in with their TE ID + "_i" as the initial password.
            They will be required to change it on first login.
          </div>
        </div>

        <!-- Plant -->
        <div class="mb-4">
          <label for="plantId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Plant</label>
          <select
            id="plantId"
            formControlName="plantId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white"
          >
            <option [ngValue]="null" disabled>Select a plant</option>
            <option *ngFor="let plant of plants" [value]="plant.id">{{ plant.name }}</option>
          </select>
          <div *ngIf="plantId?.invalid && (plantId?.dirty || plantId?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
            <div *ngIf="plantId?.errors?.['required']">Plant is required</div>
          </div>
        </div>

        <!-- User Role -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Role</label>
          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <input
                id="regularAdmin"
                type="radio"
                [value]="false"
                formControlName="isSuperAdmin"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 dark:bg-dark-700"
              />
              <label for="regularAdmin" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Regular Admin
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="superAdmin"
                type="radio"
                [value]="true"
                formControlName="isSuperAdmin"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-dark-600 dark:bg-dark-700"
              />
              <label for="superAdmin" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Super Admin
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end">
          <app-button
            type="submit"
            [loading]="loading"
            [disabled]="adminForm.invalid || loading"
            variant="primary"
          >
            Create Admin User
          </app-button>
        </div>
      </form>

      <!-- Password Display Modal -->
      <div *ngIf="showPasswordModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 dark:bg-dark-900 opacity-75 dark:opacity-80"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-dark-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                    <div class="bg-gray-100 dark:bg-dark-700 p-2 rounded-md">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">Generated Password:</p>
                      <p class="text-sm text-gray-700 dark:text-gray-300 font-mono mt-1">{{ generatedPassword }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                (click)="closePasswordModal()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-900 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Done
              </button>
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
    // // Define password pattern for validation
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,100}$/;

    this.adminForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      teid: ['', [
        Validators.required,
        Validators.pattern(/^TE\d+$/) // Ensure TE followed by numbers
      ]],
      email: ['', [Validators.required, Validators.email]],
      // password: ['', [
      //   // Password is optional, but if provided, it must follow the pattern
      //   Validators.minLength(8),
      //   Validators.maxLength(100),
      //   Validators.pattern(passwordPattern)
      // ]],
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
      Object.keys(this.adminForm.controls).forEach(key => {
        const control = this.adminForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.loading = true;

    const adminData = {...this.adminForm.value};

    // If password is empty, set it to TE ID + "_i"
    adminData.password ??= `${adminData.teid}_init`;

    this.authService.registerAdmin(adminData).subscribe({
      next: (response) => {
        this.loading = false;
          this.notificationService.success('Admin user created successfully');
          this.router.navigate(['/admin/users']);
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
