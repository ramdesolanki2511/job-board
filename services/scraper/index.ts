import cron from "node-cron";

import { main } from "../scraper/src";

cron.schedule(
  "*/30 * * * *",
  async () => {

    console.log(
      "Starting scheduled scrape..."
    );

    await main();

  }
);