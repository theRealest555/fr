import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="relative">
      <!-- Prefix (Icon or Text) -->
      <div *ngIf="prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">{{ prefix }}</span>
      </div>

      <!-- Input Element -->
      <input
        [type]="type"
        [id]="id"
        [name]="name"
        [attr.placeholder]="placeholder"
        [attr.autocomplete]="autocomplete"
        [attr.aria-label]="ariaLabel || placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="onInputChange($event)"
        (blur)="onBlur()"
        [class]="inputClass"
      />

      <!-- Suffix (Icon or Text) -->
      <div *ngIf="suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span class="text-gray-500 sm:text-sm">{{ suffix }}</span>
      </div>

      <!-- Password Toggle Button -->
      <button
        *ngIf="type === 'password' && allowTogglePassword"
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        (click)="togglePasswordVisibility()"
      >
        <svg *ngIf="isPasswordVisible" class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
        <svg *ngIf="!isPasswordVisible" class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' = 'text';
  @Input() id = '';
  @Input() name = '';
  @Input() placeholder = '';
  @Input() autocomplete = '';
  @Input() ariaLabel = '';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() allowTogglePassword = true;
  @Input() disabled = false;

  value = '';
  isPasswordVisible = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get inputClass(): string {
    let classes = 'form-input block w-full';

    if (this.prefix) {
      classes += ' pl-10';
    }

    if (this.suffix || (this.type === 'password' && this.allowTogglePassword)) {
      classes += ' pr-10';
    }

    if (this.disabled) {
      classes += ' bg-gray-100 cursor-not-allowed';
    }

    return classes;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    if (this.type === 'password') {
      this.isPasswordVisible = !this.isPasswordVisible;
      this.type = this.isPasswordVisible ? 'text' : 'password';
    }
  }
}
