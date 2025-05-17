import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'te-theme';
  private readonly themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  public theme$ = this.themeSubject.asObservable();

  constructor() {
    // Apply the theme immediately on service initialization
    this.applyTheme(this.themeSubject.value);

    // Watch for OS theme changes if no theme is explicitly stored
    this.watchSystemTheme();
  }

  private getInitialTheme(): Theme {
    // Check if user has previously selected a theme
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;

    if (savedTheme) {
      return savedTheme;
    }

    // Otherwise use the OS preference
    return this.getSystemTheme();
  }

  private getSystemTheme(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Watch for OS theme changes
    mediaQuery.addEventListener('change', (e) => {
      // Only apply system theme if user hasn't set a preference
      if (!localStorage.getItem(this.THEME_KEY)) {
        const newTheme: Theme = e.matches ? 'dark' : 'light';
        this.themeSubject.next(newTheme);
        this.applyTheme(newTheme);
      }
    });
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
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    // Update the subject
    this.themeSubject.next(theme);

    // Save the preference
    this.saveTheme(theme);

    // Apply the theme
    this.applyTheme(theme);
  }

  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(theme: Theme): void {
    // Remove both classes and add the appropriate one
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);

    // Also update the meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (theme === 'dark') {
        metaThemeColor.setAttribute('content', '#111827'); // dark-900 color
      } else {
        metaThemeColor.setAttribute('content', '#ff5a1f'); // primary-500 color
      }
    }
  }
}
