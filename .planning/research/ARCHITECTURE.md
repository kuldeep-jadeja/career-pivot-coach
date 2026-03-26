# Architecture Research

**Domain:** Career Assessment & AI Risk Scoring Platform
**Researched:** 2024-12-19
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Landing  │  │  Quiz    │  │Dashboard │  │  Share   │        │
│  │  Pages   │  │  Flow    │  │   UI     │  │  Cards   │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └─────────────┴─────────────┴──────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER (API)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │Assessment│  │  Scoring │  │ Pivot    │  │ Payment  │        │
│  │  Service │  │  Engine  │  │Generator │  │ Handler  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│       └─────────────┴─────────────┴──────────────┘              │
├─────────────────────────────────────────────────────────────────┤
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   User   │  │Assessment│  │  Pivot   │  │ Payment  │        │
│  │   DB     │  │   DB     │  │  Plans   │  │ Records  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
├─────────────────────────────────────────────────────────────────┤
│                   STATIC DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐       │
│  │  O*NET Occupation Data (Pre-processed JSON)          │       │
│  │  - Task descriptions                                 │       │
│  │  - Skills & abilities                                │       │
│  │  - Work activities                                   │       │
│  │  - AI exposure baseline scores                       │       │
│  └──────────────────────────────────────────────────────┘       │
├─────────────────────────────────────────────────────────────────┤
│                  EXTERNAL SERVICES                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                       │
│  │  Stripe  │  │  Gemini  │  │  Email   │                       │
│  │ Payment  │  │   LLM    │  │ Service  │                       │
│  └──────────┘  └──────────┘  └──────────┘                       │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Assessment Service** | Collects user input, validates data, coordinates scoring | Next.js API routes + server actions |
| **Scoring Engine** | Deterministic AI risk calculation (4-layer algorithm) | Pure TypeScript functions, no DB queries |
| **Job Matcher** | Fuzzy matching user input to O*NET occupation codes | String similarity algorithms (Levenshtein, trigrams) |
| **Pivot Generator** | Creates 3 ranked career transition paths | Algorithm + Gemini API for narrative text |
| **Payment Handler** | Stripe checkout, webhook processing, access control | Next.js API routes + Stripe SDK |
| **Share Card Generator** | Creates downloadable images + OG meta tags | Canvas API (server-side) or external service |
| **User Auth** | Email/password authentication, session management | NextAuth.js or similar |
| **Dashboard Service** | Progress tracking, checklist state management | React components + MongoDB state |
| **Admin Panel** | Analytics, user management, revenue dashboard | Protected Next.js pages + MongoDB queries |

## Recommended Project Structure

