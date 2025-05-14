export interface Plant {
  id: number;
  name: string;
}

export interface Submission {
  id: number;
  fullName: string;
  teId: string;
  cin: string;
  dateOfBirth: string;
  greyCard?: string;
  plantId: number;
  plantName?: string;
  createdAt: string;
  files: FileInfo[];
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

export interface SubmissionRequest {
  fullName: string;
  teId: string;
  cin: string;
  dateOfBirth: string;
  plantId: number;
  greyCard?: string;
  cinImage: File;
  picImage: File;
  greyCardImage?: File;
}

export interface ExportRequest {
  format: number; // 1 for all submissions, 2 for submissions with grey cards
  plantId?: number;
}
