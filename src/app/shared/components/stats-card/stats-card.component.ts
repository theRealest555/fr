import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div class="flex items-center">
        <div [class]="'p-3 rounded-full ' + bgColorClass + ' ' + textColorClass">
          <ng-content select="[icon]"></ng-content>
        </div>
        <div class="ml-5">
          <p class="text-gray-500 text-sm">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ value }}</p>

          <div *ngIf="change !== undefined" class="mt-1">
            <span [class]="change >= 0 ? 'text-green-600' : 'text-red-600'" class="text-xs font-medium">
              <svg *ngIf="change >= 0" class="inline-block h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
              <svg *ngIf="change < 0" class="inline-block h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              {{ change >= 0 ? '+' : '' }}{{ change }}% {{ period }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StatsCardComponent {
  @Input() title = '';
  @Input() value: string | number = 0;
  @Input() colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red' = 'blue';
  @Input() change?: number;
  @Input() period = 'from last week';

  get bgColorClass(): string {
    switch (this.colorScheme) {
      case 'blue': return 'bg-blue-100';
      case 'green': return 'bg-green-100';
      case 'purple': return 'bg-purple-100';
      case 'orange': return 'bg-orange-100';
      case 'red': return 'bg-red-100';
      default: return 'bg-blue-100';
    }
  }

  get textColorClass(): string {
    switch (this.colorScheme) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      case 'red': return 'text-red-600';
      default: return 'text-blue-600';
    }
  }
}
