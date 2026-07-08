const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  shortDescription: string;
  description: string;
  location: string;
  remoteType: "Remote" | "Hybrid" | "Onsite";
  employmentType: "Full Time" | "Part Time" | "Contract" | "Internship" | "Freelance";
  experienceLevel: "Fresher" | "Junior" | "Mid" | "Senior" | "Lead";
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

export interface JobListResponse {
  success: boolean;
  message: string;
  data: {
    jobs: Job[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobListParams {
  page?: number;
  limit?: number;
  search?: string;
  company?: string;
  remoteType?: string;
  employmentType?: string;
  experienceLevel?: string;
  featured?: boolean;
  sort?: "latest" | "oldest";
}

class JobsApi {
  async listJobs(params: JobListParams = {}): Promise<JobListResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.company) queryParams.append("company", params.company);
    if (params.remoteType) queryParams.append("remoteType", params.remoteType);
    if (params.employmentType) queryParams.append("employmentType", params.employmentType);
    if (params.experienceLevel) queryParams.append("experienceLevel", params.experienceLevel);
    if (params.featured !== undefined) queryParams.append("featured", params.featured.toString());
    if (params.sort) queryParams.append("sort", params.sort);

    const query = queryParams.toString();
    const url = query ? `${API_URL}/jobs?${query}` : `${API_URL}/jobs`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.status}`);
    }

    return response.json();
  }

  async getJobBySlug(slug: string): Promise<{ success: boolean; data: Job }> {
    const response = await fetch(`${API_URL}/jobs/slug/${slug}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch job: ${response.status}`);
    }

    return response.json();
  }

  async getFeaturedJobs(): Promise<{ success: boolean; data: Job[] }> {
    const response = await fetch(`${API_URL}/jobs/featured`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch featured jobs: ${response.status}`);
    }

    return response.json();
  }

  async getLatestJobs(): Promise<{ success: boolean; data: Job[] }> {
    const response = await fetch(`${API_URL}/jobs/latest`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch latest jobs: ${response.status}`);
    }

    return response.json();
  }
}

export const jobsApi = new JobsApi();
