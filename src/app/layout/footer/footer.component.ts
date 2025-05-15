import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-white border-t border-gray-200 py-3">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-500">
            &copy; {{ currentYear }} TE Connectivity. All rights reserved.
          </div>
          <div class="text-sm h-12 text-gray-500">
            <img src="assets/images/logo.png" alt="TE Connectivity" class="h-12 w-auto inline-block mr-2">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
