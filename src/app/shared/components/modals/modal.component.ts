// Updated Modal Component (src/app/shared/components/modals/modal.component.ts)

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 overflow-y-auto z-50" role="dialog" aria-modal="true">
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75 transition-opacity backdrop-blur-sm"
          aria-hidden="true"
          (click)="closeOnBackdrop && close()"
        ></div>

        <!-- Center modal vertically -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        <!-- Modal panel -->
        <div
          class="inline-block transform overflow-hidden rounded-lg bg-white dark:bg-dark-800 text-left align-bottom shadow-xl dark:shadow-dark-lg transition-all sm:my-8 sm:w-full sm:align-middle"
          [class.sm:max-w-md]="size === 'sm'"
          [class.sm:max-w-lg]="size === 'md'"
          [class.sm:max-w-3xl]="size === 'lg'"
          [class.sm:max-w-4xl]="size === 'xl'"
          [class.sm:max-w-7xl]="size === 'full'"
          (click)="$event.stopPropagation()"
        >
          <!-- Header -->
          <div class="bg-white dark:bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <!-- Icon (optional) -->
              <div
                *ngIf="icon"
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                [ngClass]="iconClasses"
              >
                <ng-container *ngTemplateOutlet="icon"></ng-container>
              </div>

              <!-- Title and content -->
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white" *ngIf="title">{{ title }}</h3>
                <div class="mt-2 text-gray-700 dark:text-gray-300">
                  <ng-content></ng-content>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with actions -->
          <div *ngIf="showFooter" class="bg-gray-50 dark:bg-dark-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-dark-600">
            <!-- Primary button -->
            <app-button
              *ngIf="primaryButtonText"
              [type]="primaryButtonType"
              [variant]="primaryButtonVariant"
              [loading]="primaryButtonLoading"
              [disabled]="primaryButtonDisabled"
              (onClick)="onPrimaryClick.emit()"
              class="w-full sm:w-auto sm:ml-3"
            >
              {{ primaryButtonText }}
            </app-button>

            <!-- Secondary button -->
            <app-button
              *ngIf="secondaryButtonText"
              type="button"
              variant="outline"
              [disabled]="secondaryButtonDisabled"
              (onClick)="onSecondaryClick.emit()"
              class="mt-3 sm:mt-0 w-full sm:w-auto"
            >
              {{ secondaryButtonText }}
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-10px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes overlayFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    :host ::ng-deep .bg-opacity-75 {
      animation: overlayFadeIn 0.2s ease-out forwards;
    }

    :host ::ng-deep .transform {
      animation: modalFadeIn 0.3s ease-out forwards;
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() showFooter = true;

  @Input() icon?: any;
  @Input() iconType: 'info' | 'success' | 'warning' | 'error' | 'question' = 'info';

  @Input() primaryButtonText = 'Confirm';
  @Input() primaryButtonType: 'button' | 'submit' = 'button';
  @Input() primaryButtonVariant: 'primary' | 'danger' = 'primary';
  @Input() primaryButtonLoading = false;
  @Input() primaryButtonDisabled = false;
  @Input() secondaryButtonText = 'Cancel';
  @Input() secondaryButtonDisabled = false;

  @Output() onClose = new EventEmitter<void>();
  @Output() onPrimaryClick = new EventEmitter<void>();
  @Output() onSecondaryClick = new EventEmitter<void>();

  get iconClasses(): string {
    const baseClasses = 'bg-opacity-10 dark:bg-opacity-20';

    switch (this.iconType) {
      case 'info':
        return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400`;
      case 'success':
        return `${baseClasses} bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400`;
      case 'error':
        return `${baseClasses} bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400`;
      case 'question':
        return `${baseClasses} bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400`;
      default:
        return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400`;
    }
  }

  close(): void {
    this.onClose.emit();
  }
}
