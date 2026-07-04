// TODO:
// Update lastActiveAt asynchronously using queue

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { env } from "../config/env";
import { AppError } from "../shared/errors/AppError";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "Authentication required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AppError(401, "Invalid token");
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as {
      id: string;
      role: string;
    };

    req.user = decoded;

    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
}
