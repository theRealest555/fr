import { Component, OnInit } from '@angular/core';
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
            <div class="flex-shrink-0 flex items-center">
              <!-- Mobile menu button -->
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 lg:hidden hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                (click)="toggleSidebar()"
              >
                <span class="sr-only">Open sidebar</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center">
            <div class="relative" *ngIf="currentUser">
              <div>
                <button
                  type="button"
                  class="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="user-menu-button"
                  [attr.aria-expanded]="isUserMenuOpen"
                  aria-haspopup="true"
                  (click)="toggleUserMenu()"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {{ currentUser.fullName.charAt(0) }}
                  </div>
                  <span class="ml-3 text-gray-700">{{ currentUser.fullName }}</span>
                  <svg class="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>

              <!-- User dropdown menu -->
              <div
                *ngIf="isUserMenuOpen"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                tabindex="-1"
              >
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
  isUserMenuOpen = false;
  isSidebarOpen = false;
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

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    // Emit an event or use a service to inform other components about the sidebar state
  }

  logout(): void {
    this.isUserMenuOpen = false;
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
        this.notificationService.success('You have been successfully logged out');
      },
      error: () => {
        // Error is already handled by the interceptor
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
