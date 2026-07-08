import { createClient } from "redis";
import { env } from "./env";
import { logger } from "./logger";

const url = process.env.REDIS_URL || `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`;

const client = createClient({ url });

client.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

(async () => {
  try {
    await client.connect();
    logger.info("Connected to Redis");
  } catch (err) {
    logger.warn("Could not connect to Redis at startup", err);
  }
})();

export default client;
