// src/app/core/models/data.models.ts

// Plant models
export interface Plant {
  id: number;
  name: string;
  description: string;
}

export interface CreatePlantRequest {
  name: string;
  description: string;
}

export interface UpdatePlantRequest {
  name: string;
  description: string;
}

// Submission models
export interface Submission {
  id: number;
  firstName: string;
  lastName: string;
  gender: GenderType;
  teId: string;
  cin: string;
  dateOfBirth: string;
  greyCard?: string;
  plantId: number;
  plantName?: string;
  createdAt: string;
  files: FileInfo[];
}

export interface SubmissionRequest {
  firstName: string;
  lastName: string;
  gender: GenderType;
  teId: string;
  cin: string;
  dateOfBirth: string;
  plantId: number;
  greyCard?: string;
  cinImage: File;
  picImage: File;
  greyCardImage?: File;
}

export interface FileInfo {
  id: number;
  fileName: string;
  fileType: FileType;
  fileTypeDescription: string;
  uploadedAt: string;
}

export enum FileType {
  Cin = 0,
  PIC = 1,
  CG = 2
}

export enum GenderType {
  Male = 0,
  Female = 1
}

// Export models
export interface ExportRequest {
  format: number; // 1 for all submissions, 2 for submissions with grey cards
  plantId?: number;
}

// API response models
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  message: string;
  errors?: string[];
  statusCode?: number;
}

// Statistics models for dashboard
export interface PlantStatistics {
  totalSubmissions: number;
  withGreyCard: number;
  withoutGreyCard: number;
}

export interface DashboardStatistics {
  totalSubmissions: number;
  withGreyCard: number;
  plantCount: number;
  recentSubmissions: Submission[];
}
