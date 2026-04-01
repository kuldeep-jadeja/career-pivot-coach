/**
 * Layer 4: Experience Level Modifier
 * 
 * Adjusts risk score based on years of experience.
 * 
 * Counterintuitively:
 * - Entry level (0-2 years) is LESS at risk: More adaptable, fewer routine specializations
 * - Senior level (8-15 years) is MORE at risk: Deeper specialization in potentially automatable tasks
 * - Executive level (15+ years) is less at risk: Strategic, relationship-focused work
 */

import { EXPERIENCE_MULTIPLIERS } from '../config';

/**
 * Calculate experience level modifier
 * 
 * @param yearsExperience - Years of work experience (optional)
 * @returns Multiplier value (0.85 - 1.05)
 */
export function calculateExperienceModifier(yearsExperience?: number): number {
  if (yearsExperience === undefined || yearsExperience === null) {
    return 1.0; // Neutral default if experience unknown
  }
  
  if (yearsExperience <= 2) {
    return EXPERIENCE_MULTIPLIERS['entry'];
  } else if (yearsExperience <= 7) {
    return EXPERIENCE_MULTIPLIERS['mid'];
  } else if (yearsExperience <= 15) {
    return EXPERIENCE_MULTIPLIERS['senior'];
  } else {
    return EXPERIENCE_MULTIPLIERS['executive'];
  }
}

/**
 * Get human-readable label for experience level
 * 
 * @param yearsExperience - Years of work experience
 * @returns Descriptive label
 */
export function getExperienceLevel(yearsExperience?: number): string {
  if (yearsExperience === undefined || yearsExperience === null) {
    return 'Unknown Experience Level';
  }
  
  if (yearsExperience <= 2) {
    return 'Entry Level (0-2 years)';
  } else if (yearsExperience <= 7) {
    return 'Mid Level (3-7 years)';
  } else if (yearsExperience <= 15) {
    return 'Senior Level (8-15 years)';
  } else {
    return 'Executive Level (15+ years)';
  }
}

/**
 * Get detailed explanation of experience modifier
 * 
 * @param yearsExperience - Years of work experience
 * @returns Object with multiplier and reasoning
 */
export function explainExperienceModifier(yearsExperience?: number): {
  multiplier: number;
  level: string;
  reasoning: string;
} {
  const multiplier = calculateExperienceModifier(yearsExperience);
  const level = getExperienceLevel(yearsExperience);
  
  let reasoning = '';
  
  if (yearsExperience === undefined || yearsExperience === null) {
    reasoning = 'Experience level unknown - using neutral baseline.';
  } else if (yearsExperience <= 2) {
    reasoning = 'Entry-level professionals are generally more adaptable and have broader skill sets, making them slightly less vulnerable to automation in specific task areas.';
  } else if (yearsExperience <= 7) {
    reasoning = 'Mid-career professionals are at the baseline risk level - established in their roles but still adaptable.';
  } else if (yearsExperience <= 15) {
    reasoning = 'Senior professionals often have deep specialization in specific tasks. If those tasks are routine, automation risk is slightly elevated.';
  } else {
    reasoning = 'Executive-level professionals typically focus on strategic decision-making and stakeholder relationships, which are harder to automate.';
  }
  
  return { multiplier, level, reasoning };
}
