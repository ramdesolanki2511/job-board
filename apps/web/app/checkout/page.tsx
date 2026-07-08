"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/auth/auth-context";
import { SubscriptionPlan, SubscriptionFrequency } from "@/types/subscription";
import styles from "./page.module.css";

interface CheckoutPageProps {
  searchParams: {
    plan?: SubscriptionPlan;
    frequency?: SubscriptionFrequency;
  };
}

export default function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(
    (searchParams?.plan as SubscriptionPlan) || null
  );
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(
    (searchParams?.frequency as SubscriptionFrequency) || "monthly"
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  const plans = {
    free: { name: "Free", monthlyPrice: 0, annualPrice: 0 },
    basic: { name: "Basic", monthlyPrice: 29, annualPrice: 290 },
    pro: { name: "Pro", monthlyPrice: 99, annualPrice: 990 },
    enterprise: { name: "Enterprise", monthlyPrice: 0, annualPrice: 0 },
  };

  const handleCheckout = async () => {
    if (!plan || !token) {
      setError("Invalid plan or not authenticated");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/checkout/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId: plan,
          frequency,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (data.data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return (
      <main className={styles.container}>
        <div className={styles.authRequired}>
          <h1>Checkout</h1>
          <p>Please log in to complete your purchase.</p>
          <Link href="/auth/login">Sign In</Link>
        </div>
      </main>
    );
  }

  if (!plan) {
    return (
      <main className={styles.container}>
        <div className={styles.error}>
          <h1>Invalid Plan</h1>
          <p>Please select a valid subscription plan.</p>
          <Link href="/subscriptions">← Back to Plans</Link>
        </div>
      </main>
    );
  }

  const selectedPlan = plans[plan];
  const price = frequency === "monthly" ? selectedPlan.monthlyPrice : selectedPlan.annualPrice;
  const savings = frequency === "annually" && selectedPlan.monthlyPrice > 0
    ? (selectedPlan.monthlyPrice * 12 - selectedPlan.annualPrice)
    : 0;

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Checkout</h1>
        <p>Complete your purchase</p>
      </div>

      <div className={styles.content}>
        <div className={styles.summary}>
          <h2>Order Summary</h2>

          <div className={styles.planCard}>
            <div className={styles.planHeader}>
              <h3>{selectedPlan.name} Plan</h3>
              <span className={styles.frequency}>
                {frequency === "monthly" ? "Monthly" : "Annually"}
              </span>
            </div>

            <div className={styles.pricing}>
              {price === 0 ? (
                <span className={styles.free}>Free</span>
              ) : (
                <>
                  <span className={styles.price}>${price}</span>
                  <span className={styles.period}>
                    /{frequency === "monthly" ? "month" : "year"}
                  </span>
                </>
              )}
            </div>

            {savings > 0 && (
              <div className={styles.savings}>
                You save ${savings} per year!
              </div>
            )}

            <div className={styles.features}>
              <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
            </div>
          </div>

          <div className={styles.total}>
            <span>Total:</span>
            <span className={styles.totalPrice}>
              {price === 0 ? "Free" : `$${price}`}
            </span>
          </div>
        </div>

        <div className={styles.checkout}>
          <h2>Payment Details</h2>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <div className={styles.userInfo}>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Name</label>
              <p>
                {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>

          <div className={styles.frequencyToggle}>
            <button
              className={`${styles.freqButton} ${
                frequency === "monthly" ? styles.active : ""
              }`}
              onClick={() => setFrequency("monthly")}
              disabled={loading}
            >
              Monthly
            </button>
            <button
              className={`${styles.freqButton} ${
                frequency === "annually" ? styles.active : ""
              }`}
              onClick={() => setFrequency("annually")}
              disabled={loading}
            >
              Annually
            </button>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={styles.checkoutButton}
          >
            {loading ? "Processing..." : `Pay with Stripe - $${price}`}
          </button>

          <p className={styles.disclaimer}>
            Your payment is secure and encrypted. No charges until your trial ends.
          </p>

          <Link href="/subscriptions" className={styles.backLink}>
            ← Back to Plans
          </Link>
        </div>
      </div>
    </main>
  );
}
