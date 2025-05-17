import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User, UserToken } from '../../../../core/models/auth.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto">
      <!-- Profile Overview -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg mb-6 transition-colors duration-200">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
        </div>
        <div class="px-6 py-5">
          <div *ngIf="user" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</div>
              <div class="text-lg text-gray-900 dark:text-white">{{ user.fullName }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</div>
              <div class="text-lg text-gray-900 dark:text-white">{{ user.email }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plant</div>
              <div class="text-lg text-gray-900 dark:text-white">{{ user.plantName }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Role</div>
              <div class="text-lg text-gray-900 dark:text-white">{{ user.isSuperAdmin ? 'Super Admin' : 'Regular Admin' }}</div>
            </div>
          </div>

          <!-- Loading state -->
          <div *ngIf="!user" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 dark:border-primary-400"></div>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg mb-6 transition-colors duration-200">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
        </div>
        <div class="px-6 py-5">
          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
            <!-- Current Password -->
            <div class="mb-4">
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                formControlName="currentPassword"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white transition-colors duration-150"
                placeholder="Enter your current password"
              />
              <div *ngIf="currentPassword?.invalid && (currentPassword?.dirty || currentPassword?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
                <div *ngIf="currentPassword?.errors?.['required']">Current password is required</div>
              </div>
            </div>

            <!-- New Password -->
            <div class="mb-4">
              <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                formControlName="newPassword"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white transition-colors duration-150"
                placeholder="Enter new password"
              />
              <div *ngIf="newPassword?.invalid && (newPassword?.dirty || newPassword?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
                <div *ngIf="newPassword?.errors?.['required']">New password is required</div>
                <div *ngIf="newPassword?.errors?.['minlength']">Password must be at least 8 characters</div>
                <div *ngIf="newPassword?.errors?.['pattern']">
                  Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white transition-colors duration-150"
                placeholder="Confirm new password"
              />
              <div *ngIf="confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-400">
                <div *ngIf="confirmPassword?.errors?.['required']">Confirm password is required</div>
              </div>
              <div *ngIf="passwordForm.errors?.['passwordMismatch'] && confirmPassword?.touched" class="mt-1 text-sm text-red-600 dark:text-red-400">
                Passwords do not match
              </div>
            </div>

            <!-- Password Requirements -->
            <div class="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">Password requirements</h3>
                  <div class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                    <ul class="list-disc pl-5 space-y-1">
                      <li>Minimum 8 characters</li>
                      <li>At least one uppercase letter</li>
                      <li>At least one lowercase letter</li>
                      <li>At least one number</li>
                      <li>At least one special character</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end mt-6">
              <app-button
                type="submit"
                [loading]="loading"
                [disabled]="passwordForm.invalid || loading"
                [fullWidth]="true"
              >
                Change Password
              </app-button>
            </div>
          </form>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
        </div>
        <div class="px-6 py-5">
          <div *ngIf="!loadingSessions && sessions.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No active sessions found
          </div>

          <ul *ngIf="!loadingSessions && sessions.length > 0" class="divide-y divide-gray-200 dark:divide-dark-700">
            <li *ngFor="let session of sessions" class="py-4">
              <div class="flex justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ session.deviceInfo || 'Unknown Device' }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    IP: {{ session.ipAddress || 'Unknown' }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Login: {{ formatDate(session.createdAt) }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Expires: {{ formatDate(session.expiresAt) }}
                  </p>
                </div>
                <div class="self-center">
                  <span
                    *ngIf="isCurrentSession(session)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 mr-2"
                  >
                    Current Session
                  </span>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </li>
          </ul>

          <!-- Loading state -->
          <div *ngIf="loadingSessions" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 dark:border-primary-400"></div>
          </div>

          <!-- Logout Button -->
          <div class="mt-4 flex justify-end">
            <app-button
              (onClick)="logoutAllDevices()"
              [loading]="loadingLogout"
              [disabled]="loadingLogout || sessions.length === 0"
              variant="danger"
              size="md"
            >
              Logout from All Devices
            </app-button>
          </div>
        </div>
      </div>

      <!-- Logout Confirmation Modal -->
      <div *ngIf="showLogoutConfirmation" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-black dark:bg-opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-dark-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Logout from All Devices
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to log out from all devices? This will terminate all your active sessions, including the current one.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                (click)="confirmLogoutAll()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-offset-dark-800 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Yes, Log Out All
              </button>
              <button
                type="button"
                (click)="cancelLogoutAll()"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-dark-600 shadow-sm px-4 py-2 bg-white dark:bg-dark-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  passwordForm: FormGroup;
  loading = false;
  loadingSessions = false;
  loadingLogout = false;
  sessions: UserToken[] = [];
  showLogoutConfirmation = false;
  currentToken: string | null = null;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    // Modern approach using the typed FormBuilder API
    this.passwordForm = this.formBuilder.group({
      currentPassword: this.formBuilder.control('', { validators: Validators.required }),
      newPassword: this.formBuilder.control('', {
        validators: [
          Validators.required,
          Validators.minLength(8),
          // Pattern for at least one uppercase, one lowercase, one number, and one special character
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        ]
      }),
      confirmPassword: this.formBuilder.control('', { validators: Validators.required })
    }, { validators: this.passwordMatchValidator } as AbstractControlOptions);
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadSessions();
    this.currentToken = this.authService.getToken();
  }

  // Getters for form controls
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  loadProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: user => {
        this.user = user;
      },
      error: () => {
        // Error handled by interceptor
      }
    });
  }

  loadSessions(): void {
    this.loadingSessions = true;
    this.authService.getActiveSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.loadingSessions = false;
      },
      error: () => {
        this.loadingSessions = false;
      }
    });
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Password updated successfully');
        this.passwordForm.reset();
      },
      error: () => {
        this.loading = false;
        // Error is already handled by the interceptor
      }
    });
  }

  logoutAllDevices(): void {
    this.showLogoutConfirmation = true;
  }

  cancelLogoutAll(): void {
    this.showLogoutConfirmation = false;
  }

  confirmLogoutAll(): void {
    this.loadingLogout = true;
    this.showLogoutConfirmation = false;

    this.authService.logoutAllDevices().subscribe({
      next: () => {
        this.loadingLogout = false;
        this.notificationService.success('Logged out from all devices');
        // Redirect to login page
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loadingLogout = false;
        // Error is already handled by the interceptor
      }
    });
  }

  isCurrentSession(session: UserToken): boolean {
    return session.token === this.currentToken;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
