import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-submission-confirm',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent
  ],
  template: `
    <div class="max-w-3xl mx-auto">
      <div class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg px-6 py-8 text-center transition-colors duration-200">
        <!-- Success Icon -->
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
          <svg class="h-6 w-6 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Confirmation Message -->
        <h1 class="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Submission Successful!</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
          Thank you for your submission. Your information has been received successfully.
        </p>

        <!-- Reference Number -->
        <div class="mt-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-md inline-block">
          <p class="text-sm text-gray-500 dark:text-gray-400">Reference Number</p>
          <p class="text-xl font-semibold text-gray-900 dark:text-white">{{ submissionId }}</p>
        </div>

        <!-- Important Note -->
        <div class="mt-6 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-600 p-4 text-left">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400 dark:text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700 dark:text-blue-300">
                Please keep this reference number for your records. You may need it for future inquiries.
              </p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 space-x-3">
          <app-button
            type="button"
            variant="primary"
            (onClick)="navigateToNewSubmission()"
          >
            Create Another Submission
          </app-button>

          <app-button
            type="button"
            variant="outline"
            (onClick)="navigateToHome()"
          >
            Return to Home
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class SubmissionConfirmComponent implements OnInit {
  submissionId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.submissionId = id;
      } else {
        this.router.navigate(['/submission-form']);
      }
    });
  }

  navigateToNewSubmission(): void {
    this.router.navigate(['/submission-form']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
