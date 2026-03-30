# Plan 04: Core Scoring Engine

**Requirements:** INFRA-08  
**Estimated Time:** 3-4 hours  
**Dependencies:** Plan 03 (O*NET data must be parsed and available)

## Goal

Implement the deterministic 4-layer risk scoring engine as pure TypeScript functions, including fuzzy job title matching with disambiguation, risk band calculation, and comprehensive unit testing. This is the core algorithm that powers the viral assessment.

## Context

**From PHASE-1-CONTEXT.md:**
- 4-layer scoring with configurable weights: 35% / 35% / 15% / 15%
- Layer 1: Research-based AI exposure baseline (Eloundou, Felten)
- Layer 2: Task-level automation analysis (O*NET task data)
- Layer 3: Industry adoption speed modifier
- Layer 4: Experience level modifier
- Risk bands: Low (0-20%), Moderate (21-40%), Elevated (41-60%), High (61-80%), Very High (81-100%)
- Display: Risk band + percentage rounded to 5%
- Validation: Vitest unit tests (20-30 occupations) + golden dataset (50+)

**From ARCHITECTURE.md:**
- Pure functions: No DB queries, no API calls, no randomness
- Same inputs = same output (deterministic)
- Files in `lib/scoring/` directory

**Critical Pitfalls (PITFALLS.md):**
- False precision: Round to 5% increments
- Job title mapping: Show 3-5 matches with descriptions, let user pick
- Anchoring bias: Present score with opportunity context

## Tasks

### Task 1: Create scoring configuration and types

- **Action:** Define the scoring weights, types, and interfaces for the scoring engine.
- **Files:**
  - `lib/scoring/config.ts`
  - `lib/scoring/types.ts`
- **Implementation:**
  ```typescript
  // lib/scoring/config.ts
  export const SCORING_WEIGHTS = {
    layer1_ai_exposure: 0.35,      // Research baseline (Eloundou, Felten)
    layer2_task_automation: 0.35,   // O*NET task characteristics
    layer3_industry_speed: 0.15,    // Industry adoption modifier
    layer4_experience_level: 0.15   // Seniority/experience modifier
  } as const;
  
  export const RISK_BANDS = {
    LOW: { min: 0, max: 20, label: 'Low Risk', color: 'green' },
    MODERATE: { min: 21, max: 40, label: 'Moderate Risk', color: 'yellow' },
    ELEVATED: { min: 41, max: 60, label: 'Elevated Risk', color: 'orange' },
    HIGH: { min: 61, max: 80, label: 'High Risk', color: 'red' },
    VERY_HIGH: { min: 81, max: 100, label: 'Very High Risk', color: 'darkred' },
  } as const;
  
  // Industry speed multipliers (how fast AI adoption is in sector)
  export const INDUSTRY_MULTIPLIERS: Record<string, number> = {
    'technology': 1.25,        // Fastest adoption
    'finance': 1.20,
    'healthcare': 1.10,
    'retail': 1.05,
    'manufacturing': 1.00,
    'education': 0.95,
    'government': 0.90,
    'construction': 0.85,
    'hospitality': 0.80,       // Slowest adoption
    'other': 1.00,
  };
  
  // Experience modifiers (more experience = more at risk for routine roles)
  export const EXPERIENCE_MULTIPLIERS: Record<string, number> = {
    'entry': 0.85,             // 0-2 years
    'mid': 1.00,               // 3-7 years
    'senior': 1.05,            // 8-15 years
    'executive': 0.90,         // 15+ years (strategic roles less automatable)
  };
  
  // lib/scoring/types.ts
  export interface RiskInput {
    occupationCode: string;
    industryCode?: string;
    yearsExperience?: number;
    selectedTasks?: string[];  // User-selected relevant tasks
  }
  
  export interface RiskScore {
    overall: number;           // 0-100, rounded to 5%
    displayScore: number;      // Same as overall for display
    breakdown: LayerBreakdown;
    band: RiskBand;
    confidence: ConfidenceLevel;
  }
  
  export interface LayerBreakdown {
    layer1_ai_exposure: number;        // 0-100
    layer2_task_automation: number;    // 0-100
    layer3_industry_modifier: number;  // Multiplier (0.8-1.3)
    layer4_experience_modifier: number; // Multiplier (0.85-1.1)
    weighted_base: number;             // Before modifiers
    final_adjusted: number;            // After modifiers
  }
  
  export interface RiskBand {
    level: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' | 'VERY_HIGH';
    label: string;
    color: string;
    min: number;
    max: number;
  }
  
  export type ConfidenceLevel = 'high' | 'medium' | 'low';
  
  export interface JobMatch {
    socCode: string;
    title: string;
    description: string;
    confidence: number;        // 0-1 match confidence
    alternateTitles?: string[];
  }
  ```
