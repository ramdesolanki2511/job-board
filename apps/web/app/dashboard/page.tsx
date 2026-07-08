"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import styles from "./page.module.css";

interface Analytics {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplications: number;
  savedCandidates: number;
  rejectedApplications: number;
  conversionRate: number;
  recentActivity: Array<{
    type: string;
    description: string;
    createdAt: string;
  }>;
}

export default function CompanyDashboard() {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  useEffect(() => {
    if (!user || !token) return;
    fetchAnalytics();
  }, [user, token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/company-dashboard/analytics/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load analytics");

      const data = await response.json();
      setAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return (
      <main className={styles.container}>
        <div className={styles.authRequired}>
          <h1>Company Dashboard</h1>
          <p>Please log in to view your dashboard.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.errorState}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className={styles.container}>
        <div className={styles.emptyState}>
          <h2>No Dashboard Data</h2>
          <p>Start by posting your first job to see analytics.</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Company Dashboard</h1>
        <p>Welcome back, {user?.firstName}!</p>
      </div>

      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📋</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Total Jobs Posted</p>
            <p className={styles.metricValue}>{analytics.totalJobs}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>✓</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Active Jobs</p>
            <p className={styles.metricValue}>{analytics.activeJobs}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📧</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Applications</p>
            <p className={styles.metricValue}>{analytics.totalApplications}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>⭐</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Saved Candidates</p>
            <p className={styles.metricValue}>{analytics.savedCandidates}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>📊</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Conversion Rate</p>
            <p className={styles.metricValue}>{analytics.conversionRate}%</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIcon}>✕</div>
          <div className={styles.metricContent}>
            <p className={styles.metricLabel}>Rejected</p>
            <p className={styles.metricValue}>{analytics.rejectedApplications}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.activitySection}>
        <h2>Recent Activity</h2>
        {analytics.recentActivity.length > 0 ? (
          <div className={styles.activityList}>
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <span className={styles.activityType}>
                  {activity.type === "job_posted" && "📝"}
                  {activity.type === "application_received" && "📧"}
                  {activity.type === "candidate_saved" && "⭐"}
                  {activity.type === "job_closed" && "✕"}
                </span>
                <div className={styles.activityContent}>
                  <p className={styles.activityDescription}>
                    {activity.description}
                  </p>
                  <p className={styles.activityTime}>
                    {new Date(activity.createdAt).toLocaleDateString()} at{" "}
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noActivity}>No recent activity</p>
        )}
      </div>

      {/* Call to Actions */}
      <div className={styles.ctaSection}>
        <a href="/jobs/post" className={styles.ctaButton}>
          Post New Job
        </a>
        <a href="/company/applications" className={styles.ctaButtonSecondary}>
          View Applications
        </a>
      </div>
    </main>
  );
}
