// Updated Notification Component with improved responsiveness
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification, NotificationService, NotificationType } from '../../../core/services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="notifications.length > 0" aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
      <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
        <div *ngFor="let notification of notifications; let i = index"
             class="max-w-sm w-full bg-white dark:bg-dark-800 shadow-lg dark:shadow-dark-lg rounded-lg pointer-events-auto ring-1 overflow-hidden backdrop-blur-lg transition-all duration-200"
             [ngClass]="getRingColorClass(notification)"
             [@slideInOut]="'in'"
             [style.animation-delay]="i * 100 + 'ms'">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Success icon -->
                <div *ngIf="notification.type === 'success'" class="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 dark:bg-green-900/30">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <!-- Error icon -->
                <div *ngIf="notification.type === 'error'" class="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-100 dark:bg-red-900/30">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>

                <!-- Warning icon -->
                <div *ngIf="notification.type === 'warning'" class="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>

                <!-- Info icon -->
                <div *ngIf="notification.type === 'info'" class="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ getNotificationTitle(notification) }}</p>
                <p class="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ notification.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  class="bg-white dark:bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800"
                  (click)="dismiss(notification.id)"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Progress bar -->
          <div
            *ngIf="notification.autoClose"
            class="h-1 bg-gray-200 dark:bg-dark-700"
          >
            <div
              [ngClass]="getProgressBarColorClass(notification)"
              class="h-1 transition-all ease-linear"
              [style.width.%]="getProgressWidth(notification)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ],
  styles: [`
    @media (max-width: 640px) {
      :host ::ng-deep .max-w-sm {
        max-width: calc(100vw - 2rem);
      }
    }
  `]
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  progressMap = new Map<string, number>();

  constructor(private readonly notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(notifications => {
      // Update progress
      notifications.forEach(notification => {
        if (notification.autoClose && !this.progressMap.has(notification.id)) {
          this.progressMap.set(notification.id, 100);
          this.startProgressBar(notification);
        }
      });

      // Remove progress for dismissed notifications
      const currentIds = new Set(notifications.map(n => n.id));
      Array.from(this.progressMap.keys()).forEach(id => {
        if (!currentIds.has(id)) {
          this.progressMap.delete(id);
        }
      });

      this.notifications = notifications;
    });
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  getNotificationTitle(notification: Notification): string {
    switch (notification.type) {
      case NotificationType.Success:
        return 'Success';
      case NotificationType.Error:
        return 'Error';
      case NotificationType.Warning:
        return 'Warning';
      case NotificationType.Info:
        return 'Information';
      default:
        return 'Notification';
    }
  }

  getRingColorClass(notification: Notification): string {
    switch (notification.type) {
      case NotificationType.Success:
        return 'ring-green-500 dark:ring-green-700';
      case NotificationType.Error:
        return 'ring-red-500 dark:ring-red-700';
      case NotificationType.Warning:
        return 'ring-yellow-500 dark:ring-yellow-700';
      case NotificationType.Info:
        return 'ring-blue-500 dark:ring-blue-700';
      default:
        return 'ring-gray-300 dark:ring-dark-600';
    }
  }

  getProgressBarColorClass(notification: Notification): string {
    switch (notification.type) {
      case NotificationType.Success:
        return 'bg-green-500 dark:bg-green-600';
      case NotificationType.Error:
        return 'bg-red-500 dark:bg-red-600';
      case NotificationType.Warning:
        return 'bg-yellow-500 dark:bg-yellow-600';
      case NotificationType.Info:
        return 'bg-blue-500 dark:bg-blue-600';
      default:
        return 'bg-primary-500 dark:bg-primary-600';
    }
  }

  getProgressWidth(notification: Notification): number {
    return this.progressMap.get(notification.id) ?? 0;
  }

  private startProgressBar(notification: Notification): void {
    if (!notification.autoClose) return;

    const duration = notification.duration ?? 5000;
    const startTime = Date.now();
    const updateInterval = 50; // Update every 50ms

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const percent = (remaining / duration) * 100;

      this.progressMap.set(notification.id, percent);

      if (percent > 0 && this.progressMap.has(notification.id)) {
        setTimeout(updateProgress, updateInterval);
      }
    };

    setTimeout(updateProgress, updateInterval);
  }
}
