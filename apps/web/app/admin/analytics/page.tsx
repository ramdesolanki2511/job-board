"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { getRevenueAnalytics } from "@/lib/api/admin";
import styles from "./analytics.module.css";

interface RevenueData {
  period: string;
  totalRevenue: number;
  breakdown: {
    subscriptions: number;
    premiumListings: number;
    sponsorships: number;
  };
  topPlan: string;
  churnRate: number;
  activeSubscriptions: number;
}

export default function AnalyticsPage() {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState<RevenueData | null>(null);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") return;
    fetchAnalytics();
  }, [user, token, period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getRevenueAnalytics(token!, period);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <main className={styles.container}>
        <div className={styles.accessDenied}>
          <h1>Access Denied</h1>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Revenue Analytics</h1>
        <p>Monitor subscriptions, payments, and revenue</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* Period Selector */}
      <div className={styles.periodSelector}>
        {(["month", "quarter", "year"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`${styles.periodBtn} ${period === p ? styles.active : ""}`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading analytics...</p>
        </div>
      ) : analytics ? (
        <>
          {/* Main Metrics */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>💰</div>
              <div className={styles.metricContent}>
                <p className={styles.metricLabel}>Total Revenue</p>
                <p className={styles.metricValue}>
                  ${analytics.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📊</div>
              <div className={styles.metricContent}>
                <p className={styles.metricLabel}>Active Subscriptions</p>
                <p className={styles.metricValue}>
                  {analytics.activeSubscriptions.toLocaleString()}
                </p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📈</div>
              <div className={styles.metricContent}>
                <p className={styles.metricLabel}>Top Plan</p>
                <p className={styles.metricValue}>
                  {analytics.topPlan.toUpperCase()}
                </p>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>📉</div>
              <div className={styles.metricContent}>
                <p className={styles.metricLabel}>Churn Rate</p>
                <p className={styles.metricValue}>{analytics.churnRate}%</p>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className={styles.breakdownCard}>
            <h2>Revenue Breakdown</h2>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>
                  <span>Subscriptions</span>
                  <span className={styles.percentage}>
                    {(
                      (analytics.breakdown.subscriptions /
                        analytics.totalRevenue) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: `${(analytics.breakdown.subscriptions / analytics.totalRevenue) * 100}%`,
                      background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                    }}
                  ></div>
                </div>
                <p className={styles.amount}>
                  ${analytics.breakdown.subscriptions.toLocaleString()}
                </p>
              </div>

              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>
                  <span>Premium Listings</span>
                  <span className={styles.percentage}>
                    {(
                      (analytics.breakdown.premiumListings /
                        analytics.totalRevenue) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: `${(analytics.breakdown.premiumListings / analytics.totalRevenue) * 100}%`,
                      background: "linear-gradient(90deg, #10b981, #059669)",
                    }}
                  ></div>
                </div>
                <p className={styles.amount}>
                  ${analytics.breakdown.premiumListings.toLocaleString()}
                </p>
              </div>

              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>
                  <span>Sponsorships</span>
                  <span className={styles.percentage}>
                    {(
                      (analytics.breakdown.sponsorships /
                        analytics.totalRevenue) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: `${(analytics.breakdown.sponsorships / analytics.totalRevenue) * 100}%`,
                      background: "linear-gradient(90deg, #f59e0b, #d97706)",
                    }}
                  ></div>
                </div>
                <p className={styles.amount}>
                  ${analytics.breakdown.sponsorships.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className={styles.insightsCard}>
            <h2>Key Insights</h2>
            <div className={styles.insightsList}>
              <div className={styles.insight}>
                <span className={styles.insightIcon}>💡</span>
                <p>
                  Subscriptions account for{" "}
                  <strong>
                    {(
                      (analytics.breakdown.subscriptions /
                        analytics.totalRevenue) *
                      100
                    ).toFixed(0)}
                    %
                  </strong>{" "}
                  of total revenue
                </p>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightIcon}>📈</span>
                <p>
                  You have{" "}
                  <strong>{analytics.activeSubscriptions.toLocaleString()}</strong>{" "}
                  active subscriptions
                </p>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightIcon}>⚠️</span>
                <p>
                  Current churn rate is{" "}
                  <strong>{analytics.churnRate}%</strong> - monitor for
                  improvements
                </p>
              </div>
              <div className={styles.insight}>
                <span className={styles.insightIcon}>🎯</span>
                <p>
                  The <strong>{analytics.topPlan}</strong> plan is the most
                  popular among users
                </p>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
