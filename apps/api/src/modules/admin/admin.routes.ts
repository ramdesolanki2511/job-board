import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import {
  requireAdmin,
  requireAdminOrModerator,
  logAdminAction,
} from "../../middlewares/admin.middleware";
import adminController from "./admin.controller";

const router = Router();

/**
 * All admin routes require authentication and admin role
 */
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get("/dashboard/stats", logAdminAction("view_stats"), adminController.getStats);
router.get("/health", logAdminAction("check_health"), adminController.getSystemHealth);

// Users Management
router.get("/users", logAdminAction("view_users"), adminController.getUsers);
router.get("/users/:userId", logAdminAction("view_user_details"), adminController.getUserDetails);
router.post("/users/:userId/ban", logAdminAction("ban_user"), adminController.banUser);
router.post("/users/:userId/unban", logAdminAction("unban_user"), adminController.unbanUser);

// Companies Management
router.get("/companies", logAdminAction("view_companies"), adminController.getCompanies);
router.post("/companies/:companyId/verify", logAdminAction("verify_company"), adminController.verifyCompany);
router.post(
  "/companies/:companyId/suspend",
  logAdminAction("suspend_company"),
  adminController.suspendCompany
);

// Job Moderation
router.get("/jobs/pending", logAdminAction("view_pending_jobs"), adminController.getPendingJobs);
router.post("/jobs/:jobId/approve", logAdminAction("approve_job"), adminController.approveJob);
router.post("/jobs/:jobId/reject", logAdminAction("reject_job"), adminController.rejectJob);

// Analytics
router.get(
  "/analytics/revenue",
  logAdminAction("view_revenue_analytics"),
  adminController.getRevenueAnalytics
);

// Audit Logs
router.get("/audit-logs", logAdminAction("view_audit_logs"), adminController.getAuditLogs);

// Support Tickets
router.get("/tickets", logAdminAction("view_tickets"), adminController.getTickets);
router.post("/tickets", logAdminAction("create_ticket"), adminController.createTicket);
router.post("/tickets/:ticketId", logAdminAction("update_ticket"), adminController.updateTicket);

// System Settings
router.get("/settings", logAdminAction("view_settings"), adminController.getSettings);

// System Management (Super Admin only)
router.post(
  "/notifications/system",
  logAdminAction("send_system_notification"),
  adminController.sendSystemNotification
);
router.post("/settings", logAdminAction("update_settings"), adminController.updateSystemSettings);

export default router;
