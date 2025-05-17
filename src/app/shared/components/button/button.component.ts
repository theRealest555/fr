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
        'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-all duration-200 transform hover:shadow-md active:scale-95',
        sizeClasses,
        variantClasses,
        fullWidth ? 'w-full' : '',
        'relative overflow-hidden',
        disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
        glass ? 'glass' : ''
      ]"
      (click)="handleClick($event)"
      (mousedown)="handleMouseDown($event)"
    >
      <div class="absolute inset-0 ripple-container overflow-hidden"></div>

      <div class="flex items-center justify-center z-10">
        <!-- Loading spinner -->
        <div
          *ngIf="loading"
          class="mr-2 flex-shrink-0"
        >
          <svg
            class="animate-spin h-4 w-4"
            [ngClass]="variant === 'primary' || variant === 'danger' ? 'text-white' : ''"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- Icon slot (before content) -->
        <ng-content select="[icon-start]"></ng-content>

        <!-- Main content -->
        <ng-content></ng-content>

        <!-- Icon slot (after content) -->
        <ng-content select="[icon-end]"></ng-content>
      </div>
    </button>
  `,
  styles: [`
    .ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }

    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `]
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'info' = 'primary';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() glass = false;

  @Output() onClick = new EventEmitter<MouseEvent>();

  get sizeClasses(): string {
    switch (this.size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-5 py-2.5 text-base';
      case 'xl':
        return 'px-6 py-3 text-lg';
      case 'md':
      default:
        return 'px-4 py-2 text-sm';
    }
  }

  get variantClasses(): string {
    switch (this.variant) {
      case 'secondary':
        return 'bg-primary-100 text-primary-700 hover:bg-primary-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-900/50 dark:text-primary-300 dark:hover:bg-primary-900 dark:focus:ring-offset-dark-900';

      case 'outline':
        return 'bg-white dark:bg-transparent border border-primary-500 text-primary-700 hover:bg-primary-50 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:text-primary-300 dark:border-primary-400 dark:hover:bg-primary-900/30 dark:focus:ring-offset-dark-900';

      case 'danger':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-offset-dark-900';

      case 'success':
        return 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-offset-dark-900';

      case 'warning':
        return 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-offset-dark-900';

      case 'info':
        return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-dark-900';

      case 'primary':
      default:
        return 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-offset-dark-900';
    }
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }

  handleMouseDown(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      return;
    }

    const button = event.currentTarget as HTMLButtonElement;
    const rippleContainer = button.querySelector('.ripple-container') as HTMLElement;

    if (!rippleContainer) return;

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = `${diameter}px`;

    const rect = button.getBoundingClientRect();
    const offset = {
      left: event.clientX - rect.left - radius,
      top: event.clientY - rect.top - radius
    };

    ripple.style.left = `${offset.left}px`;
    ripple.style.top = `${offset.top}px`;

    rippleContainer.appendChild(ripple);

    // Remove ripple after animation completes
    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  }
}
