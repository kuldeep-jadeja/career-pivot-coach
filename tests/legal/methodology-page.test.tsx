import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@/lib/data/freshness', () => ({
  getDataFreshness: vi.fn().mockResolvedValue({
    version: '28.3',
    releaseDate: '2024-01-15',
    downloadDate: '2024-02-01',
    freshnessLevel: 'fresh',
  }),
}));

describe('Methodology Page', () => {
  it('renders page title', async () => {
    const { default: MethodologyPage } = await import('@/app/(marketing)/methodology/page');
    render(await MethodologyPage());

    expect(
      screen.getByRole('heading', { name: /Research Methodology/i, level: 1 })
    ).toBeInTheDocument();
  });

  it('includes O*NET citation', async () => {
    const { default: MethodologyPage } = await import('@/app/(marketing)/methodology/page');
    render(await MethodologyPage());

    expect(screen.getByText(/O\*NET Database Version 28\.3/i)).toBeInTheDocument();
  });

  it('includes Eloundou et al. citation', async () => {
    const { default: MethodologyPage } = await import('@/app/(marketing)/methodology/page');
    render(await MethodologyPage());

    expect(
      screen.getByText(/Eloundou, T\., Manning, S\., Mishkin, P\., & Rock, D\./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/GPTs are GPTs/i)).toBeInTheDocument();
  });

  it('includes Felten et al. citation', async () => {
    const { default: MethodologyPage } = await import('@/app/(marketing)/methodology/page');
    render(await MethodologyPage());

    expect(screen.getByText(/Felten/i)).toBeInTheDocument();
  });

  it('explains 4-layer scoring algorithm', async () => {
    const { default: MethodologyPage } = await import('@/app/(marketing)/methodology/page');
    render(await MethodologyPage());

    expect(screen.getByText(/Layer 1: AI Exposure Baseline/i)).toBeInTheDocument();
    expect(screen.getByText(/Layer 2: Task Automation Potential/i)).toBeInTheDocument();
    expect(screen.getByText(/Layer 3: Industry Adoption Speed/i)).toBeInTheDocument();
    expect(screen.getByText(/Layer 4: Experience Modifier/i)).toBeInTheDocument();
  });

  it('documents limitations', async () => {
    const { default: MethodologyPage } = await import('@/app/(marketing)/methodology/page');
    render(await MethodologyPage());

    expect(screen.getByText(/Limitations/i)).toBeInTheDocument();
    expect(screen.getByText(/Prediction uncertainty/i)).toBeInTheDocument();
  });
});
