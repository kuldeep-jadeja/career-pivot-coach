'use client';

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { LayerBreakdown as LayerBreakdownType } from '@/lib/scoring/types';
import { cn } from '@/lib/utils';

interface LayerBreakdownProps {
  breakdown: LayerBreakdownType;
  className?: string;
}

const LAYER_CONFIG = [
  {
    key: 'layer1_ai_exposure',
    name: 'AI Exposure',
    color: '#3b82f6',
    description: 'Research-based AI capability overlap with occupation tasks',
  },
  {
    key: 'layer2_task_automation',
    name: 'Task Automation',
    color: '#a855f7',
    description: 'Percentage of core tasks automatable by current AI',
  },
  {
    key: 'layer3_industry_modifier',
    name: 'Industry Speed',
    color: '#f97316',
    description: 'Industry adoption pace modifier (0.8-1.25x)',
  },
  {
    key: 'layer4_experience_modifier',
    name: 'Experience Factor',
    color: '#22c55e',
    description: 'Experience-based resilience modifier (0.85-1.05x)',
  },
] as const;

function toChartValue(key: string, value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (key.includes('modifier')) return Math.round(value * 100);
  return Math.round(value);
}

export function LayerBreakdown({ breakdown, className }: LayerBreakdownProps) {
  const data = LAYER_CONFIG.map((layer) => {
    const rawValue = Number(breakdown[layer.key as keyof LayerBreakdownType] ?? 0);
    return {
      name: layer.name,
      value: toChartValue(layer.key, rawValue),
      color: layer.color,
      description: layer.description,
      isModifier: layer.key.includes('modifier'),
      rawValue,
    };
  });

  return (
    <div className={cn('w-full', className)}>
      <h3 className="mb-4 text-lg font-semibold">Risk Score Breakdown</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
          <XAxis type="number" domain={[0, 125]} hide />
          <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 14 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const item = payload[0].payload as (typeof data)[number];
              return (
                <div className="max-w-xs rounded-lg border bg-background p-3 shadow-lg">
                  <div className="font-semibold">{item.name}</div>
                  <div className="my-1 text-2xl font-bold">
                    {item.isModifier ? `${item.rawValue.toFixed(2)}x` : `${item.value}%`}
                  </div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>
              {item.isModifier ? `${item.rawValue.toFixed(2)}x` : `${item.value}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

