import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 rounded-md"
         [class]="isDragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 border-dashed'"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave($event)"
         (drop)="onDrop($event)">
      <div class="space-y-1 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        <div class="flex text-sm text-gray-600">
          <label [for]="inputId" class="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
            <span>Upload a file</span>
            <input [id]="inputId" type="file" class="sr-only" [accept]="accept" [multiple]="multiple" (change)="onFileSelected($event)">
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>

        <p class="text-xs text-gray-500">
          {{ helperText }}
        </p>

        <!-- File Preview (if a file is selected) -->
        <div *ngIf="selectedFile" class="mt-2 flex items-center text-sm text-gray-700">
          <svg class="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span class="truncate" [title]="selectedFile.name">{{ selectedFile.name }}</span>
          <span class="ml-2 text-gray-500">({{ formatFileSize(selectedFile.size) }})</span>
          <button type="button" class="ml-2 text-red-500 hover:text-red-700" (click)="removeFile()">
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Error Message -->
        <p *ngIf="errorMessage" class="mt-2 text-sm text-red-600">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  `
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
        this.errorMessage = `Invalid file. Please upload a file that is less than ${this.maxSizeInMB}MB and is of the correct type.`;
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
        this.errorMessage = `Invalid file. Please upload a file that is less than ${this.maxSizeInMB}MB and is of the correct type.`;
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

      if (this.accept && this.accept !== '*') {
      const acceptedTypes = this.accept.split(',').map(type => type.trim());

      const fileType = file.type;

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
}