```
app/
├── (marketing)/              # Public pages (no auth)
│   ├── page.tsx              # Landing page
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   └── help/                 # FAQ/help
├── (assessment)/             # Assessment flow
│   ├── quick-risk/           # Free risk quiz (no auth)
│   ├── results/              # Risk score display + share
│   └── deeper-assessment/    # Detailed assessment (auth required)
├── (dashboard)/              # User dashboard (auth required)
│   ├── layout.tsx            # Dashboard layout with nav
│   ├── page.tsx              # Overview/progress
│   ├── pivot-plans/          # View purchased plans
│   └── settings/             # User preferences
├── (admin)/                  # Admin panel (admin role)
│   ├── users/                # User management
│   ├── analytics/            # Traffic, conversions
│   └── revenue/              # Payment dashboard
├── api/
│   ├── assessment/
│   │   ├── score/            # POST: calculate risk score
│   │   └── deeper/           # POST: complete deeper assessment
│   ├── pivot/
│   │   ├── generate/         # POST: generate 3 pivot paths
│   │   └── preview/          # GET: preview before paywall
│   ├── payment/
│   │   ├── checkout/         # POST: create Stripe session
│   │   └── webhook/          # POST: Stripe webhook handler
│   ├── share/
│   │   └── card/             # GET: generate share card image
│   └── auth/
│       └── [...nextauth]/    # NextAuth endpoints
├── _actions/                 # Server actions
│   ├── assessment.ts         # Assessment mutations
│   ├── pivot.ts              # Pivot plan actions
│   └── user.ts               # User profile updates
└── _components/              # Shared components
    ├── ui/                   # shadcn/ui components
    ├── assessment/           # Quiz UI components
    ├── dashboard/            # Dashboard widgets
    └── admin/                # Admin UI components

lib/
├── scoring/                  # Scoring engine (core logic)
│   ├── risk-calculator.ts    # 4-layer risk algorithm
│   ├── layers/
│   │   ├── ai-exposure.ts    # Layer 1: Research baseline
│   │   ├── task-automation.ts # Layer 2: Task-level analysis
│   │   ├── industry-speed.ts # Layer 3: Industry modifier
│   │   └── experience.ts     # Layer 4: Experience modifier
│   └── job-matcher.ts        # Fuzzy job title matching
├── pivot/                    # Pivot generation logic
│   ├── generator.ts          # Main pivot algorithm
│   ├── skill-gap.ts          # Skill gap analysis
│   ├── path-ranking.ts       # Fit score calculation
│   └── narrative.ts          # Gemini API integration
├── data/                     # Static data access
│   ├── onet-loader.ts        # Load pre-processed O*NET data
│   ├── types.ts              # O*NET TypeScript types
│   └── research-scores.ts    # AI exposure research data
├── db/                       # Database layer
│   ├── mongodb.ts            # MongoDB connection
│   ├── models/               # Mongoose models
│   │   ├── user.ts
│   │   ├── assessment.ts
│   │   ├── pivot-plan.ts
│   │   └── payment.ts
│   └── queries/              # Common queries
├── auth/                     # Authentication
│   ├── config.ts             # NextAuth configuration
│   └── middleware.ts         # Auth checks
├── payment/                  # Payment processing
│   ├── stripe.ts             # Stripe client
│   └── webhook-handlers.ts   # Webhook logic
└── utils/                    # Utilities
    ├── share-card.ts         # Share card generation
    ├── email.ts              # Email sending
    └── validation.ts         # Input validation (Zod schemas)

public/
├── data/                     # Static O*NET data (JSON)
│   ├── occupations.json      # All occupation codes + metadata
│   ├── tasks.json            # Task descriptions by occupation
│   ├── skills.json           # Skills by occupation
│   └── ai-exposure.json      # Research baseline scores
└── assets/                   # Images, fonts

data-processing/              # One-time data prep scripts
├── scripts/
│   ├── download-onet.ts      # Download O*NET CSV files
│   ├── parse-onet.ts         # Convert CSV to JSON
│   ├── add-ai-scores.ts      # Merge research scores
│   └── validate-data.ts      # Data integrity checks
└── raw/                      # Downloaded CSVs (not in git)
```

### Structure Rationale

- **Route groups `(marketing)`, `(assessment)`, etc.:** Next.js App Router convention for layout organization without affecting URL structure
- **`lib/scoring/` as pure functions:** Keep scoring logic testable and independent of framework/DB
- **Static O*NET data in `public/data/`:** Pre-processed JSON files served as static assets (fast, no DB queries)
- **`_actions/` prefix:** Next.js convention for server actions (runs on server, callable from client)
- **Separate `data-processing/`:** One-time scripts kept separate from application code, not deployed
- **Co-located types:** TypeScript types near the code that uses them (e.g., `lib/data/types.ts` for O*NET)

## Architectural Patterns

### Pattern 1: Deterministic Scoring Engine

**What:** Pure functions that calculate risk score from input data with no side effects or randomness.

**When to use:** When scoring must be reproducible, cacheable, and independently testable.

**Trade-offs:**
- ✅ **Pros:** Fast, testable, no DB queries, same inputs = same output, easy to debug
- ❌ **Cons:** Cannot adapt scoring over time without versioning, no machine learning

