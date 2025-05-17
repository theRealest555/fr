// src/app/shared/components/theme-toggle/theme-toggle.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      [class.bg-primary-500]="isDarkMode"
      [class.bg-gray-200]="!isDarkMode"
      [attr.aria-pressed]="isDarkMode"
      aria-label="Toggle dark mode"
      (click)="toggleTheme()"
    >
      <span class="sr-only">Toggle dark mode</span>
      <span
        class="pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
        [class.translate-x-5]="isDarkMode"
        [class.translate-x-0]="!isDarkMode"
      >
        <span
          class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
          [class.opacity-0]="isDarkMode"
          [class.opacity-100]="!isDarkMode"
          aria-hidden="true"
        >
          <svg class="h-3 w-3 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
          </svg>
        </span>
        <span
          class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
          [class.opacity-100]="isDarkMode"
          [class.opacity-0]="!isDarkMode"
          aria-hidden="true"
        >
          <svg class="h-3 w-3 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </span>
      </span>
    </button>
  `,
  styles: []
})
export class ThemeToggleComponent implements OnInit {
  isDarkMode = false;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.isDarkMode().subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
