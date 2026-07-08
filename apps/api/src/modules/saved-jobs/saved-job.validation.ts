import { z } from "zod";

export const SaveJobSchema = z.object({
  notes: z.string().optional(),
});

export type SaveJobDto = z.infer<typeof SaveJobSchema>;
