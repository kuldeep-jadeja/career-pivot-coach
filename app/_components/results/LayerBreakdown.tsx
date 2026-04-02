'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { cn } from '@/lib/utils';
import type { LayerBreakdown as RiskLayerBreakdown } from '@/lib/scoring/types';

interface LayerBreakdownProps {
  breakdown: RiskLayerBreakdown;
  className?: string;
}

const layerData = (breakdown: RiskLayerBreakdown) => [
  {
    key: 'layer1',
    name: 'AI Exposure',
    value: breakdown.layer1_ai_exposure,
    color: '#3b82f6',
    detail: `${Math.round(breakdown.layer1_ai_exposure)}% baseline exposure`,
  },
  {
    key: 'layer2',
    name: 'Task Automation',
    value: breakdown.layer2_task_automation,
    color: '#8b5cf6',
    detail: `${Math.round(breakdown.layer2_task_automation)}% task risk`,
  },
  {
    key: 'layer3',
    name: 'Industry Modifier',
    value: breakdown.layer3_industry_modifier * 100,
    color: '#f97316',
    detail: `${breakdown.layer3_industry_modifier.toFixed(2)}x multiplier`,
  },
  {
    key: 'layer4',
    name: 'Experience Modifier',
    value: breakdown.layer4_experience_modifier * 100,
    color: '#22c55e',
    detail: `${breakdown.layer4_experience_modifier.toFixed(2)}x multiplier`,
  },
];

export function LayerBreakdown({ breakdown, className }: LayerBreakdownProps) {
  const data = layerData(breakdown);

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">Risk Score Breakdown</h3>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 12 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 125]} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {data.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>
              {item.name}: {item.detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
