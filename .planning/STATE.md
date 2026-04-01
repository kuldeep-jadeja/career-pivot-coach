---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-04-01T10:37:00.000Z"
progress:
  total_phases: 7
  completed_phases: 0
  total_plans: 5
  completed_plans: 3
---

# Project State: Unautomatable

**Last Updated:** 2026-04-01  
**Project Phase:** Phase 1 - Foundation & Core Scoring (In Progress)

---

## Project Reference

### Core Value
Help mid-career professionals assess their AI displacement risk and get personalized, actionable 90-day career pivot plans at an impulse-buy price point ($19 one-time).

### Current Focus
Phase 1 Plans 01-03 complete: Infrastructure (Next.js, Tailwind, shadcn/ui), Database (Supabase with RLS, Stripe, Resend), and O*NET Data Pipeline (CSV parser, data loader, freshness system) established. Ready for Plan 04: Core Scoring Engine.

### Key Constraints
- **Zero budget:** Vercel free tier, Supabase free tier, Resend free tier (100 emails/day)
- **Solo developer + Claude:** No team, no stakeholders, no ceremonies
- **Tech stack:** Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui, Supabase (PostgreSQL + Auth), Stripe
- **LLM usage:** Google Gemini (primary) + Groq (fallback) for pivot plan narratives only — risk scoring is algorithmic
- **Data source:** O*NET bulk data (free, quarterly refresh cycles)

---

## Current Position

### Active Phase
**Phase 1:** Foundation & Core Scoring

### Active Plan
**Plan 01-04:** Core Scoring Engine (Next)

### Status
**Executing Phase 1** - 3 of 5 plans complete

### Progress
```
Project: [████░░░░░░░░░░░░░░░░] 9% (Phase 1: 3/5 plans complete)
Phase 1: [████████████░░░░░░░░] 60% (3/5 plans complete)

Milestone: Technical Foundation Established
```

---

## Performance Metrics

### Velocity
- **Phases completed:** 0/7
- **Plans completed:** 3/5 (Phase 1)
- **Requirements implemented:** 7/81 (INFRA-01, INFRA-05, INFRA-06, INFRA-07, DB-01, DB-02, DB-03)

### Quality
- **Requirement coverage:** 81/81 mapped (100%)
- **Orphaned requirements:** 0
- **Unmapped requirements:** 0
- **Build status:** PASSING (TypeScript, ESLint)
- **Test coverage:** 0% (test infrastructure ready, no tests yet)

### Decisions Made
- **7-phase structure:** Foundation → Free Assessment → Auth → Pivot Generation → Payment → Dashboard → Polish
- **Admin panel deferred:** Use Supabase Dashboard + Stripe Dashboard for MVP monitoring
- **Phase 4 flagged for research:** Dual-LLM integration needs additional investigation before planning
- **Tailwind CSS v4 with @theme syntax:** Using new @theme syntax instead of v3 CSS variables (Plan 01-01)
- **Sonner for notifications:** Replaced deprecated toast component with recommended sonner (Plan 01-01)
- **Vitest for testing:** Chose Vitest over Jest for faster test execution and better Vite integration (Plan 01-01)
- **Sample O*NET data for development:** Generate realistic sample data instead of requiring full download (Plan 01-03)
- **Windows-friendly version pointer:** Use current.json instead of symlink for cross-platform compatibility (Plan 01-03)
- **Three-tier data freshness system:** Green/yellow/red indicators with confidence scores address stale data pitfall (Plan 01-03)

---

## Accumulated Context

### Key Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| 7-phase roadmap structure | Follows value-delivery progression: validate viral hook → prove conversion → optimize retention | 2026-03-30 |
| Algorithmic risk scoring (not LLM) | Deterministic, fast, free, reproducible — no API costs for viral hook | 2026-03-30 |
| O*NET + published research | Grounded in real occupational data and peer-reviewed AI exposure metrics | 2026-03-30 |
| One-time $19 unlock (no subscription) | Simple pricing, no subscription anxiety, impulse-buy friendly | 2026-03-30 |
| Preview before paywall | Build trust, prove personalization, increase conversion after time investment | 2026-03-30 |
| Generate all 3 paths at once (not sequentially) | Better UX, shows full range of options upfront, enables meaningful choice | 2026-03-30 |
| Supabase (PostgreSQL + Auth) | Unified database and auth, simpler than MongoDB + Auth.js separate | 2026-03-30 |
| Vercel free tier deployment | Zero infrastructure cost, native Next.js support, edge functions | 2026-03-30 |
| Gemini + Groq fallback | Free tier LLM with backup, queue strategy for rate limits | 2026-03-30 |
| Resend for email | Free tier (100/day) sufficient for MVP validation | 2026-03-30 |
| Next.js App Router | Modern React framework, server components, easy deployment | 2026-03-30 |
| shadcn/ui components | High-quality, accessible UI components without heavy framework lock-in | 2026-03-30 |
| Dashboard is optional | Plans deliver value without forced engagement, respects user agency | 2026-03-30 |
| Defer admin panel | Use Supabase Dashboard + Stripe Dashboard for MVP monitoring | 2026-03-30 |
| Sample O*NET data for dev | Enables local development without 100MB+ download, real data added later | 2026-04-01 |
| Windows-friendly version pointer | JSON redirect instead of symlink for cross-platform compatibility | 2026-04-01 |
| Three-tier freshness system | Green/yellow/red with confidence scores addresses stale data pitfall | 2026-04-01 |
| Programmatic SEO pages | Top 50 job titles get dedicated landing pages for organic traffic | 2026-03-30 |
| Phase 01 P01 | 16 | 6 tasks | 26 files |

