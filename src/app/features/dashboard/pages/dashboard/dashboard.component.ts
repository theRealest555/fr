import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Submission, Plant } from '../../../../core/models/data.models';
import { User } from '../../../../core/models/auth.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StatsCardComponent } from '../../../../shared/components/stats-card/stats-card.component';
import { SubmissionsChartComponent } from '../../../../shared/components/submissions-chart/submissions-chart.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent,
    StatsCardComponent,
    SubmissionsChartComponent
  ],
  template: `
    <div>
      <!-- Welcome Banner -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg p-6 mb-6 transition-colors duration-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="mb-4 md:mb-0">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Welcome, {{ currentUser?.fullName }}</h1>
            <p class="mt-1 text-gray-600 dark:text-gray-300">
              {{ welcomeMessage }}
            </p>
          </div>
          <div class="flex space-x-2">
            <app-button
              type="button"
              variant="secondary"
              routerLink="/profile"
            >
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </app-button>
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
        <app-stats-card
          title="Total Submissions"
          [value]="totalSubmissions"
          colorScheme="blue"
          [showProgress]="true"
          [progressValue]="calculateProgress()"
          description="Total documents submitted">
          <svg icon class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </app-stats-card>

        <!-- With Grey Card -->
        <app-stats-card
          title="With Grey Card"
          [value]="withGreyCard"
          colorScheme="green"
          [change]="calculateGreyCardChange()"
          period="vs. previous period">
          <svg icon class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </app-stats-card>

        <!-- Plant Info -->
        <app-stats-card
          [title]="isSuperAdmin ? 'Total Plants' : 'Your Plant'"
          [value]="isSuperAdmin ? plants.length : (currentUser?.plantName ?? '')"
          colorScheme="purple">
          <svg icon class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </app-stats-card>
      </div>

      <!-- Add submissions chart -->
      <div class="mb-6">
        <app-submissions-chart [submissions]="recentSubmissions"></app-submissions-chart>
      </div>

      <!-- Recent Submissions -->
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Recent Submissions</h2>
          <a routerLink="/submissions" class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
            View all
          </a>
        </div>
        <div class="p-6">
          <div *ngIf="loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 dark:border-primary-400"></div>
          </div>

          <div *ngIf="!loading && recentSubmissions.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
            No submissions found
          </div>

          <div *ngIf="!loading && recentSubmissions.length > 0">
            <ul class="divide-y divide-gray-200 dark:divide-dark-700">
              <li *ngFor="let submission of recentSubmissions; let i = index"
                  class="py-4 hover:bg-gray-50 dark:hover:bg-dark-700/50 rounded-md transition-colors duration-150 -mx-2 px-2">
                <div class="flex justify-between">
                  <div>
                    <a [routerLink]="['/submissions', submission.id]"
                       class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                      {{ submission.firstName }} {{ submission.lastName }}
                    </a>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ submission.teId }} - {{ submission.cin }}</p>
                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center flex-wrap">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-dark-700 text-gray-800 dark:text-gray-200 mr-2">
                        {{ submission.plantName }}
                      </span>
                      <span *ngIf="submission.greyCard" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                        Grey Card: {{ submission.greyCard }}
                      </span>
                    </div>
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <span class="inline-flex items-center">
                      <svg class="mr-1.5 h-4 w-4 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatDate(submission.createdAt) }}
                    </span>
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
      <div *ngIf="isSuperAdmin" class="mt-6 bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Admin Actions</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a routerLink="/admin/users/add"
               class="flex items-center justify-center p-5 bg-gray-50 dark:bg-dark-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-150 shadow-sm dark:shadow-dark-sm">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                  <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span class="text-gray-900 dark:text-white font-medium">Add New Admin</span>
              </div>
            </a>
            <a routerLink="/plants"
               class="flex items-center justify-center p-5 bg-gray-50 dark:bg-dark-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-150 shadow-sm dark:shadow-dark-sm">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                  <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span class="text-gray-900 dark:text-white font-medium">Manage Plants</span>
              </div>
            </a>
            <a routerLink="/exports"
               class="flex items-center justify-center p-5 bg-gray-50 dark:bg-dark-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-150 shadow-sm dark:shadow-dark-sm">
              <div class="flex items-center">
                <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                  <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span class="text-gray-900 dark:text-white font-medium">Export Data</span>
              </div>
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

  totalSubmissions = 0;
  withGreyCard = 0;
  welcomeMessage = '';

  // For simulated metrics
  previousPeriodGreyCards = 0;

  constructor(
    private readonly submissionService: SubmissionService,
    private readonly plantService: PlantService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isSuperAdmin = user?.isSuperAdmin || false;

      if (this.isSuperAdmin) {
        this.welcomeMessage = 'Welcome to the dashboard. As a Super Admin, you have access to all plants and can manage admin users.';
      } else {
        this.welcomeMessage = `Welcome to the dashboard. You are assigned to ${user?.plantName}. You can manage submissions for your plant.`;
      }
      this.loadData();
    });
  }

  loadData(): void {
    this.loading = true;

    this.plantService.getAllPlants().subscribe({
      next: plants => {
        this.plants = plants;
      },
      error: () => {
        this.plants = [];
      }
    });

    if (this.isSuperAdmin) {
      this.submissionService.getRecentSubmissions(5).subscribe({
        next: submissions => {
          this.recentSubmissions = submissions.slice(0, 5); // Show only 5 most recent
          this.totalSubmissions = submissions.length;
          this.withGreyCard = submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;

          // Simulate previous period data for the metrics
          this.previousPeriodGreyCards = Math.floor(this.withGreyCard * (0.7 + Math.random() * 0.5));

          this.loading = false;
        },
        error: () => {
          this.recentSubmissions = [];
          this.loading = false;
        }
      });
    } else if (this.currentUser?.plantId) {
      this.submissionService.getRecentSubmissionsByPlant(this.currentUser.plantId, 5).subscribe({
        next: submissions => {
          this.recentSubmissions = submissions.slice(0, 5); // Show only 5 most recent
          this.totalSubmissions = submissions.length;
          this.withGreyCard = submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;

          // Simulate previous period data for the metrics
          this.previousPeriodGreyCards = Math.floor(this.withGreyCard * (0.7 + Math.random() * 0.5));

          this.loading = false;
        },
        error: () => {
          this.recentSubmissions = [];
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy HH:mm');
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  }

  calculateProgress(): number {
    // This is a simulated metric - in a real app would be based on actual targets
    const targetSubmissions = 100; // Example target
    return Math.min(100, Math.round((this.totalSubmissions / targetSubmissions) * 100));
  }

  calculateGreyCardChange(): number {
    if (this.previousPeriodGreyCards === 0) return 0;

    const percentChange = ((this.withGreyCard - this.previousPeriodGreyCards) / this.previousPeriodGreyCards) * 100;
    return Math.round(percentChange);
  }
}
