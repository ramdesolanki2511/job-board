export interface CompanyDto {
  id: string;
  name: string;
  slug: string;
  website: string;
  careersUrl: string;
  logo: string;
  description: string;
  industry: string;
  size: string;
  headquarters: string;
  foundedYear: number | null;
  linkedinUrl: string;
  twitterUrl: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}