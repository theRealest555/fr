import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  autoClose?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() { }

  /**
   * Show a success notification
   */
  success(message: string, autoClose = true, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Success,
      autoClose,
      duration
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, autoClose = true, duration = 8000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Error,
      autoClose,
      duration
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, autoClose = true, duration = 6000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Warning,
      autoClose,
      duration
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, autoClose = true, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Info,
      autoClose,
      duration
    });
  }

  /**
   * Dismiss a notification by ID
   */
  dismiss(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clear(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Add a notification to the stack
   */
  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [...currentNotifications, notification];
    this.notificationsSubject.next(updatedNotifications);

    if (notification.autoClose) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration ?? 5000);
    }
  }

  /**
   * Generate a unique ID for the notification
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
