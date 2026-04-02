import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

import { Badge } from '@/app/_components/ui/badge';
import { Card, CardContent } from '@/app/_components/ui/card';

interface DataFreshnessProps {
  version: string;
  releaseDate: string;
  downloadDate: string;
  freshnessLevel: 'fresh' | 'aging' | 'stale';
}

const FRESHNESS_CONFIG = {
  fresh: {
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    label: 'Current',
    description: 'Using the latest O*NET data release',
  },
  aging: {
    icon: Clock,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    label: 'Update Available',
    description: 'A newer O*NET version may be available',
  },
  stale: {
    icon: AlertCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    label: 'Outdated',
    description: 'This data may not reflect recent changes',
  },
} as const;

export function DataFreshness({
  version,
  releaseDate,
  downloadDate,
  freshnessLevel,
}: DataFreshnessProps) {
  const config = FRESHNESS_CONFIG[freshnessLevel];
  const Icon = config.icon;

  return (
    <Card className={config.bgColor}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.color}`} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">O*NET Database</span>
              <Badge variant="outline">v{version}</Badge>
              <Badge variant={freshnessLevel === 'fresh' ? 'default' : 'secondary'}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{config.description}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Released: {releaseDate}</p>
              <p>Last updated: {downloadDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
