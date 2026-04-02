import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export function getScoreColor(score: number): string {
  if (score <= 20) return '#22c55e';
  if (score <= 40) return '#eab308';
  if (score <= 60) return '#f97316';
  if (score <= 80) return '#ef4444';
  return '#b91c1c';
}

export function getRiskLabel(score: number): string {
  if (score <= 20) return 'Low Risk';
  if (score <= 40) return 'Moderate Risk';
  if (score <= 60) return 'Elevated Risk';
  if (score <= 80) return 'High Risk';
  return 'Very High Risk';
}

export function parseOgParams(searchParams: URLSearchParams) {
  const jobTitle = searchParams.get('jobTitle') || 'Your Role';
  const rawScore = Number.parseInt(searchParams.get('riskScore') || '50', 10);
  const riskScore = Number.isNaN(rawScore) ? 50 : Math.max(0, Math.min(100, rawScore));
  return { jobTitle, riskScore };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { jobTitle, riskScore } = parseOgParams(searchParams);

  const scoreColor = getScoreColor(riskScore);
  const riskLabel = getRiskLabel(riskScore);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 144,
            fontWeight: 'bold',
            color: scoreColor,
            marginBottom: 16,
          }}
        >
          {riskScore}%
        </div>
        <div
          style={{
            fontSize: 48,
            color: scoreColor,
            marginBottom: 40,
          }}
        >
          {riskLabel}
        </div>
        <div
          style={{
            fontSize: 36,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '80%',
            marginBottom: 48,
          }}
        >
          {jobTitle}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#64748b',
          }}
        >
          Assess your career risk at Unautomatable.ai
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
