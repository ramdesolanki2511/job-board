import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import companyDashboardService from "./company-dashboard.service";

export class CompanyDashboardController {
  /**
   * Get dashboard analytics
   * GET /api/v1/company-dashboard
   */
  getDashboard = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const dashboard =
        await companyDashboardService.getDashboardByUserId(userId);

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    }
  );

  /**
   * Get analytics summary
   * GET /api/v1/company-dashboard/analytics/summary
   */
  getAnalyticsSummary = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const dashboard =
        await companyDashboardService.getDashboardByUserId(userId);
      const analytics = await companyDashboardService.getAnalyticsSummary(
        dashboard.companyId
      );

      res.status(200).json({
        success: true,
        data: analytics,
      });
    }
  );

  /**
   * Initialize dashboard for company
   * POST /api/v1/company-dashboard/init
   */
  initializeDashboard = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;
      const { companyId } = req.body;

      if (!userId || !companyId) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      const dashboard =
        await companyDashboardService.initializeDashboard(companyId, userId);

      res.status(201).json({
        success: true,
        data: dashboard,
      });
    }
  );

  /**
   * Record job posted event
   * POST /api/v1/company-dashboard/events/job-posted
   */
  recordJobPosted = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;
      const { companyId, jobTitle } = req.body;

      if (!userId || !companyId || !jobTitle) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      await companyDashboardService.recordJobPosted(companyId, jobTitle);

      res.status(200).json({
        success: true,
        message: "Event recorded",
      });
    }
  );

  /**
   * Record application received event
   * POST /api/v1/company-dashboard/events/application-received
   */
  recordApplicationReceived = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;
      const { companyId, applicantName, jobTitle } = req.body;

      if (!userId || !companyId || !applicantName || !jobTitle) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields",
        });
      }

      await companyDashboardService.recordApplicationReceived(
        companyId,
        applicantName,
        jobTitle
      );

      res.status(200).json({
        success: true,
        message: "Event recorded",
      });
    }
  );
}
