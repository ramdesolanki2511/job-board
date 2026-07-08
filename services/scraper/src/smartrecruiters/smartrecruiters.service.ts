import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { buildImportJob, ImportJobPayload } from "../shared/normalizer";

export class SmartRecruitersService {
  async getJobs(companySlug: string) {
    const response = await axios.get(`https://api.smartrecruiters.com/v1/companies/${companySlug}/postings?limit=100`, {
      timeout: 10000,
    });

    return response.data?.content as Array<{
      id?: string;
      title?: string;
      applyUrl?: string;
      location?: string;
      department?: string;
    }>;
  }

  async scrape(company: CompanyConfig): Promise<ImportJobPayload[]> {
    try {
      const jobs = await this.getJobs(company.boardToken);

      return jobs.map((job) =>
        buildImportJob(company, {
          title: job.title ?? "Open Position",
          applyUrl: job.applyUrl,
          location: job.location,
          sourceJobId: job.id,
          source: "SmartRecruiters",
          sourcePlatform: "smartrecruiters",
        }),
      );
    } catch {
      return [];
    }
  }
}
