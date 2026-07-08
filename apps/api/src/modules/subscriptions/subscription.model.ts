import mongoose, { Schema, InferSchemaType } from "mongoose";
import {
  SubscriptionPlan,
  SubscriptionFrequency,
  SubscriptionBillingStatus,
} from "../../shared/constants/subscription.constants";

const SubscriptionSchema = new Schema(
  {
    // Reference to subscriber (user or company)
    subscriberId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Type of subscriber
    subscriberType: {
      type: String,
      enum: ["user", "company"],
      required: true,
      index: true,
    },

    // Subscription Details
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      required: true,
    },

    frequency: {
      type: String,
      enum: Object.values(SubscriptionFrequency),
      default: SubscriptionFrequency.MONTHLY,
    },

    billingStatus: {
      type: String,
      enum: Object.values(SubscriptionBillingStatus),
      default: SubscriptionBillingStatus.ACTIVE,
    },

    // Stripe Integration
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    stripeCurrentPeriodStart: {
      type: Date,
      default: null,
    },

    stripeCurrentPeriodEnd: {
      type: Date,
      default: null,
    },

    // Pricing Information
    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    currency: {
      type: String,
      default: "usd",
    },

    // Trial Information
    trialStart: {
      type: Date,
      default: null,
    },

    trialEnd: {
      type: Date,
      default: null,
    },

    // Cancellation Information
    cancelledAt: {
      type: Date,
      default: null,
    },

    cancelReason: {
      type: String,
      default: null,
    },

    // Metadata
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    // Auto-renewal
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indices: [
      { key: { subscriberId: 1, subscriberType: 1 }, unique: true },
    ],
  }
);

export type Subscription = InferSchemaType<typeof SubscriptionSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const SubscriptionModel = mongoose.model<Subscription>(
  "Subscription",
  SubscriptionSchema
);
