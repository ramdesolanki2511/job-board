import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { v4 as uuid } from "uuid";
import promClient from "prom-client";

import v1Routes from "./routes/v1";

import { notFound } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { logger } from "./config/logger";

// Optional Sentry
if (process.env.SENTRY_DSN) {
  try {
    // lazy require to avoid if package not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Sentry = require("@sentry/node");
    Sentry.init({ dsn: process.env.SENTRY_DSN });
    logger.info("Sentry initialized");
  } catch (e) {
    logger.warn("Sentry not configured (missing package)");
  }
}

const app = express();

// request id middleware (early)
app.use((req: Request, _res: Response, next: NextFunction) => {
  const id = req.headers["x-request-id"] || uuid();
  req.headers["x-request-id"] = id as string;
  res.setHeader("x-request-id", id as string);
  next();
});

app.use(pinoHttp({ logger } as any));

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

// rate limiter - memory store by default; try to use Redis store if available at runtime
try {
  const limiterOptions: any = { windowMs: 60 * 1000, max: 120 };
  let limiter = rateLimit(limiterOptions);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RedisStore = require("rate-limit-redis");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require("ioredis");
    const redisClient = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
    limiterOptions.store = new RedisStore({ client: redisClient });
    limiter = rateLimit(limiterOptions);
    logger.info("Rate limiter configured with Redis store");
  } catch (e) {
    logger.warn("Redis rate limiter not configured, using in-memory store");
  }
  app.use(limiter);
} catch (err) {
  logger.error("Failed to configure rate limiter", err);
}

// Prometheus default metrics
try {
  promClient.collectDefaultMetrics({ prefix: "jobboard_" });
  app.get("/metrics", async (_req: Request, res: Response) => {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  });
} catch (err) {
  logger.warn("Prometheus metrics not available", err);
}

app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "RemoteLaunch API Running 🚀",
  });
});

app.use("/api/v1", v1Routes);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// readiness endpoint checks DB and Redis connections
app.get("/ready", async (_req: Request, res: Response) => {
  const checks: Record<string, any> = {};
  let healthy = true;

  // check MongoDB
  try {
    // lazy require to avoid top-level
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mongoose = require("mongoose");
    const state = mongoose.connection.readyState; // 1 == connected
    checks.mongodb = { readyState: state };
    if (state !== 1) healthy = false;
  } catch (e) {
    checks.mongodb = { error: String(e) };
    healthy = false;
  }

  // check Redis
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const client = require("./config/redis").default;
    const ping = await client.ping();
    checks.redis = { ping };
    if (ping !== "PONG") healthy = false;
  } catch (e) {
    checks.redis = { error: String(e) };
    healthy = false;
  }

  return res.status(healthy ? 200 : 503).json({ success: healthy, checks });
});

app.use(notFound);
app.use(errorHandler);

export default app;
