/**
 * Layer Function Unit Tests
 * 
 * Tests individual scoring layers in isolation.
 */

import { describe, it, expect } from 'vitest';
import { calculateAIExposure, getExposureDescription } from '../layers/layer1-ai-exposure';
import { calculateTaskAutomation, getTaskBreakdown, explainTaskScore } from '../layers/layer2-task-automation';
import { calculateIndustryModifier, getIndustryLabel, explainIndustryModifier } from '../layers/layer3-industry-speed';
import { calculateExperienceModifier, getExperienceLevel, explainExperienceModifier } from '../layers/layer4-experience-level';
import type { OnetTask } from '@/lib/data/types';

describe('Layer 1: AI Exposure', () => {
  describe('calculateAIExposure', () => {
    it('returns exact match score for known occupation', () => {
      const score = calculateAIExposure('15-1252.00'); // Software Developer
      expect(score).toBe(78);
    });

    it('returns family average for unknown specific occupation', () => {
      const score = calculateAIExposure('15-1299.99'); // Unknown in software family
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('returns default for completely unknown occupation', () => {
      const score = calculateAIExposure('99-9999.00');
      expect(score).toBe(50); // Default score
    });

    it('handles all test occupations', () => {
      const testCodes = [
        '15-1252.00', // Software Developer
        '29-1141.00', // Nurse
        '47-2152.00', // Plumber
        '43-9061.00', // Office Clerk
      ];
      
      for (const code of testCodes) {
        const score = calculateAIExposure(code);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('getExposureDescription', () => {
    it('provides description for high exposure occupation', () => {
      const desc = getExposureDescription('43-9061.00'); // Office Clerk (88)
      expect(desc).toContain('Very High');
    });

    it('provides description for low exposure occupation', () => {
      const desc = getExposureDescription('47-2152.00'); // Plumber (12)
      expect(desc).toContain('Very Low');
    });
  });
});

describe('Layer 2: Task Automation', () => {
  const mockTasks: OnetTask[] = [
    {
      socCode: '43-9061.00',
      taskId: 'T1',
      description: 'Collect, count, and disburse money, do basic bookkeeping, and complete banking transactions.',
    },
    {
      socCode: '43-9061.00',
      taskId: 'T2',
      description: 'Maintain and update filing, inventory, mailing, and database systems.',
    },
    {
      socCode: '29-1141.00',
      taskId: 'T3',
      description: 'Monitor, record, and report symptoms or changes in patients\' conditions.',
    },
    {
      socCode: '29-1141.00',
      taskId: 'T4',
      description: 'Counsel and educate patients and their families on health issues.',
    },
  ];

  describe('calculateTaskAutomation', () => {
    it('scores high-automation tasks correctly', () => {
      const highAutoTasks = mockTasks.filter(t => t.socCode === '43-9061.00');
      const score = calculateTaskAutomation(highAutoTasks);
      
      expect(score).toBeGreaterThan(50); // Should be above neutral
    });

    it('scores low-automation tasks correctly', () => {
      const lowAutoTasks = mockTasks.filter(t => t.socCode === '29-1141.00');
      const score = calculateTaskAutomation(lowAutoTasks);
      
      // Counseling and education should score lower
      expect(score).toBeLessThan(70);
    });

    it('returns 50 for empty task array', () => {
      const score = calculateTaskAutomation([]);
      expect(score).toBe(50);
    });

    it('filters to selected tasks when provided', () => {
      const score1 = calculateTaskAutomation(mockTasks, ['T1', 'T2']);
      const score2 = calculateTaskAutomation(mockTasks, ['T3', 'T4']);
      
      // T1, T2 are high automation, T3, T4 are low
      expect(score1).toBeGreaterThan(score2);
    });

    it('returns 50 if selected tasks filter to nothing', () => {
      const score = calculateTaskAutomation(mockTasks, ['INVALID']);
      expect(score).toBe(50);
    });

    it('always returns 0-100', () => {
      const score = calculateTaskAutomation(mockTasks);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getTaskBreakdown', () => {
    it('categorizes tasks into risk levels', () => {
      const breakdown = getTaskBreakdown(mockTasks);
      
      expect(breakdown).toHaveProperty('high_risk');
      expect(breakdown).toHaveProperty('medium_risk');
      expect(breakdown).toHaveProperty('low_risk');
      
      const totalTasks = breakdown.high_risk.length + breakdown.medium_risk.length + breakdown.low_risk.length;
      expect(totalTasks).toBe(mockTasks.length);
    });

    it('puts routine tasks in high risk category', () => {
      const routineTask: OnetTask = {
        socCode: '43-9061.00',
        taskId: 'T5',
        description: 'Process data entry forms and maintain records.',
      };
      
      const breakdown = getTaskBreakdown([routineTask]);
      expect(breakdown.high_risk.length).toBeGreaterThan(0);
    });
  });

  describe('explainTaskScore', () => {
    it('identifies high-automation keywords', () => {
      const explanation = explainTaskScore('Maintain and update filing systems.');
      
      expect(explanation.highAutomationMatches.length).toBeGreaterThan(0);
      expect(explanation.highAutomationMatches).toContain('maintain records');
    });

    it('identifies low-automation keywords', () => {
      const explanation = explainTaskScore('Counsel patients and provide emotional support.');
      
      expect(explanation.lowAutomationMatches.length).toBeGreaterThan(0);
      expect(explanation.lowAutomationMatches).toContain('counsel');
    });

    it('returns score matching calculateTaskAutomation', () => {
      const description = 'Process data and file records.';
      const explanation = explainTaskScore(description);
      
      const mockTask: OnetTask = {
        socCode: '00-0000.00',
        taskId: 'T',
        description,
      };
      
      const taskScore = calculateTaskAutomation([mockTask]);
      expect(explanation.score).toBe(taskScore);
    });
  });
});

describe('Layer 3: Industry Speed', () => {
  describe('calculateIndustryModifier', () => {
    it('returns 1.25 for technology industry', () => {
      const modifier = calculateIndustryModifier('technology');
      expect(modifier).toBe(1.25);
    });

    it('returns 0.80 for hospitality industry', () => {
      const modifier = calculateIndustryModifier('hospitality');
      expect(modifier).toBe(0.80);
    });

    it('returns 1.0 for unknown industry', () => {
      const modifier = calculateIndustryModifier('unknown-industry');
      expect(modifier).toBe(1.0);
    });

    it('returns 1.0 for undefined industry', () => {
      const modifier = calculateIndustryModifier(undefined);
      expect(modifier).toBe(1.0);
    });

    it('is case-insensitive', () => {
      const modifier1 = calculateIndustryModifier('TECHNOLOGY');
      const modifier2 = calculateIndustryModifier('technology');
      expect(modifier1).toBe(modifier2);
    });

    it('handles whitespace', () => {
      const modifier = calculateIndustryModifier('  technology  ');
      expect(modifier).toBe(1.25);
    });

    it('returns values in expected range', () => {
      const industries = ['technology', 'finance', 'healthcare', 'hospitality'];
      
      for (const industry of industries) {
        const modifier = calculateIndustryModifier(industry);
        expect(modifier).toBeGreaterThanOrEqual(0.8);
        expect(modifier).toBeLessThanOrEqual(1.25);
      }
    });
  });

  describe('getIndustryLabel', () => {
    it('returns descriptive label for technology', () => {
      const label = getIndustryLabel('technology');
      expect(label).toContain('Technology');
      expect(label).toContain('fastest');
    });

    it('returns descriptive label for hospitality', () => {
      const label = getIndustryLabel('hospitality');
      expect(label).toContain('Hospitality');
      expect(label).toContain('slowest');
    });

    it('returns unknown label for undefined', () => {
      const label = getIndustryLabel(undefined);
      expect(label).toContain('Unknown');
    });
  });

  describe('explainIndustryModifier', () => {
    it('provides complete explanation object', () => {
      const explanation = explainIndustryModifier('technology');
      
      expect(explanation).toHaveProperty('multiplier');
      expect(explanation).toHaveProperty('label');
      expect(explanation).toHaveProperty('reasoning');
      
      expect(explanation.multiplier).toBe(1.25);
      expect(explanation.reasoning.length).toBeGreaterThan(0);
    });
  });
});

describe('Layer 4: Experience Level', () => {
  describe('calculateExperienceModifier', () => {
    it('returns 0.85 for entry level (0-2 years)', () => {
      expect(calculateExperienceModifier(0)).toBe(0.85);
      expect(calculateExperienceModifier(2)).toBe(0.85);
    });

    it('returns 1.0 for mid level (3-7 years)', () => {
      expect(calculateExperienceModifier(3)).toBe(1.0);
      expect(calculateExperienceModifier(5)).toBe(1.0);
      expect(calculateExperienceModifier(7)).toBe(1.0);
    });

    it('returns 1.05 for senior level (8-15 years)', () => {
      expect(calculateExperienceModifier(8)).toBe(1.05);
      expect(calculateExperienceModifier(10)).toBe(1.05);
      expect(calculateExperienceModifier(15)).toBe(1.05);
    });

    it('returns 0.90 for executive level (15+ years)', () => {
      expect(calculateExperienceModifier(16)).toBe(0.90);
      expect(calculateExperienceModifier(20)).toBe(0.90);
      expect(calculateExperienceModifier(30)).toBe(0.90);
    });

    it('returns 1.0 for undefined experience', () => {
      expect(calculateExperienceModifier(undefined)).toBe(1.0);
      expect(calculateExperienceModifier(null as any)).toBe(1.0);
    });

    it('returns values in expected range', () => {
      const experiences = [0, 2, 5, 10, 15, 20];
      
      for (const exp of experiences) {
        const modifier = calculateExperienceModifier(exp);
        expect(modifier).toBeGreaterThanOrEqual(0.85);
        expect(modifier).toBeLessThanOrEqual(1.05);
      }
    });
  });

  describe('getExperienceLevel', () => {
    it('returns entry level label for 0-2 years', () => {
      const label = getExperienceLevel(1);
      expect(label).toContain('Entry Level');
      expect(label).toContain('0-2');
    });

    it('returns mid level label for 3-7 years', () => {
      const label = getExperienceLevel(5);
      expect(label).toContain('Mid Level');
      expect(label).toContain('3-7');
    });

    it('returns senior level label for 8-15 years', () => {
      const label = getExperienceLevel(10);
      expect(label).toContain('Senior Level');
      expect(label).toContain('8-15');
    });

    it('returns executive level label for 15+ years', () => {
      const label = getExperienceLevel(20);
      expect(label).toContain('Executive Level');
      expect(label).toContain('15+');
    });

    it('returns unknown label for undefined', () => {
      const label = getExperienceLevel(undefined);
      expect(label).toContain('Unknown');
    });
  });

  describe('explainExperienceModifier', () => {
    it('provides complete explanation object', () => {
      const explanation = explainExperienceModifier(10);
      
      expect(explanation).toHaveProperty('multiplier');
      expect(explanation).toHaveProperty('level');
      expect(explanation).toHaveProperty('reasoning');
      
      expect(explanation.multiplier).toBe(1.05);
      expect(explanation.level).toContain('Senior');
      expect(explanation.reasoning.length).toBeGreaterThan(0);
    });

    it('explains entry level advantage', () => {
      const explanation = explainExperienceModifier(1);
      expect(explanation.reasoning.toLowerCase()).toContain('adaptable');
    });

    it('explains senior level risk', () => {
      const explanation = explainExperienceModifier(10);
      expect(explanation.reasoning.toLowerCase()).toContain('specialization');
    });
  });
});
