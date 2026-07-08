/**
 * Queue scaffold: try to initialize BullMQ if ioredis is available.
 * This file avoids failing startup if ioredis isn't installed.
 */

let Queue: any = null;
let Worker: any = null;
let queueInstance: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Queue: BQueue, Worker: BWorker } = require("bullmq");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const IORedis = require("ioredis");
  const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");

  Queue = BQueue;
  Worker = BWorker;

  queueInstance = new Queue("default", { connection });
  console.info("BullMQ queue initialized");
} catch (e) {
  console.warn("BullMQ / ioredis not available; queue disabled", e?.message || e);
}

export { Queue, Worker, queueInstance };
