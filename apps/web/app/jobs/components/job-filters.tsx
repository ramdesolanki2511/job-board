"use client";

import { useSearchParams, useRouter } from "next/navigation";
import styles from "./job-filters.module.css";

export interface FilterValues {
  search?: string;
  remoteType?: string;
  employmentType?: string;
  experienceLevel?: string;
  sort?: "latest" | "oldest";
}

interface JobFiltersProps {
  onFilterChange?: (filters: FilterValues) => void;
}

export const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentRemoteType = searchParams.get("remoteType") || "";
  const currentEmploymentType = searchParams.get("employmentType") || "";
  const currentExperienceLevel = searchParams.get("experienceLevel") || "";
  const currentSort = (searchParams.get("sort") as "latest" | "oldest") || "latest";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    onFilterChange?.({ search: value });
  };

  const handleRemoteTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("remoteType", value);
    } else {
      params.delete("remoteType");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleEmploymentTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("employmentType", value);
    } else {
      params.delete("employmentType");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleExperienceLevelChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("experienceLevel", value);
    } else {
      params.delete("experienceLevel");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: "latest" | "oldest") => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push("/jobs");
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search jobs by title, skills..."
          value={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.filterGrid}>
        <div className={styles.filterGroup}>
          <label htmlFor="remote-type">Remote Type</label>
          <select
            id="remote-type"
            value={currentRemoteType}
            onChange={(e) => handleRemoteTypeChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="employment-type">Employment Type</label>
          <select
            id="employment-type"
            value={currentEmploymentType}
            onChange={(e) => handleEmploymentTypeChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="experience-level">Experience Level</label>
          <select
            id="experience-level"
            value={currentExperienceLevel}
            onChange={(e) => handleExperienceLevelChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Levels</option>
            <option value="Fresher">Fresher</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value as "latest" | "oldest")}
            className={styles.select}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {(currentSearch || currentRemoteType || currentEmploymentType || currentExperienceLevel) && (
        <button onClick={handleReset} className={styles.resetButton}>
          Clear Filters
        </button>
      )}
    </div>
  );
};