### Technology Stack Summary

**Frontend:**
- Next.js 15+ (App Router, Server Components, Server Actions)
- React 19+
- TypeScript 5+
- Tailwind CSS 4+
- shadcn/ui + Radix UI (accessible components)
- Zod + React Hook Form (complex multi-step forms)
- Recharts (career path visualization, risk breakdowns)

**Backend:**
- Next.js API Routes + Server Actions
- Supabase (PostgreSQL database + Auth)
- Resend (transactional email)
- Google Gemini API (primary LLM for narratives)
- Groq API (fallback LLM)
- Stripe (one-time payments)

**Data Processing:**
- csv-parse (O*NET CSV parsing)
- tsx (TypeScript script execution)

**Tooling:**
- Sharp (share card image generation)
- @vercel/og (Open Graph images for social media previews)
- Sentry (error tracking)

**Deployment:**
- Vercel (free tier, zero infrastructure cost)

**Data Sources:**
- O*NET bulk data (versioned JSON in public/data/onet-v28.3/, currently sample data)
- Published AI exposure research (Eloundou et al. "GPTs are GPTs", Felten et al.)

### Architectural Patterns

1. **Deterministic Scoring Engine:** Pure TypeScript functions for 4-layer risk algorithm (AI exposure + task automation + industry modifier + experience modifier). No LLM involvement in scoring.

2. **Versioned Data Pipeline:** O*NET CSVs → parsed JSON in versioned directories (onet-v28.3/) with current.json pointer for easy updates.

3. **Data Freshness Transparency:** Three-tier system (fresh/aging/stale) with visual indicators and confidence scores addresses stale data pitfall.

2. **Static Data Pre-processing:** O*NET CSVs transformed to optimized JSON at build time, served as static assets (fast, no DB queries, CDN-cacheable).

3. **Preview-Before-Paywall:** Generate full personalized content (all 3 pivot paths), show partial preview, gate full details behind payment (builds trust, proves value).

4. **Dual-LLM Fallback:** Gemini (primary) → Groq (backup) → queue for later + email user. Never block user flow on LLM failures.

5. **Webhook-Driven Payment State:** Stripe webhooks as source of truth for payment status (handles async completion, browser closed mid-payment).

---

### Critical Pitfalls to Avoid

Research identified 8 critical pitfalls with prevention strategies:

1. **Algorithmic Anchoring Bias:** Users fixate on risk score and ignore pivot plans
   - *Prevention:* Present score with opportunity context, visual balance of risk AND opportunity

2. **Job Title Mapping Hell:** Fuzzy matching fails for hybrid roles, company-specific titles
   - *Prevention:* Multi-step disambiguation UI (show 3-5 O*NET matches, let user pick), supplement with task selection

3. **Stale Occupational Data:** O*NET lags 2-3 years behind labor market reality
   - *Prevention:* Document O*NET version/date, plan quarterly refresh cycles, allow user feedback

4. **False Precision in Risk Scoring:** "74.3%" implies accuracy that doesn't exist
   - *Prevention:* Round to 5% increments, use confidence bands, qualitative labels

5. **Pivot Path Generic Recommendations:** User pays $19, sees generic advice, feels scammed
   - *Prevention:* Capture constraints in deeper assessment, apply filters BEFORE LLM generation, reference specific user inputs

6. **Skill Gap Analysis Vagueness:** "Learn SQL" without dialect, proficiency level, time estimate
   - *Prevention:* Define proficiency levels, link 2-3 specific resources, estimate time, include validation milestones

7. **90-Day Timeline Unrealism:** Fantasy timeline defeats user by Week 3
   - *Prevention:* Adjust timeline from user's hours/week, include buffer weeks, make editable in dashboard

8. **Share Card Design Ignores Context:** Anxiety-inducing cards on LinkedIn backfire
   - *Prevention:* Offer LinkedIn-friendly "proactive frame" variant, platform-specific copy suggestions