**Example:**
```typescript
// lib/scoring/risk-calculator.ts
import { calculateAIExposure } from './layers/ai-exposure';
import { calculateTaskAutomation } from './layers/task-automation';
import { calculateIndustryModifier } from './layers/industry-speed';
import { calculateExperienceModifier } from './layers/experience';

export interface RiskInput {
  occupationCode: string;
  industryCode: string;
  yearsExperience: number;
  specificTasks: string[];
}

export interface RiskScore {
  overall: number;           // 0-100
  breakdown: {
    aiExposure: number;      // 35% weight
    taskAutomation: number;  // 35% weight
    industrySpeed: number;   // 15% weight
    experience: number;      // 15% weight
  };
  confidence: 'high' | 'medium' | 'low';
}

export function calculateRiskScore(input: RiskInput): RiskScore {
  // Pure calculation - no DB, no API calls, no randomness
  const layer1 = calculateAIExposure(input.occupationCode);      // 0-100
  const layer2 = calculateTaskAutomation(input.specificTasks);   // 0-100
  const layer3 = calculateIndustryModifier(input.industryCode);  // multiplier
  const layer4 = calculateExperienceModifier(input.yearsExperience); // multiplier
  
  const baseScore = (layer1 * 0.35) + (layer2 * 0.35);
  const adjusted = baseScore * layer3 * layer4;
  
  return {
    overall: Math.round(Math.max(0, Math.min(100, adjusted))),
    breakdown: {
      aiExposure: layer1,
      taskAutomation: layer2,
      industrySpeed: layer3,
      experience: layer4,
    },
    confidence: determineConfidence(input),
  };
}
```

### Pattern 2: Static Data Pre-processing

**What:** Convert external data sources (O*NET CSVs) into optimized JSON files at build time, not runtime.

**When to use:** When data updates infrequently (quarterly/yearly) and runtime transformation is wasteful.

**Trade-offs:**
- ✅ **Pros:** Fast reads, no DB queries, cacheable by CDN, version controlled
- ❌ **Cons:** Requires rebuild to update data, larger git repo size (mitigated with Git LFS)

**Example:**
```typescript
// data-processing/scripts/parse-onet.ts
import { parse } from 'csv-parse/sync';
import fs from 'fs';

interface ONETOccupation {
  code: string;
  title: string;
  description: string;
  tasks: string[];
  skills: Array<{name: string, level: number}>;
}

// Run once: node data-processing/scripts/parse-onet.ts
async function processONET() {
  const rawCSV = fs.readFileSync('data-processing/raw/occupations.csv', 'utf-8');
  const records = parse(rawCSV, { columns: true });
  
  // Transform to optimized structure
  const occupations: Record<string, ONETOccupation> = {};
  
  for (const record of records) {
    occupations[record['O*NET-SOC Code']] = {
      code: record['O*NET-SOC Code'],
      title: record['Title'],
      description: record['Description'],
      tasks: [], // Merged from tasks.csv
      skills: [], // Merged from skills.csv
    };
  }
  
  // Write to public/ for static serving
  fs.writeFileSync(
    'public/data/occupations.json',
    JSON.stringify(occupations, null, 2)
  );
  
  console.log(`Processed ${Object.keys(occupations).length} occupations`);
}
```

### Pattern 3: Preview-Before-Paywall

**What:** Generate full personalized content, show partial preview, gate full access behind payment.

**When to use:** Building trust with users, proving value before asking for money.

**Trade-offs:**
- ✅ **Pros:** Higher conversion (user invested time), demonstrates personalization quality
- ❌ **Cons:** Users already have data, must store generated content before payment

**Example:**
```typescript
// app/api/pivot/generate/route.ts
import { generatePivotPaths } from '@/lib/pivot/generator';
import { saveToDatabase } from '@/lib/db/queries';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  
  const assessment = await getUserAssessment(session.user.id);
  
  // Generate FULL pivot plans (all 3 paths, complete details)
  const pivotPaths = await generatePivotPaths(assessment);
  
  // Save complete plans to database
  await saveToDatabase({
    userId: session.user.id,
    assessmentId: assessment.id,
    paths: pivotPaths,
    status: 'preview', // User hasn't paid yet
    createdAt: new Date(),
  });
  
  // Return PARTIAL preview to client
  return Response.json({
    paths: pivotPaths.map(path => ({
      id: path.id,
      title: path.title,
      fitScore: path.fitScore,
      aiSafetyRating: path.aiSafetyRating,
      fitReasoning: path.fitReasoning,
      // Full details EXCLUDED: skillGaps, weekByWeekPlan, resources
      isLocked: true,
    })),
  });
}

// After payment webhook:
// UPDATE status: 'preview' → 'unlocked'
// Client refetches and now gets full details
```

