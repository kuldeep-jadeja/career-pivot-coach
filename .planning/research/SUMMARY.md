# Project Research Summary

**Project:** Unautomatable — AI Career Pivot Coach
**Domain:** Career Assessment & AI Displacement Risk Platform
**Updated:** 2026-03-30
**Confidence:** HIGH

## Executive Summary

Unautomatable is an AI-powered career transition platform that addresses a clear market gap: combining credible AI displacement risk assessment with actionable pivot plans. The research reveals three critical insights. First, the technical foundation is solid and well-documented — Next.js with App Router, React, Supabase (PostgreSQL + Auth), and Google Gemini (with Groq fallback) provide a production-ready stack with excellent free tiers for MVP validation on Vercel. Second, the product sits in white space between generic career assessments (MyPlan, YouScience) and toy-like AI risk calculators (BBC "Will AI Take My Job?") — nobody combines credible methodology with personalized action plans at an impulse-buy price point ($19 one-time). Third, success hinges on avoiding eight critical pitfalls, most notably: job title mapping accuracy (garbage in → garbage out), algorithmic anchoring bias (users fixate on risk scores and ignore solutions), and personalization theater (generic advice kills conversion).

The recommended approach follows a clear value-delivery progression: start with a free viral assessment to validate the hook (shareable risk scores), gate deeper personalization behind accounts, then monetize with preview-before-paywall pivot plans that generate ALL 3 paths simultaneously. The architecture is deliberately simple — a Next.js monolith with deterministic scoring (no LLM dependency for calculations), static O*NET data (pre-processed JSON), and pure functions for testability. This design supports rapid iteration while avoiding premature optimization. Deployment on Vercel free tier enables zero-infrastructure-cost validation.

Key risks center on data quality and user trust. O*NET job title mapping requires disambiguation UI from day one — fuzzy string matching alone will fail for hybrid roles, company-specific titles, and seniority variations. Risk score presentation must balance virality (simple percentages) with nuance (context, opportunity framing) to avoid anxiety spirals or dismissiveness. Personalization quality determines paid conversion — users who pay $19 and receive generic "learn Python" advice will request refunds and leave negative reviews. The research flags specific prevention strategies for each pitfall, with clear phase-to-pitfall mappings to guide implementation.

## Key Findings

### Recommended Stack

The research converged on a modern, zero-budget stack optimized for rapid MVP development and scalable growth. **Use @latest for all packages** — specific version numbers from research may be outdated.

**Core technologies:**
- **Next.js**: Industry-standard full-stack React framework with stable App Router. Handles both UI and API in a single deployable unit. Native Vercel deployment.
- **React**: Latest stable with Server Components and Actions, perfect for multi-step assessment flows. Native form handling reduces boilerplate.
- **TypeScript**: Non-negotiable for production. Catches majority of bugs at compile time.
- **Supabase**: Unified PostgreSQL database + authentication. Simpler architecture than separate MongoDB + Auth.js. Free tier supports thousands of users.
- **Resend**: Transactional email (free tier: 100 emails/day). For account verification, payment receipts, pivot plan delivery.
- **Tailwind CSS**: Fast builds, improved JIT. Standard for rapid UI development.
- **Google Gemini API** (primary): Free tier for narrative generation. Simple promise-based SDK.
- **Groq API** (fallback): Backup LLM when Gemini rate limits hit. Strategy: Gemini → Groq → queue for later. Both free tier.
- **Stripe**: One-time payments via Checkout Sessions. Strong TypeScript types and webhook handling.
- **Vercel** (deployment): Free tier (hobby plan) with zero infrastructure cost, automatic HTTPS, CDN, edge functions.

**Supporting libraries:**
- **shadcn/ui + Radix UI**: Pre-built accessible components (copy-paste, not npm). Handles forms, dialogs, dropdowns with accessibility out of the box.
- **Zod + React Hook Form**: Industry standard for complex multi-step forms with schema validation.
- **Recharts**: Best React charting library for career path visualization, risk breakdowns.
- **Sharp**: Native image processing for shareable card generation via serverless functions.
- **@vercel/og**: Edge function-based Open Graph image generation for social media previews.

