// Fixed File Upload Component with improved responsiveness, accessibility and mobile handling
import { Component, EventEmitter, Input, Output, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="mt-1 flex justify-center px-4 py-4 sm:px-6 sm:pt-5 sm:pb-6 border-2 rounded-md"
      [class]="isDragOver ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-dark-600 border-dashed'"
      [class.border-red-300]="errorMessage"
      [class.dark:border-red-700]="errorMessage"
      [class.bg-red-50]="errorMessage"
      [class.dark:bg-red-900/10]="errorMessage"
      [attr.aria-label]="'File upload area. ' + helperText"
      [attr.aria-describedby]="errorMessage ? 'file-upload-error' : null"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (keydown)="onKeyDown($event)"
      tabindex="0"
      role="button">
      <div class="space-y-1 text-center">
        <!-- Different icon sizes for mobile vs desktop -->
        <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>

        <div class="flex flex-wrap justify-center text-sm text-gray-600 dark:text-gray-400">
          <label [for]="inputId" class="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 dark:text-primary-400 dark:hover:text-primary-300 mx-1 px-2 py-1 touch-feedback">
            <span>Upload a file</span>
            <input [id]="inputId" type="file" class="sr-only" [accept]="accept" [multiple]="multiple" (change)="onFileSelected($event)" aria-label="File input">
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

        <!-- File Preview with multiple file support -->
        <div *ngIf="selectedFiles.length > 0" class="mt-3 flex flex-col items-center justify-center text-sm text-gray-700 dark:text-gray-300">
          <div *ngFor="let file of selectedFiles; let i = index" class="flex items-center max-w-full p-2 bg-gray-50 dark:bg-dark-700/50 rounded-md mb-1">
            <svg class="h-5 w-5 text-green-500 flex-shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <!-- Filename with accessible tooltip -->
            <div class="flex-1 min-w-0 group relative">
              <span 
                class="truncate max-w-[180px] sm:max-w-[240px] inline-block" 
                [id]="'file-name-' + i"
                [attr.title]="file.name"
                tabindex="0">{{ file.name }}</span>
              <span 
                [id]="'tooltip-' + i"
                class="absolute left-0 -bottom-5 bg-gray-800 text-white text-xs rounded px-2 py-1 hidden group-hover:block group-focus-within:block z-10 whitespace-nowrap">
                {{ file.name }}
              </span>
            </div>
            <span class="ml-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">({{ formatFileSize(file.size) }})</span>
            <button 
              type="button" 
              class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1.5 touch-feedback" 
              (click)="removeFile(i)"
              aria-label="Remove file">
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message - More visible on mobile -->
        <p *ngIf="errorMessage" id="file-upload-error" class="mt-2 text-sm text-red-600 dark:text-red-500 font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-md" role="alert">
          {{ errorMessage }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    /* Make the dropzone more touch-friendly on mobile */
    @media (max-width: 640px) {
      :host ::ng-deep div[class*="border-2"] {
        min-height: 130px;
      }

      /* Larger remove button for touch targets */
      :host ::ng-deep button {
        padding: 8px;
        min-height: 36px;
        min-width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Ensure the file upload label is easily tappable */
      :host ::ng-deep label[for] {
        padding: 8px 12px;
        margin: 4px;
        background-color: rgba(249, 250, 251, 0.1);
        border-radius: 0.375rem;
        display: inline-block;
      }
    }

    /* Fix iOS scroll issues during drag */
    :host ::ng-deep input[type="file"] {
      -webkit-appearance: none;
    }
    
    /* Ripple effect for better touch feedback */
    .touch-feedback {
      position: relative;
      overflow: hidden;
    }
    
    .touch-feedback:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, rgba(0, 0, 0, .4) 10%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform .3s, opacity .5s;
    }
    
    .touch-feedback:active:after {
      transform: scale(0, 0);
      opacity: .3;
      transition: 0s;
    }

    /* Keyboard focus styles for accessibility */
    :host ::ng-deep [tabindex]:focus {
      outline: 2px solid rgba(59, 130, 246, 0.5);
      outline-offset: 2px;
    }

    :host ::ng-deep [tabindex]:focus:not(:focus-visible) {
      outline: none;
    }

    /* Responsive text wrapping like in the data table component */
    @media (max-width: 768px) {
      :host ::ng-deep .truncate {
        word-break: break-word;
        hyphens: auto;
        white-space: normal;
      }
    }
  `]
})
export class FileUploadComponent implements OnInit {
  @Input() inputId = 'file-upload';
  @Input() accept = 'image/*';
  @Input() multiple = false;
  @Input() maxSizeInMB = 5;
  @Input() helperText = 'PNG, JPG, GIF up to 5MB';
  @Input() errorMessage = '';

  @Output() fileSelected = new EventEmitter<File | null>();
  @Output() filesSelected = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  isDragOver = false;
  screenWidth = 0;
  
  // Cache for accepted file types
  private acceptedFileTypesCache = '';
  private acceptedFileTypesHumanReadable = '';

  ngOnInit(): void {
    // Pre-cache the accepted file types
    this.acceptedFileTypesHumanReadable = this.getAcceptedFileTypes();
    // Initialize screen width
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorMessage = '';

    if (!input.files || input.files.length === 0) {
      return;
    }
    
    // Process files
    this.processFiles(input.files, this.multiple);
    
    // Reset the input value to allow selecting the same file again
    input.value = '';
  }
  
  private processFiles(fileList: FileList, isMultiple: boolean): void {
    const validFiles: File[] = [];
    let hasInvalidFile = false;
    
    Array.from(fileList).forEach(file => {
      if (this.validateFile(file)) {
        validFiles.push(file);
      } else {
        hasInvalidFile = true;
        this.setErrorMessage(file);
      }
    });
    
    if (validFiles.length === 0) {
      if (hasInvalidFile && !this.errorMessage) {
        this.errorMessage = `Please upload valid ${this.getAcceptedFileTypes()} less than ${this.maxSizeInMB}MB.`;
      }
      return;
    }
    
    // Handle file selection
    if (isMultiple) {
      this.selectedFiles = [...this.selectedFiles, ...validFiles];
    } else {
      // For single file mode, just use the first valid file
      this.selectedFiles = [validFiles[0]];
    }
    
    // Emit events
    this.filesSelected.emit(this.selectedFiles);
    this.fileSelected.emit(this.selectedFiles[0]); // For backward compatibility
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
    this.errorMessage = '';

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files, this.multiple);
    }
  }

  removeFile(index: number): void {
    if (index >= 0 && index < this.selectedFiles.length) {
      this.selectedFiles.splice(index, 1);
      
      // Update outputs
      this.filesSelected.emit(this.selectedFiles);
      
      // Maintain backward compatibility
      if (this.selectedFiles.length > 0) {
        this.fileSelected.emit(this.selectedFiles[0]);
      } else {
        this.fileSelected.emit(null);
      }
    }
  }

  validateFile(file: File): boolean {
    // Check file size
    const maxSizeInBytes = this.maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return false;
    }

    // Check file type if accept is specified
    if (!this.accept || this.accept === '*') {
      return true;
    }
    
    // First check by MIME type
    const acceptedTypes = this.accept.split(',').map(type => type.trim());
    const fileType = file.type;
    
    // Check if file type matches any of the accepted types by MIME
    const isAcceptedByMime = this.checkMimeTypeMatch(fileType, acceptedTypes);
    if (isAcceptedByMime) {
      return true;
    }
    
    // If MIME type doesn't match, check by extension
    return this.checkExtensionMatch(file.name, acceptedTypes);
  }
  
  private checkMimeTypeMatch(fileType: string, acceptedTypes: string[]): boolean {
    return acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const category = type.split('/')[0];
        return fileType.startsWith(category);
      }
      return type === fileType;
    });
  }
  
  private checkExtensionMatch(fileName: string, acceptedTypes: string[]): boolean {
    fileName = fileName.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
    
    return acceptedTypes.some(type => {
      // If accept is like '.jpg, .png'
      if (type.startsWith('.')) {
        return type.substring(1).toLowerCase() === fileExtension;
      }
      
      // If accept is like 'image/jpeg'
      if (type.includes('/') && type !== '*/*' && !type.endsWith('/*')) {
        const extension = type.split('/')[1];
        return extension.toLowerCase() === fileExtension;
      }
      
      return false;
    });
  }

  setErrorMessage(file: File): void {
    if (file.size > this.maxSizeInMB * 1024 * 1024) {
      this.errorMessage = `File is too large. Maximum size is ${this.maxSizeInMB}MB.`;
    } else {
      this.errorMessage = `Invalid file type. Please use ${this.getAcceptedFileTypes()}.`;
    }
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

  // Improved mobile detection using HostListener and screenWidth
  isMobileDevice(): boolean {
    // Check for touch points as primary indicator
    if ('maxTouchPoints' in navigator) {
      return navigator.maxTouchPoints > 0;
    }
    
    // Fallback to screen size
    return this.screenWidth < 640;
  }

  // Cached version of accepted file types
  getAcceptedFileTypes(): string {
    // Return cached version if accept hasn't changed
    if (this.acceptedFileTypesCache === this.accept && this.acceptedFileTypesHumanReadable) {
      return this.acceptedFileTypesHumanReadable;
    }
    
    this.acceptedFileTypesCache = this.accept;
    
    if (this.accept === 'image/*') {
      this.acceptedFileTypesHumanReadable = 'image files';
    } else if (this.accept === 'image/jpeg,image/png') {
      this.acceptedFileTypesHumanReadable = 'JPG or PNG files';
    } else if (this.accept === 'application/pdf') {
      this.acceptedFileTypesHumanReadable = 'PDF files';
    } else {
      // Extract extensions from MIME types
      const types = this.accept.split(',').map(type => {
        type = type.trim();
        
        // If it's already an extension
        if (type.startsWith('.')) {
          return type;
        }
        
        const parts = type.split('/');
        if (parts.length === 2) {
          if (parts[1] === '*') {
            return parts[0] + ' files';
          } else {
            return '.' + parts[1];
          }
        }
        return type;
      });

      this.acceptedFileTypesHumanReadable = types.join(', ');
    }
    
    return this.acceptedFileTypesHumanReadable;
  }

  // Handle keyboard events for accessibility
  onKeyDown(event: KeyboardEvent): void {
    // Handle Enter or Space key to open file dialog
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const input = document.getElementById(this.inputId) as HTMLInputElement;
      if (input) {
        input.click();
      }
    }
  }
}