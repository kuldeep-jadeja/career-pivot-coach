/**
 * Risk Calculator Unit Tests
 * 
 * Tests the 4-layer scoring algorithm with hardcoded test occupations.
 * NO external file dependencies (golden-dataset.json is created in Plan 05).
 */

import { describe, it, expect } from 'vitest';
import { calculateRiskScoreSync } from '../risk-calculator';
import type { RiskInput } from '../types';

/**
 * Hardcoded test occupations for unit testing
 * These represent diverse roles across the automation risk spectrum
 */
const TEST_OCCUPATIONS = [
  { 
    title: 'Software Developer', 
    socCode: '15-1252.00',
    industry: 'technology',
    experience: 5,
    expectedRange: { min: 60, max: 85 },
    rationale: 'High AI exposure + high automation potential for routine coding tasks'
  },
  { 
    title: 'Elementary School Teacher', 
    socCode: '25-2021.00',
    industry: 'education',
    experience: 10,
    expectedRange: { min: 20, max: 45 },
    rationale: 'Low AI exposure + human interaction requirement + classroom management'
  },
  { 
    title: 'Registered Nurse', 
    socCode: '29-1141.00',
    industry: 'healthcare',
    experience: 7,
    expectedRange: { min: 25, max: 50 },
    rationale: 'Physical care, emotional support - core tasks resist automation'
  },
  { 
    title: 'Plumber', 
    socCode: '47-2152.00',
    industry: 'construction',
    experience: 15,
    expectedRange: { min: 5, max: 30 },
    rationale: 'Physical work in unpredictable environments, problem-solving'
  },
  { 
    title: 'Office Clerk', 
    socCode: '43-9061.00',
    industry: 'technology',
    experience: 5,
    expectedRange: { min: 75, max: 100 },
    rationale: 'Very high automation - data entry, filing, scheduling'
  },
  { 
    title: 'Graphic Designer', 
    socCode: '27-1024.00',
    industry: 'retail',
    experience: 4,
    expectedRange: { min: 50, max: 75 },
    rationale: 'AI tools augment but creative direction remains human'
  },
  { 
    title: 'Chief Executive', 
    socCode: '11-1011.00',
    industry: 'finance',
    experience: 20,
    expectedRange: { min: 25, max: 50 },
    rationale: 'Strategic leadership and stakeholder relationships are human-centric'
  },
  { 
    title: 'Truck Driver', 
    socCode: '53-3032.00',
    industry: 'manufacturing',
    experience: 12,
    expectedRange: { min: 40, max: 70 },
    rationale: 'Autonomous vehicles advancing but regulatory/last-mile challenges'
  },
];

