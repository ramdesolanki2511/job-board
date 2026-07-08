import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { buildImportJob, ImportJobPayload } from "../shared/normalizer";

export class LeverService {
  async getJobs(companySlug: string) {
    const response = await axios.get(`https://api.lever.co/v0/postings/${companySlug}?mode=json`, {
      timeout: 10000,
    });

    return response.data as Array<{
      id?: string;
      title?: string;
      hostedUrl?: string;
      applyUrl?: string;
      description?: string;
      location?: string;
      categories?: {
        location?: string[];
      };
    }>;
  }

  async scrape(company: CompanyConfig): Promise<ImportJobPayload[]> {
    try {
      const jobs = await this.getJobs(company.boardToken);

      return jobs.map((job) =>
        buildImportJob(company, {
          title: job.title ?? "Open Position",
          applyUrl: job.hostedUrl ?? job.applyUrl,
          location: job.categories?.location?.join(", ") ?? job.location,
          description: job.description,
          sourceJobId: job.id,
          source: "Lever",
          sourcePlatform: "lever",
        }),
      );
    } catch {
      return [];
    }
  }
}
