import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Plant } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FilterComponent, FilterField } from '../../../../shared/components/filter/filter.component';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, FilterComponent],
  template: `
    <div>
      <!-- Header with add button -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Plants</h1>

        <div *ngIf="isSuperAdmin">
          <a routerLink="/plants/add" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800">
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Plant
          </a>
        </div>
      </div>

      <!-- Filter component -->
      <app-filter
        [filterConfig]="filterConfig"
        (filtersApplied)="applyFilters($event)"
      ></app-filter>

      <!-- Plants Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let plant of filteredPlants" class="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-md overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ plant.name }}</h2>
          </div>
          <div class="px-6 py-4">
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 h-10">
              {{ plant.description || 'No description provided' }}
            </p>
            <div class="flex justify-between items-center mt-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">ID: {{ plant.id }}</span>
              <a [routerLink]="['/plants', plant.id]" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 dark:border-primary-400"></div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && filteredPlants.length === 0" class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg p-6 text-center">
        <svg class="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No Plants Found</h2>
        <p class="text-gray-500 dark:text-gray-400">There are no plants matching your criteria.</p>

        <div *ngIf="isSuperAdmin" class="mt-4">
          <app-button
            routerLink="/plants/add"
            variant="primary"
          >
            Add Your First Plant
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = [];
  filteredPlants: Plant[] = [];
  loading = true;
  isSuperAdmin = false;
  filterConfig: FilterField[] = [];

  constructor(
    private readonly plantService: PlantService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isSuperAdmin = user?.isSuperAdmin || false;
    });

    this.loadPlants();
    this.setupFilterConfig();
  }

  setupFilterConfig(): void {
    this.filterConfig = [
      {
        name: 'search',
        label: 'Search',
        type: 'text',
        placeholder: 'Search by plant name or description'
      }
    ];
  }

  loadPlants(): void {
    this.loading = true;
    this.plantService.getAllPlants().subscribe({
      next: (plants) => {
        this.plants = plants;
        this.filteredPlants = plants;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(filters: any): void {
    let filtered = [...this.plants];

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm) ||
        plant.description?.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredPlants = filtered;
  }
}
