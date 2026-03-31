# Project Roadmap: Unautomatable

**Project:** AI Career Pivot Coach  
**Created:** 2026-03-30  
**Granularity:** Standard (7 phases)  
**Total Requirements:** 81 v1 requirements

## Overview

Unautomatable delivers AI displacement risk assessment paired with actionable career pivot plans. The roadmap follows a value-delivery progression: **validate viral hook → prove conversion → optimize retention**. Each phase builds on the previous, delivering verifiable user value while avoiding critical pitfalls identified in research.

**Key Strategy:**
- Free viral assessment validates market demand (Phase 1-2)
- Authentication gates deeper personalization only after viral validation (Phase 3)
- ALL 3 pivot paths generated simultaneously before payment (Phase 4)
- Preview-before-paywall builds trust and proves value (Phase 5)
- Progress tracking optimizes retention (Phase 6)
- Production polish enables scale (Phase 7)

**Admin Panel Decision:** Deferred from roadmap — use Supabase Dashboard + Stripe Dashboard for MVP monitoring.

---

## Phases

- [ ] **Phase 1: Foundation & Core Scoring** - Technical infrastructure and deterministic risk algorithm
- [ ] **Phase 2: Free Assessment Flow (Viral Hook)** - Public risk assessment with shareable cards
- [ ] **Phase 3: Authentication & Deeper Assessment** - User accounts and personalization inputs
- [ ] **Phase 4: Pivot Path Generation** - AI-powered career transition plans (3 paths)
- [ ] **Phase 5: Payment & Unlock Flow** - Stripe integration and plan monetization
- [ ] **Phase 6: Progress Tracking Dashboard** - Execution support and retention optimization
- [ ] **Phase 7: Polish & Production Readiness** - SEO, performance, security, legal compliance

---

## Phase Details

### Phase 1: Foundation & Core Scoring

**Goal:** Establish technical infrastructure and prove the core risk scoring algorithm works accurately. No user-facing features yet — focus on data quality, scoring correctness, and project foundation.

**Depends on:** Nothing (first phase)

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07, INFRA-08, INFRA-11, INFRA-12

**Success Criteria** (what must be TRUE):
1. Developer can run Next.js app locally with TypeScript, Tailwind, shadcn/ui configured
2. O*NET bulk data (occupations, tasks, skills) is downloaded, parsed to JSON, and version controlled
3. Deterministic scoring engine calculates 4-layer risk scores (AI exposure + task automation + industry modifier + experience modifier) as pure TypeScript functions
4. Job title fuzzy matching returns 3-5 O*NET occupation matches with confidence scores for test inputs
5. Supabase database schema created with users, assessments, pivot_plans, payments tables and Row Level Security policies
6. Dual-LLM client configured with Gemini (primary) → Groq (fallback) → email queue for failures
7. All environment variables (.env.local) configured and documented in README
8. Developer can insert test assessment data and verify scoring engine returns expected results

**Milestone:** Risk scoring engine returns accurate, reproducible scores for 50+ diverse job title inputs (tech roles, traditional roles, hybrid roles). Data pipeline is documented and repeatable.

**Risks & Mitigation:**
- **Stale O*NET data** (Pitfall 3) — Document version/date clearly in footer, plan quarterly refresh
- **False precision in scoring** (Pitfall 4) — Round to 5% increments, use confidence bands
- **Job title mapping hell** (Pitfall 2) — Build disambiguation UI logic from start, log confidence scores

**Plans:**
1. ✅ [Project Setup & Infrastructure Foundation](phases/01/plans/01-01-PLAN.md) - COMPLETE (16 min, 6 tasks, 8 commits)
2. [ ] [Database Schema & Services Integration](phases/01/plans/01-02-PLAN.md) (3-4h, 6 tasks)
3. [ ] [O*NET Data Pipeline](phases/01/plans/01-03-PLAN.md) (3-4h, 7 tasks)
4. [ ] [Core Scoring Engine](phases/01/plans/01-04-PLAN.md) (3-4h, 7 tasks)
5. [ ] [Dual-LLM Client & Validation Suite](phases/01/plans/01-05-PLAN.md) (3-4h, 7 tasks)

