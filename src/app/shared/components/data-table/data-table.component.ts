// Updated DataTable Component with better responsiveness for Angular 19
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800">
      <!-- Mobile & Tablet View (Cards Layout) -->
      <div class="md:hidden">
        <div *ngIf="paginatedData.length === 0" class="p-6 text-center text-gray-500 dark:text-gray-400">
          {{ emptyMessage }}
        </div>

        <div *ngIf="paginatedData.length > 0" class="divide-y divide-gray-200 dark:divide-dark-700">
          <div *ngFor="let item of paginatedData; let i = index"
              class="p-4"
              [ngClass]="{'bg-gray-50': i % 2 === 1, 'dark:bg-dark-700/30': i % 2 === 1}">
            <div class="space-y-3">
              <div *ngFor="let column of columns">
                <div class="flex justify-between items-start gap-4">
                  <div class="text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[120px]">
                    {{ column.title }}
                  </div>
                  <div class="text-sm text-right text-gray-900 dark:text-white flex-1">
                    <ng-container *ngIf="column.template && isTemplateRef(column.template); else defaultCell">
                      <ng-container *ngTemplateOutlet="column.template; context: {$implicit: item, column: column}">
                      </ng-container>
                    </ng-container>
                    <ng-template #defaultCell>
                      <ng-container *ngIf="column.template && !isTemplateRef(column.template); else plainValue">
                        <span [innerHTML]="sanitizeHTML(column.template(item, column.field))"></span>
                      </ng-container>
                      <ng-template #plainValue>
                        <span class="break-words">{{ getPropertyValue(item, column.field) }}</span>
                      </ng-template>
                    </ng-template>
                  </div>
                </div>
              </div>

              <!-- Mobile Actions -->
              <div *ngIf="actionTemplate" class="mt-4 flex justify-end">
                <ng-container *ngTemplateOutlet="actionTemplate; context: {$implicit: item}"></ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop View (Traditional Table) -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
          <thead class="bg-gray-50 dark:bg-dark-800">
            <tr>
              <th *ngFor="let column of columns"
                  scope="col"
                  (click)="column.sortable ? onSort(column.field) : null"
                  [ngClass]="column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-700' : ''"
                  class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-150 whitespace-nowrap">
                <div class="flex items-center">
                  {{ column.title }}

                  <!-- Sort indicator -->
                  <div *ngIf="column.sortable" class="ml-1 flex-shrink-0">
                    <svg *ngIf="sortColumn !== column.field" class="h-4 w-4 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 10a1 1 0 0 1 1-1h8a1 1 0 0 1 0 2H6a1 1 0 0 1-1-1Z" />
                      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Zm-3.25 9.5a.75.75 0 0 1 1.1 1.02l2.7 2.908 2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 0-1.02Z" clip-rule="evenodd" />
                    </svg>
                    <svg *ngIf="sortColumn === column.field && sortDirection === 'asc'" class="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 3a.75.75 0 0 1 .55.24l3.25 3.5a.75.75 0 1 1-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 0 1-1.1-1.02l3.25-3.5A.75.75 0 0 1 10 3Z" clip-rule="evenodd" />
                    </svg>
                    <svg *ngIf="sortColumn === column.field && sortDirection === 'desc'" class="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 17a.75.75 0 0 1-.55-.24l-3.25-3.5a.75.75 0 1 1 1.1-1.02L10 15.148l2.7-2.908a.75.75 0 1 1 1.1 1.02l-3.25 3.5A.75.75 0 0 1 10 17Z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </th>
              <th *ngIf="actionTemplate" scope="col" class="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
            <tr *ngFor="let item of paginatedData; let even = even; let odd = odd"
                [ngClass]="(even ? 'bg-white dark:bg-dark-800' : 'bg-gray-50 dark:bg-dark-900/30') + ' hover:bg-gray-100 dark:hover:bg-dark-700/50 transition-colors duration-150'">
              <td *ngFor="let column of columns"
                  class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <ng-container *ngIf="column.template && isTemplateRef(column.template); else defaultCell">
                  <ng-container *ngTemplateOutlet="column.template; context: {$implicit: item, column: column}"></ng-container>
                </ng-container>
                <ng-template #defaultCell>
                  <ng-container *ngIf="column.template && !isTemplateRef(column.template); else plainValue">
                    <span [innerHTML]="sanitizeHTML(column.template(item, column.field))"></span>
                  </ng-container>
                  <ng-template #plainValue>
                    <span class="truncate block max-w-xs">{{ getPropertyValue(item, column.field) }}</span>
                  </ng-template>
                </ng-template>
              </td>
              <td *ngIf="actionTemplate" class="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <ng-container *ngTemplateOutlet="actionTemplate; context: {$implicit: item}"></ng-container>
              </td>
            </tr>
            <tr *ngIf="paginatedData.length === 0">
              <td [attr.colspan]="columns.length + (actionTemplate ? 1 : 0)" class="px-3 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {{ emptyMessage }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div *ngIf="pagination && totalPages > 1"
           class="bg-white dark:bg-dark-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-dark-700 sm:px-6">
        <!-- Mobile pagination UI -->
        <div class="flex-1 flex flex-col sm:hidden space-y-3">
          <div class="flex justify-between items-center">
            <button
              (click)="onPageChange(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700 dark:text-gray-300">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              (click)="onPageChange(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="text-xs text-center text-gray-500 dark:text-gray-400">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, data.length) }} of {{ data.length }} results
          </div>
        </div>

        <!-- Desktop pagination UI -->
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * pageSize, data.length) }}</span>
              of
              <span class="font-medium">{{ data.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                (click)="onPageChange(currentPage - 1)"
                [disabled]="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>

              <ng-container *ngFor="let page of pageNumbers">
                <button
                  *ngIf="page !== '...'"
                  (click)="onPageChange(page)"
                  [ngClass]="page === currentPage
                    ? 'z-10 bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-600 text-primary-600 dark:text-primary-400 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                    : 'bg-white dark:bg-dark-700 border-gray-300 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium'"
                >
                  {{ page }}
                </button>
                <span
                  *ngIf="page === '...'"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  ...
                </span>
              </ng-container>

              <button
                (click)="onPageChange(currentPage + 1)"
                [disabled]="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    /* Responsive text wrapping */
    @media (max-width: 768px) {
      :host ::ng-deep .break-words {
        word-break: break-word;
        hyphens: auto;
      }
    }

    /* Custom scrollbar */
    :host ::ng-deep .overflow-x-auto {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
    }

    :host ::ng-deep .overflow-x-auto::-webkit-scrollbar {
      height: 6px;
    }

    :host ::ng-deep .overflow-x-auto::-webkit-scrollbar-track {
      background: transparent;
    }

    :host ::ng-deep .overflow-x-auto::-webkit-scrollbar-thumb {
      background-color: rgba(156, 163, 175, 0.3);
      border-radius: 3px;
    }
  `]
})
export class DataTableComponent implements OnChanges, OnInit {
  @Input() columns: Array<{
    field: string;
    title: string;
    template?: any;
    sortable?: boolean;
  }> = [];

  @Input() data: any[] = [];
  @Input() actionTemplate: any;
  @Input() emptyMessage = 'No data available';

  // Pagination
  @Input() pagination = true;
  @Input() pageSize = 10;

  // Sorting
  @Input() defaultSortColumn = '';
  @Input() defaultSortDirection: 'asc' | 'desc' = 'asc';

  @Output() pageChanged = new EventEmitter<number>();
  @Output() sortChanged = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();

  currentPage = 1;
  totalPages = 1;
  paginatedData: any[] = [];
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  Math = Math; // Expose Math to the template
  pageNumbers: Array<number | string> = [];
  screenWidth = 0;

  constructor(private readonly sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.updatePageNumbers();

    if (this.defaultSortColumn) {
      this.sortColumn = this.defaultSortColumn;
      this.sortDirection = this.defaultSortDirection;
      this.sortData();
    }

    this.updatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['pageSize']) {
      this.sortData();
      this.updatePagination();
    }

    if (changes['defaultSortColumn'] && this.defaultSortColumn && !this.sortColumn) {
      this.sortColumn = this.defaultSortColumn;
      this.sortDirection = this.defaultSortDirection;
      this.sortData();
      this.updatePagination();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.screenWidth = window.innerWidth;
    this.updatePageNumbers();
  }

  isTemplateRef(template: any): boolean {
    return template instanceof TemplateRef;
  }

  sanitizeHTML(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getPropertyValue(item: any, field: string): any {
    // Handle nested properties with dot notation (e.g., 'user.name')
    if (!item || !field) return '';

    const props = field.split('.');
    let value = item;

    for (const prop of props) {
      if (value == null) {
        return '';
      }
      value = value[prop];
    }

    return value;
  }

  onPageChange(page: number | string): void {
    // Skip if the page is not a number (like the ellipsis)
    if (typeof page === 'string') return;

    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.updatePagination();
    this.pageChanged.emit(page);
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      // Toggle direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortData();
    this.updatePagination();
    this.sortChanged.emit({ column: this.sortColumn, direction: this.sortDirection });
  }

  private sortData(): void {
    if (this.sortColumn) {
      // Create a sorted copy of the data
      const sortedData = [...this.data].sort((a, b) => {
        const aValue = this.getPropertyValue(a, this.sortColumn);
        const bValue = this.getPropertyValue(b, this.sortColumn);

        if (aValue === bValue) return 0;

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return this.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // For numbers, dates, etc.
        if (this.sortDirection === 'asc') {
          if (aValue < bValue) return -1;
          return 1;
        } else {
          if (bValue < aValue) return -1;
          return 1;
        }
      });

      this.data = sortedData;
    }
  }

  private updatePagination(): void {
    if (!this.pagination) {
      this.paginatedData = this.data;
      return;
    }

    this.totalPages = Math.max(1, Math.ceil(this.data.length / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.data.length);

    this.paginatedData = this.data.slice(startIndex, endIndex);
    this.updatePageNumbers();
  }

  private updatePageNumbers(): void {
    this.pageNumbers = this.getPageNumbers();
  }

  private getPageNumbers(): Array<number | string> {
    const pages: Array<number | string> = [];
    const maxVisiblePages = this.screenWidth < 640 ? 3 : 7; // Show fewer page buttons on mobile

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if less than or equal to maxVisiblePages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last page, and a few around the current page
      pages.push(1);

      if (this.currentPage > 3) {
        pages.push('...');
      }

      // Calculate start and end of page numbers around current page
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);

      // Adjust for smaller screens
      if (this.screenWidth < 640) {
        start = Math.max(2, this.currentPage);
        end = Math.min(this.totalPages - 1, this.currentPage);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push('...');
      }

      pages.push(this.totalPages);
    }

    return pages;
  }
}