**What to avoid:**
- Pinning specific version numbers (verify during installation)
- NextAuth v4 (use Supabase Auth instead for simpler integration)
- MongoDB for this use case (assessment data has stable structure, PostgreSQL fits better)
- Microservices or separate API layer (Next.js monolith sufficient for MVP)

**Confidence:** HIGH — Stack choices align with current industry standards and zero-budget constraint.

### Expected Features

Research identified 13 table stakes features, 17 differentiators, and 12 anti-features to avoid. The competitive landscape shows no dominant player combining AI risk assessment with actionable transition plans — this product sits in white space.

**Must have (table stakes):**
- Free initial risk assessment (< 5 min, no account required) — industry standard
- Job title input with fuzzy matching — enables O*NET mapping
- Personalized risk score with visual presentation — core expectation
- Career path recommendations with educational requirements — users need specifics
- Salary information and time estimates — financial/planning realities matter
- Email delivery of results and account creation — save/revisit capabilities
- Mobile responsiveness — users research during commutes, breaks
- Privacy policy and terms of service — legal requirements, trust building

**Should have (differentiators):**
- **AI displacement risk scoring** — Core unique value, addresses modern anxiety
- **Shareable visual score cards** — Viral growth mechanic with OG tags
- **Task-level breakdown** — Shows *which* parts of job are at risk (not just overall)
- **90-day action plans** — Concrete, time-bound plans vs. vague advice
- **Skill gap analysis** — Exact skills needed for target role transitions
- **Multiple pivot path options (3 paths)** — Shows alternatives, builds confidence
- **Preview before paywall** — Reduces purchase anxiety, builds trust
- **One-time payment ($19)** — No subscription fatigue, impulse-buy friendly
- **Fit score transparency** — Explains "why this path fits you"
- **AI-safety ratings** — Future-proofs recommendations with forward-looking risk
- **Progress tracking dashboard** — Motivational support for plan execution

**Defer (anti-features):**
- Job boards/listings — crowded space, shifts focus from skill building
- Resume builder — better tools exist (Canva, Resume.io)
- Live career coaching — doesn't scale, defeats automated model
- Community forums — moderation burden, scope creep
- Personality assessments — saturated market, not core value
- Mobile native apps — web works fine, avoid overhead

**MVP phasing:**
- **Phase 1** (validate hook): Free assessment, task breakdown, shareable cards, email capture
- **Phase 2** (validate conversion): Account creation, deeper assessment, pivot generation, payment, preview/paywall
- **Phase 3** (optimize retention): Progress dashboard, multiple paths, fit transparency, AI-safety ratings

**Confidence:** MEDIUM — Based on training data knowledge of career platforms and AI risk calculators. Competitor feature sets may have changed 2023-2025 (WebSearch unavailable).

### Architecture Approach

Research recommends a deliberately simple Next.js monolith architecture that prioritizes speed-to-market and maintainability over premature optimization. The key architectural decision is **deterministic scoring** (pure functions, no LLM) combined with **static data pre-processing** (O*NET data as JSON) to ensure fast, reproducible, testable risk calculations.

**System architecture:**
```
Presentation Layer: Landing pages, quiz flow, dashboard UI, share cards
Application Layer: Assessment service, scoring engine, pivot generator, payment handler
Data Layer: MongoDB (users, assessments, plans, payments)
Static Data: Pre-processed O*NET JSON files (tasks, skills, AI exposure scores)
External Services: Stripe (payments), Gemini (narratives), Email (Resend/SendGrid)
```

**Major components:**

1. **Scoring Engine** — Pure TypeScript functions implementing 4-layer risk algorithm (AI exposure baseline + task automation + industry speed modifier + experience modifier). Deterministic, cacheable, testable. No LLM involvement (critical for reproducibility).