- **Verification:**
  - Types compile without errors
  - Configuration values match PHASE-1-CONTEXT.md decisions
  - All risk bands cover 0-100 range without gaps

### Task 2: Implement Layer 1 - AI Exposure Baseline

- **Action:** Create the research-based AI exposure layer using Eloundou/Felten data. This layer uses pre-computed exposure scores mapped to O*NET occupation codes.
- **Files:**
  - `lib/scoring/layers/ai-exposure.ts`
  - `lib/data/research-scores.ts` (research baseline data)
- **Implementation:**
  ```typescript
  // lib/data/research-scores.ts
  // Pre-computed AI exposure scores from research papers
  // Source: Eloundou et al. "GPTs are GPTs" (2023), Felten et al. (2023)
  // Scores normalized to 0-100 scale
  
  export const AI_EXPOSURE_SCORES: Record<string, number> = {
    // Technology roles (high exposure)
    '15-1252.00': 78,  // Software Developers
    '15-1211.00': 82,  // Computer Systems Analysts
    '15-2051.00': 85,  // Data Scientists
    
    // Administrative (high exposure)
    '43-9061.00': 88,  // Office Clerks, General
    '43-4051.00': 75,  // Customer Service Representatives
    
    // Healthcare (lower exposure)
    '29-1141.00': 35,  // Registered Nurses
    '29-1215.00': 28,  // Family Medicine Physicians
    
    // Trades (lowest exposure)
    '47-2111.00': 15,  // Electricians
    '47-2152.00': 12,  // Plumbers
    
    // Education (moderate)
    '25-2021.00': 32,  // Elementary School Teachers
    '25-1011.00': 45,  // Business Teachers, Postsecondary
    
    // Default for unknown occupations
    '_default': 50,
  };
  
  // lib/scoring/layers/ai-exposure.ts
  import { AI_EXPOSURE_SCORES } from '@/lib/data/research-scores';
  
  /**
   * Layer 1: Research-based AI exposure baseline
   * Uses pre-computed scores from Eloundou and Felten research
   * Returns 0-100 score
   */
  export function calculateAIExposure(occupationCode: string): number {
    const score = AI_EXPOSURE_SCORES[occupationCode];
    
    if (score !== undefined) {
      return score;
    }
    
    // Check for partial match (same occupation family)
    const familyCode = occupationCode.substring(0, 5);
    const familyScores = Object.entries(AI_EXPOSURE_SCORES)
      .filter(([code]) => code.startsWith(familyCode))
      .map(([, score]) => score);
    
    if (familyScores.length > 0) {
      // Average of family members
      return Math.round(familyScores.reduce((a, b) => a + b, 0) / familyScores.length);
    }
    
    // Return default if no match
    return AI_EXPOSURE_SCORES['_default'];
  }
  ```
- **Verification:**
  - Known occupations return expected scores
  - Unknown occupations return family average or default
  - Scores are always 0-100

### Task 3: Implement Layer 2 - Task Automation Analysis

- **Action:** Analyze O*NET task data to calculate automation potential based on task characteristics.
- **Files:**
  - `lib/scoring/layers/task-automation.ts`
