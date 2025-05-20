import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControlOptions } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <!-- Logo -->
        <div class="flex justify-center">
          <img src="assets/images/logo.svg" alt="TE Connectivity Logo" class="h-12 w-auto">
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Change Password</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isFirstLogin ? 'Please set a new password to continue' : 'Update your password for security' }}
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Current Password -->
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <div class="mt-1">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  formControlName="currentPassword"
                  class="form-input"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500': currentPassword?.invalid && (currentPassword?.dirty || currentPassword?.touched)}"
                >
              </div>
              <div *ngIf="currentPassword?.invalid && (currentPassword?.dirty || currentPassword?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="currentPassword?.errors?.['required']">Current password is required</div>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <div class="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  formControlName="newPassword"
                  class="form-input"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500': newPassword?.invalid && (newPassword?.dirty || newPassword?.touched)}"
                >
              </div>
              <div *ngIf="newPassword?.invalid && (newPassword?.dirty || newPassword?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="newPassword?.errors?.['required']">New password is required</div>
                <div *ngIf="newPassword?.errors?.['minlength']">Password must be at least 8 characters</div>
                <div *ngIf="newPassword?.errors?.['pattern']">
                  Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div class="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  formControlName="confirmPassword"
                  class="form-input"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500':
                    (confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)) ||
                    (passwordForm.errors?.['passwordMismatch'] && confirmPassword?.touched)}"
                >
              </div>
              <div *ngIf="confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="confirmPassword?.errors?.['required']">Confirm password is required</div>
              </div>
              <div *ngIf="passwordForm.errors?.['passwordMismatch'] && confirmPassword?.touched" class="mt-1 text-sm text-red-600">
                Passwords do not match
              </div>
            </div>

            <!-- Password Requirements -->
            <div class="rounded-md bg-blue-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Password requirements</h3>
                  <div class="mt-2 text-sm text-blue-700">
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
    </div>
  `
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  loading = false;
  isFirstLogin = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: [this.passwordMatchValidator] } as AbstractControlOptions);
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      this.notificationService.warning('Please log in first');
      return;
    }

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isFirstLogin = user.requirePasswordChange;
      }
    });
  }

  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
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
      error: () => {
        this.loading = false;
      }
    });
  }
}
