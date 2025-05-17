import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg p-6 hover:shadow-md dark:hover:shadow-dark-lg transition-all duration-200 border border-gray-100 dark:border-dark-700 relative overflow-hidden">
      <!-- Background pattern (optional) -->
      <div *ngIf="showPattern" class="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <svg class="absolute right-0 top-0 h-24 w-24 transform translate-x-1/3 -translate-y-1/3 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path [attr.d]="getPatternPath()"></path>
        </svg>
      </div>

      <div class="flex items-start relative">
        <!-- Icon container -->
        <div [class]="'p-3 rounded-lg ' + bgColorClass + ' ' + textColorClass + ' shadow-sm transform transition-transform hover:scale-105 dark:shadow-dark-sm'">
          <ng-content select="[icon]"></ng-content>
        </div>

        <div class="ml-5 flex-1">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ title }}</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white group">
                <span>{{ value }}</span>
                <span *ngIf="showChangeIndicator && change !== undefined"
                      [class]="change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                      class="text-sm font-medium ml-2 transition-opacity">
                  <svg *ngIf="change >= 0" class="inline-block h-4 w-4 mr-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <svg *ngIf="change < 0" class="inline-block h-4 w-4 mr-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  {{ change >= 0 ? '+' : '' }}{{ change }}%
                </span>
              </p>
            </div>

            <!-- Optional visual indicator -->
            <div *ngIf="showProgress" class="ml-2">
              <svg class="h-9 w-9" viewBox="0 0 36 36">
                <path
                  class="stroke-current text-gray-200 dark:text-dark-600"
                  fill="none"
                  stroke-width="3.8"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  [class]="textColorClass"
                  fill="none"
                  stroke-width="3.8"
                  [attr.stroke-dasharray]="getProgressDashArray()"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.5" class="text-xs font-medium dark:fill-white fill-gray-800" text-anchor="middle">
                  {{ getProgressPercentage() }}%
                </text>
              </svg>
            </div>
          </div>

          <div *ngIf="description" class="mt-1">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ description }}</p>
          </div>

          <div *ngIf="change !== undefined && period" class="mt-1">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ period }}
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
  @Input() colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'pink' | 'yellow' | 'teal' = 'blue';
  @Input() change?: number;
  @Input() period = 'from last week';
  @Input() description?: string;
  @Input() showPattern = true;
  @Input() showProgress = false;
  @Input() showChangeIndicator = true;
  @Input() progressValue = 0; // 0-100 percentage

  get bgColorClass(): string {
    switch (this.colorScheme) {
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/50';
      case 'green': return 'bg-green-100 dark:bg-green-900/50';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/50';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900/50';
      case 'red': return 'bg-red-100 dark:bg-red-900/50';
      case 'indigo': return 'bg-indigo-100 dark:bg-indigo-900/50';
      case 'pink': return 'bg-pink-100 dark:bg-pink-900/50';
      case 'yellow': return 'bg-yellow-100 dark:bg-yellow-900/50';
      case 'teal': return 'bg-teal-100 dark:bg-teal-900/50';
      default: return 'bg-blue-100 dark:bg-blue-900/50';
    }
  }

  get textColorClass(): string {
    switch (this.colorScheme) {
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'red': return 'text-red-600 dark:text-red-400';
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
      case 'pink': return 'text-pink-600 dark:text-pink-400';
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400';
      case 'teal': return 'text-teal-600 dark:text-teal-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  }

  getPatternPath(): string {
    // Different patterns for different color schemes
    switch (this.colorScheme) {
      case 'blue':
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h-2v2h4v-8z';
      case 'green':
        return 'M17.66 8L12 2.35 6.34 8C4.78 9.56 4 11.64 4 13.64s.78 4.11 2.34 5.67 3.61 2.35 5.66 2.35 4.1-.79 5.66-2.35S20 15.64 20 13.64 19.22 9.56 17.66 8zM6 14c.01-2 .62-3.27 1.76-4.4L12 5.27l4.24 4.38C17.38 10.77 17.99 12 18 14H6z';
      case 'purple':
        return 'M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 16c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z';
      case 'orange':
        return 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';
      case 'red':
        return 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z';
      case 'indigo':
        return 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z';
      case 'pink':
        return 'M10.8 4.9c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v5.8h-6.2V4.9zm6.2 8V18c0 1.71-1.39 3.1-3.1 3.1s-3.1-1.39-3.1-3.1v-5.1h6.2z';
      case 'yellow':
        return 'M12 7.27L16.28 17.7H7.72L12 7.27z';
      case 'teal':
        return 'M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';
      default:
        return 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z';
    }
  }

  getProgressDashArray(): string {
    // Calculate percentage for the circular progress
    const value = this.progressValue || 0;
    const circumference = 2 * Math.PI * 15.9155; // Radius is 15.9155 in the SVG
    const progressLength = (value / 100) * circumference;
    return `${progressLength} ${circumference}`;
  }

  getProgressPercentage(): number {
    return Math.round(this.progressValue || 0);
  }
}
