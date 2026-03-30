# Project State: Unautomatable

**Last Updated:** 2026-03-30  
**Project Phase:** Roadmap Planning Complete

---

## Project Reference

### Core Value
Help mid-career professionals assess their AI displacement risk and get personalized, actionable 90-day career pivot plans at an impulse-buy price point ($19 one-time).

### Current Focus
Roadmap planning complete. All 81 v1 requirements mapped to 7 phases. Ready to begin Phase 1: Foundation & Core Scoring.

### Key Constraints
- **Zero budget:** Vercel free tier, Supabase free tier, Resend free tier (100 emails/day)
- **Solo developer + Claude:** No team, no stakeholders, no ceremonies
- **Tech stack:** Next.js (App Router), React, TypeScript, Tailwind, shadcn/ui, Supabase (PostgreSQL + Auth), Stripe
- **LLM usage:** Google Gemini (primary) + Groq (fallback) for pivot plan narratives only — risk scoring is algorithmic
- **Data source:** O*NET bulk data (free, quarterly refresh cycles)

---

## Current Position

### Active Phase
**None** — Roadmap planning phase complete

### Active Plan
**None** — No plans created yet

### Status
**Ready for Phase 1 Planning**

### Progress
```
Project: [░░░░░░░░░░░░░░░░░░░░] 0% (0/7 phases complete)

Milestone: Roadmap Created
```

---

## Performance Metrics

### Velocity
- **Phases completed:** 0/7
- **Plans completed:** 0
- **Requirements implemented:** 0/81

### Quality
- **Requirement coverage:** 81/81 mapped (100%)
- **Orphaned requirements:** 0
- **Unmapped requirements:** 0

### Decisions Made
- **7-phase structure:** Foundation → Free Assessment → Auth → Pivot Generation → Payment → Dashboard → Polish
- **Admin panel deferred:** Use Supabase Dashboard + Stripe Dashboard for MVP monitoring
- **Phase 4 flagged for research:** Dual-LLM integration needs additional investigation before planning

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
| Programmatic SEO pages | Top 50 job titles get dedicated landing pages for organic traffic | 2026-03-30 |

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

**Tooling:**
- Sharp (share card image generation)
- @vercel/og (Open Graph images for social media previews)
- Sentry (error tracking)

**Deployment:**
- Vercel (free tier, zero infrastructure cost)

**Data Sources:**
- O*NET bulk data (pre-processed CSVs → JSON)
- Published AI exposure research (Eloundou et al. "GPTs are GPTs", Felten et al.)

### Architectural Patterns

1. **Deterministic Scoring Engine:** Pure TypeScript functions for 4-layer risk algorithm (AI exposure + task automation + industry modifier + experience modifier). No LLM involvement in scoring.

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

**Next (Phase 1 Preparation):**
- [ ] Begin Phase 1 planning: `/gsd-plan-phase 1`
- [ ] Research O*NET bulk data download process (onetcenter.org)
- [ ] Review Next.js App Router documentation (latest)
- [ ] Review Supabase setup guides (PostgreSQL + Auth)

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
Completed comprehensive roadmap planning for Unautomatable project. All 81 v1 requirements mapped to 7 phases with clear success criteria, milestones, and risk mitigation strategies. Roadmap follows research recommendations: validate viral hook → prove conversion → optimize retention.

### What's Next
Begin Phase 1 planning with `/gsd-plan-phase 1`. Phase 1 focuses on technical foundation: Next.js setup, O*NET data processing, deterministic scoring engine, job title fuzzy matching, Supabase schema, and dual-LLM client configuration.

### Context for Next Agent
- **Roadmap complete:** 7 phases, 81 requirements mapped, 0 orphans
- **Phase 1 ready to plan:** Foundation & Core Scoring (10 requirements: INFRA-01 to INFRA-12)
- **Research flag:** Phase 4 needs additional LLM integration research
- **Admin panel deferred:** Use Supabase Dashboard + Stripe Dashboard for MVP
- **Key constraint:** Zero budget — all services must use free tiers

---

*State file created: 2026-03-30*  
*Next command: `/gsd-plan-phase 1`*
