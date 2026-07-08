"use client";

import { useState, useEffect } from "react";
import {
  CreateJobAlertPayload,
  JobAlertCriteria,
} from "@/lib/api/job-alerts";
import styles from "./alert-form.module.css";

interface AlertFormProps {
  onSubmit: (payload: CreateJobAlertPayload) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  initialData?: any;
  isEditing?: boolean;
}

const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Freelance",
];
const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Mid", "Senior", "Lead"];
const REMOTE_TYPES = ["Remote", "Hybrid", "Onsite"];
const FREQUENCIES = [
  { value: "immediate", label: "Immediately" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

export default function AlertForm({
  onSubmit,
  onCancel,
  loading = false,
  initialData,
  isEditing = false,
}: AlertFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [search, setSearch] = useState(initialData?.search || "");
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [remoteType, setRemoteType] = useState<string[]>(
    initialData?.remoteType || []
  );
  const [employmentType, setEmploymentType] = useState<string[]>(
    initialData?.employmentType || []
  );
  const [experienceLevel, setExperienceLevel] = useState<string[]>(
    initialData?.experienceLevel || []
  );
  const [salaryMin, setSalaryMin] = useState(initialData?.salaryMin || "");
  const [salaryMax, setSalaryMax] = useState(initialData?.salaryMax || "");
  const [locations, setLocations] = useState<string[]>(
    initialData?.locations || []
  );
  const [locationInput, setLocationInput] = useState("");
  const [frequency, setFrequency] = useState(
    initialData?.frequency || "daily"
  );
  const [emailNotifications, setEmailNotifications] = useState(
    initialData?.emailNotifications !== false
  );
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleAddLocation = () => {
    if (locationInput.trim() && !locations.includes(locationInput.trim())) {
      setLocations([...locations, locationInput.trim()]);
      setLocationInput("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setLocations(locations.filter((l) => l !== location));
  };

  const toggleRemoteType = (type: string) => {
    setRemoteType(
      remoteType.includes(type)
        ? remoteType.filter((t) => t !== type)
        : [...remoteType, type]
    );
  };

  const toggleEmploymentType = (type: string) => {
    setEmploymentType(
      employmentType.includes(type)
        ? employmentType.filter((t) => t !== type)
        : [...employmentType, type]
    );
  };

  const toggleExperienceLevel = (level: string) => {
    setExperienceLevel(
      experienceLevel.includes(level)
        ? experienceLevel.filter((l) => l !== level)
        : [...experienceLevel, level]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Alert name is required");
      return;
    }

    if (salaryMin && salaryMax && parseInt(salaryMin) > parseInt(salaryMax)) {
      setError("Minimum salary cannot be greater than maximum salary");
      return;
    }

    const payload: CreateJobAlertPayload = {
      name: name.trim(),
      frequency: frequency as any,
      emailNotifications,
      criteria: {
        search: search.trim(),
        skills: skills.length > 0 ? skills : undefined,
        remoteType: remoteType.length > 0 ? remoteType : undefined,
        employmentType:
          employmentType.length > 0 ? employmentType : undefined,
        experienceLevel:
          experienceLevel.length > 0 ? experienceLevel : undefined,
        salaryMin: salaryMin ? parseInt(salaryMin) : undefined,
        salaryMax: salaryMax ? parseInt(salaryMax) : undefined,
        locations: locations.length > 0 ? locations : undefined,
      },
    };

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save alert");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}

      {/* Basic Info */}
      <div className={styles.section}>
        <h3>Alert Name & Search</h3>

        <div className={styles.formGroup}>
          <label htmlFor="name">Alert Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Senior React Developer Remote"
            disabled={loading}
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="search">Job Title / Keywords</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g., React, Frontend, JavaScript"
            disabled={loading}
            className={styles.input}
          />
        </div>
      </div>

      {/* Skills */}
      <div className={styles.section}>
        <h3>Skills</h3>
        <div className={styles.tagInput}>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Add a skill and press Enter"
            disabled={loading}
            className={styles.input}
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={loading || !skillInput.trim()}
            className={styles.addButton}
          >
            Add
          </button>
        </div>
        <div className={styles.tags}>
          {skills.map((skill) => (
            <div key={skill} className={styles.tag}>
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                disabled={loading}
                className={styles.removeTag}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Work Type */}
      <div className={styles.section}>
        <h3>Work Type</h3>

        <div className={styles.filterGroup}>
          <label>Remote Type</label>
          <div className={styles.checkboxGroup}>
            {REMOTE_TYPES.map((type) => (
              <label key={type} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={remoteType.includes(type)}
                  onChange={() => toggleRemoteType(type)}
                  disabled={loading}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>Employment Type</label>
          <div className={styles.checkboxGroup}>
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={employmentType.includes(type)}
                  onChange={() => toggleEmploymentType(type)}
                  disabled={loading}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label>Experience Level</label>
          <div className={styles.checkboxGroup}>
            {EXPERIENCE_LEVELS.map((level) => (
              <label key={level} className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={experienceLevel.includes(level)}
                  onChange={() => toggleExperienceLevel(level)}
                  disabled={loading}
                />
                <span>{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Range */}
      <div className={styles.section}>
        <h3>Salary Range</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="salaryMin">Minimum (USD)</label>
            <input
              id="salaryMin"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g., 60000"
              disabled={loading}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="salaryMax">Maximum (USD)</label>
            <input
              id="salaryMax"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g., 150000"
              disabled={loading}
              className={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className={styles.section}>
        <h3>Preferred Locations</h3>
        <div className={styles.tagInput}>
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddLocation();
              }
            }}
            placeholder="e.g., New York, San Francisco"
            disabled={loading}
            className={styles.input}
          />
          <button
            type="button"
            onClick={handleAddLocation}
            disabled={loading || !locationInput.trim()}
            className={styles.addButton}
          >
            Add
          </button>
        </div>
        <div className={styles.tags}>
          {locations.map((location) => (
            <div key={location} className={styles.tag}>
              {location}
              <button
                type="button"
                onClick={() => handleRemoveLocation(location)}
                disabled={loading}
                className={styles.removeTag}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className={styles.section}>
        <h3>Notification Settings</h3>

        <div className={styles.formGroup}>
          <label htmlFor="frequency">Frequency</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            disabled={loading}
            className={styles.input}
          >
            {FREQUENCIES.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            disabled={loading}
          />
          <span>Send me email notifications</span>
        </label>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={styles.cancelButton}
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Alert"
              : "Create Alert"}
        </button>
      </div>
    </form>
  );
}
