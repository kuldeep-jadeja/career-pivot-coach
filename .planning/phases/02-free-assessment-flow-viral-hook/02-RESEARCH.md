# Phase 2: Free Assessment Flow (Viral Hook) - Research

**Researched:** 2026-04-01  
**Domain:** User-facing assessment flow, data visualization, social sharing, mobile-first forms  
**Confidence:** HIGH

## Summary

Phase 2 builds the free viral assessment hook — the core value proposition that validates market demand before investing in authentication infrastructure. Users complete a quick assessment (<5 minutes), receive a personalized risk score with visual breakdown, and can share results socially without creating an account.

The technical challenge spans multiple domains: (1) smooth job title search with fuzzy matching and disambiguation UI, (2) mobile-responsive multi-step forms with session persistence, (3) data visualization for risk scores and task breakdowns, (4) social share card generation with platform-specific OG tags, (5) PNG download capability, (6) email delivery via Resend, and (7) landing page with methodology transparency.

This phase leverages existing infrastructure from Phase 1: O*NET data loader, scoring engine, Supabase database, and Resend integration are already complete. The focus is on user experience and shareability.

**Primary recommendation:** Use shadcn/ui + Radix primitives for forms/combobox, Recharts for visualization, @vercel/og for social cards, html2canvas for PNG downloads, and native sessionStorage for anonymous progress tracking. Prioritize mobile-first design with careful attention to social share card context (proactive framing vs. anxiety-inducing).

---

<phase_requirements>
## Phase Requirements

This phase MUST address the following requirements from REQUIREMENTS.md:

| ID | Description | Research Support |
|----|-------------|-----------------|
| ASSESS-01 | User can take free risk assessment without creating an account (< 5 min) | Multi-step form with sessionStorage, no auth gate |
| ASSESS-02 | User can input job title with fuzzy matching to O*NET occupation codes | Combobox with client-side fuzzy search, disambiguation UI |
| ASSESS-03 | User can input industry and years of experience | Standard form inputs with validation (Zod + React Hook Form) |
| ASSESS-04 | System calculates AI displacement risk score (0-100) using 4-layer algorithm | Phase 1 scoring engine integration, Server Action invocation |
| ASSESS-05 | User sees personalized risk score with visual presentation (charts, gauges) | Recharts RadialBarChart, BarChart, custom gauge components |
| ASSESS-06 | User sees task-level breakdown showing which tasks are at risk vs. safe | Recharts BarChart with color coding, sortable task list |
| ASSESS-07 | User can provide email to receive results | Form input with email validation, optional field |
| ASSESS-08 | System sends risk score email via Resend | Email template with React Email, Server Action integration |
| ASSESS-09 | Assessment is fully mobile responsive | Tailwind mobile-first utilities, touch-friendly controls |
| ASSESS-10 | Assessment saves progress automatically (anonymous users get session storage) | sessionStorage with Zod schema validation, auto-save on input change |
| VIRAL-01 | User can download shareable visual score card as image (PNG) | html2canvas for client-side rendering, download link trigger |
| VIRAL-02 | Risk score results page has dynamic OG meta tags for social link previews | @vercel/og for server-side image generation, Next.js metadata API |
| LEGAL-01 | Site has Help/FAQ page explaining methodology and common questions | Static MDX page with academic citations, methodology transparency |
| LEGAL-04 | Site has contact/support mechanism (email form or mailto link) | Simple mailto link in footer + Help page |
| LEGAL-05 | Site documents research methodology with academic citations (O*NET, Eloundou, Felten) | Methodology section on landing page, citations in footer |
</phase_requirements>

---

## Standard Stack

### Core Dependencies (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.1 | App Router, Server Components, metadata API | Best-in-class React framework for SSR/SSG, built-in routing |
| React | 19.2.4 | UI library | Latest stable, server components support |
| TypeScript | 6.0.2 | Type safety | Catches errors at compile time, better DX |
| Tailwind CSS | 4.2.2 | Utility-first styling | Rapid mobile-first development, design consistency |
| Zod | 4.3.6 | Schema validation | Type-safe form validation, runtime safety |
| React Hook Form | 7.72.0 | Form state management | Performance (uncontrolled), excellent validation integration |
| Recharts | 3.8.1 | Data visualization | React-native charts, composable, accessible |
| Sharp | 0.34.5 | Image processing | Fast, production-grade (for server-side use if needed) |
| @vercel/og | 0.11.1 | Social card generation | Dynamic OG images at edge, platform-optimized |
| Resend | 6.10.0 | Email delivery | Already integrated (Phase 1), free tier (100/day) |
| Supabase | 2.101.0 | Database + Auth | Already integrated (Phase 1), PostgreSQL with RLS |

**Installation (already complete):** ✅ All dependencies from Phase 1 setup

### Additional Dependencies Needed

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| html2canvas | 1.4.1 | Client-side screenshot | PNG download from DOM elements (shareable cards) |
| cmdk | 1.1.1 | Command palette primitive | Combobox/autocomplete for job title search (optional — Radix Select may suffice) |
| react-email | 5.2.10 | Email templates | Type-safe email composition with React components |

**Installation:**
```bash
npm install html2canvas@1.4.1 react-email@5.2.10
```

**Note on cmdk:** Only install if Radix UI Select proves insufficient for job title autocomplete. Start with Radix Select (already installed) + custom filtering.

### Verification

