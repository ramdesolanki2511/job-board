import { GreenhouseService } from "./greenhouse/greenhouse.service";
import { GreenhouseMapper } from "./greenhouse/greenhouse.mapper";

async function main() {
  const greenhouse = new GreenhouseService();

  const jobs = await greenhouse.getJobs("stripe");

  const companyId = "YOUR_COMPANY_ID";

  const mapped = jobs.map((job) =>
    GreenhouseMapper.toImportJob(companyId, job),
  );

  console.log(mapped[0]);
}

main();