2. **Job Matcher** — Fuzzy matching of user input to O*NET occupation codes using Levenshtein/trigram similarity. Requires disambiguation UI (show 3-5 matches, let user pick) to avoid mapping hell for hybrid roles and company-specific titles.

3. **Pivot Generator** — Combines algorithmic path ranking (skill gap analysis, fit scoring) with Gemini API for narrative text. Generates 3 ranked paths based on transferable skills, salary constraints, time availability, and AI-safety projections.

4. **Payment Handler** — Stripe Checkout Sessions with webhook-driven fulfillment. Key pattern: generate plans BEFORE payment (save with `status: 'preview'`), show partial preview, then update status to `unlocked` on webhook — avoids double API calls and ensures consistency.

5. **Share Card Generator** — Server-side canvas rendering (Sharp) for downloadable images + @vercel/og for dynamic OG tags. Pre-generate on assessment completion to avoid real-time CPU bottlenecks.

**Critical patterns:**
- **Static data pre-processing**: O*NET CSVs transformed to optimized JSON at build time, served as static assets (fast, no DB queries, CDN-cacheable)
- **Preview-before-paywall**: Generate full personalized content, show partial data, gate details behind payment (builds trust, proves value)
- **Server Actions for mutations**: Use Next.js server actions (not API routes) for form handling and data mutations (type-safe, automatic revalidation)
- **Webhook-driven state**: Stripe webhooks as source of truth for payment status (handles user closing browser, async completion)

**Project structure:**
```
app/
  (marketing)/        # Public pages (landing, privacy, terms)
  (assessment)/       # Quiz flow (quick-risk, results, deeper-assessment)
  (dashboard)/        # User dashboard (pivot plans, progress, settings)
  (admin)/            # Admin panel (users, analytics, revenue)
  api/                # API routes (scoring, pivot, payment, webhooks)
  _actions/           # Server actions (assessment, pivot, user mutations)
lib/
  scoring/            # Pure scoring functions (4-layer algorithm)
  pivot/              # Pivot generation logic (skill gaps, path ranking, Gemini)
  data/               # O*NET data loaders and TypeScript types
  db/                 # MongoDB connection, models, queries
  auth/               # Auth.js configuration
  payment/            # Stripe client, webhook handlers
public/data/          # Static O*NET JSON files (occupations, tasks, skills, AI scores)
```

**Scaling considerations:**
- 0-1K users: Monolith on single Digital Ocean droplet works perfectly
- 1K-10K users: Add Redis for rate limiting, move assets to CDN, enable ISR
- 10K-100K users: Separate read/write DB, cache assessment results, batch Gemini calls
- 100K+ users: Split services (scoring engine, pivot generator), add job queue

**Confidence:** HIGH — Architecture based on Next.js official docs, standard patterns for assessment platforms, and MongoDB/Stripe best practices.

### Critical Pitfalls

Research identified 8 critical pitfalls with specific prevention strategies. Most are unique to the AI risk assessment + career transition domain and won't be caught by general development best practices.

1. **Algorithmic Anchoring Bias** — Users fixate on risk score percentage and ignore actionable pivot plans. Score overshadows solutions, reducing conversion.
   - **Prevention**: Present score with immediate opportunity context ("74% at risk, but 82% of skills transfer to 3 careers"). Visual balance of risk AND opportunity. Frame as "starting point" not "verdict." Track conversion by score range to detect blocking.

2. **Job Title Mapping Hell** — Fuzzy matching fails for hybrid roles, company-specific titles, seniority variations. Wrong O*NET mapping → inaccurate scores → lost trust.
   - **Prevention**: Multi-step disambiguation UI (show 3-5 matches with descriptions, let user pick). Supplement with task selection ("which tasks do you do?"). Build mapping database from user selections. Allow "none fit" with free-form capture. Log confidence scores for review.

