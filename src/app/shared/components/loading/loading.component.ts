import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30 dark:bg-opacity-50 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-lg flex flex-col items-center space-y-4 max-w-sm mx-auto transition-all duration-200">
        <div class="relative">
          <!-- Outer ring -->
          <div class="w-16 h-16 rounded-full border-4 border-primary-200 dark:border-primary-900 opacity-30"></div>

          <!-- Spinning inner ring -->
          <div class="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 dark:border-t-primary-400 animate-spin"></div>

          <!-- Center dot -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div class="w-4 h-4 bg-primary-500 dark:bg-primary-400 rounded-full"></div>
          </div>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300">Loading</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we process your request</p>
        </div>
      </div>
    </div>
  `
})
export class LoadingComponent implements OnInit {
  loading = false;

  constructor(private readonly loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
    });
  }
}
