// src/app/shared/components/filter/filter.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Dynamic Filter Fields -->
          <ng-container *ngFor="let field of filterConfig">
            <div *ngIf="field.type === 'select'">
              <label [for]="field.name" class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
              <select
                [id]="field.name"
                [formControlName]="field.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option [ngValue]="null">{{ field.placeholder || 'All' }}</option>
                <option *ngFor="let option of field.options" [value]="option.value">{{ option.label }}</option>
              </select>
            </div>

            <div *ngIf="field.type === 'text'">
              <label [for]="field.name" class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
              <input
                type="text"
                [id]="field.name"
                [formControlName]="field.name"
                [placeholder]="field.placeholder || ''"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div *ngIf="field.type === 'date'">
              <label [for]="field.name" class="block text-sm font-medium text-gray-700 mb-1">{{ field.label }}</label>
              <input
                type="date"
                [id]="field.name"
                [formControlName]="field.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </ng-container>

          <!-- Filter Button -->
          <div class="flex items-end">
            <app-button type="submit" variant="primary" size="md">
              Apply Filters
            </app-button>
            <app-button 
              *ngIf="showResetButton" 
              type="button" 
              variant="outline" 
              size="md" 
              class="ml-2"
              (onClick)="resetFilters()"
            >
              Reset
            </app-button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class FilterComponent implements OnInit {
  @Input() filterConfig: FilterField[] = [];
  @Input() showResetButton = true;
  @Output() filtersApplied = new EventEmitter<any>();
  
  filterForm!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const formGroup: Record<string, any> = {};

    this.filterConfig.forEach(field => {
      formGroup[field.name] = [field.defaultValue !== undefined ? field.defaultValue : null];
    });

    this.filterForm = this.fb.group(formGroup);
  }

  applyFilters(): void {
    this.filtersApplied.emit(this.filterForm.value);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filtersApplied.emit(this.filterForm.value);
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