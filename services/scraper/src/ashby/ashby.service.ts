import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { buildImportJob, ImportJobPayload } from "../shared/normalizer";

export class AshbyService {
  async getJobs(companySlug: string) {
    const response = await axios.get(`https://jobs.ashbyhq.com/api/non-user-graphql?query=${encodeURIComponent(`query { jobs(boardToken: "${companySlug}") { id title location remote type } }`)}`, {
      timeout: 10000,
    });

    return response.data?.data?.jobs as Array<{
      id?: string;
      title?: string;
      location?: string;
      remote?: boolean;
      type?: string;
    }>;
  }

  async scrape(company: CompanyConfig): Promise<ImportJobPayload[]> {
    try {
      const jobs = await this.getJobs(company.boardToken);

      return jobs.map((job) =>
        buildImportJob(company, {
          title: job.title ?? "Open Position",
          location: job.location,
          sourceJobId: job.id,
          remoteType: job.remote ? "Remote" : "Hybrid",
          source: "Ashby",
          sourcePlatform: "ashby",
        }),
      );
    } catch {
      return [];
    }
  }
}
