import { z } from "zod";

export const CreateJobSchema = z.object({
  title: z.string().min(3),

  company: z.string(),

  applyUrl: z.string().url(),

  description: z.string().optional(),

  shortDescription: z.string().optional(),

  location: z.string().optional(),

  remoteType: z
    .enum(["Remote", "Hybrid", "Onsite"])
    .optional(),

  employmentType: z
    .enum([
      "Full Time",
      "Part Time",
      "Contract",
      "Internship",
      "Freelance",
    ])
    .optional(),

  experienceLevel: z
    .enum([
      "Fresher",
      "Junior",
      "Mid",
      "Senior",
      "Lead",
    ])
    .optional(),

  salaryMin: z.number().optional(),

  salaryMax: z.number().optional(),

  salaryCurrency: z.string().optional(),

  skills: z.array(z.string()).optional(),

  source: z.string().optional(),

  sourceJobId: z.string().optional(),

  isFeatured: z.boolean().optional(),

  expiresAt: z.coerce.date().optional(),
});

export type CreateJobDto = z.infer<typeof CreateJobSchema>;