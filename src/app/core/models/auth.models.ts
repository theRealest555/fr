// User-related models
export interface User {
  id: string;
  email: string;
  fullName: string;
  plantId: number;
  plantName?: string;
  isSuperAdmin: boolean;
  requirePasswordChange: boolean;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: string;
  requirePasswordChange: boolean;
}

export interface RegisterAdminRequest {
  fullName: string;
  teid: string;
  email: string;
  password?: string;
  plantId: number;
  isSuperAdmin: boolean;
}

export interface UpdateAdminRequest {
  fullName: string;
  teid?: string;
  email?: string;
  plantId: number;
  isSuperAdmin?: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  newPassword: string;
}

// Admin role constants
export enum AdminRoles {
  SuperAdmin = 'SuperAdmin',
  RegularAdmin = 'RegularAdmin'
}

// User token
export interface UserToken {
  id: number;
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  isRevoked: boolean;
  deviceInfo?: string;
  ipAddress?: string;
}
