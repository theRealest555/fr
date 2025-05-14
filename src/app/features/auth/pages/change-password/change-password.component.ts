import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControlOptions } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="flex justify-center">
          <img class="h-12 w-auto" src="assets/images/logo.png" alt="TE Connectivity" />
        </div>

        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Password</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Please update your password for security reasons
        </p>

        <!-- Change Password Form -->
        <form class="mt-8 space-y-6" [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm space-y-4">
            <!-- Current Password Field -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                formControlName="currentPassword"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Current password"
              />
              <div *ngIf="currentPassword?.invalid && (currentPassword?.dirty || currentPassword?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="currentPassword?.errors?.['required']">Current password is required</div>
              </div>
            </div>

            <!-- New Password Field -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                formControlName="newPassword"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="New password"
              />
              <div *ngIf="newPassword?.invalid && (newPassword?.dirty || newPassword?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="newPassword?.errors?.['required']">New password is required</div>
                <div *ngIf="newPassword?.errors?.['minlength']">Password must be at least 8 characters</div>
                <div *ngIf="newPassword?.errors?.['pattern']">
                  Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                </div>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                formControlName="confirmPassword"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Confirm new password"
              />
              <div *ngIf="confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)" class="text-red-500 text-xs mt-1">
                <div *ngIf="confirmPassword?.errors?.['required']">Confirm password is required</div>
              </div>
              <div *ngIf="passwordForm.errors?.['passwordMismatch'] && confirmPassword?.touched" class="text-red-500 text-xs mt-1">
                Passwords do not match
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
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
  `
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    // Initialize form with password requirements
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        // Pattern for at least one uppercase, one lowercase, one number, and one special character
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: [this.passwordMatchValidator] } as AbstractControlOptions);
  }

  ngOnInit(): void {
    // Check if user is authenticated, redirect to login if not
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      this.notificationService.warning('Please login first');
    }
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

  onSubmit(): void {
    // Stop if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.changePassword(this.passwordForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success('Password changed successfully');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading = false;
        // Error is already handled by the interceptor
      }
    });
  }
}
