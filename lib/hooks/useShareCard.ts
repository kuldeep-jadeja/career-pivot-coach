'use client';

import { useCallback, useState } from 'react';

export function useShareCard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCard = useCallback(async (elementId: string, filename: string) => {
    setIsGenerating(true);
    try {
      console.log('[useShareCard] Starting download for element:', elementId);
      
      const html2canvas = (await import('html2canvas')).default;
      console.log('[useShareCard] html2canvas loaded');

      await document.fonts.ready;
      console.log('[useShareCard] Fonts ready');

      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element "${elementId}" not found`);
      }
      console.log('[useShareCard] Element found:', element);

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: true,
        useCORS: true,
        width: 1200,
        height: 630,
      });
      console.log('[useShareCard] Canvas created:', canvas.width, 'x', canvas.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((generatedBlob) => {
          if (!generatedBlob) {
            reject(new Error('Canvas to blob failed'));
            return;
          }
          resolve(generatedBlob);
        }, 'image/png');
      });
      console.log('[useShareCard] Blob created:', blob.size, 'bytes');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
      console.log('[useShareCard] Download triggered');
    } catch (error) {
      console.error('[useShareCard] Error during download:', error);
      throw error;
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
