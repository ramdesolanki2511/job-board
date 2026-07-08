import { Subscription } from "./subscription.model";
import { SubscriptionDto } from "./subscription.dto";

export class SubscriptionMapper {
  static toDto(subscription: Subscription): SubscriptionDto {
    return {
      id: subscription._id?.toString() || "",
      subscriberId: subscription.subscriberId?.toString() || "",
      subscriberType: subscription.subscriberType,
      plan: subscription.plan,
      frequency: subscription.frequency,
      billingStatus: subscription.billingStatus,
      stripeCustomerId: subscription.stripeCustomerId,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      stripeCurrentPeriodStart: subscription.stripeCurrentPeriodStart,
      stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
      amount: subscription.amount,
      currency: subscription.currency,
      trialStart: subscription.trialStart,
      trialEnd: subscription.trialEnd,
      cancelledAt: subscription.cancelledAt,
      cancelReason: subscription.cancelReason,
      metadata: subscription.metadata,
      autoRenew: subscription.autoRenew,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }

  static toListDto(subscriptions: Subscription[]): SubscriptionDto[] {
    return subscriptions.map((subscription) => this.toDto(subscription));
  }
}
