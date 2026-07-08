import express, { Router } from "express";
import { authenticateToken } from "../../middlewares/auth.middleware";
import { CheckoutController } from "./checkout.controller";

const router = Router();
const controller = new CheckoutController();

/**
 * Public Routes
 */

// Handle Stripe webhooks (no auth needed)
router.post("/webhook", express.raw({ type: "application/json" }), controller.handleWebhook);

/**
 * Protected Routes
 */

// Get checkout session details
router.get("/sessions/:sessionId", authenticateToken, controller.getCheckoutSession);

// Create checkout session
router.post("/sessions", authenticateToken, controller.createCheckoutSession);

export default router;