**Verify package versions before planning:**
```bash
npm view html2canvas version  # 1.4.1 (published 2023-09-19)
npm view react-email version  # 5.2.10 (published 2024-01-xx)
```

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── (marketing)/
│   ├── page.tsx                    # Landing page with methodology
│   ├── help/page.tsx               # FAQ + methodology detail
│   └── results/[id]/page.tsx       # Dynamic results page (OG tags)
├── (assessment)/
│   ├── layout.tsx                  # Assessment-specific layout
│   ├── start/page.tsx              # Step 1: Job title input
│   ├── details/page.tsx            # Step 2: Industry + experience
│   ├── results/page.tsx            # Step 3: Risk score + breakdown
│   └── email/page.tsx              # Optional: Email capture
├── api/
│   ├── og/route.tsx                # Dynamic OG image endpoint
│   └── assessment/
│       ├── calculate/route.ts      # Calculate risk score (Server Action preferred)
│       └── email/route.ts          # Send results email (Server Action preferred)
├── _actions/
│   ├── assessment.ts               # Server Actions for score calculation
│   └── email.ts                    # Server Actions for email delivery
└── _components/
    ├── assessment/
    │   ├── JobTitleCombobox.tsx    # Searchable job title selector
    │   ├── IndustrySelect.tsx      # Industry dropdown
    │   ├── ExperienceInput.tsx     # Years of experience slider/input
    │   ├── ProgressTracker.tsx     # Step indicator (1/2/3)
    │   └── SessionManager.tsx      # Auto-save to sessionStorage
    ├── results/
    │   ├── RiskScoreGauge.tsx      # Primary risk score visualization
    │   ├── LayerBreakdown.tsx      # 4-layer scoring breakdown chart
    │   ├── TaskRiskList.tsx        # Task-level risk analysis
    │   ├── ShareCard.tsx           # Downloadable share card design
    │   └── ShareButtons.tsx        # Social share + PNG download
    └── legal/
        ├── MethodologySection.tsx  # Academic citations display
        └── DataFreshness.tsx       # O*NET version transparency

lib/
├── hooks/
│   ├── useSessionStorage.ts       # Type-safe sessionStorage hook
│   ├── useAssessmentFlow.ts       # Multi-step form orchestration
│   └── useShareCard.ts            # PNG download logic
├── validation/
│   ├── assessment-schema.ts       # Zod schemas for all assessment inputs
│   └── email-schema.ts            # Email validation schema
└── utils/
    ├── fuzzy-search.ts            # Client-side job title matching
    ├── share-card-generator.ts    # Canvas/image generation helpers
    └── og-image-helpers.ts        # @vercel/og utilities
```

### Pattern 1: Multi-Step Form with Session Persistence

**What:** Progressive disclosure form that saves state automatically without authentication.

**When to use:** Anonymous user flows where account creation comes later (post-validation).

**Implementation:**

```typescript
// lib/hooks/useSessionStorage.ts
import { useState, useEffect } from 'react';
import { z } from 'zod';

export function useSessionStorage<T>(
  key: string,
  schema: z.ZodSchema<T>,
  defaultValue: T
) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage on mount (client-only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const validated = schema.safeParse(parsed);
        if (validated.success) {
          setValue(validated.data);
        }
      } catch (e) {
        console.warn(`Failed to parse sessionStorage key "${key}"`, e);
      }
    }
    setIsHydrated(true);
  }, [key, schema]);

  // Persist to sessionStorage on change
  useEffect(() => {
    if (!isHydrated) return;
    if (typeof window === 'undefined') return;
    
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value, isHydrated]);

  return [value, setValue, isHydrated] as const;
}
```

**Usage:**
```typescript
// app/(assessment)/start/page.tsx
'use client';

import { useSessionStorage } from '@/lib/hooks/useSessionStorage';
import { assessmentSchema } from '@/lib/validation/assessment-schema';

export default function JobTitleStep() {
  const [assessment, setAssessment, isHydrated] = useSessionStorage(
    'assessment-draft',
    assessmentSchema.partial(),
    {}
  );

  if (!isHydrated) return <Skeleton />; // Prevent hydration mismatch

  return (
    <form onSubmit={handleNext}>
      <JobTitleCombobox
        value={assessment.jobTitle}
        onChange={(value) => setAssessment({ ...assessment, jobTitle: value })}
      />
      {/* Auto-saves on every change */}
    </form>
  );
}
```

**Why it works:**
- No server round-trips for draft saving
- Survives page refresh
- Type-safe with Zod validation
- Hydration-safe (client-only, conditional render)

**Pitfall to avoid:** Don't use `localStorage` — sessionStorage clears on tab close (better for privacy, no stale data accumulation).

---

### Pattern 2: Job Title Fuzzy Search with Disambiguation

**What:** Search-as-you-type combobox that fuzzy-matches user input to O*NET occupation codes, shows 3-5 best matches with descriptions, lets user select final choice.

**When to use:** Job title input (ASSESS-02) — critical for accurate scoring.

**Implementation:**

```typescript
// lib/utils/fuzzy-search.ts
interface OccupationMatch {
  code: string;
  title: string;
  description: string;
  confidence: number; // 0-1 score
}

export function fuzzyMatchOccupations(
  query: string,
  occupations: Array<{ code: string; title: string; description: string }>,
  limit = 5
): OccupationMatch[] {
  if (!query || query.length < 2) return [];

  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);

  return occupations
    .map((occ) => {
      const titleLower = occ.title.toLowerCase();
      let score = 0;

      // Exact match bonus
      if (titleLower === queryLower) score += 100;
      
      // Starts-with bonus
      if (titleLower.startsWith(queryLower)) score += 50;
      
      // Contains query bonus
      if (titleLower.includes(queryLower)) score += 25;
      
      // Word match bonus (each word in query found in title)
      words.forEach((word) => {
        if (titleLower.includes(word)) score += 10;
      });

      return {
        ...occ,
        confidence: Math.min(score / 100, 1), // Normalize to 0-1
      };
    })
    .filter((match) => match.confidence > 0.1) // Minimum threshold
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
}
```

```typescript
// app/_components/assessment/JobTitleCombobox.tsx
'use client';

import { useState, useMemo } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command';
import { fuzzyMatchOccupations } from '@/lib/utils/fuzzy-search';
import { occupations } from '@/lib/data/onet-loader'; // Load O*NET data

