import Joi from "joi";
import {
  SubscriptionPlan,
  SubscriptionFrequency,
} from "../../shared/constants/subscription.constants";

export interface CreateSubscriptionPayload {
  subscriberType: "user" | "company";
  plan: SubscriptionPlan;
  frequency?: SubscriptionFrequency;
}

export interface UpdateSubscriptionPayload {
  plan?: SubscriptionPlan;
  frequency?: SubscriptionFrequency;
  autoRenew?: boolean;
}

export const createSubscriptionSchema = Joi.object({
  subscriberType: Joi.string()
    .valid("user", "company")
    .required()
    .messages({
      "any.required": "Subscriber type is required",
      "any.only": "Subscriber type must be 'user' or 'company'",
    }),
  plan: Joi.string()
    .valid(...Object.values(SubscriptionPlan))
    .required()
    .messages({
      "any.required": "Plan is required",
      "any.only": "Invalid subscription plan",
    }),
  frequency: Joi.string()
    .valid(...Object.values(SubscriptionFrequency))
    .default(SubscriptionFrequency.MONTHLY)
    .messages({
      "any.only": "Frequency must be 'monthly' or 'annually'",
    }),
});

export const updateSubscriptionSchema = Joi.object({
  plan: Joi.string()
    .valid(...Object.values(SubscriptionPlan))
    .messages({
      "any.only": "Invalid subscription plan",
    }),
  frequency: Joi.string()
    .valid(...Object.values(SubscriptionFrequency))
    .messages({
      "any.only": "Frequency must be 'monthly' or 'annually'",
    }),
  autoRenew: Joi.boolean().messages({
    "boolean.base": "Auto-renew must be a boolean value",
  }),
});
