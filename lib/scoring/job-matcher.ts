/**
 * Job Title Matcher
 * 
 * Fuzzy matching engine to map user-entered job titles to O*NET occupations.
 * Handles typos, variants, informal titles, and company-specific role names.
 * 
 * Returns 3-5 matches with confidence scores to allow user disambiguation
 * (avoids the "Job Title Mapping Hell" pitfall from PITFALLS.md)
 */

import type { OnetOccupation } from '@/lib/data/types';
import type { JobMatch } from './types';
import { loadOccupations } from '@/lib/data/onet-loader';
import { JOB_MATCH_AUTO_SELECT_THRESHOLD, JOB_MATCH_MIN_THRESHOLD } from './config';

/**
 * Calculate Levenshtein distance between two strings
 * Measures minimum number of edits (insertions, deletions, substitutions)
 * needed to transform one string into another
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  // Initialize first column and row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calculate similarity score (0-1) between two strings
 * Uses multiple heuristics for better matching
 */
function calculateSimilarity(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  
  // Exact match = perfect score
  if (q === t) return 1.0;
  
  // One string fully contains the other = high score
  if (t.includes(q)) return 0.90;
  if (q.includes(t)) return 0.85;
  
  // Word-level matching for multi-word queries
  const qWords = q.split(/\s+/);
  const tWords = t.split(/\s+/);
  
  // Count how many query words appear in target
  let wordMatches = 0;
  for (const qWord of qWords) {
    if (tWords.some(tWord => tWord.includes(qWord) || qWord.includes(tWord))) {
      wordMatches++;
    }
  }
  
  // If most words match, give high score
  if (qWords.length > 1 && wordMatches >= qWords.length * 0.7) {
    return 0.75 + (wordMatches / qWords.length) * 0.15;
  }
  
  // Levenshtein-based similarity for single words or poor word matches
  const distance = levenshteinDistance(q, t);
  const maxLength = Math.max(q.length, t.length);
  
  // Avoid division by zero
  if (maxLength === 0) return 0;
  
  return Math.max(0, 1 - (distance / maxLength));
}

/**
 * Find matching O*NET occupations for a job title
 * Returns up to maxResults matches sorted by confidence
 * 
 * @param jobTitle - User-entered job title
 * @param maxResults - Maximum number of matches to return (default: 5)
 * @returns Array of job matches with confidence scores
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
    let bestConfidence = calculateSimilarity(jobTitle, occ.title);
    
    // Also check alternate titles if available
    if (occ.alternateTitles && occ.alternateTitles.length > 0) {
      for (const altTitle of occ.alternateTitles) {
        const altScore = calculateSimilarity(jobTitle, altTitle);
        if (altScore > bestConfidence) {
          bestConfidence = altScore;
        }
      }
    }
    
    // Only keep matches above minimum threshold
    if (bestConfidence >= JOB_MATCH_MIN_THRESHOLD) {
      scored.push({ occupation: occ, confidence: bestConfidence });
    }
  }
  
  // Sort by confidence descending
  scored.sort((a, b) => b.confidence - a.confidence);
  
  // Return top N matches
  return scored.slice(0, maxResults).map(({ occupation, confidence }) => ({
    socCode: occupation.socCode,
    title: occupation.title,
    description: occupation.description,
    confidence: Math.round(confidence * 100) / 100, // Round to 2 decimal places
    alternateTitles: occupation.alternateTitles,
  }));
}

/**
 * Get single best match for automatic selection
 * Only returns match if confidence exceeds auto-select threshold (0.8)
 * Otherwise returns null to trigger user disambiguation
 * 
 * @param jobTitle - User-entered job title
 * @returns Best match if confident, null otherwise
 */
export async function getBestMatch(jobTitle: string): Promise<JobMatch | null> {
  const matches = await findJobMatches(jobTitle, 1);
  
  if (matches.length > 0 && matches[0].confidence >= JOB_MATCH_AUTO_SELECT_THRESHOLD) {
    return matches[0];
  }
  
  return null; // Requires user disambiguation
}

/**
 * Synchronous version for testing with mocked occupation data
 * 
 * @param jobTitle - User-entered job title
 * @param occupations - Mock occupation array for testing
 * @param maxResults - Maximum number of matches to return
 * @returns Array of job matches
 */
export function findJobMatchesSync(
  jobTitle: string,
  occupations: OnetOccupation[],
  maxResults: number = 5
): JobMatch[] {
  const scored: Array<{
    occupation: OnetOccupation;
    confidence: number;
  }> = [];
  
  for (const occ of occupations) {
    let bestConfidence = calculateSimilarity(jobTitle, occ.title);
    
    if (occ.alternateTitles && occ.alternateTitles.length > 0) {
      for (const altTitle of occ.alternateTitles) {
        const altScore = calculateSimilarity(jobTitle, altTitle);
        if (altScore > bestConfidence) {
          bestConfidence = altScore;
        }
      }
    }
    
    if (bestConfidence >= JOB_MATCH_MIN_THRESHOLD) {
      scored.push({ occupation: occ, confidence: bestConfidence });
    }
  }
  
  scored.sort((a, b) => b.confidence - a.confidence);
  
  return scored.slice(0, maxResults).map(({ occupation, confidence }) => ({
    socCode: occupation.socCode,
    title: occupation.title,
    description: occupation.description,
    confidence: Math.round(confidence * 100) / 100,
    alternateTitles: occupation.alternateTitles,
  }));
}
