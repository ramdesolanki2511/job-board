import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { CompanyDashboardController } from "./company-dashboard.controller";

const router = Router();
const controller = new CompanyDashboardController();

/**
 * Protected Routes
 */

// Get dashboard for authenticated user
router.get("/", authenticateToken, controller.getDashboard);

// Get analytics summary
router.get("/analytics/summary", authenticateToken, controller.getAnalyticsSummary);

// Initialize dashboard for company
router.post("/init", authenticateToken, controller.initializeDashboard);

// Record job posted event
router.post(
  "/events/job-posted",
  authenticateToken,
  controller.recordJobPosted
);

// Record application received event
router.post(
  "/events/application-received",
  authenticateToken,
  controller.recordApplicationReceived
);

export default router;
