// Updated Footer Component with improved responsiveness
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 py-3 transition-colors duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <div class="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            &copy; {{ currentYear }} TE Connectivity. All rights reserved.
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
            <img src="assets/images/logo.png" alt="TE Connectivity" class="h-8 sm:h-12 w-auto inline-block mr-2">
            <div class="flex flex-col items-end">
              <span>Version 1.0.0</span>
              <span class="text-xs mt-1 flex items-center">
                <span class="inline-flex h-2 w-2 mr-1 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
