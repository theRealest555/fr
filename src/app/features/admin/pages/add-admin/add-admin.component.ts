import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { PlantService } from '../../../../core/services/plant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Plant } from '../../../../core/models/data.models';
import { AdminRoles } from '../../../../core/models/auth.models';
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
    <div class="bg-white shadow rounded-lg px-8 pt-6 pb-8 max-w-2xl mx-auto">
      <!-- Header with back button -->
      <div class="flex items-center mb-6">
        <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-semibold text-gray-900">Add New Admin User</h1>
      </div>

      <form [formGroup]="adminForm" (ngSubmit)="onSubmit()">
        <!-- Full Name -->
        <div class="mb-4">
          <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="fullName"
            formControlName="fullName"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter full name"
          />
          <div *ngIf="fullName?.invalid && (fullName?.dirty || fullName?.touched)" class="mt-1 text-sm text-red-600">
            <div *ngIf="fullName?.errors?.['required']">Full name is required</div>
            <div *ngIf="fullName?.errors?.['maxlength']">Full name cannot exceed 100 characters</div>
          </div>
        </div>

        <!-- TE ID -->
        <div class="mb-4">
          <label for="teid" class="block text-sm font-medium text-gray-700 mb-1">TE ID</label>
          <input
            type="text"
            id="teid"
            formControlName="teid"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter TE ID"
          />
          <div *ngIf="teid?.invalid && (teid?.dirty || teid?.touched)" class="mt-1 text-sm text-red-600">
            <div *ngIf="teid?.errors?.['required']">TE ID is required</div>
          </div>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter email address"
          />
          <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="mt-1 text-sm text-red-600">
            <div *ngIf="email?.errors?.['required']">Email is required</div>
            <div *ngIf="email?.errors?.['email']">Please enter a valid email address</div>
          </div>
        </div>

        <!-- Password (Optional) -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password (Optional)
            <span class="text-gray-500 font-normal"> - If left blank, a strong password will be generated</span>
          </label>
          <input
            type="password"
            id="password"
            formControlName="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter password (optional)"
          />
          <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="mt-1 text-sm text-red-600">
            <div *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</div>
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

        <!-- User Role -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">User Role</label>
          <div class="flex items-center space-x-6">
            <div class="flex items-center">
              <input
                id="regularAdmin"
                type="radio"
                [value]="false"
                formControlName="isSuperAdmin"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label for="regularAdmin" class="ml-2 block text-sm text-gray-700">
                Regular Admin
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="superAdmin"
                type="radio"
                [value]="true"
                formControlName="isSuperAdmin"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label for="superAdmin" class="ml-2 block text-sm text-gray-700">
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
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Admin User Created Successfully
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 mb-2">
                      The admin user has been created. Please save the generated password for the user.
                    </p>
                    <div class="bg-gray-100 p-2 rounded-md">
                      <p class="text-sm font-medium text-gray-900">Generated Password:</p>
                      <p class="text-sm text-gray-700 font-mono mt-1">{{ generatedPassword }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                (click)="closePasswordModal()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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
    this.adminForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.maxLength(100)]],
      teid: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(8)],
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

  // Getters for form controls
  get fullName() { return this.adminForm.get('fullName'); }
  get teid() { return this.adminForm.get('teid'); }
  get email() { return this.adminForm.get('email'); }
  get password() { return this.adminForm.get('password'); }
  get plantId() { return this.adminForm.get('plantId'); }

  onSubmit(): void {
    if (this.adminForm.invalid) {
      return;
    }

    this.loading = true;

    const adminData = {
      ...this.adminForm.value
    };

    this.authService.registerAdmin(adminData).subscribe({
      next: (response) => {
        this.loading = false;

        // If a password was not provided, show the generated one
        if (!this.adminForm.value.password) {
          this.generatedPassword = response.password ?? 'Password not returned';
          this.showPasswordModal = true;
        } else {
          this.notificationService.success('Admin user created successfully');
          this.router.navigate(['/admin/users']);
        }
      },
      error: () => {
        this.loading = false;
        // Error is already handled by the interceptor
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
