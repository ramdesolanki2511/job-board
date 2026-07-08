import { API_URL } from "@/lib/api/config";

export interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    banned: number;
  };
  companies: {
    total: number;
    verified: number;
    suspended: number;
    thisMonth: number;
  };
  jobs: {
    total: number;
    active: number;
    pendingApproval: number;
    rejected: number;
  };
  subscriptions: {
    total: number;
    monthly: number;
    annual: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "banned" | "pending";
  createdAt: string;
  subscriptionPlan: string;
  lastLogin: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  status: "verified" | "pending" | "suspended";
  verificationDate: string;
  totalJobsPosted: number;
  activeJobs: number;
  createdAt: string;
  plan: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  content: string;
}

export interface SystemHealth {
  uptime: number;
  responseTime: number;
  errorRate: number;
  databaseConnected: boolean;
}

export async function getAdminStats(token: string): Promise<AdminStats> {
  const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch admin stats");
  const data = await response.json();
  return data.data;
}

export async function getUsers(
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<{ users: User[]; total: number; totalPages: number }> {
  const response = await fetch(
    `${API_URL}/admin/users?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch users");
  const data = await response.json();
  return {
    users: data.data,
    total: data.total,
    totalPages: data.totalPages,
  };
}

export async function getUserDetails(
  token: string,
  userId: string
): Promise<any> {
  const response = await fetch(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch user details");
  const data = await response.json();
  return data.data;
}

export async function banUser(
  token: string,
  userId: string,
  reason: string
): Promise<any> {
  const response = await fetch(`${API_URL}/admin/users/${userId}/ban`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) throw new Error("Failed to ban user");
  const data = await response.json();
  return data.data;
}

export async function unbanUser(token: string, userId: string): Promise<any> {
  const response = await fetch(`${API_URL}/admin/users/${userId}/unban`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to unban user");
  const data = await response.json();
  return data.data;
}

export async function getCompanies(
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<{ companies: Company[]; total: number; totalPages: number }> {
  const response = await fetch(
    `${API_URL}/admin/companies?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch companies");
  const data = await response.json();
  return {
    companies: data.data,
    total: data.total,
    totalPages: data.totalPages,
  };
}

export async function verifyCompany(
  token: string,
  companyId: string
): Promise<any> {
  const response = await fetch(`${API_URL}/admin/companies/${companyId}/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to verify company");
  const data = await response.json();
  return data.data;
}

export async function suspendCompany(
  token: string,
  companyId: string,
  reason: string
): Promise<any> {
  const response = await fetch(
    `${API_URL}/admin/companies/${companyId}/suspend`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  if (!response.ok) throw new Error("Failed to suspend company");
  const data = await response.json();
  return data.data;
}

export async function getPendingJobs(
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<{ jobs: Job[]; total: number; totalPages: number }> {
  const response = await fetch(
    `${API_URL}/admin/jobs/pending?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch pending jobs");
  const data = await response.json();
  return {
    jobs: data.data,
    total: data.total,
    totalPages: data.totalPages,
  };
}

export async function approveJob(token: string, jobId: string): Promise<any> {
  const response = await fetch(`${API_URL}/admin/jobs/${jobId}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to approve job");
  const data = await response.json();
  return data.data;
}

export async function rejectJob(
  token: string,
  jobId: string,
  reason: string
): Promise<any> {
  const response = await fetch(`${API_URL}/admin/jobs/${jobId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) throw new Error("Failed to reject job");
  const data = await response.json();
  return data.data;
}

export async function getRevenueAnalytics(
  token: string,
  period: "month" | "quarter" | "year" = "month"
): Promise<any> {
  const response = await fetch(
    `${API_URL}/admin/analytics/revenue?period=${period}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch revenue analytics");
  const data = await response.json();
  return data.data;
}

export async function getSystemHealth(token: string): Promise<SystemHealth> {
  const response = await fetch(`${API_URL}/admin/health`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch system health");
  const data = await response.json();
  return data.data;
}

export async function getAuditLogs(
  token: string,
  page: number = 1,
  limit: number = 50
): Promise<any> {
  const response = await fetch(
    `${API_URL}/admin/audit-logs?page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch audit logs");
  const data = await response.json();
  return data.data;
}

export async function sendSystemNotification(
  token: string,
  title: string,
  message: string
): Promise<any> {
  const response = await fetch(`${API_URL}/admin/notifications/system`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, message }),
  });

  if (!response.ok) throw new Error("Failed to send notification");
  const data = await response.json();
  return data.data;
}
