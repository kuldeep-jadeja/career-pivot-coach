import fs from 'node:fs';
import path from 'node:path';

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AssessmentResultsEmail, getScoreColor } from '@/app/_components/emails/AssessmentResults';
import { sendAssessmentResults } from '@/app/_actions/email';
import { getRiskLevel } from '@/lib/email/assessment-results';

vi.mock('@/lib/email/resend', () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
    },
  },
}));

describe('AssessmentResultsEmail', () => {
  it('renders email with correct score and job title', () => {
    const { container } = render(
      <AssessmentResultsEmail
        jobTitle="Software Developer"
        riskScore={65}
        resultsUrl="https://test.com/results/123"
        riskLevel="High Risk"
      />
    );

    expect(container.textContent).toContain('65%');
    expect(container.textContent).toContain('Software Developer');
    expect(container.textContent).toContain('High Risk');
  });

  it('includes link to results URL', () => {
    const { container } = render(
      <AssessmentResultsEmail
        jobTitle="Test Job"
        riskScore={50}
        resultsUrl="https://unautomatable.ai/results/abc123"
        riskLevel="Elevated Risk"
      />
    );

    const link = container.querySelector('a[href*="results/abc123"]');
    expect(link).toBeTruthy();
  });

  it('returns expected score colors for risk bands', () => {
    expect(getScoreColor(15)).toBe('#16a34a');
    expect(getScoreColor(75)).toBe('#dc2626');
    expect(getScoreColor(90)).toBe('#b91c1c');
  });
});

describe('sendAssessmentResults', () => {
  it('maps risk score to expected risk levels', () => {
    expect(getRiskLevel(10)).toBe('Low Risk');
    expect(getRiskLevel(35)).toBe('Moderate Risk');
    expect(getRiskLevel(55)).toBe('Elevated Risk');
    expect(getRiskLevel(75)).toBe('High Risk');
    expect(getRiskLevel(90)).toBe('Very High Risk');
  });

  it('validates email format', async () => {
    const result = await sendAssessmentResults({
      to: 'not-an-email',
      jobTitle: 'Test',
      riskScore: 50,
      assessmentId: '123',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.toLowerCase()).toContain('email');
    }
  });

  it('accepts email input with surrounding whitespace', async () => {
    const result = await sendAssessmentResults({
      to: '  person@example.com  ',
      jobTitle: 'Analyst',
      riskScore: 42,
      assessmentId: 'abc-123',
    });

    expect(result.success).toBe(true);
  });
});

describe('results page integration', () => {
  it('wires EmailCapture into assessment results page', () => {
    const resultsPagePath = path.join(process.cwd(), 'app', '(assessment)', 'results', 'page.tsx');
    const source = fs.readFileSync(resultsPagePath, 'utf-8');

    expect(source).toContain('EmailCapture');
  });

  it('uses Email Results to Me capture copy', () => {
    const capturePath = path.join(
      process.cwd(),
      'app',
      '_components',
      'results',
      'EmailCapture.tsx'
    );
    const source = fs.readFileSync(capturePath, 'utf-8');

    expect(source).toContain('Email Results to Me');
  });
});