---

### TODOs

**Immediate (Roadmap Phase):**
- [x] Complete roadmap planning
- [x] Map all 81 requirements to phases
- [x] Define success criteria for each phase
- [x] Identify research flags (Phase 4 needs additional research)
- [x] Update REQUIREMENTS.md traceability section

**Next (Phase 1 Execution):**
- [x] Execute Plan 01-01: Project Setup & Infrastructure Foundation
- [ ] Execute Plan 01-02: Database Schema & Services Integration
- [ ] Execute Plan 01-03: O*NET Data Pipeline
- [ ] Execute Plan 01-04: Core Scoring Engine
- [ ] Execute Plan 01-05: Dual-LLM Client & Validation Suite

**Deferred:**
- Admin panel (use Supabase Dashboard + Stripe Dashboard)
- v2 requirements (advanced personalization, community features, enhanced insights)

---

### Blockers

**None currently.**

**Anticipated (Phase 4):**
- Dual-LLM integration for career narratives needs research (Gemini + Groq fallback, prompt engineering, rate limit handling, content filtering)

---

### Recent Changes

**2026-04-01:**
- ✅ **Completed Plan 01-03:** O*NET Data Pipeline
  - Created CSV download and parsing infrastructure
  - Generated sample O*NET data (5 occupations, tasks, skills, activities)
  - Implemented versioned JSON storage in public/data/onet-v28.3/
  - Built type-safe data loader with SSR/client hybrid loading
  - Created freshness calculation system (green/yellow/red confidence)
  - Added transparency UI components (footer, banner, badges)
  - 7 tasks completed, 21 files created, 4 commits, 13 minutes duration
  - TypeScript compiling successfully, all verifications passed

**2026-03-31:**
- ✅ **Completed Plan 01-02:** Database Schema & Services Integration
  - Set up Supabase project with PostgreSQL database
  - Created 6 core tables (users, assessments, pivot_plans, payments, onet_*, payment_events)
  - Configured Row Level Security policies for all tables
  - Integrated Supabase Auth with server-side utilities
  - Set up Resend email service and Stripe payment integration
  - Created database query utilities and types
  - Build passing, all integrations configured

- ✅ **Completed Plan 01-01:** Project Setup & Infrastructure Foundation
  - Initialized Next.js 16.2.1 with TypeScript 6.0.2, Tailwind CSS 4.2.2
  - Configured shadcn/ui with 9 components (New York style, Zinc base)
  - Created project directory structure (route groups, API routes, lib stubs)
  - Set up environment variables template (.env.example)
  - Configured Vercel deployment (vercel.json, README.md)
  - Added Vitest test infrastructure with React Testing Library
  - 6 tasks completed, 26 files created, 8 commits, 16 minutes duration
  - Build passing, TypeScript compiling successfully

**2026-03-30:**
- Completed comprehensive roadmap planning
- Mapped all 81 v1 requirements to 7 phases
- Defined success criteria for each phase (2-8 observable behaviors per phase)
- Cross-referenced with ARCHITECTURE.md build order
- Flagged Phase 4 for additional research (LLM integration complexity)
- Validated 100% requirement coverage (no orphans, no gaps)
- Deferred admin panel to reduce scope (use Supabase + Stripe dashboards)

---

## Session Continuity

### What Just Happened
Completed Plan 01-03 (O*NET Data Pipeline). Established complete data pipeline from CSV download to UI transparency. Created parsing infrastructure with sample data fallback, implemented type-safe data loader with SSR/client support, built three-tier freshness system (green/yellow/red), and added transparency components (footer disclaimer, freshness banner, confidence badges). All 7 tasks executed, TypeScript passing, ready for Plan 01-04.

### What's Next
Execute Plan 01-04: Core Scoring Engine. Implement the 4-layer AI displacement risk algorithm (AI exposure, task automation, industry modifier, experience modifier). Create scoring utilities, occupation mapping, and risk calculation functions. Integrate O*NET data loader for occupation analysis.

### Context for Next Agent
- **Plans 01-01, 01-02, 01-03 complete:** Infrastructure, Database, and O*NET Data Pipeline established
- **Next task:** Implement core scoring engine (4-layer risk algorithm)
- **Key files available:** O*NET data loader (`lib/data/onet-loader.ts`), types (`lib/data/types.ts`), freshness system (`lib/data/freshness.ts`)
- **Data ready:** Sample O*NET data in `public/data/onet-v28.3/` (5 occupations for testing)
- **Build status:** PASSING - no TypeScript or build errors

---

*State file created: 2026-03-30*  
*Last updated: 2026-03-31*  
*Next command: Execute Plan 01-02 (Database Schema & Services Integration)*