**Progress:** 1/5 plans complete (20%)

---

### Phase 2: Free Assessment Flow (Viral Hook)

**Goal:** Validate the product hook — do people care about AI displacement risk? Free assessment with shareable cards tests market demand before building monetization infrastructure. Users can take assessment, see risk score, and share results socially — all without creating an account.

**Depends on:** Phase 1 (scoring engine and data pipeline must work)

**Requirements:** ASSESS-01, ASSESS-02, ASSESS-03, ASSESS-04, ASSESS-05, ASSESS-06, ASSESS-07, ASSESS-08, ASSESS-09, ASSESS-10, VIRAL-01, VIRAL-02, LEGAL-01, LEGAL-04, LEGAL-05

**Success Criteria** (what must be TRUE):
1. Anonymous user can complete free risk assessment in under 5 minutes without account creation
2. User inputs job title and sees 3-5 O*NET occupation matches with descriptions, can select best fit
3. User inputs industry and years of experience via simple form
4. System calculates and displays risk score (0-100) with visual breakdown by layer (charts/gauges)
5. User sees task-level breakdown showing which specific tasks are at high risk vs. safe
6. User can download shareable score card as PNG image with professional design
7. Score results page has dynamic OG meta tags that render correctly when shared on LinkedIn/Twitter/Facebook
8. User can provide email to receive results, system sends email via Resend
9. Assessment is fully mobile responsive and usable on phones
10. Assessment saves progress in session storage (anonymous users can refresh without losing data)
11. Landing page explains methodology with academic citations (O*NET, Eloundou, Felten research)

**Milestone:** 100+ real users complete free assessment. Shareability validated — at least 10% of users download or share score cards. No critical bugs in scoring logic reported.

**Risks & Mitigation:**
- **Algorithmic anchoring bias** (Pitfall 1) — Present score with opportunity context ("74% at risk, but 82% of skills transfer to 3 careers")
- **Share card design ignores context** (Pitfall 8) — Offer LinkedIn-friendly "proactive frame" variant
- **Job title mapping failures** — Validate disambiguation UI with real users, collect feedback
- **Viral traffic overwhelms infrastructure** — Rate limiting (10 assessments/hour per IP), caching

**Research Flag:** May need brief OG tag research (social platform image requirements vary by platform). Otherwise standard patterns.

**Plans:** TBD

---

### Phase 3: Authentication & Deeper Assessment

**Goal:** Convert engaged users from free assessment into account holders. Deeper assessment captures personalization inputs needed for quality pivot plans. Anonymous assessments are automatically linked to user account upon registration.

**Depends on:** Phase 2 (free assessment must validate user interest)

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08, AUTH-09, DEEP-01, DEEP-02, DEEP-03, DEEP-04, DEEP-05, DEEP-06, DEEP-07, LEGAL-02, LEGAL-03

**Success Criteria** (what must be TRUE):
1. User can sign up with email/password or Google OAuth via Supabase Auth
2. User receives email verification after signup via Resend and can confirm email address
3. User can log in with email/password or Google and session persists across browser refresh
4. User can log out and session ends properly (no lingering access)
5. User can reset password via email link if forgotten
6. User can update profile settings (name, email, password change) from dashboard
7. Anonymous risk score data from free assessment is automatically linked when user creates account (session cookie or localStorage ID tracks anonymous assessments, merges on account creation)
8. Authenticated user can access deeper assessment form with multi-step flow
9. User can input current skills with auto-suggest from O*NET database + manual skill additions
10. User can input salary requirements/expectations (minimum acceptable salary)
11. User can input time availability (hours per week available for reskilling)
12. User can input location/remote work preferences
13. User can input industry preferences (what sectors interest them for pivot)
14. Deeper assessment saves progress automatically (user can abandon and resume later)
15. Site has Privacy Policy and Terms of Service pages that are GDPR/CCPA compliant

