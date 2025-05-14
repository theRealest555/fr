import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <!-- Logo -->
        <div class="flex justify-center">
          <img class="h-12 w-auto" src="assets/images/logo.svg" alt="TE Connectivity" />
        </div>

        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Login to access the admin dashboard
        </p>

        <!-- Login Form -->
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <!-- Email Field -->
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                formControlName="email"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="text-red-500 text-xs mt-1 ml-1">
                <div *ngIf="email?.errors?.['required']">Email is required</div>
                <div *ngIf="email?.errors?.['email']">Please enter a valid email</div>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                formControlName="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="text-red-500 text-xs mt-1 ml-1">
                <div *ngIf="password?.errors?.['required']">Password is required</div>
              </div>
            </div>
          </div>

          <!-- Back to submission form link -->
          <div class="flex items-center justify-center">
            <a href="/" class="font-medium text-primary-600 hover:text-primary-500">
              ← Return to submission form
            </a>
          </div>

          <!-- Submit Button -->
          <div>
            <app-button
              type="submit"
              [loading]="loading"
              [disabled]="loginForm.invalid || loading"
              [fullWidth]="true"
            >
              Sign in
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    // Initialize form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // Getters for form controls
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;

        // Check if password change is required
        if (response.requirePasswordChange) {
          this.router.navigate(['/auth/change-password']);
          this.notificationService.info('Please change your password');
        } else {
          // Navigate to return URL
          this.router.navigate([this.returnUrl]);
          this.notificationService.success('Login successful');
        }
      },
      error: (error) => {
        this.loading = false;
        // Error is already handled by the interceptor
      }
    });
  }
}
