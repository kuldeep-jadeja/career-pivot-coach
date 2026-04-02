import { z } from "zod";

export const assessmentSchema = z.object({
  jobTitle: z
    .object({
      code: z.string().min(1, "Please select a job title"),
      title: z.string().min(1),
    })
    .nullable(),
  industry: z.string().nullable(),
  yearsExperience: z.number().min(0).max(50).nullable(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;
