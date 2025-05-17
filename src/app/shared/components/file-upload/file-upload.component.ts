// Updated File Upload Component with improved responsiveness and mobile handling
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-1 flex justify-center px-4 py-4 sm:px-6 sm:pt-5 sm:pb-6 border-2 rounded-md"
         [class]="isDragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-dark-600 border-dashed'"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave($event)"
         (drop)="onDrop($event)">
      <div class="space-y-1 text-center">
        <!-- Different icon sizes for mobile vs desktop -->
        <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        <div class="flex flex-wrap justify-center text-sm text-gray-600 dark:text-gray-400">
          <label [for]="inputId" class="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300 mx-1">
            <span>Upload a file</span>
            <input [id]="inputId" type="file" class="sr-only" [accept]="accept" [multiple]="multiple" (change)="onFileSelected($event)">
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>

        <p class="text-xs text-gray-500 dark:text-gray-500">
          {{ helperText }}
        </p>

        <!-- Mobile-specific instructions -->
        <p *ngIf="isMobileDevice()" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
          On mobile, tap to select a file from your device
        </p>

        <!-- File Preview (if a file is selected) -->
        <div *ngIf="selectedFile" class="mt-3 flex items-center text-sm text-gray-700 dark:text-gray-300">
          <svg class="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <!-- Truncate filename if too long -->
          <span class="truncate max-w-[180px] sm:max-w-[240px]" [title]="selectedFile.name">{{ selectedFile.name }}</span>
          <span class="ml-2 text-gray-500 dark:text-gray-400">({{ formatFileSize(selectedFile.size) }})</span>
          <button type="button" class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" (click)="removeFile()">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Error Message - More visible on mobile -->
        <p *ngIf="errorMessage" class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* Make the dropzone more touch-friendly on mobile */
    @media (max-width: 640px) {
      :host ::ng-deep div[class*="border-2"] {
        min-height: 120px;
      }

      /* Larger remove button for touch targets */
      :host ::ng-deep button {
        padding: 4px;
      }
    }

    /* Fix iOS scroll issues during drag */
    :host ::ng-deep input[type="file"] {
      -webkit-appearance: none;
    }
  `]
})
export class FileUploadComponent {
  @Input() inputId = 'file-upload';
  @Input() accept = 'image/*';
  @Input() multiple = false;
  @Input() maxSizeInMB = 5;
  @Input() helperText = 'PNG, JPG, GIF up to 5MB';
  @Input() errorMessage = '';

  @Output() fileSelected = new EventEmitter<File | null>();

  selectedFile: File | null = null;
  isDragOver = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.fileSelected.emit(file);
        this.errorMessage = '';
      } else {
        this.selectedFile = null;
        this.fileSelected.emit(null);

        // More specific error messages for mobile users
        if (file.size > this.maxSizeInMB * 1024 * 1024) {
          this.errorMessage = `File is too large. Maximum size is ${this.maxSizeInMB}MB.`;
        } else {
          this.errorMessage = `Invalid file type. Please use ${this.getAcceptedFileTypes()}.`;
        }
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (this.validateFile(file)) {
        this.selectedFile = file;
        this.fileSelected.emit(file);
        this.errorMessage = '';
      } else {
        this.selectedFile = null;
        this.fileSelected.emit(null);

        // More specific error messages
        if (file.size > this.maxSizeInMB * 1024 * 1024) {
          this.errorMessage = `File is too large. Maximum size is ${this.maxSizeInMB}MB.`;
        } else {
          this.errorMessage = `Invalid file type. Please use ${this.getAcceptedFileTypes()}.`;
        }
      }
    }
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileSelected.emit(null);
  }

  validateFile(file: File): boolean {
    // Check file size
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return false;
    }

    // Check file type if accept is specified
    if (this.accept && this.accept !== '*') {
      // Convert accept string to array of MIME types
      const acceptedTypes = this.accept.split(',').map(type => type.trim());

      // Check if file type matches any of the accepted types
      const fileType = file.type;

      // Special handling for wildcards like 'image/*'
      const isAccepted = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(category);
        }
        return type === fileType;
      });

      if (!isAccepted) {
        return false;
      }
    }

    return true;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  }

  // Helper to check if user is on a mobile device
  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth < 640;
  }

  // Helper to get human-readable accepted file types
  getAcceptedFileTypes(): string {
    if (this.accept === 'image/*') {
      return 'image files';
    } else if (this.accept === 'image/jpeg,image/png') {
      return 'JPG or PNG files';
    } else if (this.accept === 'application/pdf') {
      return 'PDF files';
    } else {
      // Extract extensions from MIME types
      const types = this.accept.split(',').map(type => {
        const parts = type.trim().split('/');
        if (parts.length === 2) {
          if (parts[1] === '*') {
            return parts[0] + ' files';
          } else {
            return '.' + parts[1];
          }
        }
        return type;
      });

      return types.join(', ');
    }
  }
}
