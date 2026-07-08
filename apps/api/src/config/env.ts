import { cleanEnv, str, port } from "envalid";

export const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: port(),
  API_PREFIX: str(),
  MONGODB_URI: str(),
  REDIS_HOST: str({ default: "127.0.0.1" }),
  REDIS_PORT: port({ default: 6379 }),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  LOG_LEVEL: str()
});