export enum SubscriptionPlan {
  BASIC = "basic",
  PRO = "pro",
  ENTERPRISE = "enterprise",
  FREE = "free",
}

export enum SubscriptionFrequency {
  MONTHLY = "monthly",
  ANNUALLY = "annually",
}

export enum SubscriptionBillingStatus {
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
  TRIALING = "trialing",
}

export const SUBSCRIPTION_PLAN_CONFIG = {
  [SubscriptionPlan.FREE]: {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Get started with basic features",
    features: ["Up to 5 job postings", "Basic analytics", "Email support"],
    jobPostingLimit: 5,
    analyticsFeature: true,
    prioritySupport: false,
    customBranding: false,
  },
  [SubscriptionPlan.BASIC]: {
    name: "Basic",
    monthlyPrice: 29,
    annualPrice: 290,
    description: "Perfect for small companies",
    features: [
      "Up to 20 job postings",
      "Advanced analytics",
      "Priority email support",
      "Custom job application form",
    ],
    jobPostingLimit: 20,
    analyticsFeature: true,
    prioritySupport: true,
    customBranding: false,
  },
  [SubscriptionPlan.PRO]: {
    name: "Pro",
    monthlyPrice: 99,
    annualPrice: 990,
    description: "For growing companies",
    features: [
      "Unlimited job postings",
      "Advanced analytics",
      "24/7 priority support",
      "Custom job application form",
      "Team collaboration tools",
      "API access",
    ],
    jobPostingLimit: Infinity,
    analyticsFeature: true,
    prioritySupport: true,
    customBranding: true,
  },
  [SubscriptionPlan.ENTERPRISE]: {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "Custom for large organizations",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label options",
    ],
    jobPostingLimit: Infinity,
    analyticsFeature: true,
    prioritySupport: true,
    customBranding: true,
  },
};
