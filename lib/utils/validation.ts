/**
 * Validation Utilities
 * 
 * Purpose: Zod schemas for form validation
 * Placeholder - will be populated as forms are built
 */

import { z } from 'zod';

/**
 * Quick risk assessment form schema
 * 
 * TODO: Expand with actual validation rules
 */
export const quickRiskSchema = z.object({
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters'),
  yearsExperience: z.number().min(0).max(50),
  industry: z.string().min(2, 'Please select an industry'),
});

export type QuickRiskInput = z.infer<typeof quickRiskSchema>;

// TODO: Add deeper assessment schema
// TODO: Add user profile schema
// TODO: Add payment intent schema
