"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import {
  getCompanies,
  verifyCompany,
  suspendCompany,
  Company,
} from "@/lib/api/admin";
import styles from "./companies.module.css";

export default function CompaniesPage() {
  const { user, token } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [action, setAction] = useState<"suspend" | "verify">("suspend");
  const [suspendReason, setSuspendReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") return;
    fetchCompanies();
  }, [user, token, currentPage]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies(token!, currentPage, 20);
      setCompanies(data.companies);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (company: Company, actionType: "suspend" | "verify") => {
    setSelectedCompany(company);
    setAction(actionType);
    if (actionType === "verify") {
      handleVerify(company);
    } else {
      setShowModal(true);
    }
  };

  const handleVerify = async (company: Company) => {
    try {
      setActionLoading(true);
      await verifyCompany(token!, company.id);
      fetchCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify company");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedCompany || !suspendReason.trim()) return;

    try {
      setActionLoading(true);
      await suspendCompany(token!, selectedCompany.id, suspendReason);
      setShowModal(false);
      setSuspendReason("");
      setSelectedCompany(null);
      fetchCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend company");
    } finally {
      setActionLoading(false);
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
        <h1>Company Management</h1>
        <p>Verify, suspend, and manage companies</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading companies...</p>
        </div>
      ) : (
        <>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Contact Email</th>
                  <th>Jobs Posted</th>
                  <th>Active Jobs</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.companyName}>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.totalJobsPosted}</td>
                    <td>{c.activeJobs}</td>
                    <td>
                      <span className={styles.badge}>{c.plan}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.status} ${styles[`status${c.status}`]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className={styles.actions}>
                      {c.status === "pending" && (
                        <button
                          onClick={() => handleAction(c, "verify")}
                          className={styles.verifyBtn}
                          disabled={actionLoading}
                        >
                          Verify
                        </button>
                      )}
                      {c.status !== "suspended" && (
                        <button
                          onClick={() => handleAction(c, "suspend")}
                          className={styles.suspendBtn}
                          disabled={actionLoading}
                        >
                          Suspend
                        </button>
                      )}
                    </td>
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

      {/* Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Suspend Company</h2>
            <p className={styles.modalSubtext}>
              Are you sure you want to suspend {selectedCompany?.name}?
            </p>

            <div className={styles.formGroup}>
              <label>Reason for suspension</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Explain why this company is being suspended..."
                rows={4}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSuspendReason("");
                }}
                className={styles.cancelBtn}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                className={styles.confirmBtn}
                disabled={actionLoading || !suspendReason.trim()}
              >
                {actionLoading ? "Suspending..." : "Confirm Suspension"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
