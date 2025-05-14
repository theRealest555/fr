import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterAdminRequest,
  ChangePasswordRequest
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private readonly tokenKey = 'auth_token';
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private readonly http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          this.loadUserProfile();
        }),
        catchError(error => {
          console.error('Login error', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => this.clearAuth()),
        catchError(error => {
          console.error('Logout error', error);
          // Still clear local auth even if server logout fails
          this.clearAuth();
          return throwError(() => error);
        })
      );
  }

  logoutAllDevices(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout-all`, {})
      .pipe(
        tap(() => this.clearAuth()),
        catchError(error => {
          console.error('Logout all devices error', error);
          return throwError(() => error);
        })
      );
  }

  getActiveSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sessions`)
      .pipe(
        catchError(error => {
          console.error('Get sessions error', error);
          return throwError(() => error);
        })
      );
  }

  registerAdmin(admin: RegisterAdminRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, admin)
      .pipe(
        catchError(error => {
          console.error('Register error', error);
          return throwError(() => error);
        })
      );
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, passwordData)
      .pipe(
        catchError(error => {
          console.error('Change password error', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(userId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/admin/reset-password/${userId}`, {})
      .pipe(
        catchError(error => {
          console.error('Reset password error', error);
          return throwError(() => error);
        })
      );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`)
      .pipe(
        catchError(error => {
          console.error('Get profile error', error);
          return throwError(() => error);
        })
      );
  }

  getAllAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`)
      .pipe(
        catchError(error => {
          console.error('Get admins error', error);
          return throwError(() => error);
        })
      );
  }

  getAdminsByPlant(plantId: number): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users/plant/${plantId}`)
      .pipe(
        catchError(error => {
          console.error('Get admins by plant error', error);
          return throwError(() => error);
        })
      );
  }

  deleteAdmin(userId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/admin/users/${userId}`)
      .pipe(
        catchError(error => {
          console.error('Delete admin error', error);
          return throwError(() => error);
        })
      );
  }

  loadUserProfile(): void {
    if (this.getToken()) {
      this.getUserProfile().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.clearAuth();
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(role) : false;
  }

  isSuperAdmin(): boolean {
    const user = this.currentUserValue;
    return user ? user.isSuperAdmin : false;
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  private getUserFromStorage(): User | null {
    // We don't store the user in localStorage for security,
    // only the token is stored. This is a placeholder for when
    // the user profile is loaded later
    return null;
  }
}
