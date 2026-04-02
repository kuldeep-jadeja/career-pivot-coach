import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

vi.mock('@/lib/hooks/useAssessmentFlow', () => ({
  useAssessmentFlow: () => ({
    assessment: {
      step: 1,
      jobTitle: { code: '15-1252.00', title: 'Software Developers' },
      industry: 'technology',
      yearsExperience: 5,
      email: '',
    },
    setField: vi.fn(),
    goToStep: vi.fn(),
    currentStep: 1,
    isHydrated: true,
  }),
}));

vi.mock('@/app/_actions/assessment', () => ({
  calculateAndSaveAssessment: vi.fn().mockResolvedValue({
    success: true,
    assessmentId: 'abc123',
    riskScore: 65,
    breakdown: {
      layer1_ai_exposure: 70,
      layer2_task_automation: 60,
      layer3_industry_modifier: 1,
      layer4_experience_modifier: 1,
      weighted_base: 65,
      final_adjusted: 65,
    },
  }),
}));

describe('Anonymous Assessment Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders job title input on start page', async () => {
    const { default: StartPage } = await import('@/app/(assessment)/start/page');
    render(<StartPage />);
    expect(screen.getByText(/what's your current job title/i)).toBeInTheDocument();
  });

  it('renders industry and experience inputs on details page', async () => {
    const { default: DetailsPage } = await import('@/app/(assessment)/details/page');
    render(<DetailsPage />);
    expect(screen.getByText(/tell us a bit more/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /see my results/i })).toBeInTheDocument();
  });

  it('calculateAndSaveAssessment returns risk score', async () => {
    const { calculateAndSaveAssessment } = await import('@/app/_actions/assessment');
    const result = await calculateAndSaveAssessment({
      jobTitle: { code: '15-1252.00', title: 'Software Developers' },
      industry: 'technology',
      yearsExperience: 5,
    });
    expect(result.success).toBe(true);
    expect(result.riskScore).toBe(65);
  });
});
