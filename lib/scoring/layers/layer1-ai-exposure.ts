/**
 * Layer 1: AI Exposure Baseline
 * 
 * Uses pre-computed AI exposure scores from published research:
 * - Eloundou et al. "GPTs are GPTs" (2023)
 * - Felten et al. "Occupational Exposure to AI" (2023)
 * 
 * This layer provides the research-backed baseline score before
 * task-level analysis and modifiers are applied.
 */

import { AI_EXPOSURE_SCORES } from '@/lib/data/research-scores';

/**
 * Calculate AI exposure baseline score for an occupation
 * 
 * Strategy:
 * 1. Look up exact SOC code match
 * 2. If not found, average scores from same occupation family (first 5 digits)
 * 3. If no family match, return default (50)
 * 
 * @param occupationCode - O*NET SOC code (e.g., "15-1252.00")
 * @returns AI exposure score (0-100)
 */
export function calculateAIExposure(occupationCode: string): number {
  // Try exact match first
  const exactScore = AI_EXPOSURE_SCORES[occupationCode];
  
  if (exactScore !== undefined) {
    return exactScore;
  }
  
  // Try occupation family match (first 5 digits: e.g., "15-12" from "15-1252.00")
  const familyCode = occupationCode.substring(0, 5);
  const familyScores = Object.entries(AI_EXPOSURE_SCORES)
    .filter(([code]) => code !== '_default' && code.startsWith(familyCode))
    .map(([, score]) => score);
  
  if (familyScores.length > 0) {
    // Return average of family members
    return Math.round(familyScores.reduce((sum, score) => sum + score, 0) / familyScores.length);
  }
  
  // No match found, return default
  return AI_EXPOSURE_SCORES['_default'];
}

/**
 * Get description of AI exposure level for an occupation
 * 
 * @param occupationCode - O*NET SOC code
 * @returns Human-readable description of exposure level
 */
export function getExposureDescription(occupationCode: string): string {
  const score = calculateAIExposure(occupationCode);
  
  if (score >= 81) {
    return 'Very High - Highly routine, repetitive, or text-based tasks with significant automation potential';
  } else if (score >= 61) {
    return 'High - Knowledge work with substantial routine elements that AI can augment or automate';
  } else if (score >= 41) {
    return 'Moderate - Mixed cognitive and manual work with some automatable routine tasks';
  } else if (score >= 21) {
    return 'Low - Interpersonal, creative, or physical problem-solving work resistant to automation';
  } else {
    return 'Very Low - Manual, physical, or highly contextual work requiring human judgment and dexterity';
  }
}
