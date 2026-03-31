/**
 * Scoring Engine Type Definitions
 * 
 * Purpose: TypeScript types for risk scoring system
 */

/**
 * Risk score result (0-100 scale)
 */
export interface RiskScore {
  overall: number;
  breakdown: {
    aiExposure: number;
    taskAutomation: number;
    industryModifier: number;
    experienceModifier: number;
  };
  level: 'low' | 'medium' | 'high';
  confidence: number; // 0-1 scale
}

/**
 * User assessment input
 */
export interface AssessmentInput {
  jobTitle: string;
  yearsExperience: number;
  industry: string;
  // TODO: Add task selection, skills, etc.
}

/**
 * O*NET occupation data structure
 */
export interface OccupationData {
  code: string;        // SOC code (e.g., "15-1252.00")
  title: string;       // Job title
  aiExposure: number;  // AI exposure score (0-100)
  tasks: Task[];
  // TODO: Add skills, knowledge, abilities
}

/**
 * Task definition
 */
export interface Task {
  id: string;
  description: string;
  importance: number;  // 0-100
  automation: number;  // Automation potential (0-100)
}

// TODO: Add pivot path types
// TODO: Add skill gap types
