import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Submission, SubmissionRequest, ExportRequest } from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private readonly apiUrl = `${environment.apiUrl}/Submissions`;
  private readonly exportUrl = `${environment.apiUrl}/Export`;

  constructor(private readonly http: HttpClient) { }

  // Get all submissions (SuperAdmin only)
  getAllSubmissions(): Observable<Submission[]> {
    return this.http.get<Submission[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching all submissions:', error);
          return throwError(() => error);
        })
      );
  }

  // Get submissions for a specific plant
  getSubmissionsByPlant(plantId: number): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.apiUrl}/plant/${plantId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching submissions for plant ${plantId}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Get single submission by ID
  getSubmissionById(id: number): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching submission ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Create a new submission (public endpoint)
  createSubmission(submission: SubmissionRequest): Observable<{ message: string, id: number }> {
    // We need to use FormData for file uploads
    const formData = new FormData();

    // Add text fields
    formData.append('firstName', submission.firstName);
    formData.append('lastName', submission.lastName);
    formData.append('gender', submission.gender.toString());
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

    return this.http.post<{ message: string, id: number }>(this.apiUrl, formData)
      .pipe(
        catchError(error => {
          console.error('Error creating submission:', error);
          return throwError(() => error);
        })
      );
  }

  // Get recent submissions for dashboard
  getRecentSubmissions(limit: number = 5): Observable<Submission[]> {
    // No specific endpoint for recent submissions, so we'll get all and limit client-side
    return this.getAllSubmissions();
  }

  // Get recent submissions for a specific plant
  getRecentSubmissionsByPlant(plantId: number, limit: number = 5): Observable<Submission[]> {
    // No specific endpoint for recent submissions, so we'll get all for plant and limit client-side
    return this.getSubmissionsByPlant(plantId);
  }

  // Export data to Excel
  exportData(exportRequest: ExportRequest): Observable<Blob> {
    return this.http.post(this.exportUrl, exportRequest, {
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error exporting data:', error);
        return throwError(() => error);
      })
    );
  }

  // Search and filter submissions
  searchSubmissions(
    plantId?: number,
    searchTerm?: string,
    hasGreyCard?: boolean,
    startDate?: string,
    endDate?: string
  ): Observable<Submission[]> {
    // Since we don't have a specific search endpoint, we'll fetch the appropriate data
    // and filter client-side based on the parameters

    if (plantId) {
      return this.getSubmissionsByPlant(plantId);
    } else {
      return this.getAllSubmissions();
    }
  }
}
