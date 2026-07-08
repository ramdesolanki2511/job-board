import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { parseHtmlJobs } from "../shared/html-scraper";
import { buildImportJob, ImportJobPayload } from "../shared/normalizer";

export class GenericHtmlService {
  async getHtml(url: string) {
    const response = await axios.get(url, { timeout: 10000 });
    return response.data as string;
  }

  async scrape(company: CompanyConfig): Promise<ImportJobPayload[]> {
    try {
      const html = await this.getHtml(company.companyWebsite);
      const jobs = parseHtmlJobs(html, company.companyWebsite, company, "Generic HTML", "generic-html");

      if (jobs.length === 0) {
        return [
          buildImportJob(company, {
            title: "Open Position",
            applyUrl: company.companyWebsite,
            source: "Generic HTML",
            sourcePlatform: "generic-html",
          }),
        ];
      }

      return jobs;
    } catch {
      return [];
    }
  }
}
