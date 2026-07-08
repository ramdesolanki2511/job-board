import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import stripeService from "../../shared/services/stripe.service";
import { validateRequest } from "../../shared/utils/validators";
import Joi from "joi";

const createCheckoutSessionSchema = Joi.object({
  planId: Joi.string()
    .valid("free", "basic", "pro", "enterprise")
    .required(),
  frequency: Joi.string().valid("monthly", "annually").required(),
});

export class CheckoutController {
  /**
   * Create checkout session
   * POST /api/v1/checkout/sessions
   */
  createCheckoutSession = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const payload = req.body;

      await validateRequest(payload, createCheckoutSessionSchema);

      const userId = (req as any).user?.id;
      const userEmail = (req as any).user?.email;

      if (!userId || !userEmail) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });
      }

      const successUrl = `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${process.env.FRONTEND_URL}/subscriptions?tab=plans`;

      const session = await stripeService.createCheckoutSession({
        planId: payload.planId,
        frequency: payload.frequency,
        userId,
        userEmail,
        successUrl,
        cancelUrl,
      });

      res.status(200).json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url,
        },
      });
    }
  );

  /**
   * Get checkout session details
   * GET /api/v1/checkout/sessions/:sessionId
   */
  getCheckoutSession = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { sessionId } = req.params;

      const session = await stripeService.retrieveSession(sessionId);

      res.status(200).json({
        success: true,
        data: {
          id: session.id,
          status: session.payment_status,
          customer: session.customer,
          subscription: session.subscription,
          amount_total: session.amount_total,
          metadata: session.metadata,
        },
      });
    }
  );

  /**
   * Handle webhook events from Stripe
   * POST /api/v1/checkout/webhook
   */
  handleWebhook = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const signature = req.headers["stripe-signature"];

      if (!signature) {
        return res.status(400).json({
          success: false,
          error: "Missing stripe-signature header",
        });
      }

      try {
        const event = stripeService.verifyWebhookSignature(
          req.body,
          signature as string,
          process.env.STRIPE_WEBHOOK_SECRET || ""
        );

        // Handle different event types
        switch (event.type) {
          case "checkout.session.completed":
            // Handle successful checkout
            console.log("Checkout session completed:", event.data.object);
            break;
          case "customer.subscription.created":
            // Handle subscription created
            console.log("Subscription created:", event.data.object);
            break;
          case "customer.subscription.updated":
            // Handle subscription updated
            console.log("Subscription updated:", event.data.object);
            break;
          case "customer.subscription.deleted":
            // Handle subscription cancelled
            console.log("Subscription deleted:", event.data.object);
            break;
          case "invoice.payment_succeeded":
            // Handle payment succeeded
            console.log("Payment succeeded:", event.data.object);
            break;
          case "invoice.payment_failed":
            // Handle payment failed
            console.log("Payment failed:", event.data.object);
            break;
          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        res.status(200).json({
          success: true,
          received: true,
        });
      } catch (err) {
        console.error("Webhook error:", err);
        res.status(400).json({
          success: false,
          error: err instanceof Error ? err.message : "Webhook error",
        });
      }
    }
  );
}
