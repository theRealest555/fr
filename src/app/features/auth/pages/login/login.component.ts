import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
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
          <img src="assets/images/logo.png" alt="TE Connectivity Logo" class="h-16 w-auto">
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sign in to access the admin dashboard
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  formControlName="email"
                  class="form-input"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500': email?.invalid && (email?.dirty || email?.touched)}"
                  placeholder="admin@example.com"
                >
              </div>
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="email?.errors?.['required']">Email is required</div>
                <div *ngIf="email?.errors?.['email']">Please enter a valid email address</div>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="current-password"
                  formControlName="password"
                  class="form-input"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500': password?.invalid && (password?.dirty || password?.touched)}"
                  placeholder="••••••••"
                >
              </div>
              <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="mt-1 text-sm text-red-600">
                <div *ngIf="password?.errors?.['required']">Password is required</div>
              </div>
            </div>

            <!-- Back to Public Site Link -->
            <div class="text-sm">
              <a routerLink="/" class="font-medium text-primary-600 hover:text-primary-500">
                &larr; Return to public site
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
    </div>
  `
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService
  ) {
    // Initialize the form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/dashboard';
  }

  ngOnInit(): void {
    // If already logged in, redirect to return URL
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.requirePasswordChange) {
          this.router.navigate(['/auth/change-password']);
          this.notificationService.info('Please change your password');
        } else {
          this.router.navigate([this.returnUrl]);
          this.notificationService.success('Login successful');
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
