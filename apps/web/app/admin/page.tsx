"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { getAdminStats, AdminStats, getSystemHealth, SystemHealth } from "@/lib/api/admin";
import Link from "next/link";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") return;
    fetchData();
  }, [user, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, healthData] = await Promise.all([
        getAdminStats(token!),
        getSystemHealth(token!),
      ]);
      setStats(statsData);
      setHealth(healthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <main className={styles.container}>
        <div className={styles.accessDenied}>
          <h1>Access Denied</h1>
          <p>You do not have permission to access the admin panel.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading admin dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>System overview and management</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {/* System Health */}
      {health && (
        <div className={styles.healthCard}>
          <h2>System Health</h2>
          <div className={styles.healthMetrics}>
            <div className={styles.healthItem}>
              <span>Uptime</span>
              <strong>{health.uptime}%</strong>
            </div>
            <div className={styles.healthItem}>
              <span>Response Time</span>
              <strong>{health.responseTime}ms</strong>
            </div>
            <div className={styles.healthItem}>
              <span>Error Rate</span>
              <strong>{health.errorRate}%</strong>
            </div>
            <div className={styles.healthItem}>
              <span>Database</span>
              <strong className={health.databaseConnected ? styles.healthy : styles.unhealthy}>
                {health.databaseConnected ? "Connected" : "Disconnected"}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {stats && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>👥</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Total Users</p>
                <p className={styles.statValue}>{stats.users.total}</p>
                <p className={styles.statSubtext}>{stats.users.active} active</p>
              </div>
              <Link href="/admin/users" className={styles.viewLink}>
                Manage →
              </Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏢</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Companies</p>
                <p className={styles.statValue}>{stats.companies.total}</p>
                <p className={styles.statSubtext}>{stats.companies.verified} verified</p>
              </div>
              <Link href="/admin/companies" className={styles.viewLink}>
                Manage →
              </Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Jobs Posted</p>
                <p className={styles.statValue}>{stats.jobs.total}</p>
                <p className={styles.statSubtext}>
                  {stats.jobs.pendingApproval} pending approval
                </p>
              </div>
              <Link href="/admin/jobs" className={styles.viewLink}>
                Review →
              </Link>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>💰</div>
              <div className={styles.statContent}>
                <p className={styles.statLabel}>Subscriptions</p>
                <p className={styles.statValue}>{stats.subscriptions.total}</p>
                <p className={styles.statSubtext}>Active plans</p>
              </div>
              <Link href="/admin/analytics" className={styles.viewLink}>
                Analytics →
              </Link>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className={styles.alertsCard}>
            <h2>Alerts</h2>
            <div className={styles.alertsList}>
              {stats.users.banned > 0 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>⚠️</span>
                  <span>
                    <strong>{stats.users.banned} users</strong> have been banned
                  </span>
                </div>
              )}
              {stats.companies.suspended > 0 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>🚫</span>
                  <span>
                    <strong>{stats.companies.suspended} companies</strong> are suspended
                  </span>
                </div>
              )}
              {stats.jobs.rejectedJobs > 0 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>❌</span>
                  <span>
                    <strong>{stats.jobs.rejectedJobs} jobs</strong> have been rejected
                  </span>
                </div>
              )}
              {stats.jobs.pendingApproval > 0 && (
                <div className={styles.alert}>
                  <span className={styles.alertIcon}>⏳</span>
                  <span>
                    <strong>{stats.jobs.pendingApproval} jobs</strong> awaiting approval
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h2>Quick Actions</h2>
            <div className={styles.actionButtons}>
              <Link href="/admin/users" className={styles.actionButton}>
                👥 Manage Users
              </Link>
              <Link href="/admin/companies" className={styles.actionButton}>
                🏢 Manage Companies
              </Link>
              <Link href="/admin/jobs" className={styles.actionButton}>
                📋 Review Jobs
              </Link>
              <Link href="/admin/analytics" className={styles.actionButton}>
                📊 Analytics
              </Link>
              <Link href="/admin/audit-logs" className={styles.actionButton}>
                📝 Audit Logs
              </Link>
              <Link href="/admin/settings" className={styles.actionButton}>
                ⚙️ Settings
              </Link>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