**Milestone:** 50+ users create accounts and complete deeper assessment. Account creation friction is measurable but doesn't kill conversion (aim for >60% of engaged free assessment users creating accounts).

**Risks & Mitigation:**
- **Auth friction kills viral growth** — Keep auth gate AFTER free assessment, not before
- **Generic recommendations** (Pitfall 5) — Deeper assessment captures constraints (salary floor, hours/week, location) that prevent personalization theater
- **Timeline unrealism** (Pitfall 7) — Hours/week input enables accurate timeline calculation
- **Privacy concerns for salary/location** — Encrypt PII at rest, explain why data is needed

**Research Flag:** Standard auth patterns — no additional research needed. Supabase Auth + Resend docs cover setup.

**Plans:** TBD

---

### Phase 4: Pivot Path Generation

**Goal:** Build the core paid value — personalized career transition paths. Generate ALL 3 paths simultaneously (not sequentially) before payment using preview-before-paywall pattern. Each path includes skill gaps, 90-day action plan, fit score, AI-safety rating, and free learning resources.

**Depends on:** Phase 3 (deeper assessment inputs required for personalization)

**Requirements:** PIVOT-01, PIVOT-02, PIVOT-03, PIVOT-04, PIVOT-05, PIVOT-06, PIVOT-07, PIVOT-08, PIVOT-09, PIVOT-10, PIVOT-11, PIVOT-12, PAY-01

