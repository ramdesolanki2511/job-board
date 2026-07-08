import { SubscriptionPlan, SubscriptionFrequency } from "@/types/subscription";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export interface SubscriptionResponse {
  success: boolean;
  data?: {
    id: string;
    subscriberId: string;
    subscriberType: "user" | "company";
    plan: SubscriptionPlan;
    frequency: SubscriptionFrequency;
    billingStatus: string;
    amount: number;
    currency: string;
    autoRenew: boolean;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

export interface PlansResponse {
  success: boolean;
  data?: Array<{
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
  }>;
}

export interface SubscriptionsApi {
  getPlans(): Promise<PlansResponse>;
  getPlanDetails(plan: SubscriptionPlan): Promise<PlansResponse>;
  getCurrentSubscription(token: string): Promise<SubscriptionResponse>;
  createSubscription(
    subscriberType: "user" | "company",
    plan: SubscriptionPlan,
    frequency?: SubscriptionFrequency,
    token?: string
  ): Promise<SubscriptionResponse>;
  upgradeSubscription(newPlan: SubscriptionPlan, token: string): Promise<SubscriptionResponse>;
  downgradeSubscription(
    newPlan: SubscriptionPlan,
    token: string
  ): Promise<SubscriptionResponse>;
  cancelSubscription(subscriptionId: string, reason?: string, token?: string): Promise<SubscriptionResponse>;
}

const subscriptionsApi: SubscriptionsApi = {
  async getPlans() {
    const response = await fetch(`${API_URL}/subscriptions/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  async getPlanDetails(plan) {
    const response = await fetch(`${API_URL}/subscriptions/plans/${plan}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  async getCurrentSubscription(token) {
    const response = await fetch(`${API_URL}/subscriptions/current`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async createSubscription(subscriberType, plan, frequency, token) {
    const response = await fetch(`${API_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        subscriberType,
        plan,
        frequency: frequency || "monthly",
      }),
    });
    return response.json();
  },

  async upgradeSubscription(newPlan, token) {
    const response = await fetch(`${API_URL}/subscriptions/upgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPlan }),
    });
    return response.json();
  },

  async downgradeSubscription(newPlan, token) {
    const response = await fetch(`${API_URL}/subscriptions/downgrade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPlan }),
    });
    return response.json();
  },

  async cancelSubscription(subscriptionId, reason, token) {
    const response = await fetch(`${API_URL}/subscriptions/${subscriptionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ reason }),
    });
    return response.json();
  },
};

export default subscriptionsApi;
