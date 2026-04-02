import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LayerBreakdown } from '@/app/_components/results/LayerBreakdown';
import type { LayerBreakdown as LayerBreakdownType } from '@/lib/scoring/types';

const baseBreakdown: LayerBreakdownType = {
  layer1_ai_exposure: 70,
  layer2_task_automation: 55,
  layer3_industry_modifier: 1.2,
  layer4_experience_modifier: 0.95,
  weighted_base: 62,
  final_adjusted: 68,
};

describe('LayerBreakdown', () => {
  it('renders 4 horizontal layer labels', () => {
    render(<LayerBreakdown breakdown={baseBreakdown} />);

    expect(screen.getByText('AI Exposure')).toBeInTheDocument();
    expect(screen.getByText('Task Automation')).toBeInTheDocument();
    expect(screen.getByText('Industry Speed')).toBeInTheDocument();
    expect(screen.getByText('Experience Factor')).toBeInTheDocument();
  });

  it('shows percentage values for score layers', () => {
    render(<LayerBreakdown breakdown={baseBreakdown} />);

    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
  });

  it('shows x multipliers for modifier layers', () => {
    render(<LayerBreakdown breakdown={baseBreakdown} />);

    expect(screen.getByText('1.20x')).toBeInTheDocument();
    expect(screen.getByText('0.95x')).toBeInTheDocument();
  });

  it('handles missing or non-finite values gracefully', () => {
    const brokenBreakdown = {
      ...baseBreakdown,
      layer1_ai_exposure: Number.NaN,
      layer2_task_automation: Number.POSITIVE_INFINITY,
    };

    render(<LayerBreakdown breakdown={brokenBreakdown} />);

    expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
  });
});

