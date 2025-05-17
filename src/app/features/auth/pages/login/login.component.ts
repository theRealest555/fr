// Updated Login Component with improved responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonComponent,
    ThemeToggleComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center py-10 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <!-- Background pattern - better positioned on mobile -->
      <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-0 right-0 -mt-8 sm:-mt-16 -mr-16 sm:-mr-32 w-40 sm:w-80 h-40 sm:h-80 bg-primary-500/10 dark:bg-primary-900/20 rounded-full"></div>
        <div class="absolute bottom-0 left-0 -mb-8 sm:-mb-16 -ml-16 sm:-ml-32 w-40 sm:w-80 h-40 sm:h-80 bg-primary-500/10 dark:bg-primary-900/20 rounded-full"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" class="text-primary-500/5 dark:text-primary-700/5">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="3" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <!-- Theme toggle - better positioned on mobile -->
      <div class="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
        <app-theme-toggle></app-theme-toggle>
      </div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <!-- Logo -->
        <div class="flex justify-center">
          <div class="relative flex items-center">
            <img src="assets/images/logo.png" alt="TE Connectivity Logo" class="h-12 sm:h-16 w-auto">
            <div class="absolute -top-1 -right-1 flex h-2 w-2 sm:h-3 sm:w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 sm:h-3 sm:w-3 bg-primary-500"></span>
            </div>
          </div>
        </div>
        <h2 class="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Admin Login</h2>
        <p class="mt-2 text-center text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Sign in to access the admin dashboard
        </p>
      </div>

      <div class="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div class="bg-white dark:bg-dark-800 py-6 sm:py-8 px-4 sm:px-10 shadow-lg dark:shadow-dark-lg sm:rounded-lg transition-colors duration-200 border border-gray-200 dark:border-dark-700 w-full">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4 sm:space-y-6">
            <!-- Email Field - Improved for mobile -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  formControlName="email"
                  class="form-input block w-full pl-10 sm:text-sm border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500': email?.invalid && (email?.dirty || email?.touched)}"
                  placeholder="admin@example.com"
                  inputmode="email"
                >
              </div>
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-500">
                <div *ngIf="email?.errors?.['required']">Email is required</div>
                <div *ngIf="email?.errors?.['email']">Please enter a valid email address</div>
              </div>
            </div>

            <!-- Password Field - Improved for mobile -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  formControlName="password"
                  class="form-input block w-full pl-10 pr-10 sm:text-sm border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                  [ngClass]="{'border-red-500 focus:ring-red-500 focus:border-red-500': password?.invalid && (password?.dirty || password?.touched)}"
                  placeholder="••••••••"
                >
                <!-- Toggle password visibility - larger touch target on mobile -->
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center h-full focus:outline-none"
                  style="min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;"
                  (click)="togglePasswordVisibility()"
                >
                  <svg *ngIf="!showPassword" class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                  </svg>
                  <svg *ngIf="showPassword" class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                </button>
              </div>
              <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="mt-1 text-sm text-red-600 dark:text-red-500">
                <div *ngIf="password?.errors?.['required']">Password is required</div>
              </div>
            </div>

            <!-- Links - Better spaced for mobile -->
            <div class="text-xs sm:text-sm flex justify-between flex-wrap">
              <a routerLink="/" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-150 mb-2 sm:mb-0">
                &larr; Return to public site
              </a>
              <a href="#" class="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-150">
                Forgot password?
              </a>
            </div>

            <!-- Submit Button - Full width on all screens for better touch target -->
            <div>
              <app-button
                type="submit"
                [loading]="loading"
                [disabled]="loginForm.invalid || loading"
                [fullWidth]="true"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign in
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Mobile-specific styles */
    @media (max-width: 640px) {
      :host ::ng-deep input {
        font-size: 16px !important; /* Prevents iOS zoom on input focus */
      }

      :host ::ng-deep button[type="button"] {
        /* Ensure minimum tap target size */
        padding: 8px;
      }
    }

    /* Fix for better mobile keyboard handling */
    @media (max-height: 600px) {
      .min-h-screen {
        min-height: 600px; /* Ensure min height on landscape with keyboard open */
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  showPassword = false;
  isDarkMode = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly notificationService: NotificationService,
    private readonly themeService: ThemeService
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

    // Get the current theme
    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Focus email field automatically (but after a delay on mobile to prevent keyboard popping up immediately)
    setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement;
      if (emailInput && window.innerWidth >= 640) { // Only auto-focus on non-mobile
        emailInput.focus();
      }
    }, 300);

    // Handle orientation changes on mobile
    window.addEventListener('orientationchange', () => {
      // Give time for browser UI to settle
      setTimeout(() => this.adjustForOrientation(), 300);
    });

    // Initial check
    this.adjustForOrientation();
  }

  // Adjust layout for different orientations
  adjustForOrientation(): void {
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isLandscape && window.innerHeight < 500) {
      // In landscape with limited height (keyboard likely open)
      // We could make adjustments here if needed
    }
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      // Mark fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
