import cron from "node-cron";

import { companies } from "./config/companies";
import { GreenhouseService } from "./greenhouse/greenhouse.service";
import { LeverService } from "./lever/lever.service";
import { AshbyService } from "./ashby/ashby.service";
import { WorkdayService } from "./workday/workday.service";
import { BambooHrService } from "./bamboohr/bamboohr.service";
import { SmartRecruitersService } from "./smartrecruiters/smartrecruiters.service";
import { GenericHtmlService } from "./generic/generic.service";
import { importJobsToApi } from "./shared/importer";

const greenhouse = new GreenhouseService();
const lever = new LeverService();
const ashby = new AshbyService();
const workday = new WorkdayService();
const bambooHr = new BambooHrService();
const smartRecruiters = new SmartRecruitersService();
const genericHtml = new GenericHtmlService();

export async function runScraperCycle() {
  console.log("[scheduler] Starting scraper cycle");

  for (const company of companies) {
    const availableScrapers = [
      ...(company.ats === "greenhouse" || !company.ats
        ? [{ name: "greenhouse", runner: () => greenhouse.scrape(company) }]
        : []),
      ...(company.ats === "lever" || !company.ats
        ? [{ name: "lever", runner: () => lever.scrape(company) }]
        : []),
      ...(company.ats === "ashby" || !company.ats
        ? [{ name: "ashby", runner: () => ashby.scrape(company) }]
        : []),
      ...(company.ats === "workday" || !company.ats
        ? [{ name: "workday", runner: () => workday.scrape(company) }]
        : []),
      ...(company.ats === "bamboohr" || !company.ats
        ? [{ name: "bamboohr", runner: () => bambooHr.scrape(company) }]
        : []),
      ...(company.ats === "smartrecruiters" || !company.ats
        ? [{ name: "smartrecruiters", runner: () => smartRecruiters.scrape(company) }]
        : []),
      ...(company.ats === "generic" || !company.ats
        ? [{ name: "generic", runner: () => genericHtml.scrape(company) }]
        : []),
    ];

    for (const scraper of availableScrapers) {
      try {
        const jobs = await scraper.runner();

        if (!Array.isArray(jobs) || jobs.length === 0) {
          continue;
        }

        const result = await importJobsToApi(company, jobs);

        console.log(`[scheduler] ${company.companyName} (${scraper.name}) ->`, result);
      } catch (error) {
        console.error(`[scheduler] ${company.companyName} (${scraper.name}) failed`, error);
      }
    }
  }
}

export function startScheduler() {
  cron.schedule("*/30 * * * *", () => {
    void runScraperCycle();
  });

  void runScraperCycle();
}
