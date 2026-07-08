import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../../shared/utils/validators";
import { JobAlertService } from "./job-alert.service";
import {
  createJobAlertSchema,
  updateJobAlertSchema,
} from "./job-alert.validation";

export class JobAlertController {
  private service = new JobAlertService();

  /**
   * Create a new job alert
   * POST /api/v1/job-alerts
   */
  createAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;

      await validateRequest(payload, createJobAlertSchema);

      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const alert = await this.service.createAlert(userId, payload);

      res.status(201).json({
        success: true,
        data: alert,
      });
    }
  );

  /**
   * Get alert by ID
   * GET /api/v1/job-alerts/:id
   */
  getAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const alert = await this.service.getAlert(id);

      res.status(200).json({
        success: true,
        data: alert,
      });
    }
  );

  /**
   * Get user's job alerts
   * GET /api/v1/job-alerts
   */
  getUserAlerts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const response = await this.service.getUserAlerts(userId, page, limit);

      res.status(200).json({
        success: true,
        data: response.alerts,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    }
  );

  /**
   * Update job alert
   * PUT /api/v1/job-alerts/:id
   */
  updateAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const payload = req.body;

      await validateRequest(payload, updateJobAlertSchema);

      const alert = await this.service.updateAlert(id, payload);

      res.status(200).json({
        success: true,
        data: alert,
      });
    }
  );

  /**
   * Delete job alert
   * DELETE /api/v1/job-alerts/:id
   */
  deleteAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      await this.service.deleteAlert(id);

      res.status(200).json({
        success: true,
        message: "Alert deleted successfully",
      });
    }
  );

  /**
   * Pause job alert
   * POST /api/v1/job-alerts/:id/pause
   */
  pauseAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const alert = await this.service.pauseAlert(id);

      res.status(200).json({
        success: true,
        data: alert,
        message: "Alert paused successfully",
      });
    }
  );

  /**
   * Resume job alert
   * POST /api/v1/job-alerts/:id/resume
   */
  resumeAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const alert = await this.service.resumeAlert(id);

      res.status(200).json({
        success: true,
        data: alert,
        message: "Alert resumed successfully",
      });
    }
  );

  /**
   * Test alert (send immediately regardless of frequency)
   * POST /api/v1/job-alerts/:id/test
   */
  testAlert = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const alert = await this.service.getAlert(id);

      // TODO: Implement email sending logic
      res.status(200).json({
        success: true,
        message: "Test email sent",
        data: alert,
      });
    }
  );
}
