import { JobAlert } from "@/lib/api/job-alerts";
import styles from "./alert-list.module.css";

interface AlertListProps {
  alerts: JobAlert[];
  loading?: boolean;
  onEdit: (alert: JobAlert) => void;
  onDelete: (id: string) => Promise<void>;
  onPause: (id: string) => Promise<void>;
  onResume: (id: string) => Promise<void>;
}

export default function AlertList({
  alerts,
  loading = false,
  onEdit,
  onDelete,
  onPause,
  onResume,
}: AlertListProps) {
  if (loading) {
    return <div className={styles.loading}>Loading alerts...</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No job alerts created yet.</p>
        <p>Create your first alert to get started!</p>
      </div>
    );
  }

  const getFrequencyLabel = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return styles.badgeActive;
      case "paused":
        return styles.badgePaused;
      case "disabled":
        return styles.badgeDisabled;
      default:
        return styles.badgeActive;
    }
  };

  return (
    <div className={styles.alertList}>
      {alerts.map((alert) => (
        <div key={alert.id} className={styles.alertCard}>
          <div className={styles.header}>
            <div className={styles.titleSection}>
              <h3 className={styles.title}>{alert.name}</h3>
              <span className={`${styles.badge} ${getStatusBadgeClass(alert.status)}`}>
                {alert.status}
              </span>
            </div>
            <div className={styles.frequency}>
              {getFrequencyLabel(alert.frequency)}
            </div>
          </div>

          <div className={styles.criteria}>
            {alert.search && (
              <span className={styles.criteriaTag}>
                <strong>Search:</strong> {alert.search}
              </span>
            )}
            {alert.skills.length > 0 && (
              <span className={styles.criteriaTag}>
                <strong>Skills:</strong> {alert.skills.join(", ")}
              </span>
            )}
            {alert.remoteType.length > 0 && (
              <span className={styles.criteriaTag}>
                <strong>Remote:</strong> {alert.remoteType.join(", ")}
              </span>
            )}
            {alert.employmentType.length > 0 && (
              <span className={styles.criteriaTag}>
                <strong>Type:</strong> {alert.employmentType.join(", ")}
              </span>
            )}
            {alert.experienceLevel.length > 0 && (
              <span className={styles.criteriaTag}>
                <strong>Level:</strong> {alert.experienceLevel.join(", ")}
              </span>
            )}
            {(alert.salaryMin || alert.salaryMax) && (
              <span className={styles.criteriaTag}>
                <strong>Salary:</strong> ${alert.salaryMin || 0} - $
                {alert.salaryMax || "∞"}
              </span>
            )}
            {alert.locations.length > 0 && (
              <span className={styles.criteriaTag}>
                <strong>Locations:</strong> {alert.locations.join(", ")}
              </span>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.info}>
              {alert.lastSentAt && (
                <span className={styles.lastSent}>
                  Last sent: {new Date(alert.lastSentAt).toLocaleDateString()}
                </span>
              )}
              {!alert.emailNotifications && (
                <span className={styles.noEmail}>Email disabled</span>
              )}
            </div>

            <div className={styles.actions}>
              {alert.status === "active" ? (
                <button
                  onClick={() => onPause(alert.id)}
                  className={styles.buttonPause}
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => onResume(alert.id)}
                  className={styles.buttonResume}
                >
                  Resume
                </button>
              )}
              <button
                onClick={() => onEdit(alert)}
                className={styles.buttonEdit}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(alert.id)}
                className={styles.buttonDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
