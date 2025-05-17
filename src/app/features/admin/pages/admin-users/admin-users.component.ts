// src/app/features/admin/pages/admin-users/admin-users.component.ts
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
import { AdminStatusComponent } from '../../../../shared/components/admin-status/admin-status.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DataTableComponent,
    FilterComponent,
    AdminStatusComponent
],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Admin Users</h1>

        <div>
          <a
            routerLink="/admin/users/add"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Admin
          </a>
        </div>
      </div>

      <!-- Filters -->
      <app-filter 
        [filterConfig]="filterConfig" 
        (filtersApplied)="applyFilters($event)"
      ></app-filter>

      <!-- Admin Users Table -->
      <div class="bg-white shadow rounded-lg">
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
              class="text-blue-600 hover:text-blue-900"
            >
              Reset Password
            </button>
            <button
              (click)="deleteAdmin(admin.id, admin.fullName)"
              class="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </div>
        </ng-template>

        <!-- Status template for data table -->
        <ng-template #statusTemplate let-admin>
          <app-admin-status [requirePasswordChange]="admin.requirePasswordChange"></app-admin-status>
        </ng-template>

        <!-- Role template for data table -->
        <ng-template #roleTemplate let-admin>
          {{ admin.isSuperAdmin ? 'Super Admin' : 'Regular Admin' }}
        </ng-template>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Delete Admin User
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete the admin user "{{ adminToDelete.name }}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                (click)="confirmDelete()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                (click)="cancelDelete()"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Password Reset Modal -->
      <div *ngIf="showPasswordModal" class="fixed inset-0 overflow-y-auto z-50">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Password Reset Successful
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 mb-2">
                      The password has been reset successfully. Please provide the new password to the user.
                    </p>
                    <div class="bg-gray-100 p-2 rounded-md">
                      <p class="text-sm font-medium text-gray-900">New Password:</p>
                      <p class="text-sm text-gray-700 font-mono mt-1">{{ newPassword }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                (click)="closePasswordModal()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
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

  adminColumns = [
    { field: 'fullName', title: 'Name' },
    { field: 'email', title: 'Email' },
    { field: 'plantName', title: 'Plant' },
    {
      field: 'isSuperAdmin',
      title: 'Role',
      templateRef: 'roleTemplate'
    },
    {
      field: 'requirePasswordChange',
      title: 'Status',
      templateRef: 'statusTemplate'
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
    this.authService.deleteAdmin(this.adminToDelete.id).subscribe({
      next: () => {
        this.notificationService.success(`Admin "${this.adminToDelete.name}" deleted successfully`);
        this.loadAdmins(); // Reload the list
        this.showDeleteModal = false;
      },
      error: () => {
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