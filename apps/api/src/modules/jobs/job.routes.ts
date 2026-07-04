import { Router } from "express";

import { JobController } from "./job.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";

const router = Router();

const controller = new JobController();

router.post("/", authenticate, asyncHandler(controller.create));

router.get("/", authenticate, asyncHandler(controller.findAll));

router.get("/search", authenticate, asyncHandler(controller.search));

router.get("/featured", authenticate, asyncHandler(controller.featured));

router.get("/latest", authenticate, asyncHandler(controller.latest));

router.get("/slug/:slug", authenticate, asyncHandler(controller.findBySlug));

router.get("/:id", authenticate, asyncHandler(controller.findById));

export default router;
