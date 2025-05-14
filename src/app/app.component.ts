import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { AuthService } from './core/services/auth.service';

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
    NotificationComponent
  ],
  template: `
    <div class="h-screen flex flex-col">
      <!-- Notifications -->
      <app-notification></app-notification>

      <!-- Public layout for unauthenticated users -->
      <div *ngIf="!isLoggedIn" class="h-full flex flex-col">
        <!-- Simple header with logo and login button -->
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex-shrink-0 flex items-center">
                <img src="assets/images/logo.svg" alt="TE Connectivity Logo" class="h-8">
                <span class="ml-2 text-lg font-semibold">TE Project</span>
              </div>
              <div class="flex items-center">
                <a
                  routerLink="/auth/login"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Admin Login
                </a>
              </div>
            </div>
          </div>
        </header>

        <!-- Main content -->
        <main class="flex-1 overflow-auto">
          <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <router-outlet></router-outlet>
            </div>
          </div>
        </main>

        <app-footer></app-footer>
      </div>

      <!-- Admin layout for authenticated users -->
      <div *ngIf="isLoggedIn" class="h-full flex flex-col">
        <app-header></app-header>

        <div class="flex-1 flex overflow-hidden">
          <!-- Sidebar -->
          <div class="w-64 flex-shrink-0 hidden lg:block">
            <app-sidebar></app-sidebar>
          </div>

          <!-- Main content -->
          <div class="flex-1 overflow-auto">
            <main class="py-6">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <router-outlet></router-outlet>
              </div>
            </main>
          </div>
        </div>

        <app-footer></app-footer>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Load the user profile if there's a token
    this.authService.loadUserProfile();

    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
