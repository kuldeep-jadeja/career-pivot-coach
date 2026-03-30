# Phase 1 Context: Foundation & Core Scoring

**Phase:** 1 of 7  
**Phase Name:** Foundation & Core Scoring  
**Discussion Date:** 2026-03-30  
**Status:** Planning (not yet started)

---

## Phase Overview

**Goal:** Establish technical infrastructure and prove the core risk scoring algorithm works accurately. No user-facing features yet — focus on data quality, scoring correctness, and project foundation.

**Milestone:** Risk scoring engine returns accurate, reproducible scores for 50+ diverse job title inputs (tech roles, traditional roles, hybrid roles). Data pipeline is documented and repeatable.

**Requirements Covered:**
- INFRA-01: Next.js + TypeScript + Tailwind + App Router
- INFRA-02: Supabase (PostgreSQL + Auth)
- INFRA-03: Resend (transactional email)
- INFRA-04: Stripe (test + live mode webhooks)
- INFRA-05: Vercel deployment config
- INFRA-06: Environment variables (.env.local, Vercel)
- INFRA-07: O*NET data processing pipeline
- INFRA-08: Deterministic scoring engine (4-layer algorithm)
- INFRA-11: Database schema with RLS policies
- INFRA-12: Dual-LLM client (Gemini → Groq → queue)

---

## Discussion Summary

### Areas Discussed
1. ✅ **O*NET Data Pipeline Strategy** — Comprehensive data processing, versioning, and freshness transparency
2. ✅ **Scoring Engine Validation** — Multi-tier testing approach with credibility validation
3. 🔧 **Database Schema** — Use recommended defaults (Supabase standard patterns)
4. 🔧 **Dev Environment** — Use recommended defaults (standard Next.js setup)

### Key Decisions

**1. O*NET Data Tables (Comprehensive)**
- **Decision:** Import Occupations + Tasks + Skills + Work Activities
- **Rationale:** Comprehensive data supports all features downstream (skill gap analysis, transferable strengths, work activity mapping)
- **Trade-off:** More initial processing time, but avoids re-processing later
- **Implementation:** 4 core JSON files (occupations.json, tasks.json, skills.json, work_activities.json)

**2. O*NET Data Versioning (Hybrid Snapshots)**
- **Decision:** Versioned snapshots (e.g., `data/onet-v28.3/`) + current pointer symlink
- **Rationale:** Enables rollback if new O*NET data causes issues, preserves reproducibility for past assessments
- **Trade-off:** Slightly more complex than single dataset, but worth it for stability
- **Implementation:**
  ```
  public/data/
    onet-v28.3/         # Versioned snapshot (committed to git)
      occupations.json
      tasks.json
      skills.json
      work_activities.json
    onet-v29.0/         # Next version when released
    current -> onet-v28.3/  # Symlink points to active version
  ```
- **Update process:** Download new O*NET release → process to new versioned folder → test thoroughly → update symlink → commit

**3. Data Freshness Transparency (Comprehensive)**
- **Decision:** All of the above — footer disclaimer + results page banner + per-occupation confidence scores
- **Rationale:** Research flagged "stale data" as critical pitfall. Over-communicate rather than under-communicate.
- **Implementation:**
  - **Footer:** "Powered by O*NET v28.3 (released Jan 2024) | Last updated: [date] | Methodology"
  - **Results page:** Banner explaining "This assessment uses occupational data from O*NET v28.3. Some emerging roles may not be fully represented."
  - **Confidence scores:** Green (< 1 year old) / Yellow (1-2 years) / Red (3+ years) per occupation based on O*NET's own data freshness metadata
- **Trade-off:** Might reduce user confidence, but honesty builds long-term trust

**4. Parsed Data Storage (Hybrid)**
- **Decision:** Both database (Supabase) + static JSON (public/)
- **Rationale:** Best of both worlds — fast frontend access via static JSON, queryable backend via database for admin/analysis
- **Implementation:**
  - **Static JSON:** Loaded by scoring engine (fast, CDN-cacheable, zero DB calls)
  - **Database tables:** Mirror of JSON for admin queries (e.g., "Which occupations have Task X?", "Show all skills in category Y")
- **Trade-off:** Data duplication, but keeps frontend fast and enables backend flexibility
- **Schema:** `onet_occupations`, `onet_tasks`, `onet_skills`, `onet_work_activities` tables (read-only for frontend)

**5. Scoring Validation Strategy (Three-Tier)**
- **Decision:** Unit tests (fast) + golden dataset (thorough) + research paper validation (credible)
- **Rationale:** Multi-tier validation catches different classes of errors. Research validation proves credibility.
- **Implementation:**
  - **Tier 1 — Unit Tests (Vitest):** 20-30 occupations with expected score ranges
    - Example: "Software Developer" → 65-75% risk
    - Example: "Elementary School Teacher" → 20-30% risk
    - Run in CI on every commit (fast feedback)
  - **Tier 2 — Golden Dataset:** 50+ manually verified occupations across risk spectrum
    - Diverse roles: tech, healthcare, trades, creative, management, service
    - Human-reviewed scores with rationale documented
    - JSON file: `tests/golden-dataset.json`
  - **Tier 3 — Research Validation:** Compare our scores to published rankings
    - Eloundou et al. "GPTs are GPTs" occupation exposure rankings
    - Felten et al. AI Occupational Exposure index
    - Correlation coefficient > 0.7 with published research = credible
