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
    <div *ngIf="submission" class="bg-white shadow rounded-lg">
      <!-- Header with back button -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
          <button (click)="goBack()" class="mr-2 text-gray-500 hover:text-gray-700">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-gray-900">Submission Details</h1>
        </div>
        <div class="text-sm text-gray-500">
          Submitted on {{ formatDate(submission.createdAt) }}
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Personal Information Section -->
        <div class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Full Name -->
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Full Name</div>
              <div class="text-base text-gray-900">{{ submission.fullName }}</div>
            </div>

            <!-- TE ID -->
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">TE ID</div>
              <div class="text-base text-gray-900">{{ submission.teId }}</div>
            </div>

            <!-- CIN -->
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">CIN</div>
              <div class="text-base text-gray-900">{{ submission.cin }}</div>
            </div>

            <!-- Date of Birth -->
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Date of Birth</div>
              <div class="text-base text-gray-900">{{ formatDate(submission.dateOfBirth) }}</div>
            </div>

            <!-- Plant -->
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">Plant</div>
              <div class="text-base text-gray-900">{{ submission.plantName }}</div>
            </div>

            <!-- Grey Card (if present) -->
            <div *ngIf="submission.greyCard">
              <div class="text-sm font-medium text-gray-500 mb-1">Grey Card Number</div>
              <div class="text-base text-gray-900">{{ submission.greyCard }}</div>
            </div>
          </div>
        </div>

        <!-- Documents Section -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Documents</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- CIN Document -->
            <div *ngIf="getCinDocument()" class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-700">CIN Document</h3>
              </div>
              <div class="p-4">
                <div class="text-sm text-gray-500 mb-2">Filename: {{ getCinDocument()?.fileName }}</div>
                <div class="text-sm text-gray-500 mb-4">Uploaded: {{ formatDate(getCinDocument()?.uploadedAt) }}</div>
                <div>
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="downloadingCin"
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
            <div *ngIf="getPersonalPhoto()" class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-700">Personal Photo</h3>
              </div>
              <div class="p-4">
                <div class="text-sm text-gray-500 mb-2">Filename: {{ getPersonalPhoto()?.fileName }}</div>
                <div class="text-sm text-gray-500 mb-4">Uploaded: {{ formatDate(getPersonalPhoto()?.uploadedAt) }}</div>
                <div>
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="downloadingPhoto"
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
            <div *ngIf="getGreyCardDocument()" class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <h3 class="text-sm font-medium text-gray-700">Grey Card Document</h3>
              </div>
              <div class="p-4">
                <div class="text-sm text-gray-500 mb-2">Filename: {{ getGreyCardDocument()?.fileName }}</div>
                <div class="text-sm text-gray-500 mb-4">Uploaded: {{ formatDate(getGreyCardDocument()?.uploadedAt) }}</div>
                <div>
                  <app-button
                    variant="outline"
                    size="sm"
                    [loading]="downloadingGreyCard"
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

    <!-- Loading state -->
    <div *ngIf="!submission && !error" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div *ngIf="error" class="bg-white shadow rounded-lg p-6 text-center">
      <svg class="h-16 w-16 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 class="text-xl font-medium text-gray-900 mb-2">Submission Not Found</h2>
      <p class="text-gray-500 mb-4">The requested submission could not be found or you don't have permission to view it.</p>
      <app-button (onClick)="goBack()">Go Back</app-button>
    </div>
  `
})
export class SubmissionDetailComponent implements OnInit {
  submissionId!: number;
  submission: Submission | null = null;
  error = false;

  // Download loading states
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

    // Set the appropriate loading flag
    switch (fileType) {
      case 'cin': this.downloadingCin = true; break;
      case 'photo': this.downloadingPhoto = true; break;
      case 'greycard': this.downloadingGreyCard = true; break;
    }

    this.fileService.downloadFile(fileId).subscribe({
      next: (blob) => {
        // Determine filename based on file type and submission info
        let fileName = '';
        const nameBase = this.submission?.fullName.replace(/\s+/g, '_') || 'document';

        switch (fileType) {
          case 'cin':
            fileName = `CIN_${nameBase}_${this.submission?.cin || ''}.${this.getFileExtension(blob)}`;
            break;
          case 'photo':
            fileName = `Photo_${nameBase}.${this.getFileExtension(blob)}`;
            break;
          case 'greycard':
            fileName = `GreyCard_${nameBase}_${this.submission?.greyCard || ''}.${this.getFileExtension(blob)}`;
            break;
        }

        // Trigger the download
        this.fileService.saveFile(blob, fileName);
        this.notificationService.success('File downloaded successfully');
      },
      error: (error) => {
        this.notificationService.error('Failed to download file. Please try again later.');
        console.error('Download error:', error);
      },
      complete: () => {
        // Reset the loading flag
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
}
