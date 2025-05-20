import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plant, CreatePlantRequest, UpdatePlantRequest } from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private readonly apiUrl = `${environment.apiUrl}/Plants`;

  constructor(private readonly http: HttpClient) { }

  // Get all plants
  getAllPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching plants:', error);
          return throwError(() => error);
        })
      );
  }

  // Get a specific plant by ID
  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching plant ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Create a new plant (SuperAdmin only)
  createPlant(plant: CreatePlantRequest): Observable<Plant> {
    return this.http.post<Plant>(this.apiUrl, plant)
      .pipe(
        catchError(error => {
          console.error('Error creating plant:', error);
          return throwError(() => error);
        })
      );
  }

  // Update an existing plant (SuperAdmin only)
  updatePlant(id: number, plant: UpdatePlantRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, plant)
      .pipe(
        catchError(error => {
          console.error(`Error updating plant ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Delete a plant (SuperAdmin only)
  deletePlant(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Error deleting plant ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Get plant statistics
  getPlantStatistics(plantId: number): Observable<any> {
    // This would be a custom endpoint if available, but we can derive this information
    // from submission data if needed
    return this.http.get<any>(`${this.apiUrl}/${plantId}/statistics`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching statistics for plant ${plantId}:`, error);
          return throwError(() => error);
        })
      );
  }
}
