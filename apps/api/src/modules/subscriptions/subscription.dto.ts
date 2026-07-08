import {
  SubscriptionPlan,
  SubscriptionFrequency,
  SubscriptionBillingStatus,
} from "../../shared/constants/subscription.constants";

export interface SubscriptionDto {
  id: string;
  subscriberId: string;
  subscriberType: "user" | "company";
  plan: SubscriptionPlan;
  frequency: SubscriptionFrequency;
  billingStatus: SubscriptionBillingStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeCurrentPeriodStart?: Date;
  stripeCurrentPeriodEnd?: Date;
  amount: number;
  currency: string;
  trialStart?: Date;
  trialEnd?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  metadata?: Record<string, any>;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionDto {
  subscriberId: string;
  subscriberType: "user" | "company";
  plan: SubscriptionPlan;
  frequency?: SubscriptionFrequency;
  amount?: number;
  currency?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateSubscriptionDto {
  plan?: SubscriptionPlan;
  frequency?: SubscriptionFrequency;
  billingStatus?: SubscriptionBillingStatus;
  autoRenew?: boolean;
  metadata?: Record<string, any>;
}

export interface SubscriptionListResponse {
  subscriptions: SubscriptionDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
