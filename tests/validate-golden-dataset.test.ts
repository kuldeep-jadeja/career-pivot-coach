/**
 * Golden Dataset Validation Tests
 * 
 * Purpose: Validate that our risk scoring algorithm produces expected results
 * across 50+ occupations spanning all categories and risk bands.
 */

import { describe, it, expect } from 'vitest';
import { calculateRiskScoreSync } from '@/lib/scoring/risk-calculator';
import goldenDataset from './golden-dataset.json';

// Validate dataset completeness first
describe('Golden Dataset Completeness', () => {
  it('contains minimum 50 occupations', () => {
    expect(goldenDataset.occupations.length).toBeGreaterThanOrEqual(50);
  });
  
  it('has minimum 8 occupations per core category', () => {
    const categories = ['tech', 'healthcare', 'trades', 'creative', 'management', 'service'];
    for (const cat of categories) {
      const count = goldenDataset.occupations.filter(o => o.category === cat).length;
      expect(count, `Category "${cat}" needs 8+ occupations, has ${count}`).toBeGreaterThanOrEqual(8);
    }
  });
  
  it('has minimum 10 occupations per risk band', () => {
    const bands = [
      { name: 'Low (0-20%)', min: 0, max: 20 },
      { name: 'Moderate (21-40%)', min: 21, max: 40 },
      { name: 'Elevated (41-60%)', min: 41, max: 60 },
      { name: 'High (61-80%)', min: 61, max: 80 },
      { name: 'Very High (81-100%)', min: 81, max: 100 },
    ];
    
    for (const band of bands) {
      const count = goldenDataset.occupations.filter(o => 
        o.expectedRange.min >= band.min - 10 && o.expectedRange.max <= band.max + 10
      ).length;
      expect(count, `Risk band "${band.name}" needs 10+ occupations, has ${count}`).toBeGreaterThanOrEqual(10);
    }
  });
  
  it('each occupation has expected score range and written rationale', () => {
    for (const occ of goldenDataset.occupations) {
      expect(occ.expectedRange, `${occ.title} missing expectedRange`).toBeDefined();
      expect(occ.expectedRange.min, `${occ.title} missing min`).toBeDefined();
      expect(occ.expectedRange.max, `${occ.title} missing max`).toBeDefined();
      expect(occ.rationale, `${occ.title} missing rationale`).toBeDefined();
      expect(occ.rationale.length, `${occ.title} rationale too short`).toBeGreaterThan(20);
    }
  });
});

describe('Golden Dataset Validation', () => {
  const failures: Array<{
    title: string;
    socCode: string;
    expected: { min: number; max: number };
    actual: number;
  }> = [];

  for (const occupation of goldenDataset.occupations) {
    it(`${occupation.title} (${occupation.socCode}) scores within expected range`, () => {
      const score = calculateRiskScoreSync({
        occupationCode: occupation.socCode,
        industryCode: occupation.category,
        yearsExperience: 5, // Standard mid-career
      });
      
      const withinRange = 
        score.overall >= occupation.expectedRange.min &&
        score.overall <= occupation.expectedRange.max;

      if (!withinRange) {
        failures.push({
          title: occupation.title,
          socCode: occupation.socCode,
          expected: occupation.expectedRange,
          actual: score.overall,
        });
      }

      expect(score.overall, 
        `${occupation.title}: Expected ${occupation.expectedRange.min}-${occupation.expectedRange.max}%, got ${score.overall}%`
      ).toBeGreaterThanOrEqual(occupation.expectedRange.min);
      
      expect(score.overall,
        `${occupation.title}: Expected ${occupation.expectedRange.min}-${occupation.expectedRange.max}%, got ${score.overall}%`
      ).toBeLessThanOrEqual(occupation.expectedRange.max);
    });
  }

  // After all tests, log summary if there were failures
  if (failures.length > 0) {
    console.log('\n=== Golden Dataset Validation Failures ===');
    console.log(`Failed: ${failures.length}/${goldenDataset.occupations.length} occupations\n`);
    failures.forEach(f => {
      console.log(`${f.title} (${f.socCode})`);
      console.log(`  Expected: ${f.expected.min}-${f.expected.max}%`);
      console.log(`  Actual: ${f.actual}%`);
      console.log();
    });
  }
});
