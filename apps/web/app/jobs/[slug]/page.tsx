"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jobsApi, Job } from "@/lib/api/jobs";
import styles from "./page.module.css";

interface JobDetailPageProps {
  params: {
    slug: string;
  };
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await jobsApi.getJobBySlug(params.slug);

        if (response.success && response.data) {
          setJob(response.data);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [params.slug]);

  const handleSaveJob = () => {
    setSaved(!saved);
    // TODO: Implement actual save functionality
    console.log(saved ? "Unsaved job" : "Saved job", job?.id);
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className={styles.container}>
        <div className={styles.errorContainer}>
          <h1>Job Not Found</h1>
          <p>{error || "This job is no longer available."}</p>
          <Link href="/jobs" className={styles.backLink}>
            ← Back to Job Listings
          </Link>
        </div>
      </main>
    );
  }

  const formattedSalary = job.salaryMin && job.salaryMax
    ? `${job.salaryCurrency} ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k`
    : job.salaryMin > 0
    ? `${job.salaryCurrency} ${(job.salaryMin / 1000).toFixed(0)}k+`
    : "Not specified";

  const publishedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className={styles.container}>
      <Link href="/jobs" className={styles.backLink}>
        ← Back to Job Listings
      </Link>

      <article className={styles.jobDetail}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{job.title}</h1>
            <div className={styles.companyInfo}>
              <span className={styles.company}>{job.companyName || "Company"}</span>
              <span className={styles.location}>{job.location}</span>
            </div>
            <div className={styles.metaInfo}>
              <span className={styles.metaItem}>{job.employmentType}</span>
              <span className={styles.metaItem}>{formattedSalary}</span>
              <span className={styles.metaItem}>Posted {publishedDate}</span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={handleSaveJob}
              className={`${styles.saveButton} ${saved ? styles.saved : ""}`}
              title={saved ? "Unsave job" : "Save job"}
            >
              {saved ? "♡ Saved" : "♡ Save"}
            </button>
          </div>
        </header>

        <section className={styles.content}>
          <div className={styles.mainContent}>
            {/* Quick Info */}
            <div className={styles.quickInfo}>
              <div className={styles.infoCard}>
                <h3>Remote Type</h3>
                <p className={styles.badge}>{job.remoteType}</p>
              </div>
              <div className={styles.infoCard}>
                <h3>Experience Level</h3>
                <p className={styles.badge}>{job.experienceLevel}</p>
              </div>
              <div className={styles.infoCard}>
                <h3>Salary</h3>
                <p className={styles.badge}>{formattedSalary}</p>
              </div>
            </div>

            {/* Description */}
            <section className={styles.section}>
              <h2>About the Role</h2>
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{
                  __html: job.description || job.shortDescription,
                }}
              />
            </section>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <section className={styles.section}>
                <h2>Required Skills</h2>
                <div className={styles.skillsList}>
                  {job.skills.map((skill, index) => (
                    <span key={index} className={styles.skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Application CTA */}
            <section className={styles.applicationCTA}>
              <div className={styles.ctaContent}>
                <h3>Ready to Apply?</h3>
                <p>Take the next step in your career journey</p>
              </div>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.applyButton}
              >
                Apply Now →
              </a>
            </section>
          </div>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* About Company */}
            <div className={styles.sidebarCard}>
              <h3>About the Company</h3>
              <p>
                {job.companyName || "Company"} is a growing organization
                looking for talented individuals like you.
              </p>
              <Link href={`/companies/${job.companySlug}`} className={styles.companyLink}>
                View Company Profile →
              </Link>
            </div>

            {/* Share */}
            <div className={styles.sidebarCard}>
              <h3>Share This Job</h3>
              <div className={styles.shareButtons}>
                <button
                  className={styles.shareButton}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Job link copied to clipboard!");
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Job Info */}
            <div className={styles.sidebarCard}>
              <h3>Job Information</h3>
              <dl className={styles.jobInfoList}>
                <dt>Job ID</dt>
                <dd>{job.id?.substring(0, 8)}...</dd>
                <dt>Posted</dt>
                <dd>{publishedDate}</dd>
                <dt>Employment Type</dt>
                <dd>{job.employmentType}</dd>
                <dt>Experience Level</dt>
                <dd>{job.experienceLevel}</dd>
              </dl>
            </div>
          </aside>
        </section>
      </article>
    </main>
  );
}
