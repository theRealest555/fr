// src/app/shared/components/admin-status/admin-status.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="statusClasses">
      {{ statusText }}
    </span>
  `
})
export class AdminStatusComponent {
  @Input() requirePasswordChange: boolean = false;

  get statusClasses(): string {
    return this.requirePasswordChange
      ? 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
      : 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
  }

  get statusText(): string {
    return this.requirePasswordChange
      ? 'Password Change Required'
      : 'Active';
  }
}