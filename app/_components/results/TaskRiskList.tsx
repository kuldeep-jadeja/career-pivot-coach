'use client';

import { Badge } from '@/app/_components/ui/badge';
import { cn } from '@/lib/utils';

export interface TaskWithRisk {
  taskId: string;
  description: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  automationProbability: number;
}

interface TaskRiskListProps {
  tasks: TaskWithRisk[];
  className?: string;
}

const RISK_COLORS = {
  HIGH: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  MEDIUM: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  LOW: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
} as const;

export function TaskRiskList({ tasks, className }: TaskRiskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className={cn('py-8 text-center text-muted-foreground', className)}>
        No task data available for this occupation.
      </div>
    );
  }

  const sortedTasks = [...tasks].sort(
    (a, b) => b.automationProbability - a.automationProbability
  );

  return (
    <div className={cn('space-y-2', className)}>
      <h3 className="mb-4 text-lg font-semibold">Task-Level Risk Analysis</h3>
      <div className="max-h-[400px] space-y-2 overflow-y-auto">
        {sortedTasks.map((task) => (
          <div
            key={task.taskId}
            className="flex min-h-[44px] items-start gap-3 rounded-lg bg-muted/50 p-3"
          >
            <Badge className={cn('mt-0.5 shrink-0', RISK_COLORS[task.riskLevel])}>
              {task.riskLevel}
            </Badge>
            <span className="text-sm leading-relaxed">{task.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

