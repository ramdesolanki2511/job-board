import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { buildImportJob, ImportJobPayload } from "../shared/normalizer";

export class WorkdayService {
  async getJobs(companySlug: string) {
    const response = await axios.get(`https://www.workday.com/api/recruiting/v1/jobs?company=${companySlug}`, {
      timeout: 10000,
    });

    return response.data?.jobs as Array<{
      title?: string;
      externalPath?: string;
      location?: string;
      id?: string;
    }>;
  }

  async scrape(company: CompanyConfig): Promise<ImportJobPayload[]> {
    try {
      const jobs = await this.getJobs(company.boardToken);

      return jobs.map((job) =>
        buildImportJob(company, {
          title: job.title ?? "Open Position",
          applyUrl: job.externalPath,
          location: job.location,
          sourceJobId: job.id,
          source: "Workday",
          sourcePlatform: "workday",
        }),
      );
    } catch {
      return [];
    }
  }
}