### Pattern 4: Server Actions for Mutations

**What:** Use Next.js server actions for form submissions and data mutations instead of API routes.

**When to use:** When you need server-side logic triggered by user interaction (forms, buttons).

**Trade-offs:**
- ✅ **Pros:** Type-safe, progressive enhancement, reduced boilerplate, automatic revalidation
- ❌ **Cons:** Next.js specific, debugging can be harder than API routes

**Example:**
```typescript
// app/_actions/assessment.ts
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { saveAssessment } from '@/lib/db/queries';

export async function submitDeeperAssessment(formData: FormData) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  
  const assessment = {
    userId: session.user.id,
    jobTitle: formData.get('jobTitle') as string,
    specificTasks: JSON.parse(formData.get('tasks') as string),
    salaryNeeds: parseInt(formData.get('salary') as string),
    location: formData.get('location') as string,
    timeAvailable: formData.get('time') as string,
  };
  
  await saveAssessment(assessment);
  
  // Automatically revalidate dashboard page
  revalidatePath('/dashboard');
  
  return { success: true, assessmentId: assessment.id };
}

// Usage in component:
// <form action={submitDeeperAssessment}>
//   <input name="jobTitle" />
//   <button type="submit">Submit</button>
// </form>
```

### Pattern 5: Webhook-Driven State Transitions

**What:** Use external service webhooks (Stripe) as the source of truth for critical state changes.

**When to use:** Payment processing, order fulfillment, any async operation where user might close tab.

**Trade-offs:**
- ✅ **Pros:** Reliable, handles edge cases (user closes browser), idempotent
- ❌ **Cons:** Requires webhook verification, testing is harder, async delay

**Example:**
```typescript
// app/api/payment/webhook/route.ts
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { unlockPivotPlans } from '@/lib/db/queries';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    // Verify webhook came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    
    if (!userId) {
      console.error('No userId in session metadata');
      return Response.json({ error: 'Missing metadata' }, { status: 400 });
    }
    
    // Update database: mark pivot plans as unlocked
    await unlockPivotPlans(userId);
    
    // Send confirmation email
    await sendEmail({
      to: session.customer_email!,
      subject: 'Your Career Pivot Plans Are Ready',
      template: 'pivot-unlocked',
      data: { userId },
    });
  }
  
  return Response.json({ received: true });
}
```

## Data Flow

### Request Flow: Free Risk Assessment

```
[User visits /quick-risk]
    ↓
[QuizForm component] — user fills out job title, experience
    ↓
[submitQuiz server action]
    ↓
[Job Matcher] — fuzzy match "software developer" → "15-1252.00"
    ↓
[Scoring Engine] — pure calculation (no DB)
    ├─ Layer 1: AI Exposure (from static JSON)
    ├─ Layer 2: Task Automation (from static JSON)
    ├─ Layer 3: Industry Speed (hardcoded modifiers)
    └─ Layer 4: Experience (algorithm)
    ↓
[Save to DB] — store assessment + score (creates user if not exists)
    ↓
[Revalidate] — Next.js cache refresh
    ↓
[Redirect to /results/{assessmentId}]
    ↓
[Results page] — display score, share buttons, CTA for deeper assessment
```

### Request Flow: Paid Pivot Generation

```
[User completes deeper assessment]
    ↓
[submitDeeperAssessment server action]
    ↓
[Save to DB] — detailed assessment data
    ↓
[Redirect to /pivot-plans/preview]
    ↓
[API: POST /api/pivot/generate]
    ├─ [Pivot Generator]
    │   ├─ Skill Gap Analysis (compare current → target occupations)
    │   ├─ Path Ranking (fit score algorithm)
    │   └─ Narrative Generation (Gemini API call × 3 paths)
    ↓
    └─ Save full plans to DB (status: 'preview')
    ↓
[Return preview data to client] — titles, fit scores, blurred details
    ↓
[User clicks "Unlock for $19"]
    ↓
[API: POST /api/payment/checkout]
    ├─ Create Stripe checkout session
    └─ Redirect to Stripe
    ↓
[User completes payment on Stripe]
    ↓
[Stripe sends webhook to /api/payment/webhook]
    ├─ Verify signature
    ├─ Update DB: status: 'preview' → 'unlocked'
    └─ Send confirmation email
    ↓
[User redirected back to /pivot-plans]
    ↓
[API: GET /api/pivot/full] — now returns complete details
    ↓
[Display full pivot plans with 90-day action plans]
```

