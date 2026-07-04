import { Router } from "express";

import { JobController } from "./job.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";

const router = Router();

const controller = new JobController();

router.post("/", authenticate, asyncHandler(controller.create));

router.get("/", authenticate, asyncHandler(controller.findAll));

router.get("/:id", authenticate, asyncHandler(controller.findById));

export default router;