3. **Stale Occupational Data** — O*NET updates annually but lags 2-3 years. Emerging roles don't exist, dying roles show as stable. Users in cutting-edge fields get nonsensical results.
   - **Prevention**: Document O*NET version/date in footer ("Based on O*NET 28.0, March 2024"). Disclaimer for emerging roles. Admin override layer. Plan quarterly refresh cycles. User feedback flags for review.

4. **False Precision in Risk Scoring** — Displaying "74.3%" implies accuracy that doesn't exist. Underlying research data is fuzzy, but decimals signal scientific precision. Trust collapses when reality diverges.
   - **Prevention**: Round to 5% increments (70%, 75%, 80%) to signal estimate ranges. Use confidence bands ("70-80% risk range"). Qualitative labels ("High Risk (75%)"). Transparent FAQ about methodology limitations.

5. **Pivot Path Generic Recommendations** — User pays $19, unlocks plans, sees generic advice ("learn Python" for 45-year-old accountant). Feels scammed, requests refund, leaves negative review.
   - **Prevention**: Capture constraints in deeper assessment (salary floor, hours/week available, location). Apply constraint filters BEFORE LLM generation. Include "why this fits YOU" sections referencing specific inputs. Test with diverse real scenarios before launch.

6. **Skill Gap Analysis Vagueness** — Plan says "Learn SQL" but not which dialect, proficiency level, time estimate, or where to learn. Analysis paralysis, never starts.
   - **Prevention**: Define proficiency levels ("Beginner: write basic queries"). Link 2-3 specific free resources (Mode Analytics, W3Schools). Estimate time ("20-30 hours over 4 weeks"). Validation milestones ("Complete 10 LeetCode Easy"). Resource library in CMS for updating.

7. **90-Day Timeline Unrealism** — Plan promises transition in 90 days but user has full-time job and family. Timeline is fantasy, user defeated by Week 3, abandons.
   - **Prevention**: Adjust timeline from user's available hours/week (5 hrs/week → 6 months, 20 hrs/week → 3 months). Include buffer weeks. Set expectations ("assumes consistent effort, adjust as needed"). Make timeline editable in dashboard. Track actual completion times to refine.

8. **Share Card Design Ignores Context** — User shares "74% AT RISK" on LinkedIn with ominous visuals. Professional network sees doom-posting. User regrets, blames platform.
   - **Prevention**: Offer 2 variants ("Anxiety frame" for Reddit/TikTok vs. "Proactive frame" for LinkedIn). LinkedIn version emphasizes action ("I'm planning my next move"). Platform-specific copy suggestions. User customization before sharing.

