import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { buildImportJob, ImportJobPayload } from "../shared/normalizer";

export class BambooHrService {
  async getJobs(companyDomain: string) {
    const response = await axios.get(`https://${companyDomain}/jobs/`, {
      timeout: 10000,
    });

    return response.data as string;
  }

  async scrape(company: CompanyConfig): Promise<ImportJobPayload[]> {
    try {
      const html = await this.getJobs(company.boardToken);
      const jobs = html.match(/href=["']([^"']+)["']/g) ?? [];

      return jobs.slice(0, 20).map((link) => {
        const href = link.replace(/href=["']/, "").replace(/["']$/, "");

        return buildImportJob(company, {
          title: "Open Position",
          applyUrl: href,
          source: "BambooHR",
          sourcePlatform: "bamboohr",
        });
      });
    } catch {
      return [];
    }
  }
}
