import { CompanyConfig } from "../config/companies";

export type ImportJobPayload = {
  title: string;
  companyName: string;
  companyWebsite?: string;
  applyUrl: string;
  description?: string;
  shortDescription?: string;
  location?: string;
  remoteType?: "Remote" | "Hybrid" | "Onsite";
  employmentType?: "Full Time" | "Part Time" | "Contract" | "Internship" | "Freelance";
  experienceLevel?: "Fresher" | "Junior" | "Mid" | "Senior" | "Lead";
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  skills?: string[];
  source: string;
  sourcePlatform: string;
  sourceUrl?: string;
  sourceJobId?: string;
  isFeatured?: boolean;
};

export function buildImportJob(
  company: CompanyConfig,
  input: {
    title: string;
    applyUrl?: string;
    location?: string;
    description?: string;
    sourceJobId?: string;
    source: string;
    sourcePlatform: string;
    skills?: string[];
    remoteType?: ImportJobPayload["remoteType"];
  },
): ImportJobPayload {
  const applyUrl = normalizeUrl(input.applyUrl) ?? company.companyWebsite ?? "https://example.com";

  return {
    title: normalizeText(input.title) ?? "Open Position",
    companyName: company.companyName,
    companyWebsite: company.companyWebsite,
    applyUrl,
    description: normalizeText(input.description),
    location: normalizeText(input.location) ?? "Worldwide",
    remoteType: input.remoteType ?? inferRemoteType(input.location),
    source: input.source,
    sourcePlatform: input.sourcePlatform,
    sourceUrl: applyUrl,
    sourceJobId: input.sourceJobId,
    skills: input.skills ?? [],
  };
}

function normalizeText(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.replace(/\s+/g, " ").trim();
}

function normalizeUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function inferRemoteType(location?: string): ImportJobPayload["remoteType"] {
  const normalized = (location ?? "").toLowerCase();

  if (normalized.includes("hybrid")) {
    return "Hybrid";
  }

  if (normalized.includes("onsite")) {
    return "Onsite";
  }

  return "Remote";
}
