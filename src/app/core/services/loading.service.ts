// src/app/core/services/loading.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingMap = new Map<string, boolean>();

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Start loading for a given request ID
   * @param requestId Unique identifier for the request
   */
  setLoading(requestId: string, loading: boolean): void {
    if (loading) {
      this.loadingMap.set(requestId, true);
      this.loadingSubject.next(true);
    } else {
      this.loadingMap.delete(requestId);
      this.loadingSubject.next(this.loadingMap.size > 0);
    }
  }

  /**
   * Check if any request is currently loading
   */
  isLoading(): boolean {
    return this.loadingMap.size > 0;
  }
}
