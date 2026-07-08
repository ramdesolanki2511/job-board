import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { JobAlertController } from "./job-alert.controller";

const router = Router();
const controller = new JobAlertController();

/**
 * Protected Routes (auth required)
 */

// Get user's alerts
router.get("/", authenticateToken, controller.getUserAlerts);

// Create new alert
router.post("/", authenticateToken, controller.createAlert);

// Get alert by ID
router.get("/:id", authenticateToken, controller.getAlert);

// Update alert
router.put("/:id", authenticateToken, controller.updateAlert);

// Delete alert
router.delete("/:id", authenticateToken, controller.deleteAlert);

// Pause alert
router.post("/:id/pause", authenticateToken, controller.pauseAlert);

// Resume alert
router.post("/:id/resume", authenticateToken, controller.resumeAlert);

// Test alert (send immediately)
router.post("/:id/test", authenticateToken, controller.testAlert);

export default router;
