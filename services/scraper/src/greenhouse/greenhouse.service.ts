import axios from "axios";

import { CompanyConfig } from "../config/companies";
import { GreenhouseMapper } from "./greenhouse.mapper";
import { GreenhouseJob } from "./greenhouse.types";

export class GreenhouseService {
  async getJobs(boardToken: string) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`;

    const response = await axios.get(url, { timeout: 10000 });

    return response.data.jobs as GreenhouseJob[];
  }

  async scrape(company: CompanyConfig) {
    try {
      const jobs = await this.getJobs(company.boardToken);

      return jobs.map((job) => GreenhouseMapper.toImportJob(company, job));
    } catch {
      return [];
    }
  }
}
