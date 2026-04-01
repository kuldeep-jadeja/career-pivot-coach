/**
 * Scoring Engine Configuration
 * 
 * Configurable weights and constants for the 4-layer AI displacement risk algorithm.
 * Adjust these to tune the scoring behavior without changing core logic.
 */

/**
 * Layer weights (must sum to 1.0 for proportional calculation)
 * 
 * Layer 1 (35%): AI exposure baseline from published research
 * Layer 2 (35%): Task automation potential from O*NET analysis
 * Layer 3 (15%): Industry adoption speed modifier
 * Layer 4 (15%): Experience level modifier
 */
export const SCORING_WEIGHTS = {
  layer1_ai_exposure: 0.35,      // Research baseline (Eloundou, Felten)
  layer2_task_automation: 0.35,   // O*NET task characteristics
  layer3_industry_speed: 0.15,    // Industry adoption modifier
  layer4_experience_level: 0.15   // Seniority/experience modifier
} as const;

/**
 * Risk band definitions
 * Maps 0-100 scores to qualitative risk levels with visual colors
 */
export const RISK_BANDS = {
  LOW: { min: 0, max: 20, label: 'Low Risk', color: 'green' },
  MODERATE: { min: 21, max: 40, label: 'Moderate Risk', color: 'yellow' },
  ELEVATED: { min: 41, max: 60, label: 'Elevated Risk', color: 'orange' },
  HIGH: { min: 61, max: 80, label: 'High Risk', color: 'red' },
  VERY_HIGH: { min: 81, max: 100, label: 'Very High Risk', color: 'darkred' },
} as const;

/**
 * Industry speed multipliers
 * Reflects how quickly different sectors are adopting AI tools
 * Range: 0.8 (slowest) to 1.25 (fastest)
 */
export const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  'technology': 1.25,        // Fastest AI adoption
  'finance': 1.20,
  'healthcare': 1.10,
  'retail': 1.05,
  'manufacturing': 1.00,
  'education': 0.95,
  'government': 0.90,
  'construction': 0.85,
  'hospitality': 0.80,       // Slowest AI adoption
  'other': 1.00,
};

/**
 * Experience level multipliers
 * Reflects how experience affects automation risk
 * Range: 0.85 (entry level) to 1.05 (senior)
 * 
 * Note: Entry level is LESS at risk (0.85x) because they're more adaptable
 * Senior is MORE at risk (1.05x) for routine roles that get automated
 * Executive (0.90x) is less at risk due to strategic, relationship-focused work
 */
export const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
  'entry': 0.85,             // 0-2 years (more adaptable)
  'mid': 1.00,               // 3-7 years (baseline)
  'senior': 1.05,            // 8-15 years (deeper specialization)
  'executive': 0.90,         // 15+ years (strategic roles)
};

/**
 * Minimum confidence threshold for auto-selecting job match
 * Matches below this require user disambiguation
 */
export const JOB_MATCH_AUTO_SELECT_THRESHOLD = 0.8;

/**
 * Minimum similarity threshold for considering a job match
 * Matches below this are filtered out
 */
export const JOB_MATCH_MIN_THRESHOLD = 0.3;

/**
 * Score rounding precision
 * Scores are rounded to nearest 5% to avoid false precision
 */
export const SCORE_ROUNDING_PRECISION = 5;
