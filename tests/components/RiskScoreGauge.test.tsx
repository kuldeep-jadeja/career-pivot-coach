/**
 * RiskScoreGauge Component Tests
 * 
 * Tests for the radial gauge visualization component that displays
 * risk scores with color-coded bands.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RiskScoreGauge } from '@/app/_components/results/RiskScoreGauge';

describe('RiskScoreGauge', () => {
  it('renders with score 75 showing "75%" text', () => {
    render(<RiskScoreGauge score={75} />);
    const scoreValue = screen.getByTestId('score-value');
    expect(scoreValue).toBeInTheDocument();
    expect(scoreValue.textContent).toBe('75%');
  });

  it('renders with score 85 showing red-700 color (Very High)', () => {
    render(<RiskScoreGauge score={85} />);
    const scoreValue = screen.getByTestId('score-value');
    // Very High risk uses red-700 (#b91c1c)
    expect(scoreValue).toHaveStyle({ color: '#b91c1c' });
  });

  it('renders with score 15 showing green-600 color (Low)', () => {
    render(<RiskScoreGauge score={15} />);
    const scoreValue = screen.getByTestId('score-value');
    // Low risk uses green-600 (#16a34a)
    expect(scoreValue).toHaveStyle({ color: '#16a34a' });
  });

  it('renders with score 45 showing orange-600 color (Elevated)', () => {
    render(<RiskScoreGauge score={45} />);
    const scoreValue = screen.getByTestId('score-value');
    // Elevated risk uses orange-600 (#ea580c)
    expect(scoreValue).toHaveStyle({ color: '#ea580c' });
  });

  it('renders risk level label ("High Risk", "Low Risk", etc.)', () => {
    render(<RiskScoreGauge score={75} />);
    const riskLabel = screen.getByTestId('risk-label');
    expect(riskLabel).toBeInTheDocument();
    expect(riskLabel.textContent).toBe('High Risk');
  });

  it('renders Low Risk label for score 15', () => {
    render(<RiskScoreGauge score={15} />);
    const riskLabel = screen.getByTestId('risk-label');
    expect(riskLabel.textContent).toBe('Low Risk');
  });

  it('renders Very High Risk label for score 95', () => {
    render(<RiskScoreGauge score={95} />);
    const riskLabel = screen.getByTestId('risk-label');
    expect(riskLabel.textContent).toBe('Very High Risk');
  });
});
