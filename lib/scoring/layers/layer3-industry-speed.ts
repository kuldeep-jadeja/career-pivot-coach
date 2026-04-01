/**
 * Layer 3: Industry Adoption Speed Modifier
 * 
 * Adjusts risk score based on how quickly different industry sectors
 * are adopting AI technologies.
 * 
 * Technology and finance sectors have fastest adoption (higher risk multiplier).
 * Hospitality and construction have slower adoption (lower risk multiplier).
 */

import { INDUSTRY_MULTIPLIERS } from '../config';

/**
 * Calculate industry adoption speed modifier
 * 
 * @param industryCode - Industry sector code (lowercase, e.g., "technology", "healthcare")
 * @returns Multiplier value (0.8 - 1.25)
 */
export function calculateIndustryModifier(industryCode?: string): number {
  if (!industryCode) {
    return 1.0; // Neutral default if industry unknown
  }
  
  const normalizedCode = industryCode.toLowerCase().trim();
  return INDUSTRY_MULTIPLIERS[normalizedCode] ?? INDUSTRY_MULTIPLIERS['other'];
}

/**
 * Get human-readable label for industry adoption speed
 * 
 * @param industryCode - Industry sector code
 * @returns Descriptive label with adoption speed
 */
export function getIndustryLabel(industryCode?: string): string {
  if (!industryCode) {
    return 'Unknown Industry (average AI adoption)';
  }
  
  const normalizedCode = industryCode.toLowerCase().trim();
  
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
  
  return labels[normalizedCode] ?? 'Industry (average AI adoption)';
}

/**
 * Get detailed explanation of industry modifier
 * 
 * @param industryCode - Industry sector code
 * @returns Object with multiplier and reasoning
 */
export function explainIndustryModifier(industryCode?: string): {
  multiplier: number;
  label: string;
  reasoning: string;
} {
  const multiplier = calculateIndustryModifier(industryCode);
  const label = getIndustryLabel(industryCode);
  
  let reasoning = '';
  
  if (multiplier >= 1.2) {
    reasoning = 'This industry is rapidly adopting AI tools, increasing automation risk in the near term.';
  } else if (multiplier >= 1.05) {
    reasoning = 'This industry is adopting AI at a moderate pace, with growing automation potential.';
  } else if (multiplier >= 0.95) {
    reasoning = 'This industry has average AI adoption rates, neither accelerating nor slowing automation risk.';
  } else if (multiplier >= 0.85) {
    reasoning = 'This industry is slower to adopt AI due to regulatory, physical, or cultural factors.';
  } else {
    reasoning = 'This industry faces significant barriers to AI adoption, reducing near-term automation risk.';
  }
  
  return { multiplier, label, reasoning };
}
