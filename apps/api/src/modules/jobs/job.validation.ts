import { z } from "zod";

export const CreateJobSchema = z.object({
  title: z.string().min(3),

  company: z.string(),

  applyUrl: z.string().url(),

  description: z.string().optional(),

  shortDescription: z.string().optional(),

  location: z.string().optional(),

  remoteType: z.enum(["Remote", "Hybrid", "Onsite"]).optional(),

  employmentType: z
    .enum(["Full Time", "Part Time", "Contract", "Internship", "Freelance"])
    .optional(),

  experienceLevel: z
    .enum(["Fresher", "Junior", "Mid", "Senior", "Lead"])
    .optional(),

  salaryMin: z.number().optional(),

  salaryMax: z.number().optional(),

  salaryCurrency: z.string().optional(),

  skills: z.array(z.string()).optional(),

  source: z.string().optional(),

  sourceJobId: z.string().optional(),

  isFeatured: z.boolean().optional(),

  expiresAt: z.coerce.date().optional(),

  sourcePlatform: z.string().optional(),

  sourceUrl: z.string().url().optional(),
});

export const SearchJobSchema = z.object({
  search: z.string().optional(),

  location: z.string().optional(),

  remoteType: z.string().optional(),

  employmentType: z.string().optional(),

  experienceLevel: z.string().optional(),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(10),
});

export const ImportJobSchema = z.object({
  jobs: z.array(CreateJobSchema),
});

export type CreateJobDto = z.infer<typeof CreateJobSchema>;
export type SearchJobDto = z.infer<typeof SearchJobSchema>;
export type ImportJobDto = z.infer<typeof ImportJobSchema>;
