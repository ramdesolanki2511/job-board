import { GreenhouseJob } from "./greenhouse.types";

import { CompanyConfig } from "../config/companies";
import { ImportJobPayload } from "../shared/normalizer";

export class GreenhouseMapper {
  static toImportJob(company: CompanyConfig, job: GreenhouseJob): ImportJobPayload {
    return {
      title: job.title,

      companyName: company.companyName,

      companyWebsite: company.companyWebsite,

      applyUrl: job.absolute_url,

      location: job.location?.name ?? "Worldwide",

      remoteType: "Remote",

      source: "Greenhouse",

      sourcePlatform: "greenhouse",

      sourceUrl: job.absolute_url,

      sourceJobId: String(job.id ?? ""),

      skills: [],
    };
  }
}
