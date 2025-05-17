import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubmissionService } from '../../../../core/services/submission.service';
import { FileService } from '../../../../core/services/file.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Submission, FileType } from '../../../../core/models/data.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonComponent
  ],
  template: `
    <div *ngIf="submission" class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg transition-colors duration-200">
      <!-- Header with back button - improved for mobile -->
      <div class="sticky top-0 z-10 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
        <div class="flex items-center">
          <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 -ml-2">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Submission Details</h1>
        </div>
        <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Submitted on {{ formatDate(submission.createdAt) }}
        </div>
      </div>

      <!-- Content with responsive padding -->
      <div class="p-4 sm:p-6">
        <!-- Personal Information Section -->
        <div class="mb-6 sm:mb-8">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 pb-1 border-b border-gray-200 dark:border-dark-700">Personal Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <!-- First Name -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">First Name</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.firstName }}</div>
            </div>

            <!-- Last Name -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Name</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.lastName }}</div>
            </div>

            <!-- Gender -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gender</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.gender === 0 ? 'Male' : 'Female' }}</div>
            </div>

            <!-- TE ID -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">TE ID</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.teId }}</div>
            </div>

            <!-- CIN -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">CIN</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.cin }}</div>
            </div>

            <!-- Date of Birth -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date of Birth</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ formatDate(submission.dateOfBirth) }}</div>
            </div>

            <!-- Plant -->
            <div class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Plant</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.plantName }}</div>
            </div>

            <!-- Grey Card (if present) -->
            <div *ngIf="submission.greyCard" class="bg-gray-50 dark:bg-dark-700/50 p-3 sm:p-4 rounded-md">
              <div class="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Grey Card Number</div>
              <div class="text-sm sm:text-base text-gray-900 dark:text-white">{{ submission.greyCard }}</div>
            </div>
          </div>
        </div>

        <!-- Documents Section - improved for mobile -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 pb-1 border-b border-gray-200 dark:border-dark-700">Documents</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <!-- CIN Document -->
            <div *ngIf="getCinDocument()" class="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden shadow-sm dark:shadow-dark-sm hover:shadow-md dark:hover:shadow-dark-md transition-shadow duration-200">
              <div class="bg-gray-50 dark:bg-dark-700 px-4 py-2 border-b border-gray-200 dark:border-dark-600 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">CIN Document</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{{ formatFileExt(getCinDocument()?.fileName) }}</span>
              </div>
              <div class="p-4">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 overflow-hidden text-ellipsis whitespace-nowrap" title="{{ getCinDocument()?.fileName }}">
                  {{ getCinDocument()?.fileName }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">Uploaded: {{ formatDate(getCinDocument()?.uploadedAt) }}</div>
                <div>
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="downloadingCin"
                    [fullWidth]="true"
                    (onClick)="downloadFile(getCinDocument()?.id || 0, 'cin')"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </app-button>
                </div>
              </div>
            </div>

            <!-- Personal Photo -->
            <div *ngIf="getPersonalPhoto()" class="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden shadow-sm dark:shadow-dark-sm hover:shadow-md dark:hover:shadow-dark-md transition-shadow duration-200">
              <div class="bg-gray-50 dark:bg-dark-700 px-4 py-2 border-b border-gray-200 dark:border-dark-600 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Personal Photo</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{{ formatFileExt(getPersonalPhoto()?.fileName) }}</span>
              </div>
              <div class="p-4">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 overflow-hidden text-ellipsis whitespace-nowrap" title="{{ getPersonalPhoto()?.fileName }}">
                  {{ getPersonalPhoto()?.fileName }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">Uploaded: {{ formatDate(getPersonalPhoto()?.uploadedAt) }}</div>
                <div>
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="downloadingPhoto"
                    [fullWidth]="true"
                    (onClick)="downloadFile(getPersonalPhoto()?.id || 0, 'photo')"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </app-button>
                </div>
              </div>
            </div>

            <!-- Grey Card (if present) -->
            <div *ngIf="getGreyCardDocument()" class="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden shadow-sm dark:shadow-dark-sm hover:shadow-md dark:hover:shadow-dark-md transition-shadow duration-200">
              <div class="bg-gray-50 dark:bg-dark-700 px-4 py-2 border-b border-gray-200 dark:border-dark-600 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Grey Card Document</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{{ formatFileExt(getGreyCardDocument()?.fileName) }}</span>
              </div>
              <div class="p-4">
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-2 overflow-hidden text-ellipsis whitespace-nowrap" title="{{ getGreyCardDocument()?.fileName }}">
                  {{ getGreyCardDocument()?.fileName }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mb-4">Uploaded: {{ formatDate(getGreyCardDocument()?.uploadedAt) }}</div>
                <div>
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="downloadingGreyCard"
                    [fullWidth]="true"
                    (onClick)="downloadFile(getGreyCardDocument()?.id || 0, 'greycard')"
                  >
                    <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </app-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state - improved spinner for mobile -->
    <div *ngIf="!submission && !error" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 sm:border-b-3 border-primary-500 dark:border-primary-400"></div>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="bg-white dark:bg-dark-800 shadow dark:shadow-dark-md rounded-lg p-4 sm:p-6 text-center transition-colors duration-200">
      <svg class="h-14 w-14 sm:h-16 sm:w-16 text-red-500 dark:text-red-400 mx-auto mb-3 sm:mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-2">Submission Not Found</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-4">The requested submission could not be found or you don't have permission to view it.</p>
      <app-button (onClick)="goBack()">Go Back</app-button>
    </div>
  `
})
export class SubmissionDetailComponent implements OnInit {
  submissionId!: number;
  submission: Submission | null = null;
  error = false;

