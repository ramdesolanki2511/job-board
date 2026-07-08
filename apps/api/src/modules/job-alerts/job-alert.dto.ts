import { AlertFrequency, AlertStatus } from "../../shared/constants/job-alert.constants";

export interface JobAlertDto {
  id: string;
  userId: string;
  name: string;
  search: string;
  skills: string[];
  remoteType: string[];
  employmentType: string[];
  experienceLevel: string[];
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  locations: string[];
  frequency: AlertFrequency;
  status: AlertStatus;
  emailNotifications: boolean;
  lastSentAt?: Date;
  lastSentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateJobAlertDto {
  name: string;
  search?: string;
  skills?: string[];
  remoteType?: string[];
  employmentType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  locations?: string[];
  frequency?: AlertFrequency;
  emailNotifications?: boolean;
}

export interface UpdateJobAlertDto {
  name?: string;
  search?: string;
  skills?: string[];
  remoteType?: string[];
  employmentType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  locations?: string[];
  frequency?: AlertFrequency;
  status?: AlertStatus;
  emailNotifications?: boolean;
}

export interface JobAlertListResponse {
  alerts: JobAlertDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