**Success Criteria** (what must be TRUE):
1. System generates all 3 career pivot paths simultaneously (not sequentially) after user completes deeper assessment
2. Each path includes skill gap analysis showing current vs. target role skills with specific gaps identified
3. Each path includes 90-day week-by-week action plan with specific milestones (not generic "learn X")
4. Each path includes fit score (0-100) with transparent reasoning explaining "why this path fits you" based on user inputs
5. Each path includes AI-safety rating (0-100) for target role showing future-proof assessment
6. Each path includes curated free learning resources mapped to specific skill gaps (2-3 resources per skill)
7. Each path includes salary information for target role with location-adjusted ranges
8. Each path includes realistic time estimate based on user's hours/week availability (not generic 90 days)
9. Each path includes industry adoption speed context (Layer 3 from risk scoring — how fast is AI being adopted in target industry)
10. Each path includes transferable strengths identification (which tasks/skills carry over from current role)
11. System uses Gemini API (primary) for narrative generation with Groq as fallback
12. Failed LLM requests (after both Gemini and Groq fail) are queued for retry and user receives email notification when plans are ready (don't block user flow)
13. User sees preview UI showing all 3 path titles, fit scores, AI-safety ratings with full details blurred
14. Preview UI clearly shows what's included in full unlock ("Unlock all 3 plans for $19" with explicit value list)

**Milestone:** 10+ diverse test users (single parents, recent grads, mid-career professionals) generate plans that feel genuinely personalized (not generic "learn Python"). Dual-LLM fallback chain works reliably under load.

**Risks & Mitigation:**
- **Generic recommendations** (Pitfall 5) — Apply constraint filters BEFORE LLM generation, reference specific user inputs in "why this fits you" sections
- **Skill gap vagueness** (Pitfall 6) — Define proficiency levels, link to 2-3 specific resources, estimate time, include validation milestones
- **Timeline unrealism** (Pitfall 7) — Calculate timeline from user's hours/week, include buffer weeks, make timeline editable later
- **LLM rate limits** — Implement Gemini → Groq fallback, queue failed requests, email user when ready
- **LLM hallucinations** — Validate response structure, check for fake credentials/schools, sanitize output

**Research Flag:** **Needs phase research** for dual-LLM integration (Gemini + Groq fallback). Prompt engineering for career narratives, rate limit handling, content filtering for bias/offensive output. High complexity, sparse documentation for this specific use case.

**Plans:** TBD

---

### Phase 5: Payment & Unlock Flow

**Goal:** Monetize validated value. Users have seen preview of all 3 paths, now pay $19 one-time to unlock full details for all plans. Stripe Checkout with webhook-driven fulfillment ensures reliability.

**Depends on:** Phase 4 (pivot paths must be generated and previewed before payment)

**Requirements:** PAY-02, PAY-03, PAY-04, PAY-05, PAY-06, PAY-07, PAY-08, INFRA-09, INFRA-10

**Success Criteria** (what must be TRUE):
1. User clicks "Unlock All 3 Plans for $19" button and redirects to Stripe Checkout session
2. Stripe Checkout session includes user metadata (userId, assessmentId) for webhook matching
3. Stripe webhook endpoint verifies webhook signatures for security
4. Webhook handler updates Supabase status from 'preview' → 'unlocked' idempotently (handles duplicate webhooks)
5. After successful payment, user is redirected to dashboard and sees full details for all 3 pivot paths (no blur)
6. User receives payment receipt email via Resend within 5 minutes of payment
7. User receives plan unlock notification email via Resend with all 3 plans (full text or links)
8. Payment flow works in test mode (Stripe test keys) and production mode with clear labeling
9. Free assessment endpoint has rate limiting (10 per hour per IP) to prevent scraping
10. Error tracking configured (Sentry or similar) to catch payment failures and LLM errors

**Milestone:** First 5 paying users successfully unlock plans without manual intervention. Payment → unlock flow completes in under 2 minutes. Zero refund requests due to technical failures.

**Risks & Mitigation:**
- **Payment webhook failures** — Implement retry logic, manual reconciliation via Stripe Dashboard
- **User closes browser mid-payment** — Webhook-driven state handles async completion
- **Webhook signature validation failures** — Test with Stripe CLI before production
- **Double charges** — Idempotent webhook handling (check payment already processed before unlocking)

**Research Flag:** Standard Stripe patterns — no additional research needed. Follow Stripe webhook documentation and test with Stripe CLI.

**Plans:** TBD

---

### Phase 6: Progress Tracking Dashboard

**Goal:** Optimize for retention and plan completion. Users who complete plans generate testimonials and word-of-mouth growth. Dashboard provides lightweight optional tracking (not mandatory engagement).

**Depends on:** Phase 5 (users must have unlocked plans to track progress)

**Requirements:** TRACK-01, TRACK-02, TRACK-03, TRACK-04, TRACK-05, TRACK-06

**Success Criteria** (what must be TRUE):
1. User can access dashboard overview showing progress metrics (% complete), completed tasks, and timeline visualization
2. User sees week-by-week checklist UI with expandable milestones for their chosen pivot path
3. User can manually check off completed tasks and checkmarks persist across sessions
4. User sees progress visualization (charts, progress bars, completion percentage) with satisfying feedback
5. User can mark tasks as "skip" or "not applicable" without guilt (optional engagement)
6. User sees timeline view with current week highlighted and visual roadmap of remaining weeks
7. Dashboard clearly communicates that tracking is optional ("Track your progress if you want") — plan delivers value regardless
8. User can switch between all 3 unlocked pivot paths to compare or change direction

**Milestone:** 30%+ of paying users engage with dashboard at least once per week. Users who check off 5+ tasks are measurably more likely to complete plans (validate hypothesis with analytics).

**Risks & Mitigation:**
- **Progress tracking feels mandatory** (Pitfall via UX) — Frame as optional, avoid guilt-inducing language
- **Users abandon after 2-3 weeks** (Pitfall 7) — Analytics reveal stall points, adjust timeline defaults
- **Checkbox fatigue** — Keep UI lightweight, allow bulk "skip" for irrelevant sections

**Research Flag:** Standard dashboard patterns — no additional research needed. Follow Recharts documentation for timeline visualizations.

**Plans:** TBD

---

### Phase 7: Polish & Production Readiness

**Goal:** Final polish for public launch. SEO (including programmatic job title pages), comprehensive error handling, legal compliance, performance optimization, and security hardening. Ready for viral traffic.

**Depends on:** Phase 6 (core features complete, now optimize for scale)

**Requirements:** VIRAL-03

**Success Criteria** (what must be TRUE):
1. Site has comprehensive error handling with user-friendly messages (no raw error dumps)
2. All loading states have skeleton screens or spinners (perceived performance)
3. SEO optimized with proper metadata, sitemaps, structured data (JSON-LD for career content)
4. Programmatic SEO pages for top 50 job titles (/risk/[job-slug]) are pre-rendered as static pages with job-specific content
5. Performance optimized: landing page loads in <2s, images optimized, Next.js ISR/SSG for marketing pages, caching enabled
6. Help/FAQ content written explaining methodology, limitations, and common questions
7. Rate limiting protects all public endpoints (assessment, API routes) from abuse and scraping
8. Monitoring and alerts configured for: LLM quota usage (alert at 80%), error rates (alert >1%), payment failures
9. Security hardened: input sanitization for all user inputs, PII encryption at rest (salary, location), CORS policies configured
10. Mobile responsiveness verified on iOS Safari, Android Chrome, and common tablet sizes
11. Email templates tested and rendering correctly across email clients (Gmail, Outlook, Apple Mail)
12. Analytics tracking configured for conversion funnel: landing → assessment → account → deeper assessment → payment → dashboard

**Milestone:** Site passes production readiness checklist (performance, security, SEO, legal). Stress tested with 100+ concurrent users. Zero critical security vulnerabilities. Legal pages reviewed and approved.

**Risks & Mitigation:**
- **LLM quota exceeded without warning** — Monitoring and alerts before hitting limits, cache generated plans
- **Viral traffic breaks app** — Rate limiting, CDN caching, load testing, graceful degradation
- **Security vulnerabilities** — Security audit, penetration testing, input sanitization, PII encryption
- **SEO penalties** — Follow Google guidelines for programmatic content, avoid thin content

**Research Flag:** Standard production patterns — no additional research needed. Follow Next.js performance best practices and security checklists.

**Plans:** TBD

**Note:** Admin panel (user management, analytics dashboard, payment records) deferred from this milestone. Use Supabase Dashboard for database queries and Stripe Dashboard for payment monitoring during MVP phase.

---

## Progress Tracking

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Core Scoring | 0/? | Not started | - |
| 2. Free Assessment Flow | 0/? | Not started | - |
| 3. Authentication & Deeper Assessment | 0/? | Not started | - |
| 4. Pivot Path Generation | 0/? | Not started | - |
| 5. Payment & Unlock Flow | 0/? | Not started | - |
| 6. Progress Tracking Dashboard | 0/? | Not started | - |
| 7. Polish & Production Readiness | 0/? | Not started | - |

## Requirement Coverage

**Total v1 Requirements:** 81  
**Mapped to Phases:** 81  
**Unmapped:** 0 ✓

### Coverage by Category

| Category | Requirements | Phase Mapping |
|----------|--------------|---------------|
| Technical Infrastructure | 12 | Phase 1 (10), Phase 5 (2) |
| Core Assessment Flow | 10 | Phase 2 (10) |
| Viral Growth Mechanic | 3 | Phase 2 (2), Phase 7 (1) |
| Account & Authentication | 9 | Phase 3 (9) |
| Deeper Assessment | 7 | Phase 3 (7) |
| Pivot Path Generation | 12 | Phase 4 (12) |
| Payment & Unlock | 8 | Phase 4 (1), Phase 5 (7) |
| Progress Tracking | 6 | Phase 6 (6) |
| Support & Legal | 5 | Phase 2 (3), Phase 3 (2) |

### Validation

- ✅ All 81 v1 requirements mapped to exactly one phase
- ✅ No orphaned requirements
- ✅ Phases follow natural dependency order
- ✅ Each phase has clear milestone and success criteria
- ✅ Critical pitfalls addressed in relevant phases

---

## Dependencies

```
Phase 1: Foundation & Core Scoring
    ↓
Phase 2: Free Assessment Flow (Viral Hook)
    ↓
Phase 3: Authentication & Deeper Assessment
    ↓
Phase 4: Pivot Path Generation
    ↓
Phase 5: Payment & Unlock Flow
    ↓
Phase 6: Progress Tracking Dashboard
    ↓
Phase 7: Polish & Production Readiness
```

**Strict sequential execution:** Each phase depends on the previous phase completing. No parallel phase work.

**Rationale:**
- **1 → 2:** Scoring engine must work before building assessment UI
- **2 → 3:** Free assessment must validate interest before adding auth friction
- **3 → 4:** Deeper assessment inputs required for personalized pivot generation
- **4 → 5:** Pivot paths must be generated (preview) before payment unlocks them
- **5 → 6:** Users must have unlocked plans before tracking progress
- **6 → 7:** Core features complete before production optimization

---

## Research Flags

**Needs additional research before planning:**

- **Phase 4 (Pivot Path Generation):** Dual-LLM integration (Gemini primary + Groq fallback) for career narratives. Prompt engineering patterns, fallback strategies, rate limit handling, content filtering for bias/offensive output. High complexity, sparse documentation for this specific use case.

**Standard patterns (skip additional research):**

- **Phase 1:** Next.js App Router, O*NET data processing, pure function patterns well-documented
- **Phase 2:** Quiz flows, Supabase CRUD, image generation standard patterns (may need brief OG tag research)
- **Phase 3:** Supabase Auth + Resend email covered in official docs
- **Phase 5:** Stripe Checkout + webhooks extensively documented
- **Phase 6:** Progress tracking and checklist UI standard patterns
- **Phase 7:** Production readiness checklists standardized, programmatic SEO standard Next.js patterns

---

## Timeline Estimate (Optional)

*Note: Timeline estimates based on standard development velocity for solo developer with full-time availability. Adjust based on actual hours/week.*

| Phase | Estimated Duration | Cumulative |
|-------|-------------------|------------|
| Phase 1 | 1-2 weeks | 2 weeks |
| Phase 2 | 2-3 weeks | 5 weeks |
| Phase 3 | 1-2 weeks | 7 weeks |
| Phase 4 | 2-3 weeks | 10 weeks |
| Phase 5 | 1 week | 11 weeks |
| Phase 6 | 1-2 weeks | 13 weeks |
| Phase 7 | 1-2 weeks | 15 weeks |

**Total estimated time to MVP:** 13-15 weeks (3-4 months) at full-time pace

**Assumptions:**
- Developer has experience with Next.js, React, TypeScript
- No major blockers or scope creep
- Phase 4 research adds 3-5 days to timeline
- Production testing/QA adds 1 week buffer

---

## Success Metrics

### Phase 1-2 (Viral Validation)
- 100+ free assessments completed
- 10%+ share/download rate for score cards
- <10% user reports of inaccurate job title mapping

### Phase 3-4 (Conversion Validation)
- 60%+ of engaged free users create accounts
- 50%+ of accounts complete deeper assessment
- 10+ diverse test users confirm plans feel personalized

### Phase 5-6 (Revenue & Retention)
- 2-5% conversion rate (free assessment → paid unlock)
- <1% refund rate due to technical issues
- 30%+ of paying users engage with dashboard weekly

### Phase 7 (Production Readiness)
- <2s landing page load time
- Zero critical security vulnerabilities
- Handle 100+ concurrent users without degradation

---

*Roadmap created: 2026-03-30*  
*Ready for: `/gsd-plan-phase 1`*
