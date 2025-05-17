// Updated Header Component with improved responsive design
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService } from '../../core/services/theme.service';
import { User } from '../../core/models/auth.models';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <header class="bg-white dark:bg-dark-800 shadow-sm dark:shadow-dark-sm sticky top-0 z-30 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Mobile menu button -->
            <div class="flex-shrink-0 flex items-center md:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                (click)="onToggleSidebar()"
                aria-controls="mobile-menu"
                [attr.aria-expanded]="sidebarOpen"
              >
                <span class="sr-only">{{ sidebarOpen ? 'Close sidebar' : 'Open sidebar' }}</span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <!-- Logo and title -->
            <div class="flex-shrink-0 flex items-center">
              <div class="relative flex items-center">
                <img class="w-auto" style="height: 32px; sm:height: 38px;" src="assets/images/logo.png" alt="TE Connectivity Logo">
                <div class="absolute -top-1 -right-1 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                </div>
              </div>
              <span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">TE Admin</span>
            </div>

            <!-- Desktop navigation links (if needed) -->
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <!-- Add quick links here if needed -->
            </div>
          </div>

          <!-- Right side items -->
          <div class="flex items-center space-x-2 sm:space-x-4">
            <!-- Theme Toggle -->
            <app-theme-toggle></app-theme-toggle>

            <!-- User dropdown -->
            <div class="relative" *ngIf="currentUser">
              <div>
                <button
                  type="button"
                  class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  (click)="toggleUserMenu()"
                >
                  <span class="sr-only">Open user menu</span>

                  <!-- User avatar/initials -->
                  <div class="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-md">
                    {{ currentUser.fullName.charAt(0) }}
                  </div>

                  <!-- User name (hidden on small screens) -->
                  <span class="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block group">
                    <div class="flex items-center">
                      {{ currentUser.fullName }}
                      <svg class="ml-1 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-150" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 font-normal hidden md:block">
                      {{ truncateEmail(currentUser.email) }}
                    </div>
                  </span>
                </button>
              </div>

              <!-- Dropdown menu -->
              <div
                *ngIf="isUserMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 dark:bg-dark-800 dark:ring-dark-600 transition-all duration-150 ease-out animate-fade-in"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <div class="px-4 py-2 border-b border-gray-100 dark:border-dark-700">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ currentUser.fullName }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 truncate w-40">{{ currentUser.email }}</div>
                </div>

                <a
                  routerLink="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                  role="menuitem"
                  tabindex="-1"
                  (click)="isUserMenuOpen = false"
                >
                  <div class="flex items-center">
                    <svg class="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </div>
                </a>
                <a
                  routerLink="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                  role="menuitem"
                  tabindex="-1"
                  (click)="isUserMenuOpen = false"
                >
                  <div class="flex items-center">
                    <svg class="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Your Profile
                  </div>
                </a>
                <button
                  type="button"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-700"
                  role="menuitem"
                  tabindex="-1"
                  (click)="logout()"
                >
                  <div class="flex items-center">
                    <svg class="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit {
  @Input() sidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  isUserMenuOpen = false;
  currentUser: User | null = null;
  isDarkMode = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: MouseEvent): void {
    if (this.isUserMenuOpen && !(event.target as Element).closest('#user-menu-button')) {
      this.isUserMenuOpen = false;
    }
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.notificationService.success('You have been successfully logged out');
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  truncateEmail(email: string): string {
    if (!email || email.length <= 20) return email;
    return email.substring(0, 20) + '...';
  }
}
