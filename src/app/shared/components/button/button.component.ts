import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="loading || disabled"
      [ngClass]="buttonClasses"
      (click)="onClick.emit($event)"
      class="rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      <div class="flex items-center justify-center">
        <!-- Loading spinner -->
        <svg *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <ng-content></ng-content>
      </div>
    </button>
  `
})
export class ButtonComponent implements OnInit {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  buttonClasses = '';

  ngOnInit(): void {
    // Base classes
    let classes = 'transition-colors ';

    // Size classes
    switch (this.size) {
      case 'sm':
        classes += 'px-3 py-1.5 text-sm ';
        break;
      case 'lg':
        classes += 'px-6 py-3 text-lg ';
        break;
      default:
        classes += 'px-4 py-2 text-base ';
    }

    // Variant classes
    switch (this.variant) {
      case 'secondary':
        classes += 'bg-primary-100 text-primary-700 hover:bg-primary-200 ';
        break;
      case 'outline':
        classes += 'bg-transparent border border-primary-500 text-primary-700 hover:bg-primary-50 ';
        break;
      case 'danger':
        classes += 'bg-red-600 text-white hover:bg-red-700 ';
        break;
      default:
        classes += 'bg-primary-500 text-white hover:bg-primary-600 ';
    }

    // Full width
    if (this.fullWidth) {
      classes += 'w-full ';
    }

    this.buttonClasses = classes;
  }
}
