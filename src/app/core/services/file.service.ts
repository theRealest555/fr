import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/files`;

  constructor(private http: HttpClient) { }

  /**
   * Downloads a file by ID
   * @param fileId The ID of the file to download
   * @returns A blob of the file data
   */
  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${fileId}/download`, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error downloading file', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Helper method to trigger file download in the browser
   * @param blob The file blob
   * @param fileName The name to save the file as
   */
  saveFile(blob: Blob, fileName: string): void {
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;

    // Append to the document, click, and clean up
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * Determines the file type from a MIME type
   * @param mimeType The MIME type
   * @returns A string representing the file type
   */
  getFileTypeFromMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return 'Image';
    } else if (mimeType.startsWith('application/pdf')) {
      return 'PDF';
    } else if (mimeType.includes('word')) {
      return 'Word Document';
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return 'Excel Document';
    } else {
      return 'Document';
    }
  }
}
