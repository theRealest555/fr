import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="[
        'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors',
        sizeClasses,
        variantClasses,
        fullWidth ? 'w-full' : '',
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      (click)="handleClick($event)"
    >
      <!-- Loading spinner -->
      <svg
        *ngIf="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>

      <!-- Icon slot (before content) -->
      <ng-content select="[icon-start]"></ng-content>

      <!-- Main content -->
      <ng-content></ng-content>

      <!-- Icon slot (after content) -->
      <ng-content select="[icon-end]"></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  get sizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  }

  get variantClasses(): string {
    switch (this.variant) {
      case 'secondary':
        return 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
      case 'outline':
        return 'bg-white border border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500';
      case 'primary':
      default:
        return 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500';
    }
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
}