  downloadingCin = false;
  downloadingPhoto = false;
  downloadingGreyCard = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly submissionService: SubmissionService,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.submissionId = +idParam;
        this.loadSubmission();
      } else {
        this.error = true;
      }
    });
  }

  loadSubmission(): void {
    this.submissionService.getSubmissionById(this.submissionId).subscribe({
      next: (submission) => {
        this.submission = submission;
      },
      error: () => {
        this.error = true;
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  getCinDocument() {
    return this.submission?.files.find(f => f.fileType === FileType.Cin);
  }

  getPersonalPhoto() {
    return this.submission?.files.find(f => f.fileType === FileType.PIC);
  }

  getGreyCardDocument() {
    return this.submission?.files.find(f => f.fileType === FileType.CG);
  }

  downloadFile(fileId: number, fileType: 'cin' | 'photo' | 'greycard'): void {
    if (!fileId) return;

    switch (fileType) {
      case 'cin': this.downloadingCin = true; break;
      case 'photo': this.downloadingPhoto = true; break;
      case 'greycard': this.downloadingGreyCard = true; break;
    }

    this.fileService.downloadFile(fileId).subscribe({
      next: (blob) => {
        let fileName = '';
        const nameBase = `${this.submission?.lastName}_${this.submission?.firstName}`.replace(/\s+/g, '_') ?? 'document';

        switch (fileType) {
          case 'cin':
            fileName = `CIN_${nameBase}_${this.submission?.cin ?? ''}.${this.getFileExtension(blob)}`;
            break;
          case 'photo':
            fileName = `Photo_${nameBase}.${this.getFileExtension(blob)}`;
            break;
          case 'greycard':
            fileName = `GreyCard_${nameBase}_${this.submission?.greyCard ?? ''}.${this.getFileExtension(blob)}`;
            break;
        }

        this.fileService.saveFile(blob, fileName);
        this.notificationService.success('File downloaded successfully');
      },
      error: (error) => {
        this.notificationService.error('Failed to download file. Please try again later.');
        console.error('Download error:', error);
      },
      complete: () => {
        switch (fileType) {
          case 'cin': this.downloadingCin = false; break;
          case 'photo': this.downloadingPhoto = false; break;
          case 'greycard': this.downloadingGreyCard = false; break;
        }
      }
    });
  }

  getFileExtension(blob: Blob): string {
    switch (blob.type) {
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'application/pdf': return 'pdf';
      default: return 'dat';
    }
  }

  goBack(): void {
    this.router.navigate(['/submissions']);
  }

  // Add this helper method to the class for file extension display:
  formatFileExt(fileName?: string): string {
    if (!fileName) return '';
    const ext = fileName.split('.').pop()?.toUpperCase();
    return ext || '';
  }
}
