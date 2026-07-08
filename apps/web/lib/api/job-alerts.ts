import { API_URL } from "@/lib/api/config";

export interface JobAlertCriteria {
  search?: string;
  skills?: string[];
  remoteType?: string[];
  employmentType?: string[];
  experienceLevel?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  locations?: string[];
}

export interface CreateJobAlertPayload {
  name: string;
  frequency: "immediate" | "daily" | "weekly";
  emailNotifications: boolean;
  criteria: JobAlertCriteria;
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  search: string;
  skills: string[];
  remoteType: string[];
  employmentType: string[];
  experienceLevel: string[];
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  locations: string[];
  frequency: "immediate" | "daily" | "weekly";
  status: "active" | "paused" | "disabled";
  emailNotifications: boolean;
  lastSentAt?: string;
  lastSentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobAlertListResponse {
  alerts: JobAlert[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Create a new job alert
export async function createJobAlert(
  payload: CreateJobAlertPayload,
  token: string
): Promise<JobAlert> {
  const response = await fetch(`${API_URL}/job-alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: payload.name,
      frequency: payload.frequency,
      emailNotifications: payload.emailNotifications,
      ...payload.criteria,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create job alert: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Get all user's job alerts
export async function getUserJobAlerts(
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<JobAlertListResponse> {
  const response = await fetch(
    `${API_URL}/job-alerts?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch job alerts: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    alerts: data.data,
    total: data.total,
    page: data.page,
    limit: data.limit,
    totalPages: data.totalPages,
  };
}

// Get a single job alert
export async function getJobAlert(id: string, token: string): Promise<JobAlert> {
  const response = await fetch(`${API_URL}/job-alerts/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch job alert: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Update a job alert
export async function updateJobAlert(
  id: string,
  payload: Partial<CreateJobAlertPayload>,
  token: string
): Promise<JobAlert> {
  const updatePayload: any = {};

  if (payload.name) updatePayload.name = payload.name;
  if (payload.frequency) updatePayload.frequency = payload.frequency;
  if (payload.emailNotifications !== undefined)
    updatePayload.emailNotifications = payload.emailNotifications;

  if (payload.criteria) {
    Object.assign(updatePayload, payload.criteria);
  }

  const response = await fetch(`${API_URL}/job-alerts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatePayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to update job alert: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Delete a job alert
export async function deleteJobAlert(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/job-alerts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete job alert: ${response.statusText}`);
  }
}

// Pause a job alert
export async function pauseJobAlert(id: string, token: string): Promise<JobAlert> {
  const response = await fetch(`${API_URL}/job-alerts/${id}/pause`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to pause job alert: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Resume a job alert
export async function resumeJobAlert(
  id: string,
  token: string
): Promise<JobAlert> {
  const response = await fetch(`${API_URL}/job-alerts/${id}/resume`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to resume job alert: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Send test email for an alert
export async function testJobAlert(id: string, token: string): Promise<JobAlert> {
  const response = await fetch(`${API_URL}/job-alerts/${id}/test`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to send test email: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}
