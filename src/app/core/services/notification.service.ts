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

  success(message: string, autoClose = true, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Success,
      autoClose,
      duration
    });
  }

  error(message: string, autoClose = true, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Error,
      autoClose,
      duration
    });
  }

  warning(message: string, autoClose = true, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Warning,
      autoClose,
      duration
    });
  }

  info(message: string, autoClose = true, duration = 5000): void {
    this.addNotification({
      id: this.generateId(),
      message,
      type: NotificationType.Info,
      autoClose,
      duration
    });
  }

  dismiss(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(notification => notification.id !== id);
    this.notificationsSubject.next(updatedNotifications);
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }

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

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}
