import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../shared/utils/async-handler";
import { SavedJobController } from "./saved-job.controller";

const router = Router();
const controller = new SavedJobController();

router.get("/", authenticate, asyncHandler(controller.listJobs));
router.post("/:jobId", authenticate, asyncHandler(controller.saveJob));
router.delete("/:jobId", authenticate, asyncHandler(controller.removeJob));

export default router;