export function JobTitleCombobox({ value, onChange }: Props) {
  const [query, setQuery] = useState('');
  
  const matches = useMemo(
    () => fuzzyMatchOccupations(query, occupations, 5),
    [query]
  );

  return (
    <Command>
      <CommandInput
        placeholder="Search job title (e.g., Software Engineer, Teacher, Nurse)..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {matches.length === 0 && query.length > 0 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            No matches found. Try a different term.
          </div>
        )}
        {matches.map((match) => (
          <CommandItem
            key={match.code}
            value={match.code}
            onSelect={() => onChange({ code: match.code, title: match.title })}
          >
            <div className="flex flex-col gap-1">
              <div className="font-medium">{match.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {match.description}
              </div>
              <div className="text-xs text-blue-600">
                {Math.round(match.confidence * 100)}% match
              </div>
            </div>
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
```

**Why it works:**
- Fuzzy matching handles typos and variations
- Confidence scores help user validate selection
- Descriptions disambiguate similar titles (e.g., "Software Developer" vs. "Software Engineer")
- Client-side search (no API latency)

**Alternative:** Use `cmdk` library if Command component from shadcn/ui is insufficient. shadcn/ui includes Command component based on cmdk.

---

### Pattern 3: Social Share Card Generation (Two Methods)

**Method A: Server-Side OG Images (@vercel/og)**

**What:** Dynamic Open Graph images generated at the edge using Vercel's OG image service.

**When to use:** Link previews on LinkedIn, Twitter, Facebook (automatic when URL is shared).

**Implementation:**

```typescript
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobTitle = searchParams.get('jobTitle') || 'Unknown Role';
  const riskScore = parseInt(searchParams.get('riskScore') || '0', 10);
  
  // Color coding based on risk
  const scoreColor = riskScore >= 70 ? '#EF4444' : riskScore >= 40 ? '#F59E0B' : '#10B981';
  const riskLabel = riskScore >= 70 ? 'High Risk' : riskScore >= 40 ? 'Moderate Risk' : 'Lower Risk';

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
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '60px',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', color: '#fff', marginBottom: 24 }}>
          {riskScore}% AI Risk
        </div>
        <div style={{ fontSize: 36, color: scoreColor, marginBottom: 48 }}>
          {riskLabel}
        </div>
        <div style={{ fontSize: 28, color: '#94a3b8', textAlign: 'center', maxWidth: '80%' }}>
          {jobTitle}
        </div>
        <div style={{ fontSize: 20, color: '#64748b', marginTop: 48 }}>
          Assess your career risk at Unautomatable.ai
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630, // Standard OG image dimensions
    }
  );
}
```

**Usage in page metadata:**
```typescript
// app/results/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const assessment = await getAssessment(params.id);
  
  return {
    title: `${assessment.riskScore}% AI Risk - ${assessment.jobTitle}`,
    description: `I assessed my career's AI displacement risk. Find out yours at Unautomatable.ai`,
    openGraph: {
      title: `${assessment.riskScore}% AI Risk`,
      description: `${assessment.jobTitle} — Assess your career risk`,
      images: [
        {
          url: `/api/og?jobTitle=${encodeURIComponent(assessment.jobTitle)}&riskScore=${assessment.riskScore}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${assessment.riskScore}% AI Risk`,
      description: `${assessment.jobTitle} — Assess your career risk`,
      images: [`/api/og?jobTitle=${encodeURIComponent(assessment.jobTitle)}&riskScore=${assessment.riskScore}`],
    },
  };
}
```

**Why it works:**
- Edge-rendered (fast, global distribution)
- Dynamic per-assessment (personalized sharing)
- No client-side JavaScript required
- Platform-optimized dimensions (1200x630 standard)

**Platform-specific requirements:**
- **LinkedIn:** 1200x627, max 5MB
- **Twitter:** 1200x675 (summary_large_image), max 5MB
- **Facebook:** 1200x630, min 200x200, max 8MB
- **Standard:** 1200x630 covers all platforms

---

**Method B: Client-Side PNG Download (html2canvas)**

**What:** Render a DOM element to canvas, convert to PNG, trigger download.

**When to use:** User clicks "Download Image" button to save locally (for manual sharing).

**Implementation:**

```typescript
// lib/hooks/useShareCard.ts
import html2canvas from 'html2canvas';
import { useState } from 'react';

export function useShareCard() {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCard = async (elementId: string, filename: string) => {
    setIsGenerating(true);
    try {
      const element = document.getElementById(elementId);
      if (!element) throw new Error('Element not found');

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 2, // 2x resolution for crisp images
        logging: false,
        useCORS: true, // Required for external images
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas to blob failed');
        
        // Trigger download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        // Cleanup
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Failed to generate share card:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return { downloadCard, isGenerating };
}
```

```typescript
// app/_components/results/ShareCard.tsx
'use client';

export function ShareCard({ jobTitle, riskScore, layers }: Props) {
  return (
    <div
      id="share-card"
      className="w-full max-w-[600px] aspect-[1.91/1] bg-slate-900 rounded-lg p-8 flex flex-col items-center justify-center"
    >
      <div className="text-7xl font-bold text-white mb-4">
        {riskScore}%
      </div>
      <div className="text-2xl text-orange-500 mb-8">
        AI Displacement Risk
      </div>
      <div className="text-xl text-slate-300 text-center max-w-md">
        {jobTitle}
      </div>
      <div className="mt-8 text-sm text-slate-500">
        unautomatable.ai — Assess your career risk
      </div>
    </div>
  );
}
```

```typescript
// app/_components/results/ShareButtons.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { useShareCard } from '@/lib/hooks/useShareCard';
import { toast } from 'sonner';

export function ShareButtons({ assessmentId }: Props) {
  const { downloadCard, isGenerating } = useShareCard();

  const handleDownload = async () => {
    try {
      await downloadCard('share-card', `ai-risk-score-${assessmentId}.png`);
      toast.success('Image downloaded successfully');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My AI Displacement Risk Score',
          text: 'I assessed my career AI displacement risk. Check yours!',
          url: `${window.location.origin}/results/${assessmentId}`,
        });
      } catch (error) {
        // User cancelled or share failed
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(`${window.location.origin}/results/${assessmentId}`);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handleDownload} disabled={isGenerating}>
        <Download className="mr-2 h-4 w-4" />
        {isGenerating ? 'Generating...' : 'Download Image'}
      </Button>
      <Button onClick={handleShare} variant="outline">
        <Share2 className="mr-2 h-4 w-4" />
        Share Link
      </Button>
    </div>
  );
}
```

**Why it works:**
- Client-side rendering (no server load)
- Works offline once loaded
- User controls when to generate
- Native Web Share API integration for mobile

**Pitfall to avoid:** Don't render the entire page — isolate the share card component (specific dimensions, no interactive elements) for clean output.

---

### Pattern 4: Risk Score Visualization

**What:** Radial gauge + layered bar chart showing risk score breakdown.

**When to use:** Results page (ASSESS-05, ASSESS-06) — primary visual communication of risk.

**Implementation:**

```typescript
// app/_components/results/RiskScoreGauge.tsx
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

interface RiskScoreGaugeProps {
  score: number; // 0-100
}

export function RiskScoreGauge({ score }: RiskScoreGaugeProps) {
  const data = [{ name: 'Risk', value: score, fill: getScoreColor(score) }];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <ResponsiveContainer width="100%" height={300}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          barSize={30}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-bold" style={{ color: getScoreColor(score) }}>
          {score}%
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          {getRiskLabel(score)}
        </div>
      </div>
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#EF4444'; // red-500
  if (score >= 40) return '#F59E0B'; // amber-500
  return '#10B981'; // green-500
}

function getRiskLabel(score: number): string {
  if (score >= 70) return 'High Risk';
  if (score >= 40) return 'Moderate Risk';
  return 'Lower Risk';
}
```

```typescript
// app/_components/results/LayerBreakdown.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface LayerBreakdownProps {
  layers: {
    name: string;
    score: number;
    description: string;
  }[];
}

export function LayerBreakdown({ layers }: LayerBreakdownProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Risk Score Breakdown</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={layers} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <div className="font-semibold">{data.name}</div>
                  <div className="text-2xl font-bold my-2">{data.score}%</div>
                  <div className="text-sm text-muted-foreground max-w-xs">
                    {data.description}
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="score" radius={[0, 8, 8, 0]}>
            {layers.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Why Recharts:**
- React-native (no canvas/WebGL complexity)
- Composable (mix chart types)
- Responsive by default
- Accessible (SVG with ARIA attributes)
- Already in use (consistent library choice)

**Alternatives considered:**
- **react-chartjs-2 (5.3.1):** More features, but imperative API (less React-like)
- **Victory (37.3.6):** Similar to Recharts, but larger bundle size
- **Custom SVG:** Too much effort for charts (use for gauges if needed)

**Verdict:** Stick with Recharts (already approved in STATE.md).

---

### Pattern 5: Mobile-First Multi-Step Form

**What:** Progressive disclosure form with clear step indicators and mobile-optimized inputs.

**When to use:** All assessment flow pages (start → details → results).

**Implementation:**

```typescript
// app/_components/assessment/ProgressTracker.tsx
export function ProgressTracker({ currentStep, totalSteps }: Props) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full font-semibold',
              step === currentStep
                ? 'bg-primary text-primary-foreground'
                : step < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={cn(
                'h-0.5 w-12',
                step < currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

**Mobile-first principles:**
- Touch targets ≥44px (iOS guideline)
- Large text inputs (min 16px font to prevent zoom on iOS)
- Single-column layout on mobile
- Generous spacing (tap accuracy)
- Sticky navigation (progress tracker always visible)
- Autofocus first input (smooth keyboard flow)

**Form validation approach:**
```typescript
// lib/validation/assessment-schema.ts
import { z } from 'zod';

export const assessmentSchema = z.object({
  jobTitle: z.object({
    code: z.string().min(1, 'Please select a job title'),
    title: z.string().min(1),
  }),
  industry: z.string().min(1, 'Industry is required'),
  yearsExperience: z.number().min(0).max(50),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;
```

**React Hook Form integration:**
```typescript
const form = useForm<AssessmentInput>({
  resolver: zodResolver(assessmentSchema),
  defaultValues: assessment,
  mode: 'onBlur', // Validate on blur (less intrusive on mobile)
});
```

---

### Pattern 6: Email Results Delivery

**What:** Send risk score summary via Resend with React Email templates.

**When to use:** User provides email on results page (ASSESS-08).

**Implementation:**

```typescript
// app/_components/emails/AssessmentResults.tsx (React Email)
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AssessmentResultsEmailProps {
  jobTitle: string;
  riskScore: number;
  resultsUrl: string;
}

export function AssessmentResultsEmail({
  jobTitle,
  riskScore,
  resultsUrl,
}: AssessmentResultsEmailProps) {
  const riskLevel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Moderate' : 'Lower';
  
  return (
    <Html>
      <Head />
      <Preview>Your {riskScore}% AI displacement risk score for {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your AI Risk Assessment Results</Heading>
          
          <Section style={scoreSection}>
            <Text style={scoreText}>{riskScore}%</Text>
            <Text style={riskLevelText}>{riskLevel} Risk</Text>
          </Section>
          
          <Text style={paragraph}>
            Your <strong>{jobTitle}</strong> role has a {riskScore}% AI displacement risk score based on:
          </Text>
          
          <ul style={list}>
            <li>Task-level AI exposure analysis</li>
            <li>Automation potential assessment</li>
            <li>Industry adoption speed</li>
            <li>Experience protection factor</li>
          </ul>
          
          <Link href={resultsUrl} style={button}>
            View Full Results →
          </Link>
          
          <Text style={footer}>
            This assessment is based on O*NET occupational data and published AI exposure research.
            Learn more about our methodology at unautomatable.ai/help
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', maxWidth: '580px' };
const h1 = { fontSize: '24px', fontWeight: 'bold', margin: '40px 0' };
const scoreSection = { textAlign: 'center' as const, margin: '32px 0' };
const scoreText = { fontSize: '72px', fontWeight: 'bold', margin: '0', color: '#F59E0B' };
const riskLevelText = { fontSize: '24px', color: '#64748B', margin: '8px 0' };
const paragraph = { fontSize: '16px', lineHeight: '26px' };
const list = { fontSize: '16px', lineHeight: '26px', paddingLeft: '20px' };
const button = {
  backgroundColor: '#3B82F6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '32px 0',
};
const footer = { fontSize: '12px', color: '#8898aa', lineHeight: '20px', marginTop: '32px' };
```

```typescript
// app/_actions/email.ts
'use server';

import { Resend } from 'resend';
import { AssessmentResultsEmail } from '@/app/_components/emails/AssessmentResults';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchema = z.object({
  to: z.string().email(),
  jobTitle: z.string(),
  riskScore: z.number().min(0).max(100),
  assessmentId: z.string(),
});

export async function sendAssessmentResults(input: z.infer<typeof emailSchema>) {
  const validated = emailSchema.parse(input);
  
  const resultsUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/results/${validated.assessmentId}`;
  
  const { data, error } = await resend.emails.send({
    from: 'Unautomatable <noreply@unautomatable.ai>',
    to: validated.to,
    subject: `Your ${validated.riskScore}% AI Risk Score - ${validated.jobTitle}`,
    react: AssessmentResultsEmail({
      jobTitle: validated.jobTitle,
      riskScore: validated.riskScore,
      resultsUrl,
    }),
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }

  return { success: true, messageId: data?.id };
}
```

**Why React Email:**
- Type-safe templates
- Component-based (reusable styles)
- Inline CSS (email client compatibility)
- Preview during development

**Resend advantages:**
- Free tier: 100 emails/day (sufficient for MVP)
- Already integrated (Phase 1)
- No IP warmup required (shared sending infrastructure)
- Built-in analytics

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fuzzy string matching | Custom Levenshtein distance algorithm | Simple scoring heuristics (starts-with, contains, word match) | O*NET titles are well-structured — sophisticated algorithms add complexity without accuracy gains. Edge cases (typos) caught by "no results" UX. |
| Social card image generation | Canvas API manipulation | @vercel/og for link previews | Edge rendering, platform-optimized dimensions, declarative API (JSX). Canvas is error-prone (fonts, sizing, encoding). |
| Email templates | String concatenation HTML | react-email components | Email client compatibility is a nightmare (Outlook, Gmail, Apple Mail). react-email handles inline CSS, responsive layouts, cross-client testing. |
| Form validation | Custom validation logic | Zod + React Hook Form | Type-safe, runtime validation, async validation support, error handling. Custom validation leads to edge case bugs (email regex, optional fields). |
| Session persistence | Custom serialization/deserialization | Zod + JSON.stringify/parse | Schema validation prevents corrupted state, version migrations, type safety. Raw JSON.parse throws on invalid data. |
| Job title search | Full-text search engine (Fuse.js, MiniSearch) | Client-side array filtering with heuristics | Dataset is small (~1000 O*NET occupations). Client-side filtering is instant. No indexing overhead. Only use Fuse.js if simple matching proves insufficient. |
| Progress indicators | Custom stepper component | Native progress elements or simple div styling | Reinventing steppers leads to accessibility issues (screen readers, keyboard nav). Use semantic HTML + ARIA when possible. |

**Key insight:** Social sharing and email rendering have massive edge case surfaces (platform inconsistencies, client quirks). Use battle-tested libraries (vercel/og, react-email) that absorb this complexity. For search, dataset size matters — don't over-engineer when linear scan suffices.

---

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with sessionStorage

**What goes wrong:** Server renders empty form, client hydrates with sessionStorage data → React hydration error.

**Why it happens:** sessionStorage is client-only (window object doesn't exist on server).

**How to avoid:**
1. Use `useEffect` to load sessionStorage data after mount
2. Track hydration state with `isHydrated` flag
3. Render skeleton/loading state until hydrated
4. Never read sessionStorage during SSR

**Warning signs:**
- Console errors: "Text content does not match server-rendered HTML"
- Form fields flicker on load
- Default values appear briefly before sessionStorage values

**Prevention code:**
```typescript
const [isHydrated, setIsHydrated] = useState(false);

useEffect(() => {
  // Load sessionStorage data here
  setIsHydrated(true);
}, []);

if (!isHydrated) return <Skeleton />;
```

---

### Pitfall 2: Social Share Cards Ignoring Emotional Context

**What goes wrong:** Anxiety-inducing share cards ("74% at risk!") backfire on LinkedIn — users fear professional judgment.

**Why it happens:** Focus on shock value instead of empowerment. Risk score without context feels like a scarlet letter.

**How to avoid:**
1. **Offer framing variants:**
   - **Proactive frame (default):** "I'm taking control of my career future — 74% risk, 82% skills transfer to 3 new paths"
   - **Curious frame:** "Just assessed my career's AI readiness — interesting insights!"
   - **No-score frame:** "Mapped my career pivot options — surprising what's possible"

2. **Platform-specific copy suggestions:**
   - LinkedIn: Emphasize growth mindset, upskilling, proactive planning
   - Twitter: Punchy, data-driven, conversation starter
   - Facebook: Personal narrative, less professional

3. **Visual balance:**
   - Show risk AND opportunity in same card
   - Include "X% of skills transfer" metric
   - Add reassuring context ("Join 10,000+ professionals planning their pivot")

**Warning signs:**
- Low share rate despite high downloads
- Users screenshot results instead of sharing link (hiding URL)
- Negative feedback in support emails

**Implementation:**
```typescript
// Offer frame selection before sharing
<ShareFrameSelector
  frames={[
    { id: 'proactive', label: 'Growth-focused', preview: '...' },
    { id: 'curious', label: 'Conversation starter', preview: '...' },
    { id: 'data', label: 'Data-driven', preview: '...' },
  ]}
  selected={selectedFrame}
  onChange={setSelectedFrame}
/>
```

---

### Pitfall 3: PNG Download Quality Issues

**What goes wrong:** Downloaded share cards look pixelated, fonts render poorly, colors are off.

**Why it happens:**
- Low canvas scale (1x retina = blurry on modern screens)
- Web fonts not loaded when canvas renders
- CSS transforms/filters don't translate to canvas
- CORS issues with external images

**How to avoid:**
1. **Set canvas scale to 2x:** `html2canvas(element, { scale: 2 })`
2. **Wait for fonts to load:** Use `document.fonts.ready`
3. **Avoid CSS filters:** Use solid colors, no backdrop-filter
4. **Load images with CORS:** `crossorigin="anonymous"` on img tags
5. **Test on actual devices:** Download looks different than screen

**Prevention code:**
```typescript
await document.fonts.ready; // Wait for fonts
const canvas = await html2canvas(element, {
  scale: 2, // 2x resolution
  useCORS: true, // External images
  backgroundColor: '#0f172a', // Explicit background
  logging: false, // Disable debug logs
});
```

**Warning signs:**
- Blurry text on high-DPI screens
- Missing images in downloaded file
- Color shifts (especially dark mode)

---

### Pitfall 4: Mobile Form UX Disasters

**What goes wrong:** Forms work on desktop, unusable on mobile (zoom issues, keyboard covers inputs, tap targets too small).

**Why it happens:** Desktop-first design approach ignores mobile constraints.

**How to avoid:**
1. **Font size ≥16px on inputs:** Prevents iOS auto-zoom
2. **Touch targets ≥44px:** iOS/Android accessibility guideline
3. **Sticky progress tracker:** Always visible during scroll
4. **Keyboard-aware spacing:** Add padding at bottom (keyboard doesn't cover submit button)
5. **Autofocus first input:** Keyboard appears immediately (smooth flow)
6. **Test on real devices:** Simulators miss real-world issues

**Mobile-specific CSS:**
```css
/* Prevent iOS zoom on input focus */
input, select, textarea {
  font-size: 16px;
}

/* Touch-friendly button */
button {
  min-height: 44px;
  min-width: 44px;
}

/* Keyboard-aware spacing */
form {
  padding-bottom: 300px; /* Extra space for keyboard */
}
```

**Warning signs:**
- High abandon rate on mobile (analytics)
- Users report "can't see submit button"
- Form zooms in unexpectedly

---

### Pitfall 5: Job Title Disambiguation Failures

**What goes wrong:** User types "engineer" → 50+ matches → overwhelmed → abandons.

**Why it happens:** O*NET has granular job classifications ("Software Engineer", "Network Engineer", "Civil Engineer", etc.). Returning all matches is unusable.

**How to avoid:**
1. **Limit matches to 5:** Force user to refine query
2. **Show confidence scores:** Help user validate selection
3. **Include descriptions:** Disambiguate similar titles
4. **Offer "no matches" escape:** Link to manual entry or support
5. **Log unmatched queries:** Improve fuzzy matching over time

**Prevention UX:**
```typescript
if (matches.length > 50) {
  return (
    <div className="text-sm text-muted-foreground">
      Too many matches. Please be more specific (e.g., "Software Engineer" instead of "Engineer").
    </div>
  );
}

if (matches.length === 0 && query.length > 2) {
  return (
    <div className="text-sm text-muted-foreground">
      No matches found. Try a different term or{' '}
      <Link href="/help" className="underline">contact support</Link>.
    </div>
  );
}
```

**Warning signs:**
- High abandon rate at job title step
- Support emails: "Can't find my job"
- Users select wrong occupation code (bad scoring results)

---

### Pitfall 6: OG Image Cache Staleness

**What goes wrong:** User updates results, shares link, old OG image still appears.

**Why it happens:** Social platforms cache OG images aggressively (7+ days on LinkedIn, Twitter).

**How to avoid:**
1. **Version OG URLs:** Include timestamp or hash in query params
2. **Use cache-busting:** `?v=${assessmentUpdatedAt.getTime()}`
3. **Short cache headers:** `Cache-Control: public, s-maxage=3600` (1 hour)
4. **Test with debuggers:** LinkedIn Post Inspector, Twitter Card Validator

**Implementation:**
```typescript
openGraph: {
  images: [
    {
      url: `/api/og?jobTitle=${encodeURIComponent(jobTitle)}&riskScore=${riskScore}&v=${updatedAt.getTime()}`,
      width: 1200,
      height: 630,
    },
  ],
}
```

**Warning signs:**
- Users report "old score showing when I share"
- OG image doesn't match current results page

---

### Pitfall 7: Email Deliverability Issues

**What goes wrong:** Results emails land in spam or don't arrive.

**Why it happens:**
- No SPF/DKIM records
- Generic from address (noreply@, no-reply@)
- Spam trigger words ("risk", "score", "free")
- High volume from new domain (rate limiting)

**How to avoid:**
1. **Configure Resend domain:** Add SPF/DKIM records to DNS
2. **Use branded from address:** `Unautomatable <hello@unautomatable.ai>` (not noreply@)
3. **Avoid spam triggers:** Test subject lines with mail-tester.com
4. **Warm up domain:** Start with low volume, increase gradually
5. **Include unsubscribe:** Required by anti-spam laws (even for transactional emails)

**Resend setup:**
```typescript
from: 'Unautomatable <hello@unautomatable.ai>', // Branded sender
reply_to: 'support@unautomatable.ai', // Real reply address (not noreply@)
```

**Warning signs:**
- Users report "didn't receive email"
- High bounce rate in Resend dashboard
- Emails in spam folder

---

### Pitfall 8: sessionStorage Data Loss on Mobile

**What goes wrong:** User completes step 1, switches apps, returns → progress lost.

**Why it happens:** Mobile browsers aggressively clear sessionStorage on memory pressure or tab cleanup.

**How to avoid:**
1. **Use localStorage for critical data:** More persistent than sessionStorage
2. **Add "Resume" link:** If localStorage has draft, show "Continue where you left off"
3. **Debounce saves:** Don't save on every keystroke (performance)
4. **Graceful degradation:** If storage fails, continue without persistence (don't block user)

**Migration to localStorage:**
```typescript
// Change from sessionStorage to localStorage for anonymous drafts
const STORAGE_KEY = 'assessment-draft';

// Save
localStorage.setItem(STORAGE_KEY, JSON.stringify(assessment));

// Load
const stored = localStorage.getItem(STORAGE_KEY);

// Clear after completion
localStorage.removeItem(STORAGE_KEY);
```

**Warning signs:**
- High abandon rate on step 2+ (analytics)
- Users report "lost my progress"
- More common on mobile than desktop

---

## Code Examples

### Example 1: Server Action for Risk Calculation

```typescript
// app/_actions/assessment.ts
'use server';

import { calculateRiskScore } from '@/lib/scoring/risk-calculator';
import { db } from '@/lib/db';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const calculateRiskInput = z.object({
  jobTitle: z.object({
    code: z.string(),
    title: z.string(),
  }),
  industry: z.string(),
  yearsExperience: z.number().min(0).max(50),
});

export async function calculateAndSaveAssessment(
  input: z.infer<typeof calculateRiskInput>
) {
  // Validate input
  const validated = calculateRiskInput.parse(input);

  // Calculate risk score (Phase 1 scoring engine)
  const result = await calculateRiskScore({
    occupationCode: validated.jobTitle.code,
    industry: validated.industry,
    yearsExperience: validated.yearsExperience,
  });

  // Save to database
  const assessment = await db.assessments.create({
    data: {
      jobTitle: validated.jobTitle.title,
      occupationCode: validated.jobTitle.code,
      industry: validated.industry,
      yearsExperience: validated.yearsExperience,
      riskScore: result.totalScore,
      layerBreakdown: result.layers,
      taskAnalysis: result.tasks,
      createdAt: new Date(),
    },
  });

  // Revalidate results page
  revalidatePath(`/results/${assessment.id}`);

  return {
    success: true,
    assessmentId: assessment.id,
    riskScore: result.totalScore,
  };
}
```

**Source:** Next.js Server Actions documentation (app router)

---

### Example 2: Dynamic Results Page with OG Tags

```typescript
// app/results/[id]/page.tsx
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { RiskScoreGauge } from '@/app/_components/results/RiskScoreGauge';
import { LayerBreakdown } from '@/app/_components/results/LayerBreakdown';
import { ShareCard } from '@/app/_components/results/ShareCard';
import { ShareButtons } from '@/app/_components/results/ShareButtons';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const assessment = await db.assessments.findUnique({
    where: { id: params.id },
  });

  if (!assessment) return {};

  const ogImageUrl = `/api/og?jobTitle=${encodeURIComponent(assessment.jobTitle)}&riskScore=${assessment.riskScore}&v=${assessment.updatedAt.getTime()}`;

  return {
    title: `${assessment.riskScore}% AI Risk - ${assessment.jobTitle}`,
    description: `AI displacement risk assessment for ${assessment.jobTitle}. See your career pivot options.`,
    openGraph: {
      title: `${assessment.riskScore}% AI Displacement Risk`,
      description: `${assessment.jobTitle} - Assess your career risk at Unautomatable.ai`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${assessment.riskScore}% AI Risk`,
      description: `${assessment.jobTitle} - Assess your career`,
      images: [ogImageUrl],
    },
  };
}

export default async function ResultsPage({ params }: PageProps) {
  const assessment = await db.assessments.findUnique({
    where: { id: params.id },
  });

  if (!assessment) notFound();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your AI Displacement Risk Assessment</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <RiskScoreGauge score={assessment.riskScore} />
        </div>
        <div>
          <ShareCard
            jobTitle={assessment.jobTitle}
            riskScore={assessment.riskScore}
            layers={assessment.layerBreakdown}
          />
        </div>
      </div>

      <ShareButtons assessmentId={assessment.id} />

      <LayerBreakdown layers={assessment.layerBreakdown} />

      <TaskRiskList tasks={assessment.taskAnalysis} />
    </div>
  );
}
```

**Source:** Next.js App Router metadata API documentation

---

### Example 3: Mobile-Optimized Slider Input

```typescript
// app/_components/assessment/ExperienceInput.tsx
'use client';

import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ExperienceInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function ExperienceInput({ value, onChange }: ExperienceInputProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="experience" className="text-base">
        Years of Experience
      </Label>
      
      <div className="flex items-center gap-4">
        <Slider
          id="experience"
          min={0}
          max={50}
          step={1}
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          className="flex-1"
        />
        
        <Input
          type="number"
          min={0}
          max={50}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
          className="w-20 text-center text-lg"
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        {value === 0 && 'Just starting out'}
        {value >= 1 && value < 3 && 'Early career'}
        {value >= 3 && value < 10 && 'Experienced professional'}
        {value >= 10 && 'Veteran professional'}
      </p>
    </div>
  );
}
```

**Source:** Radix UI Slider documentation

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Canvas API for social cards | @vercel/og (edge functions) | 2022-2023 | Edge rendering, declarative JSX API, platform-optimized. Canvas still used for client-side PNG downloads. |
| String concatenation emails | React Email components | 2023 | Type-safe templates, component reuse, inline CSS automation. Eliminates email client compatibility issues. |
| Custom form libraries | React Hook Form + Zod | 2021-2022 | Performance (uncontrolled), type-safe validation, async support. De facto standard for complex forms. |
| localStorage for all state | sessionStorage for anonymous sessions | Ongoing | Better privacy (auto-clears), less clutter. Use localStorage only for critical persistent data. |
| Chart.js + react-chartjs-2 | Recharts | 2020-2021 | React-native API (composable), smaller bundle, simpler integration. Recharts now default for React charts. |
| Fuzzy search libraries (Fuse.js) | Simple heuristic matching | N/A | For small datasets (<10k items), client-side linear scan with basic scoring suffices. Add Fuse.js only if needed. |

**Deprecated/outdated:**
- **html2canvas alternatives (dom-to-image, rasterizeHTML):** html2canvas is most maintained, best browser support
- **Vercel OG v1 (ImageResponse from @vercel/og):** Stable, no breaking changes expected
- **React Email v1:** Now at 5.x, stable API

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.2 + React Testing Library 16.3.2 |
| Config file | `vitest.config.ts` (already configured) |
| Quick run command | `npm test` |
| Full suite command | `npm run test:coverage` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ASSESS-01 | Free assessment without account | integration | `npm test tests/assessment/anonymous-flow.test.ts` | ❌ Wave 0 |
| ASSESS-02 | Job title fuzzy matching returns correct results | unit | `npm test tests/assessment/fuzzy-search.test.ts` | ❌ Wave 0 |
| ASSESS-03 | Industry and experience validation | unit | `npm test tests/assessment/validation.test.ts` | ❌ Wave 0 |
| ASSESS-04 | Risk score calculation integration | integration | `npm test tests/assessment/risk-calculation.test.ts` | ❌ Wave 0 |
| ASSESS-05 | Risk score visualization renders correctly | unit | `npm test tests/components/RiskScoreGauge.test.tsx` | ❌ Wave 0 |
| ASSESS-06 | Task breakdown displays correctly | unit | `npm test tests/components/TaskRiskList.test.tsx` | ❌ Wave 0 |
| ASSESS-07 | Email input validation | unit | `npm test tests/assessment/email-validation.test.ts` | ❌ Wave 0 |
| ASSESS-08 | Email delivery via Resend | integration | `npm test tests/assessment/email-delivery.test.ts` | ❌ Wave 0 |
| ASSESS-09 | Mobile responsiveness | manual | Visual testing on devices | Manual-only (viewport testing) |
| ASSESS-10 | sessionStorage persistence | unit | `npm test tests/assessment/session-storage.test.ts` | ❌ Wave 0 |
| VIRAL-01 | PNG download from share card | integration | `npm test tests/sharing/png-download.test.ts` | ❌ Wave 0 |
| VIRAL-02 | OG meta tags render correctly | unit | `npm test tests/sharing/og-tags.test.ts` | ❌ Wave 0 |
| LEGAL-01 | Help/FAQ page exists and renders | smoke | `npm test tests/legal/help-page.test.ts` | ❌ Wave 0 |
| LEGAL-04 | Contact mechanism present | smoke | `npm test tests/legal/contact.test.ts` | ❌ Wave 0 |
| LEGAL-05 | Methodology documented | smoke | `npm test tests/legal/methodology.test.ts` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm test` (run affected tests, < 30 seconds)
- **Per wave merge:** `npm run test:coverage` (full suite with coverage report)
- **Phase gate:** Full suite green + manual mobile testing before `/gsd-verify-work`

### Wave 0 Gaps

Phase 2 requires new test files for assessment flow validation:

- [ ] `tests/assessment/anonymous-flow.test.ts` — covers ASSESS-01 (end-to-end flow without auth)
- [ ] `tests/assessment/fuzzy-search.test.ts` — covers ASSESS-02 (job title matching accuracy)
- [ ] `tests/assessment/validation.test.ts` — covers ASSESS-03, ASSESS-07 (Zod schema validation)
- [ ] `tests/assessment/risk-calculation.test.ts` — covers ASSESS-04 (Server Action integration)
- [ ] `tests/components/RiskScoreGauge.test.tsx` — covers ASSESS-05 (Recharts rendering)
- [ ] `tests/components/TaskRiskList.test.tsx` — covers ASSESS-06 (task breakdown UI)
- [ ] `tests/assessment/email-delivery.test.ts` — covers ASSESS-08 (Resend integration)
- [ ] `tests/assessment/session-storage.test.ts` — covers ASSESS-10 (persistence logic)
- [ ] `tests/sharing/png-download.test.ts` — covers VIRAL-01 (html2canvas integration)
- [ ] `tests/sharing/og-tags.test.ts` — covers VIRAL-02 (Next.js metadata API)
- [ ] `tests/legal/help-page.test.ts` — covers LEGAL-01 (static page exists)
- [ ] `tests/legal/contact.test.ts` — covers LEGAL-04 (contact link present)
- [ ] `tests/legal/methodology.test.ts` — covers LEGAL-05 (citations documented)

**Additional tooling:**
- [ ] Mock Resend API for email tests (avoid real sends in test environment)
- [ ] Mock html2canvas for PNG tests (avoid real canvas rendering, test logic only)
- [ ] Vitest coverage thresholds in config (aim for 80%+ on business logic)

**Framework already installed:** ✅ Vitest + React Testing Library configured in Phase 1.

---

## Sources

### Primary (HIGH confidence)

- **Next.js 15+ App Router Documentation** - Server Components, Server Actions, metadata API, routing patterns (https://nextjs.org/docs)
- **Recharts 3.8.1 Documentation** - Chart components, composition patterns, responsive containers (https://recharts.org/en-US/api)
- **React Hook Form 7.72.0 Documentation** - Form state management, validation integration, performance patterns (https://react-hook-form.com/get-started)
- **Zod 4.3.6 Documentation** - Schema validation, type inference, error handling (https://zod.dev)
- **@vercel/og 0.11.1 Documentation** - Dynamic OG image generation at edge (https://vercel.com/docs/functions/og-image-generation)
- **html2canvas 1.4.1 GitHub README** - Client-side screenshot rendering, options, limitations (https://github.com/niklasvh/html2canvas)
- **React Email 5.2.10 Documentation** - Email component patterns, inline CSS, preview (https://react.email/docs/introduction)
- **Resend Documentation** - Email API, transactional email setup, React Email integration (https://resend.com/docs)
- **Radix UI Documentation** - Accessible component primitives (Select, Slider, Dialog) (https://www.radix-ui.com/primitives)
- **npm Registry** - Package version verification (all packages verified 2026-04-01)

### Secondary (MEDIUM confidence)

- **Mobile-first design principles** - iOS Human Interface Guidelines (touch targets ≥44px), Android Material Design (48dp minimum)
- **OG image specifications** - LinkedIn (1200x627), Twitter (1200x675), Facebook (1200x630) from official platform documentation
- **Email deliverability best practices** - SPF/DKIM configuration, spam trigger avoidance (industry standard practices)
- **sessionStorage vs localStorage usage patterns** - MDN Web Docs, privacy considerations

### Tertiary (LOW confidence)

- **Social sharing psychology** - Framing variants (proactive vs. anxiety-inducing) based on general UX principles, not specific research studies (would benefit from A/B testing validation)
- **Fuzzy search heuristics** - Simple scoring approach based on common patterns, not algorithmic research (sufficient for use case, but could be improved with user feedback)

---

## Metadata

**Confidence breakdown:**
- **Standard stack:** HIGH - All packages verified via npm registry (versions, publish dates), documentation reviewed
- **Architecture patterns:** HIGH - Patterns based on official Next.js/React documentation, proven practices from Phase 1
- **Social sharing (OG images):** HIGH - @vercel/og is official Vercel solution, platform requirements from official docs
- **Social sharing (PNG download):** MEDIUM - html2canvas is widely used but has known limitations (CSS compatibility), verified via GitHub
- **Email delivery:** HIGH - Resend + React Email documented and tested approach, already integrated in Phase 1
- **Mobile UX:** HIGH - iOS/Android guidelines are official platform documentation
- **Fuzzy search:** MEDIUM - Simple heuristics are sufficient for use case, but advanced algorithm (Fuse.js) available as fallback if needed
- **Validation architecture:** HIGH - Vitest already configured, test patterns follow standard practices

**Research date:** 2026-04-01  
**Valid until:** 2026-05-01 (30 days) — Framework stable (Next.js 16.x), library versions current, mobile guidelines evergreen

**Research gaps:**
- A/B testing data for share card framing variants (would improve conversion, but requires user traffic)
- Real-world OG cache invalidation timing across platforms (documented standard practices, but edge cases exist)
- Mobile browser sessionStorage reliability under memory pressure (documented pitfall, mitigation provided)

**Next steps for planner:**
- Create Wave 0 plan for test infrastructure (13 test files needed)
- Break Phase 2 into waves: Assessment Flow → Results Visualization → Social Sharing → Legal Pages
- Flag ASSESS-09 (mobile responsiveness) for manual verification checklist (not automated)
- Consider social share card framing as user-configurable feature (multiple variants)
