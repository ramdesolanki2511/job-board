import { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { SubscriptionController } from "./subscription.controller";

const router = Router();
const controller = new SubscriptionController();

/**
 * Public Routes (no auth required)
 */

// Get all subscription plans
router.get("/plans", controller.getPlans);

// Get specific plan details
router.get("/plans/:plan", controller.getPlanDetails);

/**
 * Protected Routes (auth required)
 */

// Get current user's subscription
router.get("/current", authenticateToken, controller.getCurrentSubscription);

// Create new subscription
router.post("/", authenticateToken, controller.createSubscription);

// Get subscription by ID
router.get("/:id", authenticateToken, controller.getSubscription);

// Update subscription
router.put("/:id", authenticateToken, controller.updateSubscription);

// Cancel subscription
router.delete("/:id", authenticateToken, controller.cancelSubscription);

// Upgrade subscription
router.post("/upgrade", authenticateToken, controller.upgradeSubscription);

// Downgrade subscription
router.post("/downgrade", authenticateToken, controller.downgradeSubscription);

/**
 * Admin Routes (should be protected with role check)
 */

// List all subscriptions (admin only)
router.get("/", authenticateToken, controller.listSubscriptions);

export default router;
