"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobsApi, Job, JobListParams } from "@/lib/api/jobs";
import { JobCard } from "./components/job-card";
import { JobFilters } from "./components/job-filters";
import { Pagination } from "./components/pagination";
import styles from "./page.module.css";

interface PageState {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<PageState>({
    jobs: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: JobListParams = {
          page: parseInt(searchParams.get("page") || "1"),
          limit: parseInt(searchParams.get("limit") || "20"),
          search: searchParams.get("search") || undefined,
          remoteType: searchParams.get("remoteType") || undefined,
          employmentType: searchParams.get("employmentType") || undefined,
          experienceLevel: searchParams.get("experienceLevel") || undefined,
          sort: (searchParams.get("sort") as "latest" | "oldest") || "latest",
        };

        const response = await jobsApi.listJobs(params);

        if (response.success && response.data) {
          setState({
            jobs: response.data.jobs,
            total: response.data.total,
            page: response.data.page,
            limit: response.data.limit,
            totalPages: response.data.totalPages,
          });
        } else {
          setError("Failed to fetch jobs");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchParams]);

  const handleSaveJob = (job: Job) => {
    console.log("Saved job:", job);
    // TODO: Implement save job functionality
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>Remote Jobs</h1>
        <p>Find your next remote job opportunity</p>
      </div>

      <JobFilters />

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading jobs...</p>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      ) : state.jobs.length === 0 ? (
        <div className={styles.empty}>
          <h2>No jobs found</h2>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className={styles.jobsGrid}>
            {state.jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={handleSaveJob}
              />
            ))}
          </div>

          <Pagination
            currentPage={state.page}
            totalPages={state.totalPages}
            total={state.total}
            limit={state.limit}
          />
        </>
      )}
    </main>
  );
}
