"use client";

import { useState, useEffect } from "react";
import { CurrentSubscription, SubscriptionPlan, SubscriptionFrequency } from "@/types/subscription";
import subscriptionsApi from "@/lib/api/subscriptions";
import styles from "./subscription-manager.module.css";

interface SubscriptionManagerProps {
  token?: string;
  onSubscriptionUpdate?: (subscription: CurrentSubscription) => void;
}

export const SubscriptionManager = ({
  token,
  onSubscriptionUpdate,
}: SubscriptionManagerProps) => {
  const [subscription, setSubscription] = useState<CurrentSubscription | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    fetchSubscription();
  }, [token]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionsApi.getCurrentSubscription(
        token || ""
      );

      if (response.success && response.data) {
        setSubscription(response.data);
        onSubscriptionUpdate?.(response.data);
      } else {
        setError(response.error || "Failed to load subscription");
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlan: SubscriptionPlan) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    try {
      setActionLoading(true);
      const response = await subscriptionsApi.upgradeSubscription(
        newPlan,
        token
      );

      if (response.success && response.data) {
        setSubscription(response.data);
        setSuccessMessage("Subscription upgraded successfully!");
        onSubscriptionUpdate?.(response.data);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error || "Failed to upgrade subscription");
      }
    } catch (err) {
      console.error("Error upgrading subscription:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upgrade subscription"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = async (newPlan: SubscriptionPlan) => {
    if (!token) {
      setError("Authentication required");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to downgrade to ${newPlan}? This will take effect at the end of your current billing period.`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await subscriptionsApi.downgradeSubscription(
        newPlan,
        token
      );

      if (response.success && response.data) {
        setSubscription(response.data);
        setSuccessMessage("Subscription downgraded successfully!");
        onSubscriptionUpdate?.(response.data);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error || "Failed to downgrade subscription");
      }
    } catch (err) {
      console.error("Error downgrading subscription:", err);
      setError(
        err instanceof Error ? err.message : "Failed to downgrade subscription"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription || !token) {
      setError("Unable to cancel subscription");
      return;
    }

    try {
      setActionLoading(true);
      const response = await subscriptionsApi.cancelSubscription(
        subscription.id,
        cancelReason,
        token
      );

      if (response.success && response.data) {
        setSubscription(response.data);
        setShowCancelModal(false);
        setCancelReason("");
        setSuccessMessage("Subscription cancelled successfully!");
        onSubscriptionUpdate?.(response.data);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.error || "Failed to cancel subscription");
      }
    } catch (err) {
      console.error("Error cancelling subscription:", err);
      setError(
        err instanceof Error ? err.message : "Failed to cancel subscription"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading subscription information...</p>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className={styles.errorContainer}>
        <h3>Unable to Load Subscription</h3>
        <p>{error}</p>
        <button onClick={fetchSubscription} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={styles.emptyState}>
        <h3>No Active Subscription</h3>
        <p>You don't have an active subscription yet.</p>
      </div>
    );
  }

  const planNames: Record<SubscriptionPlan, string> = {
    free: "Free",
    basic: "Basic",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  const endDate = subscription.stripeCurrentPeriodEnd
    ? new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString()
    : "N/A";

  return (
    <div className={styles.subscriptionManager}>
      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button onClick={() => setError(null)} className={styles.closeButton}>
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className={styles.successAlert}>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.card}>
        <h2>Current Subscription</h2>

        <div className={styles.subscriptionDetails}>
          <div className={styles.detailRow}>
            <label>Plan:</label>
            <span className={styles.planBadge}>
              {planNames[subscription.plan]}
            </span>
          </div>

          <div className={styles.detailRow}>
            <label>Billing Frequency:</label>
            <span>{subscription.frequency === "monthly" ? "Monthly" : "Annually"}</span>
          </div>

          <div className={styles.detailRow}>
            <label>Status:</label>
            <span
              className={`${styles.statusBadge} ${styles[
                subscription.billingStatus
              ]}`}
            >
              {subscription.billingStatus}
            </span>
          </div>

          <div className={styles.detailRow}>
            <label>Amount:</label>
            <span>${(subscription.amount / 100).toFixed(2)}</span>
          </div>

          <div className={styles.detailRow}>
            <label>Renewal Date:</label>
            <span>{endDate}</span>
          </div>

          <div className={styles.detailRow}>
            <label>Auto-Renewal:</label>
            <span className={subscription.autoRenew ? styles.active : styles.inactive}>
              {subscription.autoRenew ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {subscription.billingStatus === "active" && (
          <div className={styles.actions}>
            <div className={styles.actionGroup}>
              <h3>Upgrade</h3>
              <div className={styles.planButtons}>
                {(["pro", "enterprise"] as const).map((plan) => (
                  subscription.plan !== plan && (
                    <button
                      key={plan}
                      onClick={() => handleUpgrade(plan)}
                      disabled={actionLoading}
                      className={styles.upgradeButton}
                    >
                      Upgrade to {planNames[plan]}
                    </button>
                  )
                ))}
              </div>
            </div>

            <div className={styles.actionGroup}>
              <h3>Downgrade</h3>
              <div className={styles.planButtons}>
                {(["free", "basic"] as const).map((plan) => (
                  subscription.plan !== plan && (
                    <button
                      key={plan}
                      onClick={() => handleDowngrade(plan)}
                      disabled={actionLoading}
                      className={styles.downgradeButton}
                    >
                      Downgrade to {planNames[plan]}
                    </button>
                  )
                ))}
              </div>
            </div>

            <div className={styles.actionGroup}>
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={actionLoading}
                className={styles.cancelButton}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </div>

      {showCancelModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Cancel Subscription</h3>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                We're sorry to see you go! Your access will end at the end of
                your current billing period.
              </p>

              <div className={styles.formGroup}>
                <label htmlFor="cancel-reason">
                  Why are you cancelling? (optional)
                </label>
                <textarea
                  id="cancel-reason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Your feedback helps us improve..."
                  className={styles.textarea}
                  rows={4}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className={styles.secondaryButton}
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className={styles.dangerButton}
              >
                {actionLoading ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
