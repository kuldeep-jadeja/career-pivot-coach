/**
 * Data Freshness Utilities
 * 
 * Calculate and display data age/freshness for transparency.
 * Addresses the "Stale O*NET Data" critical pitfall from PITFALLS.md.
 */

import type { DataFreshnessLevel } from './types';
import { loadManifest } from './onet-loader';

/**
 * Calculate data freshness based on last modified date
 * 
 * Green (fresh): < 1 year old
 * Yellow (aging): 1-3 years old
 * Red (stale): 3+ years old
 * 
 * @param lastModified - ISO date string (e.g., "2023-01-15")
 * @returns Freshness level
 */
export function calculateFreshness(
  lastModified: string | undefined
): DataFreshnessLevel {
  if (!lastModified) return 'stale';

  const lastModifiedDate = new Date(lastModified);
  const now = new Date();
  const yearsOld =
    (now.getTime() - lastModifiedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

  if (yearsOld < 1) return 'fresh';
  if (yearsOld < 3) return 'aging';
  return 'stale';
}

/**
 * Get Tailwind color class for freshness level
 */
export function getFreshnessColor(level: DataFreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return 'text-green-600 dark:text-green-400';
    case 'aging':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'stale':
      return 'text-red-600 dark:text-red-400';
  }
}

/**
 * Get background color class for freshness level
 */
export function getFreshnessBgColor(level: DataFreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return 'bg-green-100 dark:bg-green-900/20';
    case 'aging':
      return 'bg-yellow-100 dark:bg-yellow-900/20';
    case 'stale':
      return 'bg-red-100 dark:bg-red-900/20';
  }
}

/**
 * Get human-readable label for freshness level
 */
export function getFreshnessLabel(level: DataFreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return 'Recently updated';
    case 'aging':
      return 'May be outdated';
    case 'stale':
      return 'Significantly outdated';
  }
}

/**
 * Get detailed description for freshness level
 */
export function getFreshnessDescription(level: DataFreshnessLevel): string {
  switch (level) {
    case 'fresh':
      return 'This data was updated within the last year and reflects current labor market conditions.';
    case 'aging':
      return 'This data is 1-3 years old. Labor market conditions may have changed since last update.';
    case 'stale':
      return 'This data is over 3 years old and may not reflect current labor market conditions. Use with caution.';
  }
}

/**
 * Get overall dataset freshness message from manifest
 * 
 * @param releaseDate - O*NET database release date
 * @returns Formatted message for UI display
 */
export function getDatasetFreshnessMessage(releaseDate: string): string {
  const date = new Date(releaseDate);
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  return `Based on O*NET data released ${formatted}`;
}

/**
 * Calculate days since last update
 */
export function getDaysSinceUpdate(lastModified: string): number {
  const lastModifiedDate = new Date(lastModified);
  const now = new Date();
  const diffTime = now.getTime() - lastModifiedDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format last update date for display
 */
export function formatLastUpdate(lastModified: string): string {
  const date = new Date(lastModified);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get confidence score based on data freshness
 * Returns percentage (0-100) where:
 * - Fresh data (< 1 year): 90-100%
 * - Aging data (1-3 years): 70-89%
 * - Stale data (3+ years): 50-69%
 * 
 * This provides a quantitative measure for risk score confidence.
 */
export function getDataConfidenceScore(
  lastModified: string | undefined
): number {
  const level = calculateFreshness(lastModified);

  switch (level) {
    case 'fresh':
      return 95; // High confidence
    case 'aging':
      return 80; // Medium confidence
    case 'stale':
      return 60; // Low confidence
  }
}

/**
 * Check if data needs update (aging or stale)
 */
export function needsDataUpdate(lastModified: string | undefined): boolean {
  const level = calculateFreshness(lastModified);
  return level === 'aging' || level === 'stale';
}

/**
 * Get recommended action message based on freshness
 */
export function getRecommendedAction(level: DataFreshnessLevel): string | null {
  switch (level) {
    case 'fresh':
      return null; // No action needed
    case 'aging':
      return 'Consider reviewing recent industry changes that may affect this assessment.';
    case 'stale':
      return 'We recommend supplementing this analysis with current industry research and job postings.';
  }
}

/**
 * Consolidated data freshness payload for legal/transparency pages.
 */
export async function getDataFreshness(): Promise<{
  version: string;
  releaseDate: string;
  downloadDate: string;
  freshnessLevel: DataFreshnessLevel;
}> {
  const manifest = await loadManifest();

  return {
    version: manifest.version,
    releaseDate: manifest.releaseDate,
    downloadDate: manifest.downloadDate,
    freshnessLevel: calculateFreshness(manifest.releaseDate),
  };
}
