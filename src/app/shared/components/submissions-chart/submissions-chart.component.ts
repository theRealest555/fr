import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Submission } from '../../../core/models/data.models';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-submissions-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg overflow-hidden transition-colors duration-200">
      <div class="px-6 py-5 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">Submissions Over Time</h2>

        <!-- Chart type toggle -->
        <div class="flex rounded-md shadow-sm">
          <button
            (click)="setChartType('bar')"
            [class]="chartType === 'bar'
              ? 'relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-sm font-medium text-primary-700 dark:text-primary-300'
              : 'relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600'"
          >
            Bar
          </button>
          <button
            (click)="setChartType('line')"
            [class]="chartType === 'line'
              ? 'relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-sm font-medium text-primary-700 dark:text-primary-300'
              : 'relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-600'"
          >
            Line
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Chart Canvas -->
        <div class="relative h-64">
          <!-- Bar Chart -->
          <div *ngIf="chartType === 'bar'" class="h-full flex items-end space-x-2">
            <div *ngFor="let count of weeklyCounts; let i = index" class="flex-1 flex flex-col items-center">
              <!-- Bar -->
              <div class="relative w-full group">
                <div
                  class="w-full bg-primary-100 dark:bg-primary-900/20 rounded-t transition-all duration-300 ease-out"
                  [style.height.%]="0"
                  #barElement
                  [attr.data-height]="getPercentage(count)"
                  [attr.data-count]="count"
                >
                </div>

                <!-- Tooltip -->
                <div *ngIf="count > 0" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div class="bg-gray-900 dark:bg-dark-600 text-white text-xs rounded py-1 px-2">
                    {{ count }} submissions
                  </div>
                  <div class="w-2 h-2 bg-gray-900 dark:bg-dark-600 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>

              <!-- X-axis label -->
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {{ weekDays[i] }}
              </div>
            </div>
          </div>

          <!-- Line Chart -->
          <div *ngIf="chartType === 'line'" class="h-full relative">
            <!-- Horizontal grid lines -->
            <div *ngFor="let _ of [0,1,2,3,4]" class="absolute border-b border-gray-200 dark:border-dark-700 w-full"
                 [style.bottom.%]="_ * 25"></div>

            <!-- Line chart will be drawn with SVG -->
            <svg class="absolute inset-0 w-full h-full" #lineChart>
              <path
                [attr.d]="getLinePath()"
                class="stroke-primary-500 dark:stroke-primary-400 fill-none transition-all duration-300 ease-out"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                [attr.d]="getLinePath()"
                class="stroke-primary-500/10 dark:stroke-primary-400/10 fill-primary-100/50 dark:fill-primary-900/20 transition-all duration-300 ease-out"
                stroke-width="0"
              ></path>
              <!-- Data points -->
              <g *ngFor="let count of weeklyCounts; let i = index">
                <circle
                  *ngIf="count > 0"
                  [attr.cx]="getPointX(i)"
                  [attr.cy]="getPointY(count)"
                  r="4"
                  class="fill-white dark:fill-dark-800 stroke-primary-500 dark:stroke-primary-400 stroke-2"
                ></circle>
              </g>
            </svg>

            <!-- X-axis labels -->
            <div class="absolute bottom-0 inset-x-0 flex justify-between px-2 pt-2 border-t border-gray-200 dark:border-dark-700">
              <div *ngFor="let day of weekDays" class="text-xs text-gray-500 dark:text-gray-400">
                {{ day }}
              </div>
            </div>
          </div>
        </div>

        <!-- Legend / Summary -->
        <div class="mt-6 flex justify-between items-center">
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-primary-500 dark:bg-primary-400 mr-2"></div>
            <span class="text-sm text-gray-700 dark:text-gray-300">Submissions</span>
          </div>
          <div class="flex space-x-6">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total this week: <span class="font-semibold text-gray-900 dark:text-white">{{ totalThisWeek }}</span>
            </div>
            <div>
              <span [class]="weeklyChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" class="text-sm font-semibold">
                {{ weeklyChange >= 0 ? '+' : ''}}{{ weeklyChange }}%
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">vs last week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes growHeight {
      from { height: 0%; }
      to { height: var(--target-height); }
    }

    @keyframes drawLine {
      from { stroke-dashoffset: 1000; }
      to { stroke-dashoffset: 0; }
    }
  `]
})
export class SubmissionsChartComponent implements OnInit, AfterViewInit {
  @Input() submissions: Submission[] = [];
  @ViewChild('lineChart') lineChartElement!: ElementRef<SVGElement>;
  @ViewChild('barElement', {static: false, read: ElementRef}) barElements!: ElementRef[];

  weeklyCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  maxCount = 0;
  totalThisWeek = 0;
  weeklyChange = 0;
  chartType: 'bar' | 'line' = 'bar';
  chartWidth = 0;
  chartHeight = 0;
  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.processData();

    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animateChart();
    }, 100);
  }

  processData(): void {
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    let lastWeekTotal = 0;

    // Reset counts
    this.weeklyCounts = [0, 0, 0, 0, 0, 0, 0];

    // Process submissions
    this.submissions.forEach(submission => {
      const submissionDate = new Date(submission.createdAt);

      if (submissionDate >= oneWeekAgo && submissionDate <= now) {
        // This week
        const dayOfWeek = submissionDate.getDay(); // 0 = Sunday, 6 = Saturday
        this.weeklyCounts[dayOfWeek]++;
        this.totalThisWeek++;
      } else if (submissionDate >= twoWeeksAgo && submissionDate < oneWeekAgo) {
        // Last week
        lastWeekTotal++;
      }
    });

    // Calculate max count for scaling
    this.maxCount = Math.max(...this.weeklyCounts, 1); // Ensure at least 1 to avoid division by zero

    // Calculate weekly change percentage
    if (lastWeekTotal > 0) {
      this.weeklyChange = Math.round((this.totalThisWeek - lastWeekTotal) / lastWeekTotal * 100);
    } else {
      this.weeklyChange = this.totalThisWeek > 0 ? 100 : 0;
    }
  }

  getPercentage(count: number): number {
    if (this.maxCount <= 0) return 0;
    return Math.max(5, (count / this.maxCount) * 100); // At least 5% height for visibility
  }

  setChartType(type: 'bar' | 'line'): void {
    this.chartType = type;

    // Need to wait for the new chart to be rendered
    setTimeout(() => {
      this.animateChart();
    }, 50);
  }

  // Animation for bars and line chart
  animateChart(): void {
    if (this.chartType === 'bar') {
      // Find all bar elements and animate them
      const bars = document.querySelectorAll('[data-height]');
      bars.forEach(bar => {
        const targetHeight = bar.getAttribute('data-height') + '%';
        (bar as HTMLElement).style.setProperty('--target-height', targetHeight);
        (bar as HTMLElement).style.animation = 'growHeight 1s ease-out forwards';
        (bar as HTMLElement).style.height = targetHeight;
      });
    } else if (this.chartType === 'line' && this.lineChartElement) {
      // Animate the line path with dash offset
      const path = this.lineChartElement.nativeElement.querySelector('path');
      if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length.toString();
        path.style.strokeDashoffset = length.toString();
        path.style.animation = 'drawLine 1.5s ease-out forwards';
      }
    }
  }

  // Line chart calculations
  getLinePath(): string {
    if (!this.weeklyCounts.length) return '';

    // Calculate points for the line
    let path = '';
    const width = 100; // Use percentage for responsive design
    const height = 100;
    const padding = 10; // Percentage padding

    const effectiveWidth = width - (padding * 2);
    const effectiveHeight = height - (padding * 2);
    const step = effectiveWidth / (this.weeklyCounts.length - 1);

    // Start path at the first point
    if (this.weeklyCounts.length > 0) {
      const x = padding;
      const y = height - padding - (this.weeklyCounts[0] / this.maxCount) * effectiveHeight;
      path = `M ${x},${y}`;

      // Add line to each subsequent point
      for (let i = 1; i < this.weeklyCounts.length; i++) {
        const x = padding + (i * step);
        const y = height - padding - (this.weeklyCounts[i] / this.maxCount) * effectiveHeight;
        path += ` L ${x},${y}`;
      }

      // Close the path to the bottom for fill
      path += ` L ${padding + ((this.weeklyCounts.length - 1) * step)},${height - padding}`;
      path += ` L ${padding},${height - padding} Z`;
    }

    return path;
  }

  getPointX(index: number): number {
    const width = 100;
    const padding = 10;
    const effectiveWidth = width - (padding * 2);
    const step = this.weeklyCounts.length > 1 ? effectiveWidth / (this.weeklyCounts.length - 1) : 0;
    return padding + (index * step);
  }

  getPointY(count: number): number {
    const height = 100;
    const padding = 10;
    const effectiveHeight = height - (padding * 2);
    return height - padding - (count / this.maxCount) * effectiveHeight;
  }
}
