'use client';

import { useState } from 'react';
import { Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/app/_components/ui/button';
import { useShareCard } from '@/lib/hooks/useShareCard';

import { ShareCard } from './ShareCard';
import { ShareFrameSelector, type ShareFrame } from './ShareFrameSelector';

interface ShareButtonsProps {
  assessmentId: string;
  jobTitle: string;
  riskScore: number;
}

export function ShareButtons({ assessmentId, jobTitle, riskScore }: ShareButtonsProps) {
  const { downloadCard, shareLink, isGenerating } = useShareCard();
  const [selectedFrame, setSelectedFrame] = useState<ShareFrame>('proactive');

  const handleDownload = async () => {
    try {
      await downloadCard('share-card-full', `ai-risk-${assessmentId}.png`);
      toast.success('Image downloaded!');
    } catch {
      toast.error('Failed to download image. Please try again.');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/results/${assessmentId}`;
    const title = `My AI Displacement Risk: ${riskScore}%`;
    const text = `I assessed my career's AI risk. ${jobTitle} has a ${riskScore}% displacement risk. Check yours!`;

    const success = await shareLink(url, title, text);
    if (!success) {
      toast.error('Share canceled.');
      return;
    }

    if (!navigator.share) {
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/results/${assessmentId}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Share Your Results</h3>

      <ShareFrameSelector selected={selectedFrame} onChange={setSelectedFrame} />

      <div className="overflow-hidden rounded-lg border bg-muted/50 p-4">
        <div className="mx-auto h-[157px] w-[300px] overflow-hidden">
          <ShareCard
            id="share-card"
            className="origin-top-left scale-[0.25]"
            jobTitle={jobTitle}
            riskScore={riskScore}
            frame={selectedFrame}
          />
        </div>
      </div>

      <div className="fixed -left-[9999px] top-0" aria-hidden>
        <ShareCard
          id="share-card-full"
          jobTitle={jobTitle}
          riskScore={riskScore}
          frame={selectedFrame}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleDownload} disabled={isGenerating} className="min-h-[44px]">
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Download Image'}
        </Button>
        <Button onClick={handleShare} variant="outline" className="min-h-[44px]">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button onClick={handleCopyLink} variant="outline" className="min-h-[44px]">
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}
