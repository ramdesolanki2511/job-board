import * as cheerio from "cheerio";
import { CompanyConfig } from "../config/companies";
import { buildImportJob } from "./normalizer";

export function parseHtmlJobs(
  html: string,
  baseUrl: string,
  company: CompanyConfig,
  source: string,
  sourcePlatform: string,
) {
  const $ = cheerio.load(html);
  const candidates = new Map<string, string>();

  $("a").each((_, element) => {
    const href = $(element).attr("href");
    const title = $(element).text().trim();

    if (!href) {
      return;
    }

    const absoluteUrl = new URL(href, baseUrl).toString();

    if (!/job|career|opening|apply/i.test(absoluteUrl)) {
      return;
    }

    if (!candidates.has(absoluteUrl)) {
      candidates.set(absoluteUrl, title || "Open Position");
    }
  });

  return Array.from(candidates.entries()).slice(0, 25).map(([applyUrl, title]) =>
    buildImportJob(company, {
      title,
      applyUrl,
      source,
      sourcePlatform,
    }),
  );
}
