/**
 * Data Freshness Banner
 * 
 * Displays prominent banner when data is aging or stale.
 * Shows on assessment results page.
 */

import { Alert, AlertDescription, AlertTitle } from '@/app/_components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import type { DataFreshnessLevel } from '@/lib/data/types';
import {
  calculateFreshness,
  getDatasetFreshnessMessage,
  getRecommendedAction,
} from '@/lib/data/freshness';

interface DataFreshnessBannerProps {
  releaseDate: string;
  showAlways?: boolean; // Show even for fresh data
}

export function DataFreshnessBanner({
  releaseDate,
  showAlways = false,
}: DataFreshnessBannerProps) {
  const level = calculateFreshness(releaseDate);
  const message = getDatasetFreshnessMessage(releaseDate);
  const action = getRecommendedAction(level);

  // Only show for aging/stale data unless showAlways is true
  if (level === 'fresh' && !showAlways) {
    return null;
  }

  const variant = level === 'stale' ? 'destructive' : 'default';
  const Icon = level === 'stale' ? AlertTriangle : Info;

  return (
    <Alert variant={variant} className="mb-6">
      <Icon className="h-4 w-4" />
      <AlertTitle>Data Freshness Notice</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{message}</p>
        {action && <p className="font-medium">{action}</p>}
      </AlertDescription>
    </Alert>
  );
}
