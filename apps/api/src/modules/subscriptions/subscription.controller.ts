import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../../shared/utils/validators";
import { SubscriptionService } from "./subscription.service";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
} from "./subscription.validation";
import { SubscriptionPlan, SubscriptionBillingStatus } from "../../shared/constants/subscription.constants";

export class SubscriptionController {
  private service = new SubscriptionService();

  /**
   * Create a new subscription for a user or company
   * POST /api/v1/subscriptions
   */
  createSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload: CreateSubscriptionPayload = req.body;

      // Validate request body
      await validateRequest(payload, createSubscriptionSchema);

      // Get subscriber ID from authenticated user
      const subscriberId = (req as any).user?.id;
      if (!subscriberId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const subscription = await this.service.createSubscription({
        subscriberId,
        subscriberType: payload.subscriberType,
        plan: payload.plan,
        frequency: payload.frequency,
      });

      res.status(201).json({
        success: true,
        data: subscription,
      });
    }
  );

  /**
   * Get subscription by ID
   * GET /api/v1/subscriptions/:id
   */
  getSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;

      const subscription = await this.service.getSubscription(id);

      res.status(200).json({
        success: true,
        data: subscription,
      });
    }
  );

  /**
   * Get current subscription for authenticated user
   * GET /api/v1/subscriptions/current
   */
  getCurrentSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const subscriberId = (req as any).user?.id;
      if (!subscriberId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const subscription = await this.service.getSubscriptionBySubscriber(
        subscriberId,
        "user"
      );

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: "Subscription not found",
        });
      }

      res.status(200).json({
        success: true,
        data: subscription,
      });
    }
  );

  /**
   * Update subscription
   * PUT /api/v1/subscriptions/:id
   */
  updateSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const payload: UpdateSubscriptionPayload = req.body;

      // Validate request body
      await validateRequest(payload, updateSubscriptionSchema);

      const subscription = await this.service.updateSubscription(id, payload);

      res.status(200).json({
        success: true,
        data: subscription,
      });
    }
  );

  /**
   * Cancel subscription
   * DELETE /api/v1/subscriptions/:id
   */
  cancelSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params;
      const { reason } = req.body;

      const subscription = await this.service.cancelSubscription(id, reason);

      res.status(200).json({
        success: true,
        data: subscription,
        message: "Subscription cancelled successfully",
      });
    }
  );

  /**
   * List all subscriptions (admin only)
   * GET /api/v1/subscriptions
   */
  listSubscriptions = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const {
        page = 1,
        limit = 20,
        plan,
        billingStatus,
        subscriberType,
      } = req.query;

      const response = await this.service.listSubscriptions(
        {
          plan: plan as SubscriptionPlan,
          billingStatus: billingStatus as SubscriptionBillingStatus,
          subscriberType: subscriberType as "user" | "company",
        },
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        success: true,
        data: response.subscriptions,
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    }
  );

  /**
   * Get all subscription plans
   * GET /api/v1/subscriptions/plans
   */
  getPlans = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const plans = await this.service.getAllPlanConfigs();

      res.status(200).json({
        success: true,
        data: plans,
      });
    }
  );

  /**
   * Get specific plan details
   * GET /api/v1/subscriptions/plans/:plan
   */
  getPlanDetails = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { plan } = req.params;

      const planConfig = await this.service.getSubscriptionPlanConfig(
        plan as SubscriptionPlan
      );

      res.status(200).json({
        success: true,
        data: planConfig,
      });
    }
  );

  /**
   * Upgrade subscription
   * POST /api/v1/subscriptions/upgrade
   */
  upgradeSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { newPlan } = req.body;
      const subscriberId = (req as any).user?.id;

      if (!subscriberId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      if (!newPlan) {
        return res.status(400).json({
          success: false,
          error: "New plan is required",
        });
      }

      const subscription = await this.service.upgradeSubscription(
        subscriberId,
        "user",
        newPlan as SubscriptionPlan
      );

      res.status(200).json({
        success: true,
        data: subscription,
        message: "Subscription upgraded successfully",
      });
    }
  );

  /**
   * Downgrade subscription
   * POST /api/v1/subscriptions/downgrade
   */
  downgradeSubscription = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { newPlan } = req.body;
      const subscriberId = (req as any).user?.id;

      if (!subscriberId) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      if (!newPlan) {
        return res.status(400).json({
          success: false,
          error: "New plan is required",
        });
      }

      const subscription = await this.service.downgradeSubscription(
        subscriberId,
        "user",
        newPlan as SubscriptionPlan
      );

      res.status(200).json({
        success: true,
        data: subscription,
        message: "Subscription downgraded successfully",
      });
    }
  );
}
