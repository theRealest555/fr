import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:5268/api/files';

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
}
