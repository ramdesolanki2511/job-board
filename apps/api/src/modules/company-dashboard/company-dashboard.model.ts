import { Schema, model } from "mongoose";

export interface ICompanyDashboard extends Document {
  companyId: string;
  userId: string;
  totalJobsPosted: number;
  totalApplications: number;
  totalSavedApplications: number;
  totalRejectedApplications: number;
  viewsLastMonth: number;
  applicationsLastMonth: number;
  totalActiveJobs: number;
  totalClosedJobs: number;
  averageTimeToHire?: number;
  mostPopularJob?: string;
  topCandidates: string[];
  recentActivities: {
    type: string;
    description: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const companyDashboardSchema = new Schema<ICompanyDashboard>(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    totalJobsPosted: {
      type: Number,
      default: 0,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
    totalSavedApplications: {
      type: Number,
      default: 0,
    },
    totalRejectedApplications: {
      type: Number,
      default: 0,
    },
    viewsLastMonth: {
      type: Number,
      default: 0,
    },
    applicationsLastMonth: {
      type: Number,
      default: 0,
    },
    totalActiveJobs: {
      type: Number,
      default: 0,
    },
    totalClosedJobs: {
      type: Number,
      default: 0,
    },
    averageTimeToHire: {
      type: Number,
      optional: true,
    },
    mostPopularJob: {
      type: String,
      optional: true,
    },
    topCandidates: {
      type: [String],
      default: [],
    },
    recentActivities: [
      {
        type: {
          type: String,
          enum: [
            "job_posted",
            "application_received",
            "candidate_saved",
            "job_closed",
            "subscription_upgraded",
          ],
        },
        description: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CompanyDashboard = model<ICompanyDashboard>(
  "CompanyDashboard",
  companyDashboardSchema
);
