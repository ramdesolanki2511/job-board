import pino from "pino";
import { env } from "./env";

const transports: any = {};
if (process.env.NODE_ENV === "development") {
  transports.transport = { target: "pino-pretty" };
}

export const logger = pino({
  level: env.LOG_LEVEL || "info",
  ...transports,
});

export default logger;