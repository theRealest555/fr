// Updated FormField Component with improved responsiveness
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4 sm:mb-5 transition-all duration-150 hover:shadow-sm">
      <label [for]="id" class="flex flex-wrap items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-1">
        <span class="mr-1">{{ label }}</span>
        <span *ngIf="required" class="text-red-500">*</span>

        <!-- Info tooltip with improved touch target -->
        <div *ngIf="tooltip" class="relative ml-2 inline-block group">
          <button type="button" class="flex items-center justify-center h-6 w-6 sm:h-5 sm:w-5 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-dark-600 focus:outline-none">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
          </button>
          <!-- Tooltip with larger width on mobile -->
          <div class="absolute z-10 transform -translate-x-1/2 left-1/2 mt-2 w-full max-w-[250px] sm:max-w-[220px] px-3 py-2 bg-gray-900 dark:bg-dark-700 text-white dark:text-gray-200 text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {{ tooltip }}
            <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-dark-700 rotate-45"></div>
          </div>
        </div>
      </label>

      <div [class]="containerClass">
        <!-- Icon prefix (if provided) -->
        <div *ngIf="prefixIcon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" [innerHTML]="prefixIcon"></svg>
        </div>

        <ng-content></ng-content>
      </div>

      <!-- Error messages with larger text on mobile -->
      <div *ngIf="shouldShowError()" class="mt-1.5 sm:mt-1 text-sm sm:text-xs font-medium text-red-600 dark:text-red-500 transition-all duration-150 animate-fade-in">
        <div *ngIf="control?.errors?.['required']">{{ label }} is required</div>
        <div *ngIf="control?.errors?.['email']">Please enter a valid email address</div>
        <div *ngIf="control?.errors?.['minlength']">
          {{ label }} must be at least {{ control?.errors?.['minlength'].requiredLength }} characters
        </div>
        <div *ngIf="control?.errors?.['maxlength']">
          {{ label }} cannot exceed {{ control?.errors?.['maxlength'].requiredLength }} characters
        </div>
        <div *ngIf="control?.errors?.['pattern']">{{ label }} format is invalid</div>
        <div *ngIf="control?.errors?.['passwordMismatch']">Passwords do not match</div>

        <!-- Add custom error message if provided -->
        <div *ngIf="customErrors && control?.errors">
          <div *ngFor="let error of getCustomErrors()">{{ error }}</div>
        </div>
      </div>

      <!-- Hint text when no errors - larger on mobile -->
      <div *ngIf="hint && !shouldShowError()" class="mt-1.5 sm:mt-1 text-sm sm:text-xs text-gray-500 dark:text-gray-400">
        {{ hint }}
      </div>
    </div>
  `,
  styles: [`
    /* Small screen adjustments */
    @media (max-width: 640px) {
      :host ::ng-deep input,
      :host ::ng-deep select,
      :host ::ng-deep textarea {
        font-size: 16px; /* Prevents iOS zoom on focus */
        padding-top: 0.625rem;
        padding-bottom: 0.625rem;
        min-height: 2.75rem; /* Larger touch target */
      }

      :host ::ng-deep .group-hover\:visible {
        visibility: visible;
      }

      :host ::ng-deep .group-hover\:opacity-100 {
        opacity: 1;
      }
      
      /* Better handling for touch on tooltips */
      :host ::ng-deep .group button:focus + div,
      :host ::ng-deep .group button:active + div {
        visibility: visible !important;
        opacity: 1 !important;
      }
    }
    
    /* Prevent form field collapse when error messages appear/disappear */
    :host {
      display: block;
      min-height: 70px;
    }
    
    /* More responsive error animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    :host ::ng-deep .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
  `]
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() id = '';
  @Input() control!: AbstractControl | null;
  @Input() required = false;
  @Input() hint = '';
  @Input() tooltip = '';
  @Input() prefixIcon = '';  // SVG content as string
  @Input() customErrors: { [key: string]: string } = {};
  @Input() containerClass = 'relative rounded-md';

  shouldShowError(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  getCustomErrors(): string[] {
    if (!this.control?.errors || !this.customErrors) {
      return [];
    }

    return Object.keys(this.control.errors)
      .filter(errorKey => this.customErrors[errorKey])
      .map(errorKey => this.customErrors[errorKey]);
  }
}
