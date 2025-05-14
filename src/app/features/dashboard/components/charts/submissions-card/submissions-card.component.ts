import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Submission } from '../../../../../core/models/data.models';

@Component({
  selector: 'app-submissions-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Submissions Over Time</h2>
      </div>
      <div class="p-6">
        <!-- Simple Chart -->
        <div class="h-64 relative">
          <div class="absolute inset-0 flex items-end px-4">
            <div *ngFor="let count of weeklyCounts; let i = index"
                 class="w-1/7 mx-1 bg-primary-500 rounded-t"
                 [style.height.%]="getPercentage(count)"
                 [attr.data-count]="count">
            </div>
          </div>

          <!-- X-axis labels -->
          <div class="absolute bottom-0 inset-x-0 flex justify-between px-4 pt-2 border-t border-gray-200">
            <div *ngFor="let day of weekDays" class="text-xs text-gray-500">
              {{ day }}
            </div>
          </div>
        </div>

        <!-- Legend / Summary -->
        <div class="mt-4 flex justify-between text-sm text-gray-500">
          <div>Total this week: <span class="font-semibold text-gray-900">{{ totalThisWeek }}</span></div>
          <div>
            <span [class]="weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'" class="font-semibold">
              {{ weeklyChange >= 0 ? '+' : ''}}{{ weeklyChange }}%
            </span>
            vs last week
          </div>
        </div>
      </div>
    </div>
  `
})
export class SubmissionsChartComponent implements OnInit, OnChanges {
  @Input() submissions: Submission[] = [];

  weeklyCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  maxCount = 0;
  totalThisWeek = 0;
  weeklyChange = 0;

  ngOnInit(): void {
    this.processData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['submissions']) {
      this.processData();
    }
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
    this.totalThisWeek = 0;

    // Process submissions
    if (this.submissions && this.submissions.length > 0) {
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
      this.maxCount = Math.max(...this.weeklyCounts, 1); // Avoid division by zero

      // Calculate weekly change percentage
      if (lastWeekTotal > 0) {
        this.weeklyChange = Math.round((this.totalThisWeek - lastWeekTotal) / lastWeekTotal * 100);
      } else {
        this.weeklyChange = this.totalThisWeek > 0 ? 100 : 0;
      }
    }
  }

  getPercentage(count: number): number {
    if (this.maxCount <= 0) return 0;
    return (count / this.maxCount) * 100;
  }
}
