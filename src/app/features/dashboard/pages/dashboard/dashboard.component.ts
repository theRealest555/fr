import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Submission, Plant } from '../../../../core/models/data.models';
import { User } from '../../../../core/models/auth.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent
  ],
  template: `
    <div>
      <!-- Welcome Banner -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">Welcome, {{ currentUser?.fullName }}</h1>
            <p class="mt-1 text-gray-600">
              {{ welcomeMessage }}
            </p>
          </div>
          <div>
            <app-button
              type="button"
              variant="primary"
              routerLink="/exports"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </app-button>
          </div>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Total Submissions -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-gray-500 text-sm">Total Submissions</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalSubmissions }}</p>
            </div>
          </div>
        </div>

        <!-- With Grey Card -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-gray-500 text-sm">With Grey Card</p>
              <p class="text-2xl font-bold text-gray-900">{{ withGreyCard }}</p>
            </div>
          </div>
        </div>

        <!-- Plant Info -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-5">
              <p class="text-gray-500 text-sm">{{ isSuperAdmin ? 'Total Plants' : 'Your Plant' }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ isSuperAdmin ? plants.length : currentUser?.plantName }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Submissions -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Recent Submissions</h2>
          <a routerLink="/submissions" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            View all
          </a>
        </div>
        <div class="p-6">
          <div *ngIf="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>

          <div *ngIf="!loading && recentSubmissions.length === 0" class="text-center py-4 text-gray-500">
            No submissions found
          </div>

          <div *ngIf="!loading && recentSubmissions.length > 0">
            <ul class="divide-y divide-gray-200">
              <li *ngFor="let submission of recentSubmissions" class="py-4">
                <div class="flex justify-between">
                  <div>
                    <a [routerLink]="['/submissions', submission.id]" class="text-primary-600 hover:text-primary-900 font-medium">
                      {{ submission.fullName }}
                    </a>
                    <p class="text-sm text-gray-500">{{ submission.teId }} - {{ submission.cin }}</p>
                    <p class="text-sm text-gray-500">
                      Plant: {{ submission.plantName }}
                      <span *ngIf="submission.greyCard" class="ml-3">
                        Grey Card: {{ submission.greyCard }}
                      </span>
                    </p>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(submission.createdAt) }}
                  </div>
                </div>
              </li>
            </ul>

            <div class="mt-6 flex justify-center">
              <app-button
                type="button"
                routerLink="/submissions"
                variant="outline"
              >
                View All Submissions
              </app-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links For Super Admins -->
      <div *ngIf="isSuperAdmin" class="mt-6 bg-white shadow rounded-lg">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Admin Actions</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a routerLink="/admin/users/add" class="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="h-6 w-6 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span class="text-gray-900 font-medium">Add New Admin</span>
            </a>
            <a routerLink="/plants" class="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="h-6 w-6 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="text-gray-900 font-medium">Manage Plants</span>
            </a>
            <a routerLink="/exports" class="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="h-6 w-6 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-gray-900 font-medium">Export Data</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentSubmissions: Submission[] = [];
  plants: Plant[] = [];
  loading = true;
  isSuperAdmin = false;

  // Statistics
  totalSubmissions = 0;
  withGreyCard = 0;
  welcomeMessage = '';

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly plantService: PlantService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isSuperAdmin = user?.isSuperAdmin || false;

      // Set welcome message based on role
      if (this.isSuperAdmin) {
        this.welcomeMessage = 'Welcome to the dashboard. As a Super Admin, you have access to all plants and can manage admin users.';
      } else {
        this.welcomeMessage = `Welcome to the dashboard. You are assigned to ${user?.plantName}. You can manage submissions for your plant.`;
      }

      // Load data based on user role
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;

    // Load plants for statistics
    this.plantService.getAllPlants().subscribe(plants => {
      this.plants = plants;
    });

    // Load submissions based on user role
    if (this.isSuperAdmin) {
      this.submissionService.getRecentSubmissions(5).subscribe(submissions => {
        this.recentSubmissions = submissions.slice(0, 5); // Show only 5 most recent
        this.totalSubmissions = submissions.length;
        this.withGreyCard = submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;
        this.loading = false;
      });
    } else if (this.currentUser?.plantId) {
      this.submissionService.getRecentSubmissionsByPlant(this.currentUser.plantId, 5).subscribe(submissions => {
        this.recentSubmissions = submissions.slice(0, 5); // Show only 5 most recent
        this.totalSubmissions = submissions.length;
        this.withGreyCard = submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}