### Data Flow: Share Card Generation

```
[User clicks "Share my score"]
    ↓
[Client requests: GET /api/share/card?assessmentId={id}]
    ↓
[Share Card Generator]
    ├─ Fetch assessment from DB
    ├─ Generate image using Canvas API (server-side)
    │   ├─ Score visualization (circular chart)
    │   ├─ Occupation title
    │   ├─ Unautomatable branding
    │   └─ Share URL
    ├─ Save to temporary storage or return as base64
    └─ Return image URL
    ↓
[Client displays download button + social share buttons]

[Alternate: Social media link preview]
    ↓
[User shares URL: unautomatable.com/results/{id}]
    ↓
[Social crawler hits page]
    ↓
[Next.js generateMetadata] — server-side
    ├─ Fetch assessment from DB
    └─ Return OpenGraph tags:
        <meta property="og:image" content="/api/share/card?id={id}" />
        <meta property="og:title" content="{Name} got {score}% AI risk" />
    ↓
[Social platform displays rich preview]
```

### State Management

**Server-side (MongoDB):**
```
User Document
  ├─ id, email, passwordHash
  ├─ createdAt, lastLogin
  └─ paymentStatus: 'free' | 'paid'

Assessment Document
  ├─ userId (foreign key)
  ├─ type: 'quick' | 'deeper'
  ├─ inputs: { jobTitle, experience, ... }
  ├─ riskScore: { overall, breakdown }
  └─ timestamp

PivotPlan Document
  ├─ userId (foreign key)
  ├─ assessmentId (foreign key)
  ├─ status: 'preview' | 'unlocked'
  ├─ paths: [{ path1 }, { path2 }, { path3 }]
  └─ createdAt

Payment Document
  ├─ userId (foreign key)
  ├─ stripeSessionId
  ├─ amount, currency
  ├─ status: 'pending' | 'completed' | 'failed'
  └─ timestamp
```

**Client-side (React state):**
- Minimal — Next.js server components fetch on demand
- Form state: React Hook Form for complex forms
- UI state: Local useState for modals, accordions, etc.
- No global state manager needed (Zustand, Redux) — server state via Next.js cache

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| **0-1k users** | Monolith is perfect. Single Digital Ocean droplet, MongoDB Atlas free tier, static O*NET files on same server. All components in one Next.js app. |
| **1k-10k users** | Add Redis for rate limiting (API abuse prevention). Move static assets to CDN (CloudFront, Cloudflare). Upgrade MongoDB tier. Enable Next.js ISR (Incremental Static Regeneration) for marketing pages. |
| **10k-100k users** | Separate read/write databases (MongoDB replica set). Cache assessment results (Redis). Batch Gemini API calls. Add application monitoring (Sentry, DataDog). Consider serverless functions for spiky traffic (Vercel Edge, Cloudflare Workers). |
| **100k+ users** | Split services: scoring engine → separate service, pivot generator → separate service. Add job queue for async work (BullMQ, Inngest). Use CDN for share card images. Consider microservices if team grows beyond 5 engineers. |

### Scaling Priorities

1. **First bottleneck: Database queries**
   - **Symptom:** Slow dashboard loads, assessment fetching delays
   - **Fix:** Add MongoDB indexes on `userId`, `assessmentId`, `status` fields. Enable query result caching (Redis). Use Next.js data cache (`fetch` with `revalidate`).

2. **Second bottleneck: Gemini API rate limits**
   - **Symptom:** Free tier quota exhausted (60 requests/minute)
   - **Fix:** Implement request queuing (avoid parallel calls). Cache generated narratives (keyed by assessment fingerprint). Consider paid tier or alternative LLM (OpenAI GPT-3.5-turbo).

3. **Third bottleneck: Share card generation**
   - **Symptom:** CPU-intensive canvas rendering slows response times
   - **Fix:** Pre-generate cards on assessment completion (background job). Use external service (Cloudinary, imgix) for image generation. Cache generated images by assessment ID.