- **Trade-off:** Takes time to build golden dataset, but essential for confidence
- **Frequency:** Tier 1 on every commit, Tier 2 weekly, Tier 3 after major algorithm changes

**6. Risk Score Display Format (Risk Bands + Percentage)**
- **Decision:** Show both risk band labels AND percentage for precision seekers
- **Rationale:** Avoids "false precision" pitfall while still satisfying users who want numbers
- **Implementation:**
  - **Primary:** Risk band with color (e.g., "High Risk" in red)
  - **Secondary:** Percentage rounded to 5% (e.g., "72%")
  - **Bands:**
    - 0-20%: "Low Risk" (green)
    - 21-40%: "Moderate Risk" (yellow)
    - 41-60%: "Elevated Risk" (orange)
    - 61-80%: "High Risk" (red)
    - 81-100%: "Very High Risk" (dark red)
- **Trade-off:** Slightly more complex UI, but users can interpret at their comfort level

**7. Scoring Algorithm Weights (Research-Recommended, Tunable)**
- **Decision:** Start with 35% / 35% / 15% / 15% (Layer 1 / Layer 2 / Layer 3 / Layer 4), make config-tunable
- **Rationale:** Research-backed baseline gives us credibility, but we can adjust based on real-world feedback
- **Implementation:**
  ```typescript
  // lib/scoring/config.ts
  export const SCORING_WEIGHTS = {
    layer1_ai_exposure: 0.35,      // Research baseline (Eloundou, Felten)
    layer2_task_automation: 0.35,   // O*NET task characteristics
    layer3_industry_speed: 0.15,    // Industry adoption modifier
    layer4_experience_level: 0.15   // Seniority/experience modifier
  };
  ```
- **Trade-off:** Config file adds indirection, but enables A/B testing and tuning
- **Validation:** Re-run golden dataset tests after any weight changes

**8. Methodology Documentation (Full Transparency)**
- **Decision:** Methodology page + interactive calculator + academic bibliography
- **Rationale:** Trust is everything for a $19 career decision. Over-document.
- **Implementation:**
  - **Methodology page (`/methodology`):**
    - Explain each of 4 layers with examples
    - Show formula: `risk_score = (L1 * 0.35) + (L2 * 0.35) + (L3 * 0.15) + (L4 * 0.15)`
    - Limitations section (what the score does NOT predict)
  - **Interactive calculator:**
    - Sliders for each layer showing real-time score impact
    - "See how your score was calculated" link on results page
  - **Bibliography page (`/sources`):**
    - Full citations: Eloundou et al., Felten et al., O*NET database
    - Links to papers (not just titles)
    - Explanation of how we incorporate each source
- **Trade-off:** Exposes our "secret sauce," but honesty > competitive advantage
- **User benefit:** "This isn't just an AI gimmick — here's the science behind it"

**9. Automated Testing + Manual Spot-Checks**
- **Decision:** Vitest for unit tests + weekly manual validation of edge cases
- **Rationale:** Automated tests catch regressions fast, manual checks catch UX issues
- **Implementation:**
  - **Vitest setup:**
    - Test files: `lib/scoring/__tests__/risk-calculator.test.ts`
    - Coverage target: 90%+ for scoring functions
    - Run in CI: `npm run test` on every PR
  - **Manual spot-checks:**
    - Weekly: Test 5-10 edge case job titles (e.g., "AI Ethicist", "Prompt Engineer", "TikTok Creator")
    - Document unexpected scores in GitHub issues
    - Update golden dataset with new edge cases
- **Trade-off:** Manual work, but catches "this feels wrong" issues that tests miss
- **Frequency:** Automated on every commit, manual weekly during active development

---

## Technical Approach (Areas 3 & 4 — Defaults Applied)

### Database Schema (Recommended Defaults)
- **Approach:** Supabase standard patterns with Row Level Security
- **Tables:**
  - `users` (Supabase Auth managed)
  - `assessments` (user_id, job_title, risk_score, layer_breakdown, created_at)
  - `pivot_plans` (assessment_id, paths JSON, status: preview/unlocked, created_at)
  - `payments` (user_id, assessment_id, stripe_payment_id, amount, status, created_at)
  - `onet_occupations`, `onet_tasks`, `onet_skills`, `onet_work_activities` (read-only reference data)
- **RLS policies:** Users can only read/write their own assessments, pivot_plans, payments
- **Indexes:** Foreign keys, created_at, status columns

