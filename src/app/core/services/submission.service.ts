import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Submission, SubmissionRequest, ExportRequest } from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private apiUrl = `${environment.apiUrl}/submissions`;
  private exportUrl = `${environment.apiUrl}/export`;

  constructor(private http: HttpClient) { }

  getAllSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Get all submissions error', error);
          return throwError(() => error);
        })
      );
  }

  getSubmissionsByPlant(plantId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.apiUrl}/plant/${plantId}`)
      .pipe(
        catchError(error => {
          console.error(`Get submissions for plant ${plantId} error`, error);
          return throwError(() => error);
        })
      );
  }

  getSubmissionById(id: number): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Get submission ${id} error`, error);
          return throwError(() => error);
        })
      );
  }

  // New methods for the dashboard component
  getRecentSubmissions(): Observable<Submission[]> {
    // By default, we'll just get all submissions and let the component limit the number
    return this.getAllSubmissions();
  }

  getRecentSubmissionsByPlant(plantId: number): Observable<Submission[]> {
    // By default, we'll just get all plant submissions and let the component limit the number
    return this.getSubmissionsByPlant(plantId);
  }

  createSubmission(submission: SubmissionRequest): Observable<any> {
    // We need to use FormData for file uploads
    const formData = new FormData();

    // Add text fields
    formData.append('fullName', submission.fullName);
    formData.append('teId', submission.teId);
    formData.append('cin', submission.cin);
    formData.append('dateOfBirth', submission.dateOfBirth);
    formData.append('plantId', submission.plantId.toString());

    if (submission.greyCard) {
      formData.append('greyCard', submission.greyCard);
    }

    // Add files
    formData.append('cinImage', submission.cinImage);
    formData.append('picImage', submission.picImage);

    if (submission.greyCardImage) {
      formData.append('greyCardImage', submission.greyCardImage);
    }

    return this.http.post(this.apiUrl, formData)
      .pipe(
        catchError(error => {
          console.error('Create submission error', error);
          return throwError(() => error);
        })
      );
  }

  exportData(exportRequest: ExportRequest): Observable<Blob> {
    return this.http.post(this.exportUrl, exportRequest, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Export data error', error);
        return throwError(() => error);
      })
    );
  }
}
