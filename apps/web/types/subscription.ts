export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";
export type SubscriptionFrequency = "monthly" | "annually";
export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "trialing";

export interface PlanFeature {
  plan: SubscriptionPlan;
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  description: string;
  features: string[];
  jobPostingLimit: number;
  analyticsFeature: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
}

export interface CurrentSubscription {
  id: string;
  subscriberId: string;
  subscriberType: "user" | "company";
  plan: SubscriptionPlan;
  frequency: SubscriptionFrequency;
  billingStatus: SubscriptionStatus;
  amount: number;
  currency: string;
  autoRenew: boolean;
  stripeCurrentPeriodEnd?: string;
  createdAt: string;
  updatedAt: string;
}
