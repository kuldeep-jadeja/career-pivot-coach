import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toBlob: (callback: (blob: Blob | null) => void) => {
      callback(new Blob(['png'], { type: 'image/png' }));
    },
  }),
}));

describe('useShareCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(document, 'fonts', {
      value: { ready: Promise.resolve() },
      configurable: true,
    });
    URL.createObjectURL = vi.fn(() => 'blob:test');
    URL.revokeObjectURL = vi.fn();
  });

  it('downloadCard generates PNG from element', async () => {
    const { useShareCard } = await import('@/lib/hooks/useShareCard');
    const element = document.createElement('div');
    element.id = 'test-card';
    document.body.appendChild(element);

    const mockClick = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const created = originalCreateElement(tagName);
      if (tagName === 'a') {
        created.click = mockClick;
      }
      return created;
    });

    const { result } = renderHook(() => useShareCard());
    await act(async () => {
      await result.current.downloadCard('test-card', 'risk.png');
    });

    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(result.current.isGenerating).toBe(false);
  });

  it('shareLink falls back to clipboard when native share is unavailable', async () => {
    const { useShareCard } = await import('@/lib/hooks/useShareCard');
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    });

    const { result } = renderHook(() => useShareCard());
    await act(async () => {
      await result.current.shareLink('https://example.com', 'Title', 'Text');
    });

    expect(writeText).toHaveBeenCalledWith('https://example.com');
  });
});
