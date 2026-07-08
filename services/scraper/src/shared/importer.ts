import { api } from "../api/client";
import { CompanyConfig } from "../config/companies";
import { ImportJobPayload } from "./normalizer";

export async function importJobsToApi(company: CompanyConfig, jobs: ImportJobPayload[]) {
  if (jobs.length === 0) {
    return {
      imported: 0,
      duplicates: 0,
      failed: 0,
      hasNewJobs: false,
    };
  }

  const response = await api.post("/jobs/import", {
    jobs,
  });

  return response.data.data as {
    imported: number;
    duplicates: number;
    failed: number;
    hasNewJobs: boolean;
  };
}
