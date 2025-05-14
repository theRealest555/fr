// src/app/features/dashboard/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Submission, Plant } from '../../../../core/models/data.models';
import { User } from '../../../../core/models/auth.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StatsCardComponent } from '../../components/stat-cards/stats-card.component';
import { SubmissionsChartComponent } from '../../components/charts/submissions-chart/submissions-chart.component';
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
  templateUrl: './dashboard.component.html'
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
    this.plantService.getAllPlants().subscribe({
      next: plants => {
        this.plants = plants;
      },
      error: () => {
        this.plants = [];
      }
    });

    // Load submissions based on user role
    if (this.isSuperAdmin) {
      this.submissionService.getRecentSubmissions(5).subscribe({
        next: submissions => {
          this.recentSubmissions = submissions.slice(0, 5); // Show only 5 most recent
          this.totalSubmissions = submissions.length;
          this.withGreyCard = submissions.filter(s => s.greyCard && s.greyCard.trim() !== '').length;
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
    return new Date(dateString).toLocaleString();
  }
}
