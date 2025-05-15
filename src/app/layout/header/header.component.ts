import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { User } from '../../core/models/auth.models';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Mobile menu button -->
            <div class="flex-shrink-0 flex items-center md:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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
              <img class=" w-auto" style="height: 50px;" src="assets/images/logo.png" alt="TE Connectivity Logo">
              <span class="ml-2 text-lg font-semibold text-gray-900 hidden sm:block">TE Admin</span>
            </div>

            <!-- Desktop navigation links (if needed) -->
            <div class="hidden md:ml-6 md:flex md:space-x-8">
              <!-- Add quick links here if needed -->
            </div>
          </div>

          <!-- Right side items -->
          <div class="flex items-center">
            <!-- User dropdown -->
            <div class="ml-3 relative" *ngIf="currentUser">
              <div>
                <button
                  type="button"
                  class="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  (click)="toggleUserMenu()"
                >
                  <span class="sr-only">Open user menu</span>

                  <!-- User avatar/initials -->
                  <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {{ currentUser.fullName.charAt(0) }}
                  </div>

                  <!-- User name -->
                  <span class="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {{ currentUser.fullName }}
                  </span>

                  <!-- Dropdown icon -->
                  <svg class="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <!-- Dropdown menu -->
              <div
                *ngIf="isUserMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
                <a
                  routerLink="/dashboard"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  (click)="isUserMenuOpen = false"
                >
                  Dashboard
                </a>
                <a
                  routerLink="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  (click)="isUserMenuOpen = false"
                >
                  Your Profile
                </a>
                <button
                  type="button"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                  (click)="logout()"
                >
                  Sign out
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.notificationService.success('You have been successfully logged out');
      },
      error: () => {
        // Error will be handled by the interceptor
        // Still navigate to login to ensure the user can log out
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
