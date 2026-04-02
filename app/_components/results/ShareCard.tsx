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
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{
        width: '1200px',
        height: '630px',
        backgroundColor: '#0f172a',
        padding: '64px',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            marginBottom: '16px',
            fontSize: '144px',
            fontWeight: 700,
            lineHeight: 1,
            color: scoreColor,
          }}
        >
          {safeScore}%
        </div>
        <div style={{ marginBottom: '32px', fontSize: '48px', color: '#cbd5e1' }}>
          AI Displacement Risk
        </div>
        <div style={{ marginBottom: '48px', maxWidth: '900px', fontSize: '36px', color: '#94a3b8' }}>
          {jobTitle}
        </div>
        <div style={{ fontSize: '24px', fontStyle: 'italic', color: '#64748b' }}>
          "{FRAME_TEXT[frame]}"
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: '20px',
          color: '#475569',
        }}
      >
        unautomatable.ai — Assess your career risk
      </div>
    </div>
  );
}
