import { SubscriptionModel, Subscription } from "./subscription.model";
import {
  SubscriptionPlan,
  SubscriptionFrequency,
  SubscriptionBillingStatus,
} from "../../shared/constants/subscription.constants";

export class SubscriptionRepository {
  async create(data: Partial<Subscription>): Promise<Subscription> {
    const subscription = new SubscriptionModel(data);
    return subscription.save();
  }

  async findById(id: string): Promise<Subscription | null> {
    return SubscriptionModel.findById(id);
  }

  async findBySubscriber(
    subscriberId: string,
    subscriberType: "user" | "company"
  ): Promise<Subscription | null> {
    return SubscriptionModel.findOne({
      subscriberId,
      subscriberType,
    });
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string
  ): Promise<Subscription | null> {
    return SubscriptionModel.findOne({
      stripeSubscriptionId,
    });
  }

  async findByStripeCustomerId(
    stripeCustomerId: string
  ): Promise<Subscription | null> {
    return SubscriptionModel.findOne({
      stripeCustomerId,
    });
  }

  async findAll(
    filters?: {
      plan?: SubscriptionPlan;
      billingStatus?: SubscriptionBillingStatus;
      subscriberType?: "user" | "company";
    },
    page: number = 1,
    limit: number = 20
  ): Promise<{ subscriptions: Subscription[]; total: number }> {
    const query: any = {};

    if (filters?.plan) query.plan = filters.plan;
    if (filters?.billingStatus) query.billingStatus = filters.billingStatus;
    if (filters?.subscriberType)
      query.subscriberType = filters.subscriberType;

    const total = await SubscriptionModel.countDocuments(query);
    const subscriptions = await SubscriptionModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { subscriptions, total };
  }

  async update(id: string, data: Partial<Subscription>): Promise<Subscription | null> {
    return SubscriptionModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await SubscriptionModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async updateByStripeSubscriptionId(
    stripeSubscriptionId: string,
    data: Partial<Subscription>
  ): Promise<Subscription | null> {
    return SubscriptionModel.findOneAndUpdate(
      { stripeSubscriptionId },
      data,
      { new: true, runValidators: true }
    );
  }

  async countByPlan(plan: SubscriptionPlan): Promise<number> {
    return SubscriptionModel.countDocuments({ plan });
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return SubscriptionModel.find({
      billingStatus: SubscriptionBillingStatus.ACTIVE,
    });
  }

  async getExpiringSubscriptions(daysUntilExpiry: number): Promise<Subscription[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysUntilExpiry);

    return SubscriptionModel.find({
      stripeCurrentPeriodEnd: {
        $lte: futureDate,
        $gte: new Date(),
      },
      billingStatus: SubscriptionBillingStatus.ACTIVE,
    });
  }
}
