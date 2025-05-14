import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Plant } from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private readonly apiUrl = `${environment.apiUrl}/plants`;

  constructor(private readonly http: HttpClient) { }

  getAllPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Get plants error', error);
          return throwError(() => error);
        })
      );
  }

  getPlantById(id: number): Observable<Plant> {
    return this.http.get<Plant>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error(`Get plant ${id} error`, error);
          return throwError(() => error);
        })
      );
  }
}
