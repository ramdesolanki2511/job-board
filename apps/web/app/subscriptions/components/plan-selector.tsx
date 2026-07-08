"use client";

import { useState, useEffect } from "react";
import { SubscriptionPlan, SubscriptionFrequency, PlanFeature } from "@/types/subscription";
import subscriptionsApi from "@/lib/api/subscriptions";
import styles from "./plan-selector.module.css";

interface PlanSelectorProps {
  onPlanSelect?: (plan: SubscriptionPlan, frequency: SubscriptionFrequency) => void;
  selectedPlan?: SubscriptionPlan;
  loading?: boolean;
}

export const PlanSelector = ({
  onPlanSelect,
  selectedPlan,
  loading: externalLoading,
}: PlanSelectorProps) => {
  const [plans, setPlans] = useState<PlanFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await subscriptionsApi.getPlans();
        if (response.success && response.data) {
          setPlans(response.data);
        } else {
          setError("Failed to load subscription plans");
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    onPlanSelect?.(plan, frequency);
  };

  const handleFrequencyChange = (newFrequency: SubscriptionFrequency) => {
    setFrequency(newFrequency);
  };

  if (loading || externalLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading subscription plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.planSelector}>
      <div className={styles.header}>
        <h2>Choose Your Plan</h2>
        <p>Select the perfect plan for your needs</p>
      </div>

      <div className={styles.frequencyToggle}>
        <button
          className={`${styles.frequencyButton} ${
            frequency === "monthly" ? styles.active : ""
          }`}
          onClick={() => handleFrequencyChange("monthly")}
        >
          Monthly
        </button>
        <button
          className={`${styles.frequencyButton} ${
            frequency === "annually" ? styles.active : ""
          }`}
          onClick={() => handleFrequencyChange("annually")}
        >
          Annually
          <span className={styles.badge}>Save 17%</span>
        </button>
      </div>

      <div className={styles.plansGrid}>
        {plans.map((plan) => {
          const price =
            frequency === "monthly" ? plan.monthlyPrice : plan.annualPrice;
          const displayPrice =
            price !== null
              ? `$${price === 0 ? "0" : (price / 100).toFixed(0)}`
              : "Custom";

          return (
            <div
              key={plan.plan}
              className={`${styles.planCard} ${
                selectedPlan === plan.plan ? styles.selected : ""
              } ${plan.plan === "pro" ? styles.featured : ""}`}
            >
              {plan.plan === "pro" && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}

              <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <p className={styles.description}>{plan.description}</p>
              </div>

              <div className={styles.pricing}>
                <span className={styles.price}>{displayPrice}</span>
                {price !== null && (
                  <span className={styles.period}>
                    /{frequency === "monthly" ? "month" : "year"}
                  </span>
                )}
              </div>

              <button
                className={`${styles.selectButton} ${
                  selectedPlan === plan.plan ? styles.selectedButton : ""
                }`}
                onClick={() => handlePlanSelect(plan.plan)}
                disabled={externalLoading}
              >
                {selectedPlan === plan.plan ? "Selected" : "Choose Plan"}
              </button>

              <div className={styles.features}>
                <h4>Features:</h4>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {plan.jobPostingLimit !== Infinity && (
                <div className={styles.highlight}>
                  Up to {plan.jobPostingLimit} job postings
                </div>
              )}
              {plan.jobPostingLimit === Infinity && (
                <div className={styles.highlight}>Unlimited job postings</div>
              )}

              {plan.analyticsFeature && (
                <div className={styles.featureBadge}>Analytics Included</div>
              )}
              {plan.prioritySupport && (
                <div className={styles.featureBadge}>Priority Support</div>
              )}
              {plan.customBranding && (
                <div className={styles.featureBadge}>Custom Branding</div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <p>All plans include 14-day free trial. No credit card required.</p>
      </div>
    </div>
  );
};
