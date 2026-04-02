import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Help Page', () => {
  it('renders FAQ questions', async () => {
    const { default: HelpPage } = await import('@/app/(marketing)/help/page');
    render(<HelpPage />);

    expect(screen.getByText(/Help & FAQ/i)).toBeInTheDocument();
    expect(
      screen.getByText(/How accurate is the AI displacement risk score/i)
    ).toBeInTheDocument();
  });

  it('includes contact email', async () => {
    const { default: HelpPage } = await import('@/app/(marketing)/help/page');
    render(<HelpPage />);

    const emailLink = screen.getByText('support@unautomatable.ai');
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.closest('a')).toHaveAttribute(
      'href',
      'mailto:support@unautomatable.ai'
    );
  });

  it('links to methodology page', async () => {
    const { default: HelpPage } = await import('@/app/(marketing)/help/page');
    render(<HelpPage />);

    const methodologyLink = screen.getByText(/Read our methodology documentation/i);
    expect(methodologyLink.closest('a')).toHaveAttribute('href', '/methodology');
  });

  it('explains how risk score is calculated', async () => {
    const { default: HelpPage } = await import('@/app/(marketing)/help/page');
    render(<HelpPage />);

    expect(screen.getByText(/How is the risk score calculated/i)).toBeInTheDocument();
    expect(screen.getByText(/4-layer algorithm/i)).toBeInTheDocument();
  });
});
