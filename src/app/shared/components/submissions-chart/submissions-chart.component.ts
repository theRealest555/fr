import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
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
            <ng-container *ngFor="let count of weeklyCounts; let i = index">
              <div class="flex-1 flex flex-col items-center">
                <!-- Bar -->
                <div class="relative w-full group flex items-end h-full">
                  <!-- Actually render an orange background for day with submissions -->
                  <div *ngIf="count > 0"
                    class="w-full bg-orange-500 dark:bg-orange-500 rounded-t border border-orange-600 dark:border-orange-600 shadow-md transition-all duration-300"
                    [style.height.%]="getBarHeight(count)">
                    <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <div class="bg-gray-900 text-white text-xs py-1 px-2 rounded shadow-lg">
                        {{ count }} submission{{ count !== 1 ? 's' : '' }}
                      </div>
                      <div class="w-2 h-2 bg-gray-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>

                  <!-- Empty day marker - reduced visibility -->
                  <div *ngIf="count === 0"
                    class="w-full bg-gray-200 dark:bg-gray-700 rounded-t opacity-30 transition-all duration-300"
                    [style.height.px]="2">
                  </div>
                </div>

                <!-- X-axis label -->
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ weekDays[i] }}
                </div>
              </div>
            </ng-container>
          </div>

          <!-- Line Chart -->
          <div *ngIf="chartType === 'line'" class="h-full relative">
            <!-- Horizontal grid lines -->
            <div *ngFor="let _ of [0,1,2,3,4]; let i = index" class="absolute border-b border-gray-200 dark:border-dark-700 w-full"
                 [style.bottom.%]="i * 25"></div>

            <!-- Line chart with SVG -->
            <svg #lineChart class="absolute inset-0 w-full h-full">
              <!-- Area under the line -->
              <path
                [attr.d]="getAreaPath()"
                class="fill-orange-100/70 dark:fill-orange-900/40 transition-all duration-700 ease-out"
              ></path>

              <!-- Line itself -->
              <path
                [attr.d]="getLinePath()"
                class="stroke-orange-500 dark:stroke-orange-500 fill-none transition-all duration-700 ease-out"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                [attr.stroke-dasharray]="pathLength"
                [attr.stroke-dashoffset]="animatedDashOffset"
              ></path>

              <!-- Data points -->
              <g *ngFor="let count of weeklyCounts; let i = index">
                <circle
                  *ngIf="count > 0"
                  [attr.cx]="getPointX(i)"
                  [attr.cy]="getPointY(count)"
                  r="5"
                  class="fill-white dark:fill-dark-800 stroke-orange-500 dark:stroke-orange-500 stroke-2"
                >
                  <!-- Data point tooltips -->
                  <title>{{ count }} submission{{ count !== 1 ? 's' : '' }}</title>
                </circle>
              </g>
            </svg>

            <!-- X-axis labels -->
            <div class="absolute bottom-0 inset-x-0 flex justify-between px-2 pt-2 border-t border-gray-200 dark:border-dark-700">
              <div *ngFor="let day of weekDays" class="text-xs text-gray-500 dark:text-gray-400">
                {{ day }}
              </div>
            </div>
          </div>

          <!-- "No data" message -->
          <div *ngIf="totalThisWeek === 0" class="absolute inset-0 flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-400 text-sm">No submissions in this period</p>
          </div>
        </div>

        <!-- Legend / Summary -->
        <div class="mt-6 flex justify-between items-center">
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-orange-500 dark:bg-orange-500 mr-2"></div>
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
export class SubmissionsChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() submissions: Submission[] = [];
  @ViewChild('lineChart') lineChartElement!: ElementRef<SVGElement>;

  weeklyCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  maxCount = 0;
  totalThisWeek = 0;
  weeklyChange = 0;
  chartType: 'bar' | 'line' = 'bar';
  isDarkMode = false;

  // For line chart animation
  pathLength = 0;
  animatedDashOffset = 0;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.processData();

    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['submissions']) {
      this.processData();
      setTimeout(() => this.animateChart(), 100);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.animateChart();
    }, 100);
  }

  processData(): void {
    // Reset data
    this.weeklyCounts = [0, 0, 0, 0, 0, 0, 0];
    this.totalThisWeek = 0;

    if (!this.submissions || this.submissions.length === 0) {
      // Generate sample data if no data is provided
      this.generateSampleData();
      return;
    }

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    let lastWeekTotal = 0;

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

    console.log('Weekly counts:', this.weeklyCounts);
    console.log('Max count:', this.maxCount);
    console.log('Total this week:', this.totalThisWeek);
  }

  // Generate sample data if no data is provided
  generateSampleData(): void {
    // Some random sample data for demonstration
    this.weeklyCounts = [2, 5, 3, 7, 4, 6, 3];
    this.totalThisWeek = this.weeklyCounts.reduce((sum, count) => sum + count, 0);
    this.maxCount = Math.max(...this.weeklyCounts);
    this.weeklyChange = 12; // Sample percentage change
  }

  // Calculate bar heights with special handling for single submissions
  getBarHeight(count: number): number {
    // If there are no submissions, return 0 height
    if (this.totalThisWeek === 0) return 0;

    // If this is the only day with submissions, make it prominent
    if (count > 0 && this.totalThisWeek === 1) {
      return 40; // Fixed height for single submissions (40%)
    }

    // Normal scaling based on max count, with minimum height of 20%
    return Math.max(20, (count / this.maxCount) * 100);
  }

  setChartType(type: 'bar' | 'line'): void {
    // If the chart type hasn't changed, do nothing
    if (this.chartType === type) {
      return;
    }

    this.chartType = type;

    // Need to wait for the new chart to be rendered
    setTimeout(() => {
      this.animateChart();
    }, 50);
  }

  // Animation for line chart
  animateChart(): void {
    try {
      if (this.chartType === 'line') {
        // Make sure lineChartElement is available before trying to use it
        if (!this.lineChartElement || !this.lineChartElement.nativeElement) {
          return;
        }

        const path = this.lineChartElement.nativeElement.querySelector('path:nth-child(2)');
        if (path) {
          this.pathLength = (path as SVGPathElement).getTotalLength();

          // Trigger animation
          this.animatedDashOffset = this.pathLength;
          setTimeout(() => {
            this.animatedDashOffset = 0;
          }, 50);
        }
      }
    } catch (error) {
      console.error('Error in chart animation:', error);
      // Fail gracefully, don't break the UI
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

    // Avoid division by zero if there's only one data point
    const step = this.weeklyCounts.length > 1 ? effectiveWidth / (this.weeklyCounts.length - 1) : 0;

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
    }

    return path;
  }

  // Area path for the fill under the line
  getAreaPath(): string {
    if (!this.weeklyCounts.length) return '';

    // Calculate points for the area
    let path = '';
    const width = 100;
    const height = 100;
    const padding = 10;

    const effectiveWidth = width - (padding * 2);
    const effectiveHeight = height - (padding * 2);

    // Avoid division by zero if there's only one data point
    const step = this.weeklyCounts.length > 1 ? effectiveWidth / (this.weeklyCounts.length - 1) : 0;

    // Start path at the bottom left
    path = `M ${padding},${height - padding}`;

    // Go to the first data point
    const firstY = height - padding - (this.weeklyCounts[0] / this.maxCount) * effectiveHeight;
    path += ` L ${padding},${firstY}`;

    // Add line to each subsequent point
    for (let i = 1; i < this.weeklyCounts.length; i++) {
      const x = padding + (i * step);
      const y = height - padding - (this.weeklyCounts[i] / this.maxCount) * effectiveHeight;
      path += ` L ${x},${y}`;
    }

    // Close the path to the bottom
    path += ` L ${padding + ((this.weeklyCounts.length - 1) * step)},${height - padding}`;
    path += ` Z`;

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
