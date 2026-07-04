export interface JobDto {
  id: string;
  title: string;
  slug: string;
  company: string;
  shortDescription: string;
  description: string;
  location: string;
  remoteType: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  skills: string[];
  applyUrl: string;
  source: string;
  sourceJobId: string;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: Date;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}