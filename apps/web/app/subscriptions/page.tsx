"use client";

import { useEffect, useState } from "react";
import { PlanSelector, SubscriptionManager } from "./components";
import { CurrentSubscription } from "@/types/subscription";
import styles from "./page.module.css";

interface SubscriptionsPageProps {
  searchParams?: { tab?: "plans" | "manage" };
}

export default function SubscriptionsPage({
  searchParams,
}: SubscriptionsPageProps) {
  const [currentTab, setCurrentTab] = useState<"plans" | "manage">(
    (searchParams?.tab as "plans" | "manage") || "plans"
  );
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get token from localStorage or auth context
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Subscriptions</h1>
        <p>Manage your subscription and choose the perfect plan</p>
      </div>

      {!token && (
        <div className={styles.authRequired}>
          <p>
            Please log in to view and manage your subscriptions. You will be
            prompted to log in.
          </p>
        </div>
      )}

      {token && (
        <>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${
                currentTab === "plans" ? styles.active : ""
              }`}
              onClick={() => setCurrentTab("plans")}
            >
              Browse Plans
            </button>
            <button
              className={`${styles.tab} ${
                currentTab === "manage" ? styles.active : ""
              }`}
              onClick={() => setCurrentTab("manage")}
            >
              Manage Subscription
            </button>
          </div>

          <div className={styles.content}>
            {currentTab === "plans" && (
              <PlanSelector
                selectedPlan={currentSubscription?.plan}
                onPlanSelect={(plan, frequency) => {
                  console.log(`Selected plan: ${plan} (${frequency})`);
                  // TODO: Implement plan selection and checkout
                }}
              />
            )}

            {currentTab === "manage" && (
              <SubscriptionManager
                token={token}
                onSubscriptionUpdate={setCurrentSubscription}
              />
            )}
          </div>
        </>
      )}
    </main>
  );
}
