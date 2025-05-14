import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-16 text-white">
        <div class="max-w-3xl mx-auto text-center">
          <h1 class="text-3xl sm:text-4xl font-bold mb-4">TE Connectivity Document Portal</h1>
          <p class="text-lg text-white text-opacity-90 mb-8">
            Submit your information securely and efficiently. Our document portal provides a streamlined process for submitting and managing important documents.
          </p>
          <a routerLink="/submission-form" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-primary-500">
            Submit Documents
            <svg class="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Features Section -->
      <div class="py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Step 1 -->
            <div class="text-center">
              <div class="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">1. Fill Personal Information</h3>
              <p class="text-gray-600">
                Provide your personal details including your name, TE ID, CIN, and date of birth.
              </p>
            </div>

            <!-- Step 2 -->
            <div class="text-center">
              <div class="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">2. Upload Documents</h3>
              <p class="text-gray-600">
                Upload your CIN document, personal photo, and Grey Card (if applicable).
              </p>
            </div>

            <!-- Step 3 -->
            <div class="text-center">
              <div class="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">3. Submit & Confirm</h3>
              <p class="text-gray-600">
                Submit your information and receive a confirmation with a reference number.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="bg-gray-50 border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Ready to submit your documents?</h2>
          <p class="text-gray-600 mb-6">
            The submission process only takes a few minutes. Make sure you have your ID documents ready.
          </p>
          <div class="flex justify-center">
            <a routerLink="/submission-form" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Get Started
            </a>
            <a routerLink="/auth/login" class="inline-flex items-center ml-4 px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Administrator Login
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
