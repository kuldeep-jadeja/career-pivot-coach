/**
 * Risk Score Calculator
 * 
 * Main scoring engine that combines all 4 layers into a final risk score.
 * Pure function - deterministic, no side effects, same inputs = same outputs.
 * 
 * Algorithm:
 * 1. Calculate Layer 1: AI Exposure (research baseline)
 * 2. Calculate Layer 2: Task Automation (O*NET task analysis)
 * 3. Calculate weighted base = (Layer1 × 35%) + (Layer2 × 35%)
 * 4. Apply Layer 3: Industry modifier (multiplicative adjustment)
 * 5. Apply Layer 4: Experience modifier (multiplicative adjustment)
 * 6. Round final score to nearest 5% to avoid false precision
 * 7. Map to risk band and determine confidence
 */

import type { RiskInput, RiskScore, LayerBreakdown, RiskBand, ConfidenceLevel } from './types';
import { SCORING_WEIGHTS, RISK_BANDS, SCORE_ROUNDING_PRECISION } from './config';
import { calculateAIExposure } from './layers/layer1-ai-exposure';
import { calculateTaskAutomation } from './layers/layer2-task-automation';
import { calculateIndustryModifier } from './layers/layer3-industry-speed';
import { calculateExperienceModifier } from './layers/layer4-experience-level';
import { getTasksForOccupation } from '@/lib/data/onet-loader';

/**
 * Round score to nearest 5% to avoid false precision
 * Critical for preventing algorithmic anchoring bias
 */
function roundToFivePercent(score: number): number {
  return Math.round(score / SCORE_ROUNDING_PRECISION) * SCORE_ROUNDING_PRECISION;
}

/**
 * Determine risk band from score
 * Maps 0-100 score to qualitative risk level
 */
function getRiskBand(score: number): RiskBand {
  for (const [key, band] of Object.entries(RISK_BANDS)) {
    if (score >= band.min && score <= band.max) {
      return {
        level: key as RiskBand['level'],
        label: band.label,
        color: band.color,
        min: band.min,
        max: band.max,
      };
    }
  }
  
  // Fallback to MODERATE if somehow no match (shouldn't happen)
  return {
    level: 'MODERATE',
    label: 'Moderate Risk',
    color: 'yellow',
    min: 21,
    max: 40,
  };
}

/**
 * Determine confidence level based on data availability
 * High confidence requires: occupation code, industry, experience, and task data
 */
function determineConfidence(input: RiskInput, taskCount: number): ConfidenceLevel {
  let confidence: ConfidenceLevel = 'high';
  
  // Lower confidence if missing optional data
  if (!input.industryCode) confidence = 'medium';
  if (input.yearsExperience === undefined || input.yearsExperience === null) confidence = 'medium';
  
  // Low confidence if no task data or invalid occupation
  if (taskCount === 0) confidence = 'low';
  if (!input.occupationCode) confidence = 'low';
  
  return confidence;
}

/**
 * Main risk score calculation (async version for production use)
 * 
 * @param input - Risk calculation input with occupation, industry, experience
 * @returns Complete risk score with breakdown and confidence
 */
export async function calculateRiskScore(input: RiskInput): Promise<RiskScore> {
  // Load tasks for occupation from O*NET data
  const tasks = await getTasksForOccupation(input.occupationCode);
  
  // Calculate each layer
  const layer1 = calculateAIExposure(input.occupationCode);
  const layer2 = calculateTaskAutomation(tasks, input.selectedTasks);
  const layer3 = calculateIndustryModifier(input.industryCode);
  const layer4 = calculateExperienceModifier(input.yearsExperience);
  
  // Calculate weighted base score (Layer 1 + Layer 2)
  // Each contributes 35% of the final score
  const weightedBase = 
    (layer1 * SCORING_WEIGHTS.layer1_ai_exposure) +
    (layer2 * SCORING_WEIGHTS.layer2_task_automation);
  
  // Apply modifiers (Layer 3 + Layer 4)
  // Modifiers are multiplicative adjustments proportional to their weights
  const industryImpact = (layer3 - 1) * SCORING_WEIGHTS.layer3_industry_speed * 100;
  const experienceImpact = (layer4 - 1) * SCORING_WEIGHTS.layer4_experience_level * 100;
  
  const finalAdjusted = weightedBase + industryImpact + experienceImpact;
  
  // Clamp to 0-100 range and round to 5%
  const overall = roundToFivePercent(Math.max(0, Math.min(100, finalAdjusted)));
  
  // Build breakdown object
  const breakdown: LayerBreakdown = {
    layer1_ai_exposure: layer1,
    layer2_task_automation: layer2,
    layer3_industry_modifier: layer3,
    layer4_experience_modifier: layer4,
    weighted_base: Math.round(weightedBase),
    final_adjusted: Math.round(finalAdjusted),
  };
  
  return {
    overall,
    displayScore: overall,
    breakdown,
    band: getRiskBand(overall),
    confidence: determineConfidence(input, tasks.length),
  };
}

/**
 * Synchronous version for testing with mocked task data
 * 
 * Use this in unit tests where you want to control task data without async loading.
 * Production code should use calculateRiskScore() which loads real O*NET data.
 * 
 * @param input - Risk calculation input
 * @param tasks - Mock task array for testing
 * @returns Risk score (without async loading)
 */
export function calculateRiskScoreSync(
  input: RiskInput,
  tasks: any[] = []
): RiskScore {
  // Calculate each layer
  const layer1 = calculateAIExposure(input.occupationCode);
  const layer2 = calculateTaskAutomation(tasks, input.selectedTasks);
  const layer3 = calculateIndustryModifier(input.industryCode);
  const layer4 = calculateExperienceModifier(input.yearsExperience);
  
  // Calculate weighted base score (Layer 1 + Layer 2)
  const weightedBase = 
    (layer1 * SCORING_WEIGHTS.layer1_ai_exposure) +
    (layer2 * SCORING_WEIGHTS.layer2_task_automation);
  
  // Apply modifiers (Layer 3 + Layer 4)
  const industryImpact = (layer3 - 1) * SCORING_WEIGHTS.layer3_industry_speed * 100;
  const experienceImpact = (layer4 - 1) * SCORING_WEIGHTS.layer4_experience_level * 100;
  
  const finalAdjusted = weightedBase + industryImpact + experienceImpact;
  
  // Clamp to 0-100 and round to 5%
  const overall = roundToFivePercent(Math.max(0, Math.min(100, finalAdjusted)));
  
  // Build breakdown
  const breakdown: LayerBreakdown = {
    layer1_ai_exposure: layer1,
    layer2_task_automation: layer2,
    layer3_industry_modifier: layer3,
    layer4_experience_modifier: layer4,
    weighted_base: Math.round(weightedBase),
    final_adjusted: Math.round(finalAdjusted),
  };
  
  return {
    overall,
    displayScore: overall,
    breakdown,
    band: getRiskBand(overall),
    confidence: determineConfidence(input, tasks.length),
  };
}
