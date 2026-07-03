import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { notFound } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import v1Routes from "./routes/v1";
import { v4 as uuid } from "uuid";

const app = express();

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(notFound);

app.use(errorHandler);

app.use("/api/v1", v1Routes);

app.use((req, res, next) => {
  req.headers["x-request-id"] = uuid();
  next();
});

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "RemoteLaunch API Running 🚀"
  });
});

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default app;