**Technical debt to avoid:**
- Hardcoding job title mappings (unmaintainable — use DB + fuzzy match from start)
- Storing score only, not inputs (can't recalculate when methodology improves — always version)
- Generating pivot paths twice (wasteful — generate once, save with preview status, unlock on payment)
- Client-side scoring (exposes algorithm, users manipulate — server-side only)

**Security mistakes:**
- Rate limiting missing on free assessment (scraping vulnerability — 10/hour by IP, CAPTCHA after 3)
- PII without encryption (regulatory violations — encrypt salary/location at rest)
- Score cards contain email/name (privacy violation — anonymous format only)

**Confidence:** MEDIUM — Based on documented patterns in career tech, psychometric platforms, and AI scoring systems. Some risks inferred from adjacent domains (limited public post-mortems of AI+career platforms).

## Implications for Roadmap

Based on cross-cutting analysis, the research suggests a 7-phase roadmap that delivers value incrementally while avoiding critical pitfalls. The ordering prioritizes **viral validation → conversion validation → retention optimization** with technical foundation built progressively. **Admin panel deferred** — use Supabase Dashboard + Stripe Dashboard for MVP monitoring.

### Phase 1: Foundation & Core Scoring
**Rationale:** Establish technical infrastructure and prove the core algorithm works. No user-facing features yet — focus on data quality and scoring accuracy.

**Delivers:**
- Next.js project setup with TypeScript, Tailwind, shadcn/ui
- Supabase setup (PostgreSQL database + Auth configuration)
- O*NET data processing pipeline (download CSVs → transform to JSON → version control)
- Deterministic scoring engine (4-layer algorithm as pure, testable functions)
- Job title fuzzy matching with disambiguation logic
- Basic landing page UI and assessment form components

**Addresses pitfalls:**
- Stale data (documents O*NET version, establishes refresh process)
- False precision (sets display policy — 5% increments or confidence bands)
- Mapping hell (builds disambiguation UI from start)

**Research flag:** Standard patterns — no additional research needed. Follow Next.js App Router docs and O*NET bulk data documentation.

---

### Phase 2: Free Assessment Flow (Viral Hook)
**Rationale:** Validate the product hook — do people care about AI displacement risk? Free assessment with shareable cards tests market demand before building monetization.

**Delivers:**
- Complete free quiz flow (< 5 min, no account required)
- Risk score results page with visualization (charts, breakdown by layer)
- Shareable score cards (downloadable images via Sharp + dynamic OG tags via @vercel/og for social previews)
- Email capture for results delivery
- Basic Supabase integration (save assessments without user accounts)

**Addresses features:**
- Free initial assessment (table stakes)
- Job title input with matching (table stakes)
- Risk score display (table stakes)
- Task-level breakdown (differentiator)
- Shareable cards (differentiator, viral mechanic)

**Addresses pitfalls:**
- Algorithmic anchoring (tests score framing with opportunity context)
- Share card design (test LinkedIn vs. Reddit vs. Twitter variants)
- Job title mapping (validates disambiguation UI with real users)

**Research flag:** May need phase research for share card optimization (OG tag best practices, social platform image requirements vary). Otherwise standard patterns.

---

### Phase 3: Authentication & Deeper Assessment
**Rationale:** Convert engaged users from free assessment into account holders. Deeper assessment captures personalization inputs needed for quality pivot plans.

**Delivers:**
- Supabase Auth setup with email/password
- User registration and login flow with email verification via Resend
- Deeper assessment form (skills inventory, salary needs, time availability, location, preferences)
- User dashboard skeleton (navigation, profile menu)
- Email templates via Resend (account confirmation, assessment saved)

**Addresses features:**
- Account creation (table stakes)
- Skills inventory (table stakes)
- Personalized results inputs (table stakes, enables later phases)

**Addresses pitfalls:**
- Generic recommendations (captures constraints that prevent personalization theater)
- Timeline unrealism (captures hours/week available for accurate timeline calculation)

**Research flag:** Standard auth patterns — no additional research needed. Supabase Auth + Resend docs cover setup.

---

### Phase 4: Pivot Path Generation
**Rationale:** Build the core paid value — personalized career transition paths. Generate ALL 3 paths simultaneously (not sequentially) before payment (preview-before-paywall pattern) to build trust and prove value.

**Delivers:**
- Pivot generation algorithm (skill gap analysis, path ranking by fit score, AI-safety ratings)
- LLM integration: Gemini (primary), Groq (fallback), queue for later retries
- Generate ALL 3 pivot paths at once (parallel LLM calls or single prompt with structured output)
- Preview endpoint (generates 3 full paths, saves to Supabase with `status: 'preview'`, returns partial data)
- Preview UI (shows path titles, fit scores, AI-safety ratings, blurs full details)

**Addresses features:**
- Career path recommendations (table stakes)
- 90-day action plans (differentiator)
- Skill gap analysis (differentiator)
- Multiple pivot paths — all 3 generated from start (differentiator)
- Fit score transparency (differentiator)
- AI-safety ratings (differentiator)

**Addresses pitfalls:**
- Pivot path generic recommendations (implements constraint filtering, specific resource links)
- Skill gap vagueness (defines proficiency levels, time estimates, validation milestones)
- 90-day timeline unrealism (calculates from user's hours/week, includes buffers)
- LLM rate limits (Gemini → Groq fallback → queue for later)

**Research flag:** **Needs phase research** for LLM integration (prompt engineering for career narratives, dual-LLM fallback strategy, rate limit handling, content filtering for bias/offensive output). This is complex domain-specific LLM work.

---

### Phase 5: Payment & Unlock Flow
**Rationale:** Monetize validated value. Users have seen preview of all 3 paths, now pay $19 to unlock full details for all. Stripe webhooks handle async completion reliably.

**Delivers:**
- Stripe integration (Checkout Sessions with metadata for `userId`)
- Payment webhook handler (verify signatures, update Supabase status: `preview` → `unlocked`, idempotent)
- Checkout flow UI ("Unlock All 3 Plans for $19" button, redirect to Stripe, return URL)
- Full pivot plan display (all 3 paths unlocked, previously blurred sections now visible)
- Email confirmations via Resend (payment receipt, all 3 plans delivered)

**Addresses features:**
- One-time payment (differentiator)
- Preview before paywall (differentiator)

**Addresses pitfalls:**
- Payment webhook failures (implements retry logic, manual reconciliation via Stripe Dashboard)
- User closes browser (webhook-driven state handles async completion)

**Research flag:** Standard Stripe patterns — no additional research needed. Follow Stripe webhook documentation and test with Stripe CLI.

---

### Phase 6: Progress Tracking Dashboard
**Rationale:** Optimize for retention and plan completion. Users who complete plans generate testimonials and word-of-mouth growth.

**Delivers:**
- Dashboard overview (progress metrics, completed tasks, timeline visualization)
- Week-by-week checklist UI (expandable milestones, manual checkboxes)
- Progress tracking state management (save completed tasks to DB)
- Timeline view (visual roadmap with current week highlighted)
- "Skip" or "not applicable" options (avoid mandatory engagement guilt)

**Addresses features:**
- Progress tracking dashboard (differentiator)
- Timeline view (supports execution)

**Addresses pitfalls:**
- Progress tracking feels mandatory (frame as optional, plan valuable regardless)
- Users abandon after 2-3 weeks (analytics reveal stall points)

**Research flag:** Standard dashboard patterns — no additional research needed. Follow Recharts documentation for timeline visualizations.

---

### Phase 7: Polish & Production Readiness
**Rationale:** Final polish for public launch. SEO (including programmatic job title pages), error handling, legal compliance, performance optimization. **Admin panel deferred** — use Supabase Dashboard + Stripe Dashboard directly for MVP.

**Delivers:**
- Comprehensive error handling (user-friendly messages, error tracking with Sentry or similar)
- Loading states and skeleton screens (perceived performance)
- SEO optimization (metadata, sitemaps, structured data for career content)
- **Programmatic SEO pages for top 50 job titles** (/risk/[job-slug]) — pre-rendered landing pages
- Performance optimization (Next.js ISR/SSG for marketing pages, image optimization, caching)
- Help/FAQ content (methodology transparency, common questions)
- Legal pages (Terms of Service, Privacy Policy, GDPR/CCPA compliance)
- Rate limiting (protect free assessment endpoint from scraping, API abuse)
- Monitoring and alerts (LLM quota, error rates, payment failures)
- Security hardening (input sanitization, PII encryption, CORS policies)

**Addresses features:**
- Privacy policy / terms (table stakes)
- Mobile responsiveness (table stakes)
- SEO for shareable results + job-specific landing pages (extends viral reach)

**Addresses pitfalls:**
- LLM quota exceeded (monitoring and alerts before hitting limits)
- Viral traffic breaks app (rate limiting, caching, performance optimization)
- Security vulnerabilities (rate limiting, PII encryption, input sanitization)

**Research flag:** Standard production patterns — no additional research needed. Follow Next.js performance best practices and security checklists.

**Note:** Admin panel (user management, analytics dashboard, payment records) deferred from this milestone. Use Supabase Dashboard for database queries and Stripe Dashboard for payment monitoring during MVP phase.

---

### Phase Ordering Rationale

1. **Foundation before features**: Phase 1 establishes data quality and scoring accuracy — the entire product depends on this working correctly. No point building UI if scores are wrong.

2. **Free before paid**: Phase 2 validates the hook (do people care?) before investing in monetization infrastructure. If free assessment doesn't engage, paid plans won't convert.

3. **Auth after viral validation**: Phase 3 introduces account friction only after proving free assessment generates interest. Early friction kills growth.

4. **Generate before payment**: Phase 4 builds pivot generation (ALL 3 paths simultaneously) before payment integration (Phase 5) because preview-before-paywall pattern requires generated content to show previews. Payment just unlocks existing content.

5. **Payment before dashboard**: Phase 5 monetization comes before Phase 6 retention features because you need paying users before retention optimization matters.

6. **Polish last**: Phase 7 production readiness (including programmatic SEO for top 50 job titles) comes last because premature optimization wastes time. Build core features first, polish when you know what matters.

**Admin panel deferred**: Use Supabase Dashboard + Stripe Dashboard for MVP monitoring. Reduces scope by entire phase while maintaining operational visibility.

### Research Flags for Roadmapper

**Needs phase research during planning:**
- **Phase 4** (Pivot Generation) — Dual-LLM integration (Gemini primary + Groq fallback) for career narratives requires domain-specific research: prompt engineering patterns, fallback strategies, rate limit handling, content filtering for bias/offensive output. High complexity, sparse documentation for this specific use case.

**Standard patterns (skip additional research):**
- **Phase 1** (Foundation) — Next.js App Router, O*NET data processing, pure function patterns well-documented
- **Phase 2** (Free Assessment) — Quiz flows, Supabase CRUD, image generation standard patterns (may need brief OG tag research)
- **Phase 3** (Authentication) — Supabase Auth + Resend email covered in official docs
- **Phase 5** (Payment) — Stripe Checkout + webhooks extensively documented
- **Phase 6** (Dashboard) — Progress tracking and checklist UI standard patterns
- **Phase 7** (Polish) — Production readiness checklists standardized, programmatic SEO standard Next.js patterns

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Technology choices align with current industry standards and zero-budget constraint. Use @latest for all packages during installation. |
| **Features** | MEDIUM | Based on training data knowledge of career platforms (MyPlan, PathSource, YouScience) and AI risk calculators (BBC tool, academic calculators). WebSearch unavailable to verify 2024-2025 feature sets or new entrants. Competitive gap assessment may need validation. |
| **Architecture** | HIGH | Based on official Next.js, MongoDB, and Stripe documentation (authoritative sources). Patterns proven in similar assessment platforms and recommendation engines. Project requirements explicit in PROJECT.md. |
| **Pitfalls** | MEDIUM | Synthesized from documented patterns in adjacent domains (career tech, psychometric platforms, SaaS freemium funnels). AI+career combination is emerging category with limited public post-mortems. General patterns (payment integration, job matching) high confidence; AI-risk-specific issues (score framing, bias) medium confidence. |

**Overall confidence:** HIGH for technical implementation, MEDIUM for market positioning and feature prioritization.

### Gaps to Address

**Competitive landscape validation:**
- Research couldn't verify current (2024-2025) feature sets of MyPlan, PathSource, YouScience due to WebSearch unavailability
- Unknown if new AI displacement risk platforms launched 2023-2025
- Pricing model trends (subscription vs. one-time) may have shifted
- **Recommendation:** Directly explore 3-5 competitor products before Phase 2 launch. Check Product Hunt, Reddit, G2 reviews for user pain points.

**O*NET data freshness:**
- Research used training data knowledge of O*NET structure, but latest version/date unknown
- O*NET 28.0 (March 2024) mentioned in research but not verified
- **Recommendation:** Visit O*NET Center (onetcenter.org) during Phase 1 to download latest bulk data. Document version clearly. Plan quarterly refresh process from start.

**Social sharing best practices:**
- OG tag requirements for LinkedIn, Twitter, Facebook may have changed since training data cutoff
- Image size/format recommendations could be outdated
- **Recommendation:** Test share cards on all target platforms during Phase 2 before viral launch. Verify previews render correctly. Check current platform documentation.

**Gemini API quota and costs:**
- Free tier limits (1,500 requests/day) based on training data, may have changed
- Prompt token costs and rate limits unknown for current API version
- **Recommendation:** Review Google AI Studio (Gemini API) documentation during Phase 4 planning. Set up monitoring and alerts. Test with realistic concurrent load.

**Legal compliance specifics:**
- GDPR, CCPA requirements for career assessment data noted but not detailed
- PII handling (salary, location) mentioned but encryption specifics unclear
- **Recommendation:** Consult legal resources for career data compliance during Phase 8. Implement data retention policies and user data export/deletion.

### Validation Checkpoints

Before proceeding to roadmap creation, consider validating:

1. **Market demand assumption**: Interview 5-10 people in automation-risk roles (bookkeepers, customer service reps, paralegals). Would they pay $19 for personalized pivot plans? What do they expect for that price?

2. **Job title diversity**: Test fuzzy matching with 50 diverse job titles from LinkedIn (include hybrid roles, tech company titles, international variations). What's the disambiguation success rate?

3. **Personalization quality threshold**: Generate 3 sample pivot plans for different personas (single parent with 10 hrs/week, recent grad with 40 hrs/week, mid-career with salary floor). Do they feel genuinely personalized or generic?

4. **Free-to-paid conversion assumption**: What percentage of free assessment users need to convert at $19 to reach sustainability? Is 2-3% realistic based on similar products?

These validations can happen during implementation (no need to block roadmap creation), but flagged here as high-impact assumptions.

## Sources

### Primary (HIGH confidence)
- **npm registry** (2025-01-26) — Direct version verification for Next.js 16.2, React 19.2, TypeScript 6.0, Tailwind 4.2, MongoDB driver 7.1, Auth.js 1.5, Stripe 21.0, and all supporting libraries
- **Next.js official documentation** — App Router patterns, Server Actions, Turbopack, ISR (nextjs.org/docs)
- **MongoDB documentation** — Schema design best practices, connection pooling, indexing strategies (mongodb.com/docs)
- **Stripe documentation** — Checkout Sessions, webhook integration, idempotency patterns (stripe.com/docs)
- **O*NET Resource Center** — Bulk data structure, occupation taxonomy, task/skill data models (onetcenter.org)

### Secondary (MEDIUM confidence)
- **React 19 blog** — Server Components, Actions, concurrent rendering improvements (react.dev/blog)
- **Auth.js migration guide** — NextAuth v4→v5 rebrand, breaking changes (authjs.dev)
- **Tailwind CSS v4 docs** — Native CSS engine, v3→v4 migration (tailwindcss.com/docs/v4)
- **Google AI Studio (Gemini)** — Free tier limits, flash-8b model specs (training data, not verified for 2025)
- **Career assessment platforms** — Feature patterns from MyPlan, PathSource, YouScience, 16Personalities Career (training data knowledge)
- **AI risk calculators** — BBC "Will AI Take My Job?", Oxford Martin School calculator patterns (training data knowledge)

### Tertiary (LOW confidence, needs validation)
- **Competitor pricing models** — $29.99/year (MyPlan), $30-50 (YouScience school licenses) mentioned but may have changed 2023-2025
- **Gemini API free tier** — 1,500 requests/day noted but should be verified
- **O*NET version currency** — O*NET 28.0 (March 2024) referenced but not confirmed as latest
- **Social platform OG requirements** — Image size/format recommendations may be outdated

---

*Research completed: 2025-01-26*  
*Ready for roadmap: yes*  
*Total research files synthesized: 4 (STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md)*
