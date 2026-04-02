'use client';

import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';

import { cn } from '@/lib/utils';

interface RiskScoreGaugeProps {
  score: number;
  className?: string;
}

const SCORE_COLORS = {
  LOW: '#16a34a',
  MODERATE: '#ca8a04',
  ELEVATED: '#ea580c',
  HIGH: '#dc2626',
  VERY_HIGH: '#b91c1c',
} as const;

function getScoreColor(score: number): string {
  if (score <= 20) return SCORE_COLORS.LOW;
  if (score <= 40) return SCORE_COLORS.MODERATE;
  if (score <= 60) return SCORE_COLORS.ELEVATED;
  if (score <= 80) return SCORE_COLORS.HIGH;
  return SCORE_COLORS.VERY_HIGH;
}

function getRiskLabel(score: number): string {
  if (score <= 20) return 'Low Risk';
  if (score <= 40) return 'Moderate Risk';
  if (score <= 60) return 'Elevated Risk';
  if (score <= 80) return 'High Risk';
  return 'Very High Risk';
}

export function RiskScoreGauge({ score, className }: RiskScoreGaugeProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  const color = getScoreColor(safeScore);
  const data = [{ name: 'Risk', value: safeScore, fill: color }];

  return (
    <div
      className={cn(
        'relative mx-auto w-full max-w-[200px] md:max-w-[280px]',
        className
      )}
    >
      <div style={{ width: '100%', height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            barSize={24}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar background={{ fill: '#e5e7eb' }} dataKey="value" cornerRadius={12} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-5xl font-semibold md:text-7xl"
          style={{ color }}
          data-testid="score-value"
        >
          {safeScore}%
        </span>
        <span className="mt-1 text-sm text-muted-foreground" data-testid="risk-label">
          {getRiskLabel(safeScore)}
        </span>
      </div>
    </div>
  );
}
