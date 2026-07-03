import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  API_PREFIX: str(),
  MONGODB_URI: str(),
  REDIS_HOST: str(),
  REDIS_PORT: port(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  LOG_LEVEL: str()
});