### Development Environment (Standard Next.js)
- **Approach:** Next.js 15+ with App Router, TypeScript, Tailwind, shadcn/ui
- **Secrets management:**
  - `.env.local` for local development (git-ignored)
  - Vercel environment variables for deployed environments
  - `.env.example` committed to git (template without secrets)
- **Dev workflow:**
  - `npm run dev` — Local Next.js dev server
  - `npm run test` — Vitest unit tests
  - `npm run lint` — ESLint + Prettier
  - `npm run build` — Production build check
- **Debugging:** VS Code launch config for Next.js, browser DevTools for frontend

---

## Critical Paths

**Data Quality Critical Path:**
```
O*NET CSV Download
  ↓
Parse to JSON (4 tables)
  ↓
Validate data integrity
  ↓
Version & commit
  ↓
Scoring engine consumes static JSON
```

**Scoring Validation Critical Path:**
```
Implement 4-layer algorithm
  ↓
Unit tests (20-30 occupations)
  ↓
Golden dataset validation (50+ occupations)
  ↓
Research paper correlation check
  ↓
Methodology documentation
```

**Blockers to watch:**
1. O*NET download may require manual registration/approval
2. Research paper data may need manual extraction (not always machine-readable)
3. Golden dataset creation is time-intensive (budget 4-6 hours)

---

## Success Criteria Recap

Phase 1 is complete when ALL of these are TRUE:

1. ✅ Developer can run Next.js app locally with TypeScript, Tailwind, shadcn/ui configured
2. ✅ O*NET bulk data (occupations, tasks, skills, work activities) is downloaded, parsed to versioned JSON, and committed to git
3. ✅ Deterministic scoring engine calculates 4-layer risk scores with configurable weights (35/35/15/15 default)
4. ✅ Job title fuzzy matching returns 3-5 O*NET occupation matches with confidence scores
5. ✅ Supabase database schema created with RLS policies (users, assessments, pivot_plans, payments, onet_* tables)
6. ✅ Dual-LLM client configured with Gemini → Groq → email queue fallback chain
7. ✅ All environment variables documented in .env.example and configured in Vercel
8. ✅ Three-tier validation complete: unit tests (Vitest) pass, golden dataset validates, research correlation > 0.7
9. ✅ Methodology page drafted with layer explanations, formula, limitations, and bibliography
10. ✅ Developer can manually test scoring engine with diverse job titles and verify reasonable outputs

---

## Open Questions

**Resolved during discussion:**
- ✅ Which O*NET tables to import? → All 4 core tables (comprehensive)
- ✅ How to version O*NET data? → Hybrid snapshots with current pointer
- ✅ How to communicate data freshness? → Comprehensive transparency (footer + banner + confidence scores)
- ✅ Where to store parsed data? → Both static JSON (frontend) + database (admin)
- ✅ How to validate scoring? → Three-tier approach (unit + golden + research)
- ✅ How to display risk scores? → Risk bands + percentage for precision seekers
- ✅ What scoring weights to use? → Research-recommended 35/35/15/15, tunable via config
- ✅ How to document methodology? → Full transparency (page + calculator + bibliography)
- ✅ How to test scoring? → Vitest automated + weekly manual spot-checks

**Still open (deferred to planning):**
- What's the exact O*NET CSV download process? (research during execution)
- How to implement fuzzy job title matching? (algorithm selection during planning)
- What format for golden dataset JSON? (define during test creation)
- How to calculate per-occupation data freshness? (O*NET provides lastModified metadata)

---

## Constraints Applied

**Zero-Budget Constraint:**
- ✅ All services use free tiers (Vercel, Supabase, Resend)
- ✅ O*NET data is free (public domain)
- ✅ Static JSON avoids database query costs

**Solo Developer Constraint:**
- ✅ No team coordination overhead
- ✅ Manual validation is acceptable (not scaled yet)
- ✅ Documentation is inline (no separate wiki)

**Time Constraint:**
- ✅ Comprehensive data import upfront (avoids rework)
- ✅ Versioning prevents future breaking changes
- ✅ Automated tests reduce manual QA time

---

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Stale O*NET data undermines scores** | High | High | Comprehensive transparency (footer + banner + confidence scores) |
| **Golden dataset takes too long** | Medium | Medium | Start with 30 occupations, expand to 50+ iteratively |
| **Research correlation fails (< 0.7)** | Medium | High | Review algorithm weights, check for implementation bugs, document gaps |
| **Job title matching is too fuzzy** | Medium | Medium | Implement disambiguation UI (show 3-5 matches, let user pick) |
| **Scoring weights need tuning** | Low | Medium | Config-based weights enable easy adjustment without code changes |

---

## Next Steps

1. **Planning Phase:** Use this context to generate detailed plans for Phase 1
2. **Research Flag:** No additional research needed (standard patterns for all tasks)
3. **Execution:** Break Phase 1 into 3-5 executable plans covering infrastructure, data pipeline, scoring engine, validation

---

*Context captured: 2026-03-30*  
*Ready for: Phase 1 planning (`/gsd-plan-phase 1`)*
