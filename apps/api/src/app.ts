import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import v1Routes from "./routes/v1";

import { notFound } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { v4 as uuid } from "uuid";

const app = express();

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

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "RemoteLaunch API Running 🚀",
  });
});

app.use("/api/v1", v1Routes);

app.use((req, res, next) => {
  req.headers["x-request-id"] = uuid();
  next();
});

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
