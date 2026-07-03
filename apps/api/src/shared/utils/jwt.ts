import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export function generateAccessToken(userId: string) {
  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(userId: string) {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );
}