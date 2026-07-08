import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import adminService from "./admin.service";
import { validateRequest } from "../../shared/utils/validators";
import Joi from "joi";

const banUserSchema = Joi.object({
  userId: Joi.string().required(),
  reason: Joi.string().required().min(10),
});

const suspendCompanySchema = Joi.object({
  companyId: Joi.string().required(),
  reason: Joi.string().required().min(10),
});

const rejectJobSchema = Joi.object({
  jobId: Joi.string().required(),
  reason: Joi.string().required().min(10),
});

const systemNotificationSchema = Joi.object({
  title: Joi.string().required().min(5).max(200),
  message: Joi.string().required().min(10),
});

const createTicketSchema = Joi.object({
  userId: Joi.string().optional(),
  companyId: Joi.string().optional(),
  subject: Joi.string().required().min(5),
  message: Joi.string().required().min(10),
  priority: Joi.string().valid("low", "medium", "high", "urgent").optional(),
});

const updateTicketSchema = Joi.object({
  status: Joi.string().valid("open", "pending", "assigned", "resolved", "closed").optional(),
  assignedTo: Joi.string().optional(),
  message: Joi.string().optional(),
});

const settingsSchema = Joi.object().pattern(Joi.string(), Joi.any());

export class AdminController {
  /**
   * Get dashboard statistics
   * GET /api/v1/admin/dashboard/stats
   */
  getStats = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const stats = await adminService.getSystemStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    }
  );

  /**
   * Get users list
   * GET /api/v1/admin/users
   */
  getUsers = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as any;
      const search = req.query.search as string;

      const result = await adminService.getUsers({
        page,
        limit,
        status,
        search,
      });

      res.status(200).json({
        success: true,
        data: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    }
  );

  /**
   * Get user details
   * GET /api/v1/admin/users/:userId
   */
  getUserDetails = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.params;

      const user = await adminService.getUserDetails(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    }
  );

  /**
   * Ban a user
   * POST /api/v1/admin/users/:userId/ban
   */
  banUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.params;
      const payload = { ...req.body, userId };

      await validateRequest(payload, banUserSchema);

      const result = await adminService.banUser(userId, req.body.reason);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Unban a user
   * POST /api/v1/admin/users/:userId/unban
   */
  unbanUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { userId } = req.params;

      const result = await adminService.unbanUser(userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Get companies list
   * GET /api/v1/admin/companies
   */
  getCompanies = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as any;
      const search = req.query.search as string;

      const result = await adminService.getCompanies({
        page,
        limit,
        status,
        search,
      });

      res.status(200).json({
        success: true,
        data: result.companies,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    }
  );

  /**
   * Verify a company
   * POST /api/v1/admin/companies/:companyId/verify
   */
  verifyCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { companyId } = req.params;

      const result = await adminService.verifyCompany(companyId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Suspend a company
   * POST /api/v1/admin/companies/:companyId/suspend
   */
  suspendCompany = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { companyId } = req.params;
      const payload = { ...req.body, companyId };

      await validateRequest(payload, suspendCompanySchema);

      const result = await adminService.suspendCompany(
        companyId,
        req.body.reason
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Get jobs pending approval
   * GET /api/v1/admin/jobs/pending
   */
  getPendingJobs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as any;

      const result = await adminService.getJobsForApproval({
        page,
        limit,
        status,
      });

      res.status(200).json({
        success: true,
        data: result.jobs,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    }
  );

  /**
   * Approve a job
   * POST /api/v1/admin/jobs/:jobId/approve
   */
  approveJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { jobId } = req.params;

      const result = await adminService.approveJob(jobId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Reject a job
   * POST /api/v1/admin/jobs/:jobId/reject
   */
  rejectJob = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { jobId } = req.params;
      const payload = { ...req.body, jobId };

      await validateRequest(payload, rejectJobSchema);

      const result = await adminService.rejectJob(jobId, req.body.reason);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Get revenue analytics
   * GET /api/v1/admin/analytics/revenue
   */
  getRevenueAnalytics = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const period = (req.query.period as "month" | "quarter" | "year") || "month";

      const analytics = await adminService.getRevenueAnalytics(period);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    }
  );

  /**
   * Get system health
   * GET /api/v1/admin/health
   */
  getSystemHealth = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const health = await adminService.getSystemHealth();

      res.status(200).json({
        success: true,
        data: health,
      });
    }
  );

  /**
   * Get audit logs
   * GET /api/v1/admin/audit-logs
   */
  getAuditLogs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const action = req.query.action as string;
      const userId = req.query.userId as string;

      const result = await adminService.getAuditLogs({
        page,
        limit,
        action,
        userId,
      });

      res.status(200).json({
        success: true,
        data: result.logs,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    }
  );

  /**
   * Send system notification
   * POST /api/v1/admin/notifications/system
   */
  sendSystemNotification = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;

      await validateRequest(payload, systemNotificationSchema);

      const result = await adminService.sendSystemNotification(
        payload.title,
        payload.message
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Update system settings
   * POST /api/v1/admin/settings
   */
  updateSystemSettings = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const settings = req.body;

      await validateRequest(settings, settingsSchema);

      const result = await adminService.updateSystemSettings(settings);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  /**
   * Create support ticket
   * POST /api/v1/admin/tickets
   */
  createTicket = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;
      await validateRequest(payload, createTicketSchema);

      const ticket = await adminService.createSupportTicket(payload);

      res.status(201).json({ success: true, data: ticket });
    }
  );

  /**
   * Get support tickets
   * GET /api/v1/admin/tickets
   */
  getTickets = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as any;

      const result = await adminService.getSupportTickets({ page, limit, status });

      res.status(200).json({ success: true, data: result.tickets, total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages });
    }
  );

  /**
   * Update support ticket
   * POST /api/v1/admin/tickets/:ticketId
   */
  updateTicket = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { ticketId } = req.params;
      const payload = req.body;

      await validateRequest(payload, updateTicketSchema);

      const updated = await adminService.updateSupportTicket(ticketId, payload);

      res.status(200).json({ success: true, data: updated });
    }
  );

  /**
   * Get system settings
   * GET /api/v1/admin/settings
   */
  getSettings = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const settings = await adminService.getSystemSettings();
      res.status(200).json({ success: true, data: settings });
    }
  );
}

export default new AdminController();
