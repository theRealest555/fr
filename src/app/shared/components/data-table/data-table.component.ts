import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th *ngFor="let column of columns"
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ column.title }}
            </th>
            <th *ngIf="actionTemplate" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr *ngFor="let item of data" class="hover:bg-gray-50">
            <td *ngFor="let column of columns"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <ng-container *ngIf="column.template && isTemplateRef(column.template); else defaultCell">
                <ng-container *ngTemplateOutlet="column.template; context: {$implicit: item, column: column}"></ng-container>
              </ng-container>
              <ng-template #defaultCell>
                <ng-container *ngIf="column.template && !isTemplateRef(column.template); else plainValue">
                  <span [innerHTML]="sanitizeHTML(column.template(item))"></span>
                </ng-container>
                <ng-template #plainValue>
                  {{ getPropertyValue(item, column.field) }}
                </ng-template>
              </ng-template>
            </td>
            <td *ngIf="actionTemplate" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <ng-container *ngTemplateOutlet="actionTemplate; context: {$implicit: item}"></ng-container>
            </td>
          </tr>
          <tr *ngIf="data.length === 0">
            <td [colSpan]="columns.length + (actionTemplate ? 1 : 0)" class="px-6 py-4 text-center text-sm text-gray-500">
              {{ emptyMessage }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DataTableComponent implements OnChanges {
  @Input() columns: Array<{
    field: string;
    title: string;
    template?: any;
  }> = [];

  @Input() data: any[] = [];
  @Input() actionTemplate: any;
  @Input() emptyMessage = 'No data available';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    // You can add additional logic when inputs change
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
}