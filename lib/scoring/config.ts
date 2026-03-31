/**
 * Scoring Engine Configuration
 * 
 * Purpose: Weight configuration for the 4-layer risk scoring algorithm
 * - AI exposure layer (from O*NET + research)
 * - Task automation layer (routine vs. creative tasks)
 * - Industry modifier (sector-specific trends)
 * - Experience modifier (seniority adjustment)
 */

export const SCORING_WEIGHTS = {
  // Layer weights (must sum to 1.0)
  aiExposure: 0.4,
  taskAutomation: 0.3,
  industryModifier: 0.2,
  experienceModifier: 0.1,
} as const;

/**
 * Risk score thresholds (0-100 scale)
 */
export const RISK_THRESHOLDS = {
  low: 0,      // 0-33: Low risk
  medium: 34,  // 34-66: Medium risk
  high: 67,    // 67-100: High risk
} as const;

/**
 * Experience modifiers by years
 */
export const EXPERIENCE_MODIFIERS = {
  junior: { min: 0, max: 3, modifier: 1.1 },     // Higher risk (less specialized)
  midLevel: { min: 4, max: 9, modifier: 1.0 },   // Baseline
  senior: { min: 10, max: Infinity, modifier: 0.9 }, // Lower risk (more specialized)
} as const;

// TODO: Add industry modifiers based on AI adoption rates
// TODO: Add task type weights (routine vs. creative)
