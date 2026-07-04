import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().min(2),

  website: z.string().optional(),

  careersUrl: z.string().optional(),

  logo: z.string().optional(),

  description: z.string().optional(),

  industry: z.string().optional(),

  size: z.string().optional(),

  headquarters: z.string().optional(),

  foundedYear: z.number().optional(),

  linkedinUrl: z.string().optional(),

  twitterUrl: z.string().optional(),
});

export type CreateCompanyDto = z.infer<
  typeof CreateCompanySchema
>;