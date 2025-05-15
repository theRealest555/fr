import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from './core/services/auth.service';
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
    <div class="h-screen flex flex-col">
      <!-- Global Components -->
      <app-notification></app-notification>
      <app-loading></app-loading>

      <!-- Public Layout for unauthenticated users -->
      <div *ngIf="!isLoggedIn" class="h-full flex flex-col">
        <!-- Simple Public Header -->
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <!-- Logo -->
              <div class="flex-shrink-0 flex items-center">
                <img src="assets/images/logo.svg" alt="TE Connectivity Logo" class="h-8 w-auto">
                <span class="ml-2 text-lg font-semibold text-gray-900">TE Connectivity</span>
              </div>

              <!-- Navigation Links -->
              <div class="flex items-center space-x-4">
                <a routerLink="/" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</a>
                <a routerLink="/submission-form" class="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">Submit Documents</a>
                <a routerLink="/auth/login" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
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

      <!-- Admin Layout for authenticated users -->
      <div *ngIf="isLoggedIn" class="h-full flex flex-col">
        <!-- Admin Header -->
        <app-header [sidebarOpen]="sidebarOpen" (toggleSidebar)="toggleSidebar()"></app-header>

        <!-- Main Content with Sidebar -->
        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar (Desktop) -->
          <div class="hidden md:block md:w-64 flex-shrink-0">
            <app-sidebar></app-sidebar>
          </div>

          <!-- Sidebar (Mobile) -->
          <div *ngIf="sidebarOpen" class="fixed inset-0 z-40 md:hidden">
            <!-- Overlay -->
            <div class="fixed inset-0 bg-gray-600 bg-opacity-75" (click)="toggleSidebar()"></div>

            <!-- Sidebar -->
            <div class="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 h-full">
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button (click)="toggleSidebar()" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span class="sr-only">Close sidebar</span>
                  <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <app-sidebar></app-sidebar>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 overflow-auto">
            <main class="py-6">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <router-outlet></router-outlet>
              </div>
            </main>
          </div>
        </div>

        <!-- Footer -->
        <app-footer></app-footer>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  sidebarOpen = false;

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    if (this.authService.isAuthenticated()) {
      this.authService.loadUserProfile();
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
