// Fixed AppComponent with improved responsive layout
import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { LoadingComponent } from './shared/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NotificationComponent,
    LoadingComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      <!-- Global Components -->
      <app-notification></app-notification>
      <app-loading></app-loading>

      <!-- Admin Layout for authenticated users -->
      <div *ngIf="isLoggedIn" class="h-full flex flex-col">
        <!-- Admin Header -->
        <app-header [sidebarOpen]="sidebarOpen" (toggleSidebar)="toggleSidebar()"></app-header>

        <!-- Main Content with Sidebar -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar (Desktop) -->
          <div class="hidden md:block md:w-64 flex-shrink-0 transition-all duration-200">
            <app-sidebar></app-sidebar>
          </div>

          <!-- Sidebar (Mobile) - Fixed position overlay -->
          <div *ngIf="sidebarOpen"
              class="fixed inset-0 z-40 md:hidden">
            <!-- Overlay backdrop with blur effect -->
            <div class="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-dark-900 dark:bg-opacity-80 backdrop-blur-sm transition-all duration-200"
                 (click)="toggleSidebar()"></div>

            <!-- Sidebar content -->
            <div class="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 dark:bg-dark-900 h-full transform transition-transform ease-in-out duration-300"
                 (click)="$event.stopPropagation()">
              <!-- Close button -->
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button (click)="toggleSidebar()" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span class="sr-only">Close sidebar</span>
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- Sidebar component -->
              <app-sidebar></app-sidebar>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 overflow-auto bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
            <main class="py-4 sm:py-6">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <router-outlet></router-outlet>
              </div>
            </main>
          </div>
        </div>

        <!-- Footer -->
        <app-footer></app-footer>
      </div>

      <!-- Public Layout for unauthenticated users -->
      <div *ngIf="!isLoggedIn" class="h-full flex flex-col">
        <!-- Simple Public Header -->
        <header class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md transition-colors duration-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <!-- Logo -->
              <div class="flex-shrink-0 flex items-center">
                <div class="relative flex items-center">
                  <img src="assets/images/logo.png" alt="TE Connectivity Logo" class="h-10 w-auto sm:h-16">
                  <div class="absolute -top-1 -right-1 flex h-3 w-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                  </div>
                </div>
                <span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">TE Connectivity</span>
              </div>

              <!-- Mobile menu button -->
              <div class="sm:hidden flex items-center">
                <button
                  type="button"
                  class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  (click)="toggleMobileMenu()"
                >
                  <span class="sr-only">Open menu</span>
                  <svg
                    class="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>

              <!-- Navigation Links (Desktop) -->
              <div class="hidden sm:flex items-center space-x-4">
                <a routerLink="/" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-150">Home</a>
                <a routerLink="/submission-form" class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium transition-colors duration-150">Submit Documents</a>
                <div class="flex items-center space-x-2">
                  <button
                    (click)="toggleTheme()"
                    class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                    aria-label="Toggle dark mode"
                  >
                    <!-- Sun icon (light mode) -->
                    <svg *ngIf="isDarkMode" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <!-- Moon icon (dark mode) -->
                    <svg *ngIf="!isDarkMode" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                  <a routerLink="/auth/login" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-150 transform hover:shadow-md active:scale-95">
                    Admin Login
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile menu, show/hide based on menu state -->
          <div *ngIf="mobileMenuOpen" class="sm:hidden">
            <div class="pt-2 pb-3 space-y-1">
              <a routerLink="/"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 text-base font-medium"
                (click)="mobileMenuOpen = false"
              >
                Home
              </a>
              <a routerLink="/submission-form"
                class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 block px-3 py-2 text-base font-medium"
                (click)="mobileMenuOpen = false"
              >
                Submit Documents
              </a>
              <div class="flex items-center px-3 py-2 justify-between">
                <button
                  (click)="toggleTheme()"
                  class="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                  aria-label="Toggle dark mode"
                >
                  <!-- Sun icon (light mode) -->
                  <svg *ngIf="isDarkMode" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <!-- Moon icon (dark mode) -->
                  <svg *ngIf="!isDarkMode" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
                <a routerLink="/auth/login"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  (click)="mobileMenuOpen = false"
                >
                  Admin Login
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <router-outlet></router-outlet>
          </div>
        </main>

        <!-- Footer -->
        <app-footer></app-footer>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  sidebarOpen = false;
  isDarkMode = false;
  mobileMenuOpen = false;

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Subscribe to auth state
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    if (this.authService.isAuthenticated()) {
      this.authService.loadUserProfile();
    }

    // Subscribe to theme changes
    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Add listener for screen size changes
    this.setupResponsiveListeners();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;

    // When sidebar is open on mobile, prevent body scrolling
    if (this.sidebarOpen) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    } else {
      this.renderer.removeClass(document.body, 'overflow-hidden');
    }
  }

  // Close sidebar automatically when screen size changes to desktop
  private setupResponsiveListeners(): void {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches && this.sidebarOpen) {
        this.sidebarOpen = false;
        this.renderer.removeClass(document.body, 'overflow-hidden');
      }
    };

    // Initial check
    handleMediaChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaChange);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}