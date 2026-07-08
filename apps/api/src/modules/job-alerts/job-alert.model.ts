import mongoose, { Schema, InferSchemaType } from "mongoose";
import { AlertFrequency, AlertStatus } from "../../shared/constants/job-alert.constants";

const JobAlertSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Alert Criteria
    search: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    remoteType: [
      {
        type: String,
        enum: ["Remote", "Hybrid", "Onsite"],
      },
    ],

    employmentType: [
      {
        type: String,
        enum: ["Full Time", "Part Time", "Contract", "Internship", "Freelance"],
      },
    ],

    experienceLevel: [
      {
        type: String,
        enum: ["Fresher", "Junior", "Mid", "Senior", "Lead"],
      },
    ],

    salaryMin: {
      type: Number,
      default: 0,
    },

    salaryMax: {
      type: Number,
      default: 0,
    },

    salaryCurrency: {
      type: String,
      default: "USD",
    },

    // Locations (array for multiple locations)
    locations: [
      {
        type: String,
      },
    ],

    // Notification Settings
    frequency: {
      type: String,
      enum: Object.values(AlertFrequency),
      default: AlertFrequency.DAILY,
    },

    status: {
      type: String,
      enum: Object.values(AlertStatus),
      default: AlertStatus.ACTIVE,
    },

    // Email notification toggle
    emailNotifications: {
      type: Boolean,
      default: true,
    },

    // Last sent information
    lastSentAt: {
      type: Date,
      default: null,
    },

    lastSentCount: {
      type: Number,
      default: 0,
    },

    // Job IDs already notified about (to avoid duplicates)
    notifiedJobIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    // Metadata
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export type JobAlert = InferSchemaType<typeof JobAlertSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const JobAlertModel = mongoose.model<JobAlert>(
  "JobAlert",
  JobAlertSchema
);
