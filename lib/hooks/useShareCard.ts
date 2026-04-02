'use client';

import { useCallback, useState } from 'react';

export function useShareCard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCard = useCallback(async (elementId: string, filename: string) => {
    setIsGenerating(true);
    try {
      const html2canvas = (await import('html2canvas')).default;

      await document.fonts.ready;

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element "${elementId}" not found`);
      }

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
        useCORS: true,
        width: 1200,
        height: 630,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((generatedBlob) => {
          if (!generatedBlob) {
            reject(new Error('Canvas to blob failed'));
            return;
          }
          resolve(generatedBlob);
        }, 'image/png');
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const shareLink = useCallback(async (url: string, title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch {
        return false;
      }
    }

    await navigator.clipboard.writeText(url);
    return true;
  }, []);

  return { downloadCard, shareLink, isGenerating };
}
