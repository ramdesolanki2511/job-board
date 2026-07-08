import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

export interface CheckoutSessionParams {
  planId: string;
  frequency: "monthly" | "annually";
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface WebhookEvent {
  type: string;
  data: any;
}

export const stripeService = {
  /**
   * Create a Stripe checkout session for subscription
   */
  async createCheckoutSession(params: CheckoutSessionParams) {
    const priceId = this.getPriceIdForPlan(params.planId, params.frequency);

    if (!priceId) {
      throw new Error(`No price found for plan: ${params.planId}`);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: params.userEmail,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        userId: params.userId,
        planId: params.planId,
        frequency: params.frequency,
      },
    });

    return session;
  },

  /**
   * Get price ID from Stripe for a given plan and frequency
   * In production, you would fetch these from your database or Stripe's price API
   */
  getPriceIdForPlan(
    planId: string,
    frequency: "monthly" | "annually"
  ): string {
    const priceMap: Record<string, Record<string, string>> = {
      free: {
        monthly: process.env.STRIPE_PRICE_FREE_MONTHLY || "",
        annually: process.env.STRIPE_PRICE_FREE_ANNUALLY || "",
      },
      basic: {
        monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || "",
        annually: process.env.STRIPE_PRICE_BASIC_ANNUALLY || "",
      },
      pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
        annually: process.env.STRIPE_PRICE_PRO_ANNUALLY || "",
      },
      enterprise: {
        monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
        annually: process.env.STRIPE_PRICE_ENTERPRISE_ANNUALLY || "",
      },
    };

    return priceMap[planId]?.[frequency] || "";
  },

  /**
   * Retrieve checkout session details
   */
  async retrieveSession(sessionId: string) {
    return stripe.checkout.sessions.retrieve(sessionId);
  },

  /**
   * Retrieve customer details
   */
  async retrieveCustomer(customerId: string) {
    return stripe.customers.retrieve(customerId);
  },

  /**
   * Retrieve subscription
   */
  async retrieveSubscription(subscriptionId: string) {
    return stripe.subscriptions.retrieve(subscriptionId);
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediate: boolean = false) {
    if (immediate) {
      return stripe.subscriptions.del(subscriptionId);
    } else {
      return stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  },

  /**
   * Update subscription
   */
  async updateSubscription(
    subscriptionId: string,
    data: {
      items?: any;
      metadata?: Record<string, string>;
    }
  ) {
    return stripe.subscriptions.update(subscriptionId, data);
  },

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(
    body: string | Buffer,
    signature: string,
    secret: string
  ) {
    try {
      return stripe.webhooks.constructEvent(body, signature, secret);
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error}`);
    }
  },

  /**
   * List invoices for customer
   */
  async listInvoices(customerId: string, limit: number = 10) {
    return stripe.invoices.list({
      customer: customerId,
      limit,
    });
  },

  /**
   * Retrieve invoice
   */
  async retrieveInvoice(invoiceId: string) {
    return stripe.invoices.retrieve(invoiceId);
  },

  /**
   * Get invoice PDF URL
   */
  async getInvoicePdfUrl(invoiceId: string) {
    const invoice = await this.retrieveInvoice(invoiceId);
    return invoice.invoice_pdf;
  },
};

export default stripeService;
