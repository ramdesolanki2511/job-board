import { Job } from "@/lib/api/jobs";
import styles from "./job-card.module.css";

interface JobCardProps {
  job: Job;
  onSave?: (job: Job) => void;
}

export const JobCard = ({ job, onSave }: JobCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{job.title}</h3>
          <p className={styles.company}>{job.company}</p>
        </div>
        {onSave && (
          <button
            className={styles.saveButton}
            onClick={() => onSave(job)}
            title="Save job"
          >
            ♡
          </button>
        )}
      </div>

      <p className={styles.description}>{job.shortDescription || job.description}</p>

      <div className={styles.tags}>
        {job.remoteType && (
          <span className={`${styles.tag} ${styles[job.remoteType.toLowerCase()]}`}>
            {job.remoteType}
          </span>
        )}
        {job.employmentType && (
          <span className={styles.tag}>{job.employmentType}</span>
        )}
        {job.experienceLevel && (
          <span className={styles.tag}>{job.experienceLevel}</span>
        )}
      </div>

      <div className={styles.meta}>
        <span>{job.location}</span>
        {job.salaryMin > 0 && job.salaryMax > 0 && (
          <span>
            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} {job.salaryCurrency}
          </span>
        )}
        <span className={styles.date}>
          {new Date(job.publishedAt).toLocaleDateString()}
        </span>
      </div>

      <a href={`/jobs/${job.slug}`} className={styles.link}>
        View Job →
      </a>
    </div>
  );
};
