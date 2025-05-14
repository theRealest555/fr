// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    // Load user from storage if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.loadUserProfile();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          this.loadUserProfile();
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('auth_token');
          this.currentUserSubject.next(null);
        })
      );
  }

  loadUserProfile(): void {
    this.http.get<User>(`${this.apiUrl}/profile`).subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => {
        localStorage.removeItem('auth_token');
        this.currentUserSubject.next(null);
      }
    });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }
}
