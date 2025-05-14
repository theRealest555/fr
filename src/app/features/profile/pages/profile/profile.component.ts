import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User } from '../../../../core/models/auth.models';
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
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div class="px-6 py-5">
          <div *ngIf="user" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Full Name</div>
              <div class="text-lg text-gray-900">{{ user.fullName }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Email Address</div>
              <div class="text-lg text-gray-900">{{ user.email }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Plant</div>
              <div class="text-lg text-gray-900">{{ user.plantName }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Role</div>
              <div class="text-lg text-gray-900">{{ user.isSuperAdmin ? 'Super Admin' : 'Regular Admin' }}</div>
            </div>
          </div>

          <!-- Loading state -->
          <div *ngIf="!user" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>

      <!-- Change Password -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Change Password</h2>
        </div>
        <div class="px-6 py-5">
          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
            <!-- Current Password -->
            <div class="mb-4">
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                formControlName="currentPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your current password"
              />
              <div *ngIf="currentPassword?.invalid && (currentPassword?.dirty || currentPassword?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="currentPassword?.errors?.['required']">Current password is required</div>
              </div>
            </div>

            <!-- New Password -->
            <div class="mb-4">
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                formControlName="newPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter new password"
              />
              <div *ngIf="newPassword?.invalid && (newPassword?.dirty || newPassword?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="newPassword?.errors?.['required']">New password is required</div>
                <div *ngIf="newPassword?.errors?.['minlength']">Password must be at least 8 characters</div>
                <div *ngIf="newPassword?.errors?.['pattern']">
                  Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-6">
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Confirm new password"
              />
              <div *ngIf="confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="confirmPassword?.errors?.['required']">Confirm password is required</div>
              </div>
              <div *ngIf="passwordForm.errors?.['passwordMismatch'] && confirmPassword?.touched" class="mt-1 text-sm text-red-600">
                Passwords do not match
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <app-button
                type="submit"
                [loading]="loading"
                [disabled]="passwordForm.invalid || loading"
                variant="primary"
              >
                Update Password
              </app-button>
            </div>
          </form>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Active Sessions</h2>
        </div>
        <div class="px-6 py-5">
          <div *ngIf="!loadingSessions && sessions.length === 0" class="text-center py-4 text-gray-500">
            No active sessions found
          </div>

          <ul *ngIf="!loadingSessions && sessions.length > 0" class="divide-y divide-gray-200">
            <li *ngFor="let session of sessions" class="py-4">
              <div class="flex justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ session.deviceInfo || 'Unknown Device' }}
                  </p>
                  <p class="text-sm text-gray-500">
                    IP: {{ session.ipAddress || 'Unknown' }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Login: {{ formatDate(session.createdAt) }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Expires: {{ formatDate(session.expiresAt) }}
                  </p>
                </div>
                <div class="self-center">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </li>
          </ul>

          <!-- Loading state -->
          <div *ngIf="loadingSessions" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>

          <!-- Logout Button -->
          <div class="mt-4 flex justify-end">
            <app-button
              (onClick)="logoutAllDevices()"
              [loading]="loadingLogout"
              [disabled]="loadingLogout || sessions.length === 0"
              variant="danger"
              size="sm"
            >
              Logout from All Devices
            </app-button>
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
  sessions: any[] = [];

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
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
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadSessions();
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
    this.authService.getUserProfile().subscribe(user => {
      this.user = user;
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
    this.loadingLogout = true;

    this.authService.logoutAllDevices().subscribe({
      next: () => {
        this.loadingLogout = false;
        this.notificationService.success('Logged out from all devices');
        // No need to navigate - the auth interceptor will handle the redirect to login
      },
      error: () => {
        this.loadingLogout = false;
        // Error is already handled by the interceptor
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
