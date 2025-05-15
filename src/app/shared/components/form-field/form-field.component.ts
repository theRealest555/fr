import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <label [for]="id" class="block text-sm font-medium text-gray-700 mb-1">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>

      <ng-content></ng-content>

      <div *ngIf="shouldShowError()" class="mt-1 text-sm text-red-600">
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

      <div *ngIf="hint && !shouldShowError()" class="mt-1 text-xs text-gray-500">
        {{ hint }}
      </div>
    </div>
  `
})
export class FormFieldComponent {
  @Input() label = '';
  @Input() id = '';
  @Input() control!: AbstractControl | null; // Changed to accept null
  @Input() required = false;
  @Input() hint = '';
  @Input() customErrors: { [key: string]: string } = {};

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