## Anti-Patterns

### Anti-Pattern 1: LLM-Dependent Risk Scoring

**What people do:** Use ChatGPT/Gemini to calculate AI displacement risk based on job description.

**Why it's wrong:**
- Non-deterministic (same input → different scores)
- Expensive (API costs scale with users)
- Slow (network latency + generation time)
- Unverifiable (can't explain scoring methodology)
- Breaks viral mechanic (users re-run to get "better" score)

**Do this instead:** Pure algorithmic scoring based on pre-processed research data. LLMs only for narrative text generation (non-critical feature).

### Anti-Pattern 2: Real-Time O*NET API Calls

**What people do:** Query O*NET Web Services API for occupation data on every assessment.

**Why it's wrong:**
- Rate limits (API key required, limited requests)
- Latency (300-500ms per request)
- Dependency risk (if O*NET API down, app breaks)
- Unnecessary (data updates quarterly, not real-time)

**Do this instead:** Download O*NET bulk data quarterly, pre-process into optimized JSON, serve as static files. One-time setup script, zero runtime dependencies.

### Anti-Pattern 3: Generating Pivot Plans Before Payment

**What people do:** Generate plans in preview endpoint, discard them, regenerate after payment.

**Why it's wrong:**
- Wasteful (2× Gemini API calls = 2× costs)
- Inconsistent (user sees different plan after paying)
- Slow (user waits again after payment)

**Do this instead:** Generate ONCE before payment, save to database with `status: 'preview'`, return partial data to client. On payment, update status to `unlocked` and return full data.

### Anti-Pattern 4: Client-Side Scoring Calculation

**What people do:** Include scoring algorithm in client JavaScript to reduce API calls.

**Why it's wrong:**
- Exposes proprietary algorithm (visible in browser dev tools)
- Users can manipulate scores
- Cannot evolve algorithm without re-deploying client
- Still need server validation (defeats purpose)

**Do this instead:** Always calculate on server. Client sends input data, server returns score. Caching (Redis, Next.js cache) handles performance concerns.

### Anti-Pattern 5: Session-Based Payment Tracking

**What people do:** Track payment status in user session/cookies instead of database.

**Why it's wrong:**
- User closes browser → loses access
- Cannot support multiple devices
- Session hijacking → unauthorized access
- No audit trail for support/refunds

**Do this instead:** Stripe webhooks update database (`paymentStatus: 'paid'`). Session only stores authentication, not authorization. Every protected route checks database for current payment status.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| **Stripe** | Checkout Sessions + Webhooks | Use `metadata` field to pass `userId`. Always verify webhook signatures. Handle idempotency (stripe-signature header). Test with Stripe CLI. |
| **Google Gemini** | REST API (flash-8b model) | Free tier: 60 RPM, 1 million tokens/day. Use `generateContent` endpoint. Implement exponential backoff for rate limits. Cache results by assessment hash. |
| **Email (Resend/SendGrid)** | REST API (transactional) | Templates for: account confirmation, payment receipt, pivot plan unlock. Use environment variables for API keys. Implement retry logic. |
| **MongoDB Atlas** | MongoDB driver | Use connection pooling (Next.js global singleton). Index fields: `userId`, `assessmentId`, `email`, `status`. Enable change streams for real-time updates if needed. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **UI ↔ API** | Server Actions + API Routes | Prefer server actions for mutations. API routes for GET requests, webhooks, third-party integrations. |
| **API ↔ Scoring Engine** | Direct function calls | Import scoring functions directly. Pure functions, no dependencies. |
| **API ↔ Database** | Query functions | Abstract MongoDB behind query layer (`lib/db/queries/`). Easier to swap DB later. |
| **Scoring ↔ Static Data** | JSON imports | O*NET data loaded at runtime from `public/data/`. Use dynamic imports for large files. |
| **Pivot Generator ↔ Gemini** | HTTP REST API | Wrap in try/catch, handle rate limits gracefully. Fallback: use template-based narrative if API fails. |
| **Payment ↔ User State** | Webhook updates DB | Stripe webhook updates `Payment` document → triggers revalidation → UI shows unlocked content. |

## Build Order Recommendations

Based on component dependencies and value delivery:

### Phase 1: Foundation (Core Infrastructure)
**Goal:** Minimal working app with basic scoring
1. Project setup (Next.js, shadcn/ui, MongoDB)
2. O*NET data processing scripts (download, parse, save JSON)
3. Scoring engine (4-layer algorithm as pure functions)
4. Job matcher (fuzzy matching to O*NET codes)
5. Basic UI (landing page, quiz form)

**Milestone:** Can calculate and display risk score (no auth, no DB persistence yet)

### Phase 2: Free Assessment Flow
**Goal:** Viral hook with shareability
1. Database models (User, Assessment)
2. Assessment API (save inputs + scores)
3. Results page (score visualization)
4. Share card generation (downloadable image + OG meta tags)
5. Basic analytics (page views, assessments completed)

**Milestone:** Complete free flow, shareable cards working

### Phase 3: Authentication & Deeper Assessment
**Goal:** Capture user accounts for conversion
1. NextAuth.js setup (email/password)
2. User registration/login flow
3. Deeper assessment form (detailed questions)
4. Dashboard layout (navigation, user menu)

**Milestone:** Users can create accounts and complete detailed assessments

### Phase 4: Pivot Generation
**Goal:** Generate personalized career paths
1. Pivot generation algorithm (skill gaps, path ranking)
2. Gemini API integration (narrative generation)
3. Preview endpoint (partial data)
4. Preview UI (show titles, blur details)

**Milestone:** Users see 3 personalized pivot path previews

### Phase 5: Payment & Unlock
**Goal:** Monetization flow
1. Stripe integration (checkout sessions)
2. Payment webhook handler
3. Unlock logic (status update in DB)
4. Full pivot plan display
5. Email confirmations

**Milestone:** Complete paid conversion flow works end-to-end

### Phase 6: Dashboard & Tracking
**Goal:** Retention and user engagement
1. Dashboard overview (progress metrics)
2. Checklist UI (week-by-week tasks)
3. Progress tracking (manual checkboxes)
4. Timeline view (visual roadmap)

**Milestone:** Users can track their pivot plan progress

### Phase 7: Admin & Analytics
**Goal:** Business operations support
1. Admin authentication/authorization
2. User management UI
3. Analytics dashboard (traffic, conversions, revenue)
4. Payment records view

**Milestone:** Admin can monitor business metrics and support users

### Phase 8: Polish & Optimization
**Goal:** Production readiness
1. Error handling and user feedback
2. Loading states and skeletons
3. SEO optimization (metadata, sitemaps)
4. Performance optimization (caching, lazy loading)
5. Help/FAQ content
6. Terms of Service, Privacy Policy

**Milestone:** Production-ready application

## Sources

**Architecture Patterns:**
- Next.js App Router documentation (official) — https://nextjs.org/docs/app
- Next.js Server Actions documentation (official) — https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- MongoDB schema design best practices (official) — https://www.mongodb.com/docs/manual/core/data-modeling-introduction/
- Stripe webhook integration guide (official) — https://stripe.com/docs/webhooks

**Career Assessment Systems:**
- O*NET Resource Center architecture (observational) — https://www.onetcenter.org/overview.html
- Professional assessment platforms (general knowledge of psychometric platforms like Gallup StrengthsFinder, Myers-Briggs, which use similar scoring engine patterns)

**Risk Scoring Systems:**
- Credit scoring architectures (FICO model concepts — deterministic, multi-layer, weighted factors)
- Health risk assessment platforms (CDC health risk calculators, similar input → score flow)

**Recommendation Engines:**
- Educational path recommendation systems (Coursera, LinkedIn Learning path suggestions)
- Career guidance platforms (general patterns from O*NET Interest Profiler, CareerOneStop)

**Confidence Level:** HIGH — Architecture based on:
1. Official Next.js documentation (authoritative)
2. MongoDB and Stripe official documentation (authoritative)
3. Standard patterns for risk scoring and assessment platforms (well-established domain)
4. Project requirements explicitly stated in PROJECT.md (no guessing)

---
*Architecture research for: AI Career Pivot Coach (Unautomatable)*
*Researched: 2024-12-19*
