"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/auth-context";
import { getPendingJobs, approveJob, rejectJob, Job } from "@/lib/api/admin";
import styles from "./jobs.module.css";

export default function JobModerationPage() {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") return;
    fetchPendingJobs();
  }, [user, token, currentPage]);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const data = await getPendingJobs(token!, currentPage, 20);
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId: string) => {
    try {
      setActionLoading(true);
      await approveJob(token!, jobId);
      fetchPendingJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve job");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (job: Job) => {
    setSelectedJob(job);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!selectedJob || !rejectReason.trim()) return;

    try {
      setActionLoading(true);
      await rejectJob(token!, selectedJob.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedJob(null);
      fetchPendingJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject job");
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
        <h1>Job Moderation</h1>
        <p>Review and approve job postings</p>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading pending jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className={styles.emptyState}>
          <p>✓ No jobs pending approval</p>
        </div>
      ) : (
        <>
          <div className={styles.jobsList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobHeader}>
                  <div>
                    <h3>{job.title}</h3>
                    <p className={styles.company}>{job.company}</p>
                  </div>
                  <span className={styles.badge}>Pending</span>
                </div>

                <div className={styles.jobContent}>
                  <p>{job.content.substring(0, 200)}...</p>
                </div>

                <div className={styles.jobMeta}>
                  <span>
                    Submitted: {new Date(job.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.jobActions}>
                  <button
                    onClick={() => handleApprove(job.id)}
                    className={styles.approveBtn}
                    disabled={actionLoading}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleRejectClick(job)}
                    className={styles.rejectBtn}
                    disabled={actionLoading}
                  >
                    ✕ Reject
                  </button>
                </div>
              </div>
            ))}
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

      {/* Reject Modal */}
      {showRejectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Reject Job</h2>
            <p className={styles.modalSubtext}>
              Are you sure you want to reject "{selectedJob?.title}"?
            </p>

            <div className={styles.formGroup}>
              <label>Reason for rejection</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this job is being rejected..."
                rows={4}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className={styles.cancelBtn}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className={styles.confirmBtn}
                disabled={actionLoading || !rejectReason.trim()}
              >
                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
