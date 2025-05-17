// src/app/core/services/theme.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'te-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);

    // Watch for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        this.themeSubject.next(newTheme);
        this.applyTheme(newTheme);
      }
    });
  }

  private getInitialTheme(): Theme {
    // Check if user has previously selected a theme
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;

    if (savedTheme) {
      return savedTheme;
    }

    // Otherwise use the OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  isDarkMode(): Observable<boolean> {
    return new Observable(subscriber => {
      this.theme$.subscribe(theme => {
        subscriber.next(theme === 'dark');
      });
    });
  }

  toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.themeSubject.next(newTheme);
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.saveTheme(theme);
    this.applyTheme(theme);
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
}
