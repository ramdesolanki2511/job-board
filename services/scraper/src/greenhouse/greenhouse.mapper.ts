import { GreenhouseJob } from "./greenhouse.types";

export class GreenhouseMapper {
  static toImportJob(job: GreenhouseJob) {
    return {
      title: job.title,

      companyName: "Stripe",

      companyWebsite: "https://stripe.com",

      applyUrl: job.absolute_url,

      location: job.location?.name ?? "Worldwide",

      remoteType: "Remote",

      source: "Greenhouse",

      sourcePlatform: "greenhouse",

      sourceUrl: job.absolute_url,

      // sourceJobId: job.id.toString(),
      sourceJobId: String(job.id ?? ""),

      skills: [],
    };
  }
}