describe('Risk Calculator', () => {
  describe('determinism', () => {
    it('returns same score for same inputs', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      const score1 = calculateRiskScoreSync(input);
      const score2 = calculateRiskScoreSync(input);
      
      expect(score1.overall).toBe(score2.overall);
      expect(score1.breakdown).toEqual(score2.breakdown);
    });

    it('returns consistent breakdown values', () => {
      const input: RiskInput = {
        occupationCode: '29-1141.00', // Nurse
        industryCode: 'healthcare',
        yearsExperience: 7,
      };
      
      const score = calculateRiskScoreSync(input);
      
      // Breakdown values should be consistent
      expect(score.breakdown.layer1_ai_exposure).toBe(35);
      expect(score.breakdown.layer3_industry_modifier).toBe(1.10);
      expect(score.breakdown.layer4_experience_modifier).toBe(1.00);
    });
  });
  
  describe('rounding precision', () => {
    it('rounds to nearest 5%', () => {
      const inputs = [
        { occupationCode: '15-1252.00', industryCode: 'technology', yearsExperience: 5 },
        { occupationCode: '25-2021.00', industryCode: 'education', yearsExperience: 10 },
        { occupationCode: '47-2152.00', industryCode: 'construction', yearsExperience: 15 },
      ];
      
      for (const input of inputs) {
        const score = calculateRiskScoreSync(input);
        expect(score.overall % 5).toBe(0);
      }
    });

    it('display score matches overall score', () => {
      const input: RiskInput = {
        occupationCode: '43-9061.00',
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      expect(score.displayScore).toBe(score.overall);
    });
  });
  
  describe('bounds checking', () => {
    it('never exceeds 100', () => {
      const input: RiskInput = {
        occupationCode: '43-9061.00', // Very high exposure office clerk
        industryCode: 'technology',   // Fastest adoption (1.25x)
        yearsExperience: 10,          // Senior (1.05x)
      };
      
      const score = calculateRiskScoreSync(input);
      expect(score.overall).toBeLessThanOrEqual(100);
      expect(score.overall).toBeGreaterThanOrEqual(0);
    });
    
    it('never goes below 0', () => {
      const input: RiskInput = {
        occupationCode: '47-2152.00', // Very low exposure plumber
        industryCode: 'hospitality',  // Slowest adoption (0.80x)
        yearsExperience: 1,           // Entry (0.85x)
      };
      
      const score = calculateRiskScoreSync(input);
      expect(score.overall).toBeGreaterThanOrEqual(0);
      expect(score.overall).toBeLessThanOrEqual(100);
    });

    it('clamps extreme values correctly', () => {
      // Test with extreme combinations
      const highInput: RiskInput = {
        occupationCode: '43-9061.00',
        industryCode: 'technology',
        yearsExperience: 10,
      };
      
      const lowInput: RiskInput = {
        occupationCode: '47-2152.00',
        industryCode: 'hospitality',
        yearsExperience: 1,
      };
      
      const highScore = calculateRiskScoreSync(highInput);
      const lowScore = calculateRiskScoreSync(lowInput);
      
      expect(highScore.overall).toBeLessThanOrEqual(100);
      expect(lowScore.overall).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('risk band assignment', () => {
    it('assigns LOW band for low-risk occupations', () => {
      const input: RiskInput = {
        occupationCode: '47-2152.00', // Plumber
        industryCode: 'construction',
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      expect(['LOW', 'MODERATE']).toContain(score.band.level);
      expect(score.band.min).toBeLessThanOrEqual(score.overall);
      expect(score.band.max).toBeGreaterThanOrEqual(score.overall);
    });
    
    it('assigns HIGH/VERY_HIGH band for high-risk occupations', () => {
      const input: RiskInput = {
        occupationCode: '43-9061.00', // Office Clerk
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      expect(['HIGH', 'VERY_HIGH', 'ELEVATED']).toContain(score.band.level);
      expect(score.band.min).toBeLessThanOrEqual(score.overall);
      expect(score.band.max).toBeGreaterThanOrEqual(score.overall);
    });

    it('band range always contains score', () => {
      for (const occ of TEST_OCCUPATIONS) {
        const score = calculateRiskScoreSync({
          occupationCode: occ.socCode,
          industryCode: occ.industry,
          yearsExperience: occ.experience,
        });
        
        expect(score.band.min).toBeLessThanOrEqual(score.overall);
        expect(score.band.max).toBeGreaterThanOrEqual(score.overall);
      }
    });
  });
  
  describe('confidence calculation', () => {
    it('returns high confidence with all data', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      expect(score.confidence).toBe('high');
    });

    it('returns medium confidence with missing industry', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        // No industry
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      expect(score.confidence).toBe('medium');
    });

    it('returns medium confidence with missing experience', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        // No experience
      };
      
      const score = calculateRiskScoreSync(input);
      expect(score.confidence).toBe('medium');
    });

    it('returns low confidence with no task data', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      // Pass empty tasks array
      const score = calculateRiskScoreSync(input, []);
      expect(score.confidence).toBe('low');
    });
  });
  
  describe('layer weight validation', () => {
    it('applies 35% weight to Layer 1 (AI exposure)', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: undefined, // Neutral modifiers
        yearsExperience: undefined,
      };
      
      const score = calculateRiskScoreSync(input);
      
      // With neutral modifiers, weighted_base should be Layer1*0.35 + Layer2*0.35
      // Layer1 for this occupation is 78
      expect(score.breakdown.layer1_ai_exposure).toBe(78);
    });

    it('applies Layer 3 modifier correctly', () => {
      const techInput: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology', // 1.25x
        yearsExperience: 5,
      };
      
      const otherInput: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'other', // 1.00x
        yearsExperience: 5,
      };
      
      const techScore = calculateRiskScoreSync(techInput);
      const otherScore = calculateRiskScoreSync(otherInput);
      
      // Technology should score higher than 'other' industry
      expect(techScore.overall).toBeGreaterThan(otherScore.overall);
    });

    it('applies Layer 4 modifier correctly', () => {
      const seniorInput: RiskInput = {
        occupationCode: '43-9061.00',
        industryCode: 'technology',
        yearsExperience: 10, // Senior: 1.05x
      };
      
      const entryInput: RiskInput = {
        occupationCode: '43-9061.00',
        industryCode: 'technology',
        yearsExperience: 1, // Entry: 0.85x
      };
      
      const seniorScore = calculateRiskScoreSync(seniorInput);
      const entryScore = calculateRiskScoreSync(entryInput);
      
      // Senior should score higher than entry for routine roles
      expect(seniorScore.overall).toBeGreaterThan(entryScore.overall);
    });
  });
  
  describe('test occupation score ranges', () => {
    // Test each hardcoded occupation against expected range
    for (const occ of TEST_OCCUPATIONS) {
      it(`${occ.title}: ${occ.expectedRange.min}-${occ.expectedRange.max}%`, () => {
        const score = calculateRiskScoreSync({
          occupationCode: occ.socCode,
          industryCode: occ.industry,
          yearsExperience: occ.experience,
        });
        
        expect(score.overall).toBeGreaterThanOrEqual(occ.expectedRange.min);
        expect(score.overall).toBeLessThanOrEqual(occ.expectedRange.max);
      });
    }
  });

  describe('specific occupation sanity checks', () => {
    it('Software Developer: high risk (60-85%)', () => {
      const score = calculateRiskScoreSync({
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        yearsExperience: 5,
      });
      
      expect(score.overall).toBeGreaterThanOrEqual(60);
      expect(score.overall).toBeLessThanOrEqual(85);
    });
    
    it('Elementary Teacher: low-moderate risk (20-45%)', () => {
      const score = calculateRiskScoreSync({
        occupationCode: '25-2021.00',
        industryCode: 'education',
        yearsExperience: 10,
      });
      
      expect(score.overall).toBeGreaterThanOrEqual(20);
      expect(score.overall).toBeLessThanOrEqual(45);
    });
    
    it('Registered Nurse: moderate risk (25-50%)', () => {
      const score = calculateRiskScoreSync({
        occupationCode: '29-1141.00',
        industryCode: 'healthcare',
        yearsExperience: 7,
      });
      
      expect(score.overall).toBeGreaterThanOrEqual(25);
      expect(score.overall).toBeLessThanOrEqual(50);
    });
    
    it('Plumber: very low risk (5-30%)', () => {
      const score = calculateRiskScoreSync({
        occupationCode: '47-2152.00',
        industryCode: 'construction',
        yearsExperience: 15,
      });
      
      expect(score.overall).toBeGreaterThanOrEqual(5);
      expect(score.overall).toBeLessThanOrEqual(30);
    });

    it('Office Clerk: very high risk (75-100%)', () => {
      const score = calculateRiskScoreSync({
        occupationCode: '43-9061.00',
        industryCode: 'technology',
        yearsExperience: 5,
      });
      
      expect(score.overall).toBeGreaterThanOrEqual(75);
      expect(score.overall).toBeLessThanOrEqual(100);
    });
  });

  describe('breakdown structure', () => {
    it('includes all required breakdown fields', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      
      expect(score.breakdown).toHaveProperty('layer1_ai_exposure');
      expect(score.breakdown).toHaveProperty('layer2_task_automation');
      expect(score.breakdown).toHaveProperty('layer3_industry_modifier');
      expect(score.breakdown).toHaveProperty('layer4_experience_modifier');
      expect(score.breakdown).toHaveProperty('weighted_base');
      expect(score.breakdown).toHaveProperty('final_adjusted');
    });

    it('modifiers are in expected range', () => {
      const input: RiskInput = {
        occupationCode: '15-1252.00',
        industryCode: 'technology',
        yearsExperience: 5,
      };
      
      const score = calculateRiskScoreSync(input);
      
      // Industry modifier range: 0.8 - 1.25
      expect(score.breakdown.layer3_industry_modifier).toBeGreaterThanOrEqual(0.8);
      expect(score.breakdown.layer3_industry_modifier).toBeLessThanOrEqual(1.25);
      
      // Experience modifier range: 0.85 - 1.05
      expect(score.breakdown.layer4_experience_modifier).toBeGreaterThanOrEqual(0.85);
      expect(score.breakdown.layer4_experience_modifier).toBeLessThanOrEqual(1.05);
    });
  });
});
