import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent
  ],
  template: `
    <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg p-4 mb-6 transition-colors duration-200">
      <!-- Header with expand/collapse control -->
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-base font-medium text-gray-900 dark:text-white">
          <div class="flex items-center">
            <svg class="h-5 w-5 mr-2 text-primary-500 dark:text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span class="hidden sm:inline">Filters</span>
            <span class="sm:hidden">Filter Results</span>
          </div>
        </h3>
        <button
          type="button"
          (click)="toggleFilters()"
          class="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none p-2 -mr-2"
        >
          <span class="sr-only">{{ isCollapsed ? 'Expand filters' : 'Collapse filters' }}</span>
          <svg *ngIf="isCollapsed" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v8a1 1 0 11-2 0V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          <svg *ngIf="!isCollapsed" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <form [formGroup]="filterForm" 
            (ngSubmit)="applyFilters()" 
            *ngIf="!isCollapsed"
            class="transition-all duration-200 ease-in-out" 
            [class.opacity-100]="!isCollapsed" 
            [class.opacity-0]="isCollapsed">
        
        <!-- Grid layout with responsive columns -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ng-container *ngFor="let field of filterConfig">
            <!-- Filter Fields with improved mobile layout -->
            <div [ngSwitch]="field.type" class="transition-all duration-200 hover:shadow-sm">
              <label [for]="field.name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ field.label }}
              </label>

              <!-- Select Input -->
              <div *ngSwitchCase="'select'" class="relative">
                <select
                  [id]="field.name"
                  [formControlName]="field.name"
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-colors duration-150 text-base sm:text-sm"
                >
                  <option [ngValue]="null">{{ field.placeholder || 'All' }}</option>
                  <option *ngFor="let option of field.options" [ngValue]="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- Text Input -->
              <div *ngSwitchCase="'text'" class="relative">
                <input
                  type="text"
                  [id]="field.name"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder || ''"
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-colors duration-150 text-base sm:text-sm"
                />
              </div>

              <!-- Date Input -->
              <div *ngSwitchCase="'date'" class="relative">
                <input
                  type="date"
                  [id]="field.name"
                  [formControlName]="field.name"
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:text-white transition-colors duration-150 text-base sm:text-sm"
                />
              </div>
            </div>
          </ng-container>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
          <app-button
            *ngIf="showResetButton && hasActiveFilters()"
            type="button"
            variant="outline"
            size="lg"
            (onClick)="resetFilters()"
            class="w-full sm:w-auto"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </app-button>

          <app-button
            type="submit"
            variant="primary"
            size="lg"
            class="w-full sm:w-auto"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Apply Filters
          </app-button>
        </div>

        <!-- Active Filters -->
        <div *ngIf="hasActiveFilters()" 
             class="mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Active Filters
          </h4>
          <div class="flex flex-wrap gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div *ngFor="let filter of getActiveFilters()"
                 class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 whitespace-nowrap">
              <span class="mr-1.5">{{ filter.label }}:</span>
              <span class="font-normal">{{ filter.displayValue }}</span>
              <button type="button" 
                      (click)="clearFilter(filter.name)" 
                      class="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 p-0.5"
                      aria-label="Remove filter">
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Touch-friendly inputs on mobile */
    @media (max-width: 640px) {
      input, select {
        font-size: 16px !important;
        line-height: 1.25 !important;
      }
    }

    /* Smooth scrolling for active filters */
    .overflow-x-auto {
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .overflow-x-auto::-webkit-scrollbar {
      display: none;
    }
  `]
})
export class FilterComponent implements OnInit, OnChanges {
  @Input() filterConfig: FilterField[] = [];
  @Input() showResetButton = true;
  @Input() isCollapsible = true;
  @Input() initiallyCollapsed = false;
  @Output() filtersApplied = new EventEmitter<any>();

  isCollapsed = false;
  filterForm!: FormGroup;
  fieldOptionsMap = new Map<string, any[]>();

  constructor(private readonly fb: FormBuilder) {
    // Initialize with empty form group to prevent errors
    this.filterForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.isCollapsed = this.initiallyCollapsed;
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Re-initialize form when filter config changes
    if (changes['filterConfig'] && !changes['filterConfig'].firstChange) {
      this.initializeForm();
    }
  }

  private initializeForm(): void {
    // Create a new form group
    const formGroup: Record<string, any> = {};

    // Store options for display values
    this.fieldOptionsMap.clear();

    // Only add controls for the fields that exist in the config
    this.filterConfig.forEach(field => {
      // Important: Use ngValue in template and preserve the type here
      formGroup[field.name] = [field.defaultValue !== undefined ? field.defaultValue : null];

      // Store options for display values
      if (field.options) {
        this.fieldOptionsMap.set(field.name, field.options);
      }
    });

    this.filterForm = this.fb.group(formGroup);
  }

  applyFilters(): void {
    // Get form values and preserve their types
    const formValues = this.filterForm.value;

    // Debug log to verify values
    console.log('Applying filters:', formValues);

    this.filtersApplied.emit(formValues);
  }

  resetFilters(): void {
    this.filterForm.reset();
    // Emit the reset values to update parent component
    this.filtersApplied.emit(this.filterForm.value);
  }

  toggleFilters(): void {
    if (this.isCollapsible) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  hasActiveFilters(): boolean {
    if (!this.filterForm) return false;

    const values = this.filterForm.value;
    return Object.keys(values).some(key => {
      const value = values[key];
      // Also check for empty strings
      return value !== null && value !== undefined && value !== '';
    });
  }

  getActiveFilters(): Array<{name: string, label: string, value: any, displayValue: string}> {
    if (!this.filterForm) return [];

    const values = this.filterForm.value;
    const activeFilters: Array<{name: string, label: string, value: any, displayValue: string}> = [];

    Object.keys(values).forEach(key => {
      const value = values[key];
      if (value !== null && value !== undefined && value !== '') {
        const filterConfig = this.filterConfig.find(f => f.name === key);
        if (filterConfig) {
          let displayValue = value;

          // For select fields, get the label instead of the value
          if (filterConfig.type === 'select' && this.fieldOptionsMap.has(key)) {
            const options = this.fieldOptionsMap.get(key);
            // Use loose comparison for comparing primitive values (handle numbers vs strings)
            const option = options?.find(o => String(o.value) === String(value));
            if (option) {
              displayValue = option.label;
            }
          }

          activeFilters.push({
            name: key,
            label: filterConfig.label,
            value,
            displayValue: String(displayValue)
          });
        }
      }
    });

    return activeFilters;
  }

  clearFilter(name: string): void {
    if (this.filterForm.contains(name)) {
      this.filterForm.get(name)?.reset();
      // Apply filters after clearing
      this.applyFilters();
    }
  }
}

export interface FilterField {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date';
  placeholder?: string;
  defaultValue?: any;
  options?: { value: any; label: string }[];
}
