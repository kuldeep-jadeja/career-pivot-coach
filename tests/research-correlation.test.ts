/**
 * Research Correlation Validation
 * 
 * Purpose: Validate that our risk scores correlate strongly (r > 0.7)
 * with published AI exposure research from Eloundou et al. (2023)
 */

import { describe, it, expect } from 'vitest';
import { calculateRiskScoreSync } from '@/lib/scoring/risk-calculator';
import { AI_EXPOSURE_SCORES } from '@/lib/data/research-scores';

/**
 * Calculate Pearson correlation coefficient
 * Measures linear correlation between two variables (-1 to 1)
 * r > 0.7 indicates strong positive correlation
 */
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const sumY2 = y.reduce((acc, yi) => acc + yi * yi, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
  );
  
  return numerator / denominator;
}

describe('Research Correlation', () => {
  it('correlates with published AI exposure research (r > 0.7)', () => {
    const ourScores: number[] = [];
    const researchScores: number[] = [];
    const occupationDetails: Array<{
      code: string;
      ourScore: number;
      researchScore: number;
      diff: number;
    }> = [];
    
    // Compare our scores against research baseline for all occupations
    // Exclude the '_default' entry
    for (const [socCode, researchScore] of Object.entries(AI_EXPOSURE_SCORES)) {
      if (socCode === '_default') continue;
      
      const ourScore = calculateRiskScoreSync({
        occupationCode: socCode,
        industryCode: 'other',
        yearsExperience: 5,
      });
      
      ourScores.push(ourScore.overall);
      researchScores.push(researchScore);
      
      occupationDetails.push({
        code: socCode,
        ourScore: ourScore.overall,
        researchScore,
        diff: Math.abs(ourScore.overall - researchScore),
      });
    }
    
    const correlation = pearsonCorrelation(ourScores, researchScores);
    
    console.log('\n=== Research Correlation Analysis ===');
    console.log(`Pearson correlation: ${correlation.toFixed(3)}`);
    console.log(`Occupations compared: ${ourScores.length}`);
    console.log(`Target: r > 0.70 (strong positive correlation)\n`);
    
    // Show top 5 largest differences
    const sorted = occupationDetails.sort((a, b) => b.diff - a.diff);
    console.log('Top 5 largest differences:');
    sorted.slice(0, 5).forEach(o => {
      console.log(`  ${o.code}: Our=${o.ourScore}%, Research=${o.researchScore}%, Diff=${o.diff.toFixed(1)}%`);
    });
    console.log();
    
    // Calculate average absolute difference
    const avgDiff = occupationDetails.reduce((sum, o) => sum + o.diff, 0) / occupationDetails.length;
    console.log(`Average absolute difference: ${avgDiff.toFixed(1)}%`);
    console.log();
    
    // Expect correlation > 0.7 (strong positive correlation)
    expect(correlation, 
      `Correlation too low: ${correlation.toFixed(3)}. Need r > 0.70 to validate against research.`
    ).toBeGreaterThan(0.7);
  });
  
  it('average absolute difference from research is < 20%', () => {
    const differences: number[] = [];
    
    for (const [socCode, researchScore] of Object.entries(AI_EXPOSURE_SCORES)) {
      if (socCode === '_default') continue;
      
      const ourScore = calculateRiskScoreSync({
        occupationCode: socCode,
        industryCode: 'other',
        yearsExperience: 5,
      });
      
      differences.push(Math.abs(ourScore.overall - researchScore));
    }
    
    const avgDiff = differences.reduce((sum, d) => sum + d, 0) / differences.length;
    
    // Expect average difference < 20% (reasonable deviation given additional layers)
    expect(avgDiff,
      `Average difference ${avgDiff.toFixed(1)}% too high. Our scores should stay reasonably close to research baseline.`
    ).toBeLessThan(20);
  });
});
