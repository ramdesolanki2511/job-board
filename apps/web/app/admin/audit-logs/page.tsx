"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { getAuditLogs } from "@/lib/api/admin";
import styles from "./audit-logs.module.css";

interface AuditLog {
  id: string;
  action: string;
  userId: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export default function AuditLogsPage() {
  const { user, token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") return;
    fetchLogs();
  }, [user, token, currentPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getAuditLogs(token!, currentPage, 50);
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("create")) return "create";
    if (action.includes("update")) return "update";
    if (action.includes("delete")) return "delete";
    if (action.includes("ban")) return "delete";
    if (action.includes("suspend")) return "delete";
    if (action.includes("verify")) return "create";
    if (action.includes("approve")) return "create";
    if (action.includes("reject")) return "delete";
    return "update";
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
        <h1>Audit Logs</h1>
        <p>Track all admin actions and system events</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading audit logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No audit logs found</p>
        </div>
      ) : (
        <>
          <div className={styles.logsCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Admin</th>
                  <th>Target</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span
                        className={`${styles.action} ${styles[`action${getActionBadgeColor(log.action)}`]}`}
                      >
                        {log.action.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td>{log.userId}</td>
                    <td className={styles.targetId}>{log.targetId}</td>
                    <td className={styles.details}>{log.details}</td>
                    <td className={styles.timestamp}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className={styles.ip}>{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageBtn}
            >
              ← Previous
            </button>

            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </main>
  );
}
