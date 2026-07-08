"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth/auth-context";
import {
  getUserJobAlerts,
  createJobAlert,
  updateJobAlert,
  deleteJobAlert,
  pauseJobAlert,
  resumeJobAlert,
  JobAlert,
  CreateJobAlertPayload,
} from "@/lib/api/job-alerts";
import AlertForm from "./components/alert-form";
import AlertList from "./components/alert-list";
import styles from "./page.module.css";

export default function AlertsPage() {
  const { user, token } = useAuth();
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  useEffect(() => {
    if (!user || !token) return;
    fetchAlerts();
  }, [user, token, page]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!token) throw new Error("Not authenticated");

      const response = await getUserJobAlerts(token, page, limit);
      setAlerts(response.alerts);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = async (payload: CreateJobAlertPayload) => {
    try {
      setFormLoading(true);
      if (!token) throw new Error("Not authenticated");

      if (editingAlert) {
        // Update mode
        const updated = await updateJobAlert(editingAlert.id, payload, token);
        setAlerts(
          alerts.map((a) => (a.id === updated.id ? updated : a))
        );
      } else {
        // Create mode
        const newAlert = await createJobAlert(payload, token);
        setAlerts([newAlert, ...alerts]);
        setTotal(total + 1);
      }

      setShowForm(false);
      setEditingAlert(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save alert");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) return;

    try {
      if (!token) throw new Error("Not authenticated");
      await deleteJobAlert(id, token);
      setAlerts(alerts.filter((a) => a.id !== id));
      setTotal(total - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete alert");
    }
  };

  const handlePause = async (id: string) => {
    try {
      if (!token) throw new Error("Not authenticated");
      const updated = await pauseJobAlert(id, token);
      setAlerts(alerts.map((a) => (a.id === updated.id ? updated : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to pause alert");
    }
  };

  const handleResume = async (id: string) => {
    try {
      if (!token) throw new Error("Not authenticated");
      const updated = await resumeJobAlert(id, token);
      setAlerts(alerts.map((a) => (a.id === updated.id ? updated : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resume alert");
    }
  };

  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAlert(null);
  };

  if (!user || !token) {
    return (
      <main className={styles.container}>
        <div className={styles.authRequired}>
          <h1>Job Alerts</h1>
          <p>Please log in to manage your job alerts.</p>
        </div>
      </main>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Job Alerts</h1>
          <p>Automatically get notified about new job opportunities</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={styles.createButton}
          >
            + Create Alert
          </button>
        )}
      </div>

      {error && (
        <div className={styles.errorAlert}>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>
      )}

      {showForm && (
        <div className={styles.formSection}>
          <h2>{editingAlert ? "Edit Alert" : "Create New Alert"}</h2>
          <AlertForm
            onSubmit={handleCreateAlert}
            onCancel={handleCancel}
            loading={formLoading}
            initialData={editingAlert}
            isEditing={!!editingAlert}
          />
        </div>
      )}

      <AlertList
        alerts={alerts}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPause={handlePause}
        onResume={handleResume}
      />

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={styles.pageButton}
          >
            ← Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={styles.pageButton}
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}
