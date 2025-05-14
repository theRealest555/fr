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

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Admin role constants
export const AdminRoles = {
  SuperAdmin: 'SuperAdmin',
  RegularAdmin: 'RegularAdmin'
};
