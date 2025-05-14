import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { AdminRoles, User } from '../../core/models/auth.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="h-full flex flex-col bg-gray-800 text-white">
      <div class="p-4 flex items-center">
        <img src="assets/images/logo.svg" alt="TE Connectivity Logo" class="h-8">
        <span class="ml-2 text-lg font-semibold">TE Project</span>
      </div>

      <div class="flex-1 overflow-auto">
        <nav class="mt-5 px-2 space-y-1">
          <!-- Dashboard -->
          <a routerLink="/dashboard"
             routerLinkActive="bg-gray-900 text-white"
             [routerLinkActiveOptions]="{exact: true}"
             class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </a>

          <!-- Export Data - For all admins -->
          <a routerLink="/exports"
             routerLinkActive="bg-gray-900 text-white"
             class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </a>

          <!-- Submissions - Only visible to SuperAdmin -->
          <a *ngIf="isSuperAdmin"
             routerLink="/submissions"
             routerLinkActive="bg-gray-900 text-white"
             class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            All Submissions
          </a>

          <!-- Plants - Only visible to SuperAdmin -->
          <a *ngIf="isSuperAdmin"
             routerLink="/plants"
             routerLinkActive="bg-gray-900 text-white"
             class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Plants
          </a>

          <!-- Admin Users - Only for Super Admins -->
          <a *ngIf="isSuperAdmin"
             routerLink="/admin/users"
             routerLinkActive="bg-gray-900 text-white"
             class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Admin Users
          </a>

          <!-- Profile -->
          <a routerLink="/profile"
             routerLinkActive="bg-gray-900 text-white"
             class="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-700">
            <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </a>
        </nav>
      </div>

      <!-- Assigned Plant Info -->
      <div *ngIf="currentUser" class="p-4 border-t border-gray-700">
        <div class="flex items-center">
          <svg class="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span class="text-sm font-medium text-gray-300">
            {{ currentUser.plantName || 'All Plants' }}
          </span>
        </div>
        <div class="mt-1 text-xs text-gray-400">
          {{ currentUser.isSuperAdmin ? 'Super Admin' : 'Regular Admin' }}
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isSuperAdmin = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isSuperAdmin = user?.isSuperAdmin || false;
    });
  }
}
