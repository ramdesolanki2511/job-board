import mongoose, { InferSchemaType, Schema } from "mongoose";

const JobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    shortDescription: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "Worldwide",
    },

    remoteType: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      default: "Remote",
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Contract",
        "Internship",
        "Freelance",
      ],
      default: "Full Time",
    },

    experienceLevel: {
      type: String,
      enum: [
        "Fresher",
        "Junior",
        "Mid",
        "Senior",
        "Lead",
      ],
      default: "Mid",
    },

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

    skills: [
      {
        type: String,
      },
    ],

    applyUrl: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      default: "Manual",
    },

    sourceJobId: {
      type: String,
      default: "",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    publishedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

JobSchema.index({
  slug: 1,
});

JobSchema.index({
  company: 1,
});

JobSchema.index({
  isActive: 1,
});

JobSchema.index({
  publishedAt: -1,
});

export type Job = InferSchemaType<typeof JobSchema>;

export default mongoose.model("Job", JobSchema);