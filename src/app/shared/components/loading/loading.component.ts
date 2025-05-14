// src/app/shared/components/loading/loading.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div class="bg-white p-5 rounded-lg shadow-lg flex items-center space-x-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        <span class="text-gray-700 font-medium">Loading...</span>
      </div>
    </div>
  `
})
export class LoadingComponent implements OnInit {
  loading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe(loading => {
      this.loading = loading;
    });
  }
}
