import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { logger } from "../config/logger";

let Sentry: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Sentry = require("@sentry/node");
} catch (e) {
  // Sentry optional
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = req.headers["x-request-id"] || req.id || undefined;

  // Log with request id context
  logger.error({ err, requestId }, "Unhandled error");

  if (Sentry && process.env.SENTRY_DSN) {
    try {
      Sentry.withScope((scope: any) => {
        if (requestId) scope.setTag("request_id", requestId as string);
        scope.setExtra("path", req.path);
        Sentry.captureException(err);
      });
    } catch (e) {
      logger.warn("Sentry capture failed", e);
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || undefined,
      },
    });
  }

  const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message;

  return res.status(500).json({
    success: false,
    error: {
      message,
    },
    meta: {
      requestId,
    },
  });
}