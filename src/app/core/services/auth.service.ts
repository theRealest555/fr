import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  RegisterAdminRequest,
  UpdateAdminRequest,
  ResetPasswordResponse,
  UserToken
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly adminApiUrl = `${environment.apiUrl}/Admin`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private readonly http: HttpClient) {
    // Load user from storage if token exists
    if (this.getToken()) {
      this.loadUserProfile();
    }
  }

  // Auth methods
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.loadUserProfile();
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearToken();
          this.currentUserSubject.next(null);
        }),
        catchError(error => {
          // Even if logout fails on server, clear local state
          this.clearToken();
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  logoutAllDevices(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout-all`, {})
      .pipe(
        tap(() => {
          this.clearToken();
          this.currentUserSubject.next(null);
        })
      );
  }

  changePassword(request: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, request);
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  loadUserProfile(): void {
    this.getUserProfile().subscribe({
      next: user => this.currentUserSubject.next(user),
      error: () => {
        this.clearToken();
        this.currentUserSubject.next(null);
      }
    });
  }

  // Admin user management
  registerAdmin(request: RegisterAdminRequest): Observable<{ message: string, userId: string, password?: string }> {
    return this.http.post<{ message: string, userId: string, password?: string }>(`${this.apiUrl}/register`, request);
  }

  getAllAdmins(
    email?: string,
    fullName?: string,
    plantId?: number,
    plantName?: string,
    isSuperAdmin?: boolean,
    requirePasswordChange?: boolean
  ): Observable<User[]> {
    let params: any = {};

    if (email) params.email = email;
    if (fullName) params.fullName = fullName;
    if (plantId) params.plantId = plantId.toString();
    if (plantName) params.plantName = plantName;
    if (isSuperAdmin !== undefined) params.isSuperAdmin = isSuperAdmin.toString();
    if (requirePasswordChange !== undefined) params.requirePasswordChange = requirePasswordChange.toString();

    return this.http.get<User[]>(`${this.adminApiUrl}/users`, { params });
  }

  getAdminsByPlant(plantId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.adminApiUrl}/users/plant/${plantId}`);
  }

  updateAdmin(userId: string, request: UpdateAdminRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.adminApiUrl}/users/${userId}`, request);
  }

  resetPassword(userId: string): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.adminApiUrl}/reset-password/${userId}`, {});
  }

  deleteAdmin(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.adminApiUrl}/users/${userId}`);
  }

  getActiveSessions(): Observable<UserToken[]> {
    return this.http.get<UserToken[]>(`${this.apiUrl}/active-sessions`);
  }

  // Token management
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Helper methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  isSuperAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.isSuperAdmin : false;
  }
}