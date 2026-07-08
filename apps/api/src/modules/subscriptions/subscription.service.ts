import { AppError } from "../../shared/errors/AppError";
import { SubscriptionRepository } from "./subscription.repository";
import { SubscriptionMapper } from "./subscription.mapper";
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionDto,
} from "./subscription.dto";
import {
  SubscriptionPlan,
  SubscriptionFrequency,
  SubscriptionBillingStatus,
  SUBSCRIPTION_PLAN_CONFIG,
} from "../../shared/constants/subscription.constants";

export class SubscriptionService {
  private repository = new SubscriptionRepository();

  async createSubscription(data: CreateSubscriptionDto): Promise<SubscriptionDto> {
    // Check if subscriber already has an active subscription
    const existing = await this.repository.findBySubscriber(
      data.subscriberId,
      data.subscriberType
    );

    if (existing && existing.billingStatus === SubscriptionBillingStatus.ACTIVE) {
      throw new AppError(
        409,
        "Subscriber already has an active subscription"
      );
    }

    // Get plan configuration
    const planConfig = SUBSCRIPTION_PLAN_CONFIG[data.plan];
    if (!planConfig) {
      throw new AppError(400, "Invalid subscription plan");
    }

    // Calculate amount based on frequency
    const frequency = data.frequency || SubscriptionFrequency.MONTHLY;
    const amount =
      frequency === SubscriptionFrequency.MONTHLY
        ? planConfig.monthlyPrice
        : planConfig.annualPrice;

    if (amount === null) {
      throw new AppError(
        400,
        "This plan requires manual setup. Please contact support."
      );
    }

    const subscription = await this.repository.create({
      subscriberId: data.subscriberId as any,
      subscriberType: data.subscriberType,
      plan: data.plan,
      frequency,
      billingStatus: SubscriptionBillingStatus.ACTIVE,
      amount,
      currency: data.currency || "usd",
      stripeCustomerId: data.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId,
      metadata: data.metadata,
    });

    return SubscriptionMapper.toDto(subscription);
  }

  async getSubscription(id: string): Promise<SubscriptionDto> {
    const subscription = await this.repository.findById(id);

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    return SubscriptionMapper.toDto(subscription);
  }

  async getSubscriptionBySubscriber(
    subscriberId: string,
    subscriberType: "user" | "company"
  ): Promise<SubscriptionDto | null> {
    const subscription = await this.repository.findBySubscriber(
      subscriberId,
      subscriberType
    );

    if (!subscription) {
      return null;
    }

    return SubscriptionMapper.toDto(subscription);
  }

  async updateSubscription(
    id: string,
    data: UpdateSubscriptionDto
  ): Promise<SubscriptionDto> {
    const subscription = await this.repository.findById(id);

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    // Validate new plan if provided
    if (data.plan && data.plan !== subscription.plan) {
      const planConfig = SUBSCRIPTION_PLAN_CONFIG[data.plan];
      if (!planConfig) {
        throw new AppError(400, "Invalid subscription plan");
      }

      // Calculate new amount
      const frequency = data.frequency || subscription.frequency;
      const newAmount =
        frequency === SubscriptionFrequency.MONTHLY
          ? planConfig.monthlyPrice
          : planConfig.annualPrice;

      if (newAmount === null) {
        throw new AppError(
          400,
          "This plan requires manual setup. Please contact support."
        );
      }

      data.plan = data.plan;
      // Update amount based on new plan and frequency
      (data as any).amount = newAmount;
    }

    const updated = await this.repository.update(id, data);

    if (!updated) {
      throw new AppError(500, "Failed to update subscription");
    }

    return SubscriptionMapper.toDto(updated);
  }

  async cancelSubscription(id: string, reason?: string): Promise<SubscriptionDto> {
    const subscription = await this.repository.findById(id);

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    if (subscription.billingStatus === SubscriptionBillingStatus.CANCELLED) {
      throw new AppError(400, "Subscription is already cancelled");
    }

    const updated = await this.repository.update(id, {
      billingStatus: SubscriptionBillingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: reason,
    });

    if (!updated) {
      throw new AppError(500, "Failed to cancel subscription");
    }

    return SubscriptionMapper.toDto(updated);
  }

  async listSubscriptions(
    filters?: {
      plan?: SubscriptionPlan;
      billingStatus?: SubscriptionBillingStatus;
      subscriberType?: "user" | "company";
    },
    page: number = 1,
    limit: number = 20
  ) {
    const { subscriptions, total } = await this.repository.findAll(
      filters,
      page,
      limit
    );

    return {
      subscriptions: SubscriptionMapper.toListDto(subscriptions),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSubscriptionPlanConfig(plan: SubscriptionPlan) {
    const config = SUBSCRIPTION_PLAN_CONFIG[plan];

    if (!config) {
      throw new AppError(400, "Invalid subscription plan");
    }

    return {
      plan,
      ...config,
    };
  }

  async getAllPlanConfigs() {
    return Object.entries(SUBSCRIPTION_PLAN_CONFIG).map(([plan, config]) => ({
      plan,
      ...config,
    }));
  }

  async upgradeSubscription(
    subscriberId: string,
    subscriberType: "user" | "company",
    newPlan: SubscriptionPlan
  ): Promise<SubscriptionDto> {
    const subscription = await this.repository.findBySubscriber(
      subscriberId,
      subscriberType
    );

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    if (subscription.billingStatus !== SubscriptionBillingStatus.ACTIVE) {
      throw new AppError(400, "Can only upgrade active subscriptions");
    }

    return this.updateSubscription(subscription._id?.toString() || "", {
      plan: newPlan,
    });
  }

  async downgradeSubscription(
    subscriberId: string,
    subscriberType: "user" | "company",
    newPlan: SubscriptionPlan
  ): Promise<SubscriptionDto> {
    const subscription = await this.repository.findBySubscriber(
      subscriberId,
      subscriberType
    );

    if (!subscription) {
      throw new AppError(404, "Subscription not found");
    }

    if (subscription.billingStatus !== SubscriptionBillingStatus.ACTIVE) {
      throw new AppError(400, "Can only downgrade active subscriptions");
    }

    return this.updateSubscription(subscription._id?.toString() || "", {
      plan: newPlan,
    });
  }
}
