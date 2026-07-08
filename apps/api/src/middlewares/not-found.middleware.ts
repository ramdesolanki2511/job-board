import { Request, Response } from "express";

export function notFound(req: Request, res: Response) {
  const requestId = req.headers["x-request-id"] || undefined;
  res.status(404).json({
    success: false,
    error: { message: "Route Not Found" },
    meta: { requestId },
  });
}