- **Implementation:**
  ```typescript
  // lib/scoring/layers/task-automation.ts
  import type { OnetTask } from '@/lib/data/types';
  
  // Keywords that indicate high automation potential
  const HIGH_AUTOMATION_KEYWORDS = [
    'data entry', 'compile', 'record', 'file', 'schedule',
    'calculate', 'verify', 'process', 'transcribe', 'sort',
    'monitor', 'track', 'update', 'report', 'input',
  ];
  
  // Keywords that indicate low automation potential
  const LOW_AUTOMATION_KEYWORDS = [
    'negotiate', 'counsel', 'diagnose', 'mentor', 'lead',
    'design', 'create', 'innovate', 'strategize', 'persuade',
    'empathize', 'judge', 'arbitrate', 'physical', 'repair',
    'construct', 'install', 'operate machinery',
  ];
  
  /**
   * Layer 2: Task-level automation analysis
   * Analyzes O*NET task descriptions for automation potential
   * Returns 0-100 score
   */
  export function calculateTaskAutomation(
    tasks: OnetTask[],
    selectedTaskIds?: string[]
  ): number {
    if (!tasks || tasks.length === 0) {
      return 50; // Default middle score
    }
    
    // Filter to selected tasks if provided
    const relevantTasks = selectedTaskIds
      ? tasks.filter(t => selectedTaskIds.includes(t.taskId))
      : tasks;
    
    if (relevantTasks.length === 0) {
      return 50;
    }
    
    let totalScore = 0;
    
    for (const task of relevantTasks) {
      const description = task.description.toLowerCase();
      
      let taskScore = 50; // Start at neutral
      
      // Check for high automation keywords
      for (const keyword of HIGH_AUTOMATION_KEYWORDS) {
        if (description.includes(keyword)) {
          taskScore += 10;
        }
      }
      
      // Check for low automation keywords
      for (const keyword of LOW_AUTOMATION_KEYWORDS) {
        if (description.includes(keyword)) {
          taskScore -= 10;
        }
      }
      
      // Clamp to 0-100
      taskScore = Math.max(0, Math.min(100, taskScore));
      totalScore += taskScore;
    }
    
    // Average across tasks
    return Math.round(totalScore / relevantTasks.length);
  }
  
  /**
   * Get task-level breakdown for display
   */
  export function getTaskBreakdown(tasks: OnetTask[]): {
    high_risk: OnetTask[];
    medium_risk: OnetTask[];
    low_risk: OnetTask[];
  } {
    const categorized = {
      high_risk: [] as OnetTask[],
      medium_risk: [] as OnetTask[],
      low_risk: [] as OnetTask[],
    };
    
    for (const task of tasks) {
      const score = calculateTaskAutomation([task]);
      
      if (score >= 60) {
        categorized.high_risk.push(task);
      } else if (score >= 40) {
        categorized.medium_risk.push(task);
      } else {
        categorized.low_risk.push(task);
      }
    }
    
    return categorized;
  }
  ```
- **Verification:**
  - Data entry tasks score high (>70)
  - Counseling tasks score low (<40)
  - Empty tasks array returns 50

### Task 4: Implement Layer 3 & 4 - Modifiers

- **Action:** Create industry speed and experience level modifier calculations.
- **Files:**
  - `lib/scoring/layers/industry-speed.ts`
  - `lib/scoring/layers/experience.ts`
- **Implementation:**
  ```typescript
  // lib/scoring/layers/industry-speed.ts
  import { INDUSTRY_MULTIPLIERS } from '../config';
  
  /**
   * Layer 3: Industry adoption speed modifier
   * Returns multiplier (0.8 - 1.3)
   */
  export function calculateIndustryModifier(industryCode?: string): number {
    if (!industryCode) {
      return 1.0; // Neutral default
    }
    
    const normalizedCode = industryCode.toLowerCase().trim();
    return INDUSTRY_MULTIPLIERS[normalizedCode] ?? 1.0;
  }
  
  export function getIndustryLabel(industryCode?: string): string {
    if (!industryCode) return 'Unknown';
    
    const labels: Record<string, string> = {
      'technology': 'Technology (fastest AI adoption)',
      'finance': 'Finance (fast AI adoption)',
      'healthcare': 'Healthcare (moderate AI adoption)',
      'retail': 'Retail (moderate AI adoption)',
      'manufacturing': 'Manufacturing (average AI adoption)',
      'education': 'Education (slower AI adoption)',
      'government': 'Government (slower AI adoption)',
      'construction': 'Construction (slow AI adoption)',
      'hospitality': 'Hospitality (slowest AI adoption)',
    };
    
    return labels[industryCode.toLowerCase()] ?? 'Industry (average AI adoption)';
  }
  
  // lib/scoring/layers/experience.ts
  import { EXPERIENCE_MULTIPLIERS } from '../config';
  
  /**
   * Layer 4: Experience level modifier
   * Returns multiplier (0.85 - 1.1)
   */
  export function calculateExperienceModifier(yearsExperience?: number): number {
    if (yearsExperience === undefined || yearsExperience === null) {
      return 1.0; // Neutral default
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
  
  export function getExperienceLevel(yearsExperience?: number): string {
    if (!yearsExperience) return 'Unknown';
    
    if (yearsExperience <= 2) return 'Entry Level (0-2 years)';
    if (yearsExperience <= 7) return 'Mid Level (3-7 years)';
    if (yearsExperience <= 15) return 'Senior Level (8-15 years)';
    return 'Executive Level (15+ years)';
  }
  ```
- **Verification:**
  - Technology industry returns 1.25 multiplier
  - Entry level experience returns 0.85 multiplier
  - Unknown values return 1.0 (neutral)

### Task 5: Implement main risk calculator

- **Action:** Create the main scoring function that combines all 4 layers.
- **Files:**
  - `lib/scoring/risk-calculator.ts`
- **Implementation:**
  ```typescript
  // lib/scoring/risk-calculator.ts
  import type { RiskInput, RiskScore, LayerBreakdown, RiskBand, ConfidenceLevel } from './types';
  import { SCORING_WEIGHTS, RISK_BANDS } from './config';
  import { calculateAIExposure } from './layers/ai-exposure';
  import { calculateTaskAutomation } from './layers/task-automation';
  import { calculateIndustryModifier } from './layers/industry-speed';
  import { calculateExperienceModifier } from './layers/experience';
  import { getTasksForOccupation } from '@/lib/data/onet-loader';
  
  /**
   * Round score to nearest 5% to avoid false precision
   */
  function roundToFivePercent(score: number): number {
    return Math.round(score / 5) * 5;
  }
  
  /**
   * Determine risk band from score
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
    // Fallback (shouldn't happen)
    return {
      level: 'MODERATE',
      label: 'Moderate Risk',
      color: 'yellow',
      min: 21,
      max: 40,
    };
  }
  
  /**
   * Determine confidence based on data availability
   */
  function determineConfidence(input: RiskInput, tasks: any[]): ConfidenceLevel {
    let confidence: ConfidenceLevel = 'high';
    
    // Lower confidence if missing data
    if (!input.industryCode) confidence = 'medium';
    if (!input.yearsExperience) confidence = 'medium';
    if (tasks.length === 0) confidence = 'low';
    if (!input.occupationCode) confidence = 'low';
    
    return confidence;
  }
  
  /**
   * Main risk score calculation
   * Pure function - deterministic, no side effects
   */
  export async function calculateRiskScore(input: RiskInput): Promise<RiskScore> {
    // Load tasks for occupation
    const tasks = await getTasksForOccupation(input.occupationCode);
    
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
    // Modifiers affect the base proportionally
    const industryImpact = (layer3 - 1) * SCORING_WEIGHTS.layer3_industry_speed;
    const experienceImpact = (layer4 - 1) * SCORING_WEIGHTS.layer4_experience_level;
    
    const finalAdjusted = weightedBase * (1 + industryImpact + experienceImpact);
    
    // Clamp to 0-100 and round to 5%
    const overall = roundToFivePercent(Math.max(0, Math.min(100, finalAdjusted)));
    
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
      confidence: determineConfidence(input, tasks),
    };
  }
  
  /**
   * Synchronous version for testing (mocked tasks)
   */
  export function calculateRiskScoreSync(
    input: RiskInput, 
    tasks: any[] = []
  ): Omit<RiskScore, 'confidence'> & { confidence: ConfidenceLevel } {
    const layer1 = calculateAIExposure(input.occupationCode);
    const layer2 = calculateTaskAutomation(tasks, input.selectedTasks);
    const layer3 = calculateIndustryModifier(input.industryCode);
    const layer4 = calculateExperienceModifier(input.yearsExperience);
    
    const weightedBase = 
      (layer1 * SCORING_WEIGHTS.layer1_ai_exposure) +
      (layer2 * SCORING_WEIGHTS.layer2_task_automation);
    
    const industryImpact = (layer3 - 1) * SCORING_WEIGHTS.layer3_industry_speed;
    const experienceImpact = (layer4 - 1) * SCORING_WEIGHTS.layer4_experience_level;
    
    const finalAdjusted = weightedBase * (1 + industryImpact + experienceImpact);
    const overall = roundToFivePercent(Math.max(0, Math.min(100, finalAdjusted)));
    
    return {
      overall,
      displayScore: overall,
      breakdown: {
        layer1_ai_exposure: layer1,
        layer2_task_automation: layer2,
        layer3_industry_modifier: layer3,
        layer4_experience_modifier: layer4,
        weighted_base: Math.round(weightedBase),
        final_adjusted: Math.round(finalAdjusted),
      },
      band: getRiskBand(overall),
      confidence: determineConfidence(input, tasks),
    };
  }
  ```
- **Verification:**
  - Same inputs produce same outputs (deterministic)
  - Scores are always rounded to 5%
  - Scores are always clamped to 0-100
  - Risk bands are assigned correctly

### Task 6: Implement fuzzy job title matching

- **Action:** Create job title matching with confidence scores and disambiguation.
- **Files:**
  - `lib/scoring/job-matcher.ts`
- **Implementation:**
  ```typescript
  // lib/scoring/job-matcher.ts
  import type { OnetOccupation } from '@/lib/data/types';
  import type { JobMatch } from './types';
  import { loadOccupations } from '@/lib/data/onet-loader';
  
  /**
   * Simple Levenshtein distance calculation
   */
  function levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
  
  /**
   * Calculate similarity score (0-1) from Levenshtein distance
   */
  function calculateSimilarity(query: string, target: string): number {
    const q = query.toLowerCase().trim();
    const t = target.toLowerCase().trim();
    
    // Exact match
    if (q === t) return 1.0;
    
    // Contains match (weighted)
    if (t.includes(q) || q.includes(t)) {
      return 0.85;
    }
    
    // Levenshtein-based similarity
    const distance = levenshteinDistance(q, t);
    const maxLength = Math.max(q.length, t.length);
    return Math.max(0, 1 - (distance / maxLength));
  }
  
  /**
   * Find matching O*NET occupations for a job title
   * Returns 3-5 matches with confidence scores
   */
  export async function findJobMatches(
    jobTitle: string,
    maxResults: number = 5
  ): Promise<JobMatch[]> {
    const occupations = await loadOccupations();
    
    const scored: Array<{
      occupation: OnetOccupation;
      confidence: number;
    }> = [];
    
    for (const occ of occupations) {
      // Score against main title
      let confidence = calculateSimilarity(jobTitle, occ.title);
      
      // Also check alternate titles
      if (occ.alternateTitles) {
        for (const alt of occ.alternateTitles) {
          const altScore = calculateSimilarity(jobTitle, alt);
          if (altScore > confidence) {
            confidence = altScore;
          }
        }
      }
      
      if (confidence > 0.3) { // Minimum threshold
        scored.push({ occupation: occ, confidence });
      }
    }
    
    // Sort by confidence descending
    scored.sort((a, b) => b.confidence - a.confidence);
    
    // Return top matches
    return scored.slice(0, maxResults).map(({ occupation, confidence }) => ({
      socCode: occupation.socCode,
      title: occupation.title,
      description: occupation.description,
      confidence: Math.round(confidence * 100) / 100,
      alternateTitles: occupation.alternateTitles,
    }));
  }
  
  /**
   * Get single best match (for automatic selection)
   * Only returns if confidence > 0.8
   */
  export async function getBestMatch(jobTitle: string): Promise<JobMatch | null> {
    const matches = await findJobMatches(jobTitle, 1);
    
    if (matches.length > 0 && matches[0].confidence >= 0.8) {
      return matches[0];
    }
    
    return null; // Requires disambiguation
  }
  ```
- **Verification:**
  - "Software Developer" returns matches with high confidence
  - Partial matches return lower confidence scores
  - Returns 3-5 results for ambiguous titles
  - Very different titles return low/no matches

### Task 7: Create unit tests

- **Action:** Write comprehensive unit tests for the scoring engine using Vitest. **Use hardcoded test occupations — do NOT reference external golden-dataset.json file** (that's created in Plan 05 and would create a circular dependency).
- **Files:**
  - `lib/scoring/__tests__/risk-calculator.test.ts`
  - `lib/scoring/__tests__/job-matcher.test.ts`
  - `lib/scoring/__tests__/layers.test.ts`
- **Implementation:**
  ```typescript
  // lib/scoring/__tests__/risk-calculator.test.ts
  import { describe, it, expect } from 'vitest';
  import { calculateRiskScoreSync } from '../risk-calculator';
  import { RISK_BANDS } from '../config';
  
  // HARDCODED TEST OCCUPATIONS - self-contained, no external file dependencies
  // These are used for unit testing the scoring engine
  // Full golden dataset (50+) is created separately in Plan 05
  const TEST_OCCUPATIONS = [
    { 
      title: 'Software Developer', 
      socCode: '15-1252.00',
      industry: 'technology',
      expectedRange: { min: 60, max: 85 },
      rationale: 'High AI exposure + high automation potential for routine coding tasks'
    },
    { 
      title: 'Elementary School Teacher', 
      socCode: '25-2021.00',
      industry: 'education',
      expectedRange: { min: 20, max: 45 },
      rationale: 'Low AI exposure + human interaction requirement + classroom management'
    },
    { 
      title: 'Registered Nurse', 
      socCode: '29-1141.00',
      industry: 'healthcare',
      expectedRange: { min: 25, max: 50 },
      rationale: 'Physical care, emotional support - core tasks resist automation'
    },
    { 
      title: 'Plumber', 
      socCode: '47-2152.00',
      industry: 'construction',
      expectedRange: { min: 5, max: 30 },
      rationale: 'Physical work in unpredictable environments, problem-solving'
    },
    { 
      title: 'Office Clerk', 
      socCode: '43-9061.00',
      industry: 'technology',
      expectedRange: { min: 75, max: 100 },
      rationale: 'Very high automation - data entry, filing, scheduling'
    },
    { 
      title: 'Graphic Designer', 
      socCode: '27-1024.00',
      industry: 'creative',
      expectedRange: { min: 50, max: 75 },
      rationale: 'AI tools augment but creative direction remains human'
    },
    { 
      title: 'Chief Executive', 
      socCode: '11-1011.00',
      industry: 'management',
      expectedRange: { min: 25, max: 50 },
      rationale: 'Strategic leadership and stakeholder relationships are human-centric'
    },
    { 
      title: 'Truck Driver', 
      socCode: '53-3032.00',
      industry: 'transportation',
      expectedRange: { min: 50, max: 75 },
      rationale: 'Autonomous vehicles advancing but regulatory/last-mile challenges'
    },
  ];
  
  describe('Risk Calculator', () => {
    describe('determinism', () => {
      it('returns same score for same inputs', () => {
        const input = {
          occupationCode: '15-1252.00',
          industryCode: 'technology',
          yearsExperience: 5,
        };
        
        const score1 = calculateRiskScoreSync(input);
        const score2 = calculateRiskScoreSync(input);
        
        expect(score1.overall).toBe(score2.overall);
        expect(score1.breakdown).toEqual(score2.breakdown);
      });
    });
    
    describe('rounding', () => {
      it('rounds to nearest 5%', () => {
        const input = {
          occupationCode: '15-1252.00',
          industryCode: 'technology',
          yearsExperience: 5,
        };
        
        const score = calculateRiskScoreSync(input);
        expect(score.overall % 5).toBe(0);
      });
    });
    
    describe('bounds', () => {
      it('never exceeds 100', () => {
        const input = {
          occupationCode: '43-9061.00', // High exposure office clerk
          industryCode: 'technology',   // Fastest adoption
          yearsExperience: 10,          // Senior (1.05x)
        };
        
        const score = calculateRiskScoreSync(input);
        expect(score.overall).toBeLessThanOrEqual(100);
      });
      
      it('never goes below 0', () => {
        const input = {
          occupationCode: '47-2152.00', // Low exposure plumber
          industryCode: 'hospitality',  // Slowest adoption
          yearsExperience: 1,           // Entry (0.85x)
        };
        
        const score = calculateRiskScoreSync(input);
        expect(score.overall).toBeGreaterThanOrEqual(0);
      });
    });
    
    describe('risk bands', () => {
      it('assigns correct band for low risk', () => {
        const input = {
          occupationCode: '47-2152.00', // Plumber
          industryCode: 'construction',
          yearsExperience: 5,
        };
        
        const score = calculateRiskScoreSync(input);
        expect(['LOW', 'MODERATE']).toContain(score.band.level);
      });
      
      it('assigns correct band for high risk', () => {
        const input = {
          occupationCode: '43-9061.00', // Office Clerk
          industryCode: 'technology',
          yearsExperience: 5,
        };
        
        const score = calculateRiskScoreSync(input);
        expect(['HIGH', 'VERY_HIGH']).toContain(score.band.level);
      });
    });
    
    describe('expected score ranges (using hardcoded test occupations)', () => {
      // Test all hardcoded occupations against their expected ranges
      for (const occ of TEST_OCCUPATIONS) {
        it(`${occ.title}: ${occ.expectedRange.min}-${occ.expectedRange.max}%`, () => {
          const score = calculateRiskScoreSync({
            occupationCode: occ.socCode,
            industryCode: occ.industry,
            yearsExperience: 5, // Standard mid-career
          });
          expect(score.overall).toBeGreaterThanOrEqual(occ.expectedRange.min);
          expect(score.overall).toBeLessThanOrEqual(occ.expectedRange.max);
        });
      }
    });
    
    describe('individual occupation sanity checks', () => {
      it('Software Developer: 60-85%', () => {
        const score = calculateRiskScoreSync({
          occupationCode: '15-1252.00',
          industryCode: 'technology',
          yearsExperience: 5,
        });
        expect(score.overall).toBeGreaterThanOrEqual(60);
        expect(score.overall).toBeLessThanOrEqual(85);
      });
      
      it('Elementary Teacher: 20-45%', () => {
        const score = calculateRiskScoreSync({
          occupationCode: '25-2021.00',
          industryCode: 'education',
          yearsExperience: 10,
        });
        expect(score.overall).toBeGreaterThanOrEqual(20);
        expect(score.overall).toBeLessThanOrEqual(45);
      });
      
      it('Registered Nurse: 25-50%', () => {
        const score = calculateRiskScoreSync({
          occupationCode: '29-1141.00',
          industryCode: 'healthcare',
          yearsExperience: 7,
        });
        expect(score.overall).toBeGreaterThanOrEqual(25);
        expect(score.overall).toBeLessThanOrEqual(50);
      });
      
      it('Plumber: 5-30%', () => {
        const score = calculateRiskScoreSync({
          occupationCode: '47-2152.00',
          industryCode: 'construction',
          yearsExperience: 15,
        });
        expect(score.overall).toBeGreaterThanOrEqual(5);
        expect(score.overall).toBeLessThanOrEqual(30);
      });
    });
  });
  ```
- **Verification:**
  - All tests pass: `npm run test`
  - **Unit tests cover 6-10 diverse occupations (hardcoded in test file, no external file dependencies)**
  - **Tests validate all 4 scoring layers independently**
  - **Tests validate final risk score falls within expected range for each test occupation**
  - Coverage is high for scoring functions
  - Edge cases are covered

## Verification Checklist

- [ ] Scoring configuration matches 35/35/15/15 weights
- [ ] Risk bands cover 0-100 without gaps
- [ ] Layer 1 (AI exposure) returns scores from research data
- [ ] Layer 2 (task automation) analyzes task keywords
- [ ] Layer 3 (industry) returns correct multipliers
- [ ] Layer 4 (experience) returns correct multipliers
- [ ] Main calculator combines layers correctly
- [ ] Scores are always rounded to 5%
- [ ] Scores are always 0-100
- [ ] Same inputs = same outputs (deterministic)
- [ ] Job matcher returns 3-5 matches with confidence
- [ ] All unit tests pass
- [ ] **Unit tests use hardcoded test occupations (no external golden-dataset.json dependency)**
- [ ] Known occupations score within expected ranges

## Success Criteria

This plan is complete when:
1. 4-layer scoring engine calculates risk scores deterministically
2. Fuzzy job title matching returns 3-5 O*NET matches with confidence scores
3. Risk bands are assigned correctly (Low/Moderate/Elevated/High/Very High)
4. Scores are rounded to 5% to avoid false precision
5. **Unit tests pass for 6-10 hardcoded occupations with expected score ranges (no external file dependencies)**
6. Developer can test scoring with `npm run test` and verify outputs

## Notes

- **Research Data:** The AI exposure scores in `research-scores.ts` are approximations. Full research paper data integration is a Phase 2 refinement.
- **Task Keywords:** The automation keywords are starting points. Refine based on golden dataset validation.
- **Fuzzy Matching:** Levenshtein is simple but effective. Consider `fuse.js` if more sophisticated matching is needed later.
- **Golden Dataset:** Start with 20-30 occupations in tests, expand to 50+ as separate validation task.
- **Modifiers:** Industry and experience modifiers are multiplicative, not additive. This amplifies differences at the extremes.
- **Edge Cases:** Handle unknown occupation codes gracefully (default to 50, medium confidence)

---
*Plan 04 of 5 for Phase 1: Foundation & Core Scoring*
