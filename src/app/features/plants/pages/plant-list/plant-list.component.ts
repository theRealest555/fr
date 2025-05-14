import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlantService } from '../../../../core/services/plant.service';
import { Plant } from '../../../../core/models/data.models';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 mb-6">Plants</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let plant of plants" class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900">{{ plant.name }}</h2>
          </div>
          <div class="px-6 py-4">
            <div class="flex justify-end">
              <a [routerLink]="['/plants', plant.id]" class="text-primary-600 hover:text-primary-900 font-medium">
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div *ngIf="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <!-- Empty state -->
      <div *ngIf="!loading && plants.length === 0" class="bg-white shadow rounded-lg p-6 text-center">
        <svg class="h-16 w-16 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h2 class="text-xl font-medium text-gray-900 mb-2">No Plants Found</h2>
        <p class="text-gray-500">There are no plants to display at this time.</p>
      </div>
    </div>
  `
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = [];
  loading = true;

  constructor(private readonly plantService: PlantService) {}

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.loading = true;
    this.plantService.getAllPlants().subscribe({
      next: (plants) => {
        this.plants = plants;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
