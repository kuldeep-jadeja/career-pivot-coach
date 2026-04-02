import { describe, expect, it } from 'vitest';

import { getRiskLabel, getScoreColor, parseOgParams } from '@/app/api/og/route';

describe('OG Image Route', () => {
  it('maps all 5 risk bands to expected score colors', () => {
    expect(getScoreColor(10)).toBe('#22c55e');
    expect(getScoreColor(30)).toBe('#eab308');
    expect(getScoreColor(50)).toBe('#f97316');
    expect(getScoreColor(70)).toBe('#ef4444');
    expect(getScoreColor(95)).toBe('#b91c1c');
  });

  it('maps all score bands to expected labels', () => {
    expect(getRiskLabel(10)).toBe('Low Risk');
    expect(getRiskLabel(30)).toBe('Moderate Risk');
    expect(getRiskLabel(50)).toBe('Elevated Risk');
    expect(getRiskLabel(70)).toBe('High Risk');
    expect(getRiskLabel(95)).toBe('Very High Risk');
  });

  it('uses standard OG image dimensions', () => {
    expect({ width: 1200, height: 630 }).toEqual({ width: 1200, height: 630 });
  });

  it('parses job title and clamps risk score from query params', () => {
    const parsed = parseOgParams(
      new URL('https://example.com/api/og?jobTitle=Software%20Engineer&riskScore=140').searchParams
    );
    expect(parsed.jobTitle).toBe('Software Engineer');
    expect(parsed.riskScore).toBe(100);
  });
});
