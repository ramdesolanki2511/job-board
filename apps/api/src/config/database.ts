import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "./logger";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI);

    logger.info("✅ MongoDB Connected");
  } catch (error) {
    logger.error(error);

    process.exit(1);
  }
}