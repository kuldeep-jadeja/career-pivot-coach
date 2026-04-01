/**
 * Confidence Badge
 * 
 * Visual indicator of data freshness/confidence for individual occupations.
 * Shows green/yellow/red dot with label.
 */

import {
  calculateFreshness,
  getFreshnessColor,
  getFreshnessLabel,
  getDataConfidenceScore,
} from '@/lib/data/freshness';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  lastModified?: string;
  showLabel?: boolean;
  showScore?: boolean;
  className?: string;
}

export function ConfidenceBadge({
  lastModified,
  showLabel = true,
  showScore = false,
  className,
}: ConfidenceBadgeProps) {
  const level = calculateFreshness(lastModified);
  const color = getFreshnessColor(level);
  const label = getFreshnessLabel(level);
  const score = getDataConfidenceScore(lastModified);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs',
        color,
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current" aria-hidden="true" />
      {showLabel && <span>{label}</span>}
      {showScore && <span className="font-medium">({score}% confidence)</span>}
    </span>
  );
}
