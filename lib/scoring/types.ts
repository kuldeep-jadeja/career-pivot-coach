/**
 * Scoring Engine Type Definitions
 * 
 * TypeScript interfaces for the 4-layer AI displacement risk scoring system.
 */

/**
 * Input data for risk score calculation
 */
export interface RiskInput {
  occupationCode: string;      // O*NET SOC code (e.g., "15-1252.00")
  industryCode?: string;       // Industry sector (optional, defaults to neutral)
  yearsExperience?: number;    // Years of work experience (optional)
  selectedTasks?: string[];    // User-selected relevant task IDs (optional)
}

/**
 * Complete risk score result
 */
export interface RiskScore {
  overall: number;             // Final risk score 0-100, rounded to 5%
  displayScore: number;        // Same as overall, for display convenience
  breakdown: LayerBreakdown;   // Individual layer contributions
  band: RiskBand;              // Risk band classification
  confidence: ConfidenceLevel; // Data quality confidence
}

/**
 * Breakdown of individual scoring layers
 */
export interface LayerBreakdown {
  layer1_ai_exposure: number;        // 0-100 (research baseline)
  layer2_task_automation: number;    // 0-100 (task analysis)
  layer3_industry_modifier: number;  // Multiplier (0.8-1.25)
  layer4_experience_modifier: number; // Multiplier (0.85-1.05)
  weighted_base: number;             // Score before modifiers
  final_adjusted: number;            // Score after modifiers
}

/**
 * Risk band with metadata
 */
export interface RiskBand {
  level: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'VERY_HIGH';
  label: string;               // Human-readable label
  color: string;               // Visual indicator color
  min: number;                 // Minimum score in band
  max: number;                 // Maximum score in band
}

/**
 * Confidence level in scoring accuracy
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Job title match result with confidence
 */
export interface JobMatch {
  socCode: string;             // O*NET SOC code
  title: string;               // Occupation title
  description: string;         // Full occupation description
  confidence: number;          // Match confidence 0-1
  alternateTitles?: string[];  // Alternative job titles
}
