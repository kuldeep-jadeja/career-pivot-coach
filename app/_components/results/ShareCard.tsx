'use client';

import { cn } from '@/lib/utils';

import type { ShareFrame } from './ShareFrameSelector';

interface ShareCardProps {
  jobTitle: string;
  riskScore: number;
  frame: ShareFrame;
  className?: string;
  id?: string;
}

const FRAME_TEXT: Record<ShareFrame, string> = {
  proactive: "I'm preparing for AI changes in my industry",
  curious: 'Exploring how AI might impact my career',
  data: 'Analyzing workforce trends with AI risk data',
};

function getScoreColor(score: number): string {
  if (score <= 20) return '#22c55e';
  if (score <= 40) return '#eab308';
  if (score <= 60) return '#f97316';
  if (score <= 80) return '#ef4444';
  return '#b91c1c';
}

export function ShareCard({ jobTitle, riskScore, frame, className, id = 'share-card' }: ShareCardProps) {
  const safeScore = Math.max(0, Math.min(100, riskScore));
  const scoreColor = getScoreColor(safeScore);

  return (
    <div
      id={id}
      className={cn(
        'relative h-[630px] w-[1200px] overflow-hidden rounded-2xl bg-slate-900 p-16 text-white',
        className
      )}
    >
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mb-4 text-[144px] font-bold leading-none" style={{ color: scoreColor }}>
          {safeScore}%
        </div>
        <div className="mb-8 text-5xl text-slate-300">AI Displacement Risk</div>
        <div className="mb-12 max-w-[900px] text-4xl text-slate-400">{jobTitle}</div>
        <div className="text-2xl italic text-slate-500">"{FRAME_TEXT[frame]}"</div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 text-center text-xl text-slate-600">
        unautomatable.ai — Assess your career risk
      </div>
    </div>
  );
}
