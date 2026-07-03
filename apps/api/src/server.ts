import "dotenv/config";

import app from "./app";

import { env } from "./config/env";
import { logger } from "./config/logger";
import { connectDatabase } from "./config/database";

async function startServer() {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`🚀 API running on port ${env.PORT}`);
  });
}

startServer();