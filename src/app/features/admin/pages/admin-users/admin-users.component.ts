// Updated Admin-Users Component with Better Mobile Responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { PlantService } from '../../../../core/services/plant.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { User } from '../../../../core/models/auth.models';
import { Plant } from '../../../../core/models/data.models';
import { DataTableComponent } from '../../../../shared/components/data-table/data-table.component';
import { FilterComponent, FilterField } from '../../../../shared/components/filter/filter.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DataTableComponent,
    FilterComponent,
    ButtonComponent
  ],
  template: `
    <div>
      <!-- Header with improved responsive layout -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Admin Users</h1>

        <div class="w-full sm:w-auto">
          <a
            routerLink="/admin/users/add"
            class="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Admin
          </a>
        </div>
      </div>

      <!-- Filters - collapsible on mobile -->
      <div class="mb-6 bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg overflow-hidden transition-colors duration-200">
        <div class="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 dark:border-dark-700">
          <button 
            type="button" 
            class="w-full flex justify-between items-center text-left"
            (click)="toggleFilters()"
          >
            <h2 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <svg class="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </h2>
            <svg class="h-5 w-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-200" 
                [class.rotate-180]="!filtersCollapsed" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <div [class.hidden]="filtersCollapsed" class="px-4 py-4 sm:px-6 sm:py-5">
          <app-filter
            [filterConfig]="filterConfig"
            (filtersApplied)="applyFilters($event)"
          ></app-filter>
        </div>
      </div>

      <!-- Admin Users - Mobile Card View -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
        <!-- Mobile View: Card Layout -->
        <div class="md:hidden">
          <div class="px-4 py-4 border-b border-gray-200 dark:border-dark-700">
            <h3 class="text-base font-medium text-gray-900 dark:text-white">
              {{ filteredAdmins.length }} Admin Users
            </h3>
          </div>
          
          <div *ngIf="filteredAdmins.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
            No admin users found
          </div>
          
          <div *ngIf="filteredAdmins.length > 0" class="divide-y divide-gray-200 dark:divide-dark-700">
            <div *ngFor="let admin of filteredAdmins" 
                 class="p-4 hover:bg-gray-50 dark:hover:bg-dark-700/30 transition-colors duration-150">
              <div class="flex flex-col">
                <!-- Admin Name and Email -->
                <div class="mb-3">
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white">{{ admin.fullName }}</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ admin.email }}</p>
                </div>
                
                <!-- Plant and Role -->
                <div class="flex flex-wrap gap-2 mb-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200">
                    {{ admin.plantName }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="admin.isSuperAdmin 
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' 
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'">
                    {{ admin.isSuperAdmin ? 'Super Admin' : 'Regular Admin' }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [ngClass]="admin.requirePasswordChange 
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'">
                    {{ admin.requirePasswordChange ? 'Password Change Required' : 'Active' }}
                  </span>
                </div>
                
                <!-- Mobile Actions -->
                <div class="flex space-x-2">
                  <app-button
                    variant="secondary"
                    size="sm"
                    class="flex-1"
                    (onClick)="resetPassword(admin.id)"
                  >
                    Reset Password
                  </app-button>
                  <app-button
                    variant="danger"
                    size="sm"
                    class="flex-1"
                    (onClick)="deleteAdmin(admin.id, admin.fullName)"
                  >
                    Delete
                  </app-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop View: Table Layout -->
        <div class="hidden md:block">
          <app-data-table
            [columns]="adminColumns"
            [data]="filteredAdmins"
            [actionTemplate]="actionTemplate"
            emptyMessage="No admin users found"
          ></app-data-table>

          <!-- Action template for data table -->
          <ng-template #actionTemplate let-admin>
            <div class="flex space-x-2 justify-end">
              <button
                (click)="resetPassword(admin.id)"
                class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Reset Password
              </button>
              <button
                (click)="deleteAdmin(admin.id, admin.fullName)"
                class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                Delete
              </button>
            </div>
          </ng-template>
        </div>
      </div>

      <!-- Delete Confirmation Modal - improved for mobile -->
      <div *ngIf="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 dark:bg-dark-900 opacity-75 dark:opacity-80 backdrop-blur-sm"></div>
          </div>

          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-dark-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Delete Admin User
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete the admin user "{{ adminToDelete.name }}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <app-button
                type="button"
                variant="danger"
                [loading]="loading"
                (onClick)="confirmDelete()"
                class="w-full sm:w-auto mb-3 sm:mb-0 sm:ml-3"
              >
                Delete
              </app-button>
              <app-button
                type="button"
                variant="outline"
                (onClick)="cancelDelete()"
                class="w-full sm:w-auto"
              >
                Cancel
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Password Reset Modal - improved for mobile -->
      <div *ngIf="showPasswordModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 dark:bg-dark-900 opacity-75 dark:opacity-80 backdrop-blur-sm"></div>
          </div>

          <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl dark:shadow-dark-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
            <div class="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Password Reset Successful
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      The password has been reset successfully. Please provide the new password to the user.
                    </p>
                    <div class="bg-gray-100 dark:bg-dark-700 p-3 rounded-md overflow-x-auto">
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-300">New Password:</p>
                      <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-mono mt-1">{{ newPassword }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:px-6">
              <app-button
                type="button"
                variant="primary"
                (onClick)="closePasswordModal()"
                [fullWidth]="true"
                class="justify-center"
              >
                Close
              </app-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  admins: User[] = [];
  filteredAdmins: User[] = [];
  plants: Plant[] = [];
  filterConfig: FilterField[] = [];

  showDeleteModal = false;
  adminToDelete = { id: '', name: '' };

  showPasswordModal = false;
  newPassword = '';
  loading = false;
  filtersCollapsed = true; // For mobile filter toggle

  adminColumns = [
    { field: 'fullName', title: 'Name' },
    { field: 'email', title: 'Email' },
    { field: 'plantName', title: 'Plant' },
    {
      field: 'isSuperAdmin',
      title: 'Role',
      template: this.roleTemplate
    },
    {
      field: 'requirePasswordChange',
      title: 'Status',
      template: this.statusTemplate
    }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly plantService: PlantService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAdmins();
    this.loadPlants();

    // Check screen width to determine initial filters state
    this.filtersCollapsed = window.innerWidth < 768;
  }

  loadAdmins(): void {
    this.authService.getAllAdmins().subscribe(admins => {
      this.admins = admins;
      this.filteredAdmins = [...admins];
    });
  }

  loadPlants(): void {
    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
      
      // Set up filter configuration after plants are loaded
      this.setupFilterConfig();
    });
  }

  setupFilterConfig(): void {
    this.filterConfig = [
      {
        name: 'plantId',
        label: 'Plant',
        type: 'select',
        placeholder: 'All Plants',
        options: this.plants.map(plant => ({
          value: plant.id,
          label: plant.name
        }))
      },
      {
        name: 'isSuperAdmin',
        label: 'Role',
        type: 'select',
        placeholder: 'All Roles',
        options: [
          { value: 'true', label: 'Super Admin' },
          { value: 'false', label: 'Regular Admin' }
        ]
      },
      {
        name: 'search',
        label: 'Search',
        type: 'text',
        placeholder: 'Search by name or email'
      }
    ];
  }

  roleTemplate(admin: User): string {
    return admin.isSuperAdmin ? 'Super Admin' : 'Regular Admin';
  }

  statusTemplate(admin: User): string {
    return admin.requirePasswordChange 
      ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Password Change Required</span>'
      : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</span>';
  }

  toggleFilters(): void {
    this.filtersCollapsed = !this.filtersCollapsed;
  }

  applyFilters(filters: any): void {
    let filtered = [...this.admins];
    
    // Filter by plant
    if (filters.plantId) {
      filtered = filtered.filter(a => a.plantId === Number(filters.plantId));
    }

    // Filter by role
    if (filters.isSuperAdmin !== null && filters.isSuperAdmin !== undefined) {
      const isSuper = filters.isSuperAdmin === 'true';
      filtered = filtered.filter(a => a.isSuperAdmin === isSuper);
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(a =>
        a.fullName.toLowerCase().includes(searchTerm) ||
        a.email.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredAdmins = filtered;
  }

  resetPassword(userId: string): void {
    this.authService.resetPassword(userId).subscribe({
      next: (response) => {
        this.newPassword = response.newPassword;
        this.showPasswordModal = true;
      },
      error: () => {
        // Error is already handled by the interceptor
      }
    });
  }

  deleteAdmin(userId: string, fullName: string): void {
    this.adminToDelete = { id: userId, name: fullName };
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    this.loading = true;
    this.authService.deleteAdmin(this.adminToDelete.id).subscribe({
      next: () => {
        this.loading = false;
        this.notificationService.success(`Admin "${this.adminToDelete.name}" deleted successfully`);
        this.loadAdmins(); // Reload the list
        this.showDeleteModal = false;
      },
      error: () => {
        this.loading = false;
        this.showDeleteModal = false;
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.newPassword = '';
  }
}