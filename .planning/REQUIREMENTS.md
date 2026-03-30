# Requirements: Unautomatable — AI Career Pivot Coach

**Defined:** 2026-03-30
**Core Value:** Help mid-career professionals assess their AI displacement risk and get personalized, actionable 90-day career pivot plans at an impulse-buy price point.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Assessment Flow (ASSESS)

- [ ] **ASSESS-01**: User can take free risk assessment without creating an account (< 5 min)
- [ ] **ASSESS-02**: User can input job title with fuzzy matching to O*NET occupation codes
- [ ] **ASSESS-03**: User can input industry and years of experience
- [ ] **ASSESS-04**: System calculates AI displacement risk score (0-100) using 4-layer deterministic algorithm
- [ ] **ASSESS-05**: User sees personalized risk score with visual presentation (charts, gauges)
- [ ] **ASSESS-06**: User sees task-level breakdown showing which tasks are at risk vs. safe
- [ ] **ASSESS-07**: User can provide email to receive results
- [ ] **ASSESS-08**: System sends risk score email via Resend
- [ ] **ASSESS-09**: Assessment is fully mobile responsive
- [ ] **ASSESS-10**: Assessment saves progress automatically (anonymous users get session storage)

### Viral Growth Mechanic (VIRAL)

- [ ] **VIRAL-01**: User can download shareable visual score card as image (PNG)
- [ ] **VIRAL-02**: Risk score results page has dynamic OG meta tags for social link previews
- [ ] **VIRAL-03**: System generates programmatic SEO pages for top 50 job titles at /risk/[job-slug]

### Account & Authentication (AUTH)

- [ ] **AUTH-01**: User can sign up with email and password via Supabase Auth
- [ ] **AUTH-02**: User can sign up with Google OAuth via Supabase Auth
- [ ] **AUTH-03**: User receives email verification after signup via Resend
- [ ] **AUTH-04**: User can log in with email/password or Google
- [ ] **AUTH-05**: User can log out and session ends properly
- [ ] **AUTH-06**: User can reset password via email link
- [ ] **AUTH-07**: User session persists across browser refresh
- [ ] **AUTH-08**: User can update profile settings (name, email, password change)
- [ ] **AUTH-09**: Anonymous risk score data is automatically linked when user creates account

### Deeper Assessment (DEEP)

- [ ] **DEEP-01**: Authenticated user can complete deeper assessment form
- [ ] **DEEP-02**: User can input current skills (auto-suggest from O*NET + manual additions)
- [ ] **DEEP-03**: User can input salary requirements/expectations
- [ ] **DEEP-04**: User can input time availability (hours per week for reskilling)
- [ ] **DEEP-05**: User can input location/remote work preferences
- [ ] **DEEP-06**: User can input industry preferences (what sectors interest them)
- [ ] **DEEP-07**: System saves deeper assessment progress (resume if abandoned)

### Pivot Path Generation (PIVOT)

- [ ] **PIVOT-01**: System generates all 3 career pivot paths simultaneously (not sequentially)
- [ ] **PIVOT-02**: Each path includes skill gap analysis (current vs target role skills)
- [ ] **PIVOT-03**: Each path includes 90-day week-by-week action plan with specific milestones
- [ ] **PIVOT-04**: Each path includes fit score with transparent reasoning ("why this fits you")
- [ ] **PIVOT-05**: Each path includes AI-safety rating for target role (future-proof assessment)
- [ ] **PIVOT-06**: Each path includes curated free learning resources mapped to skill gaps
- [ ] **PIVOT-07**: Each path includes salary information for target role
- [ ] **PIVOT-08**: Each path includes realistic time estimate based on user's hours/week availability
- [ ] **PIVOT-09**: Each path includes industry adoption speed context (Layer 3 from risk scoring)
- [ ] **PIVOT-10**: Each path includes transferable strengths identification (safe tasks carry over)
- [ ] **PIVOT-11**: System uses Gemini API (primary) for narrative generation with Groq fallback
- [ ] **PIVOT-12**: Failed LLM requests are queued for retry (don't block user flow)

### Payment & Unlock (PAY)

- [ ] **PAY-01**: User sees preview UI showing titles, fit scores, AI-safety ratings (details blurred)
- [ ] **PAY-02**: User can click "Unlock All 3 Plans for $19" and redirect to Stripe Checkout
- [ ] **PAY-03**: Stripe Checkout session includes user metadata (userId, assessmentId)
- [ ] **PAY-04**: System has webhook handler for Stripe payment events (verify signatures)
- [ ] **PAY-05**: Webhook updates Supabase status: 'preview' → 'unlocked' (idempotent)
- [ ] **PAY-06**: After successful payment, user sees full details for all 3 pivot paths (no blur)
- [ ] **PAY-07**: User receives payment receipt email via Resend
- [ ] **PAY-08**: User receives plan unlock notification email via Resend with all 3 plans

### Progress Tracking (TRACK)

- [ ] **TRACK-01**: User can access dashboard overview showing progress metrics and timeline
- [ ] **TRACK-02**: User sees week-by-week checklist UI with expandable milestones
- [ ] **TRACK-03**: User can manually check off completed tasks
- [ ] **TRACK-04**: User sees progress visualization (charts, progress bars, completion percentage)
- [ ] **TRACK-05**: User can mark tasks as "skip" or "not applicable" (optional engagement)
- [ ] **TRACK-06**: User sees timeline view with current week highlighted

### Support & Legal (LEGAL)

- [ ] **LEGAL-01**: Site has Help/FAQ page explaining methodology and common questions
- [ ] **LEGAL-02**: Site has Privacy Policy page (GDPR/CCPA compliant)
- [ ] **LEGAL-03**: Site has Terms of Service page
- [ ] **LEGAL-04**: Site has contact/support mechanism (email form or mailto link)
- [ ] **LEGAL-05**: Site documents research methodology with academic citations (O*NET, Eloundou, Felten)

### Technical Infrastructure (INFRA)

- [ ] **INFRA-01**: Next.js project setup with TypeScript, Tailwind, App Router
- [ ] **INFRA-02**: Supabase project created with PostgreSQL database and Auth configured
- [ ] **INFRA-03**: Resend account configured for transactional email (100/day free tier)
- [ ] **INFRA-04**: Stripe account configured with test mode and live mode webhooks
- [ ] **INFRA-05**: Vercel project configured for deployment (free tier)
- [ ] **INFRA-06**: Environment variables properly configured (.env.local, Vercel dashboard)
- [ ] **INFRA-07**: O*NET data processing pipeline (download → parse → JSON → version control)
- [ ] **INFRA-08**: Deterministic scoring engine implemented as pure TypeScript functions
- [ ] **INFRA-09**: Rate limiting on free assessment endpoint (10 per hour per IP)
- [ ] **INFRA-10**: Error tracking configured (Sentry or similar)
- [ ] **INFRA-11**: Database schema created in Supabase (users, assessments, pivot_plans, payments)
- [ ] **INFRA-12**: Gemini API client configured with fallback to Groq API

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Personalization

- **PERS-01**: User can specify learning style preferences (videos, books, hands-on) for more tailored resource recommendations
- **PERS-02**: System tracks which learning resources user clicked/completed
- **PERS-03**: System recommends additional pivot paths based on user progress

### Admin Panel

- **ADMIN-01**: Admin can authenticate with role-based authorization (MFA enforced)
- **ADMIN-02**: Admin can view all users and their assessment/payment status
- **ADMIN-03**: Admin can view analytics dashboard (traffic, conversions, revenue, funnel)
- **ADMIN-04**: Admin can view payment records and handle refunds
- **ADMIN-05**: Admin can manually unlock plans for support purposes
- **ADMIN-06**: Admin can view audit logs (who changed what, when)

### Community & Social

- **SOCL-01**: User can share success stories after completing pivot plan
- **SOCL-02**: User can view anonymized success stories from others in similar roles
- **SOCL-03**: User can participate in community forum (requires moderation)

### Enhanced Insights

- **INSGT-01**: User can re-take assessment after 90 days to see progress
- **INSGT-02**: User can compare their risk score to industry averages
- **INSGT-03**: User can see trending pivot paths for their role

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Job board / job listings | Crowded space (LinkedIn, Indeed). Shifts focus from skill-building to job hunting. Link to external boards instead. |
| Resume builder | Better tools exist (Zety, Resume.io, Canva). High maintenance burden. Recommend external tools instead. |
| Live career coaching | Doesn't scale. Defeats automated model. High cost. |
| Community forums | Moderation burden, scope creep, not v1 complexity. Deferred to v2+. |
| Personality assessments | Saturated market (Myers-Briggs, Big 5). Not core value. Focus on skills/tasks. |
| Networking features | Not core to product. Adds social complexity. Recommend LinkedIn, industry groups. |
| Recurring content updates | Unsustainable for one-time payment model. Static plan based on assessment date. |
| Mobile native apps | Development/maintenance overhead. Responsive web app sufficient. |
| Detailed certification tracking | Feature creep. External tools handle this (Credly). Link instead. |
| Interview prep tools | Adjacent market, dilutes focus. Recommend Pramp, InterviewBit. |
| Company reviews / culture fit | Glassdoor/Blind own this space. Not differentiating. Link to external resources. |
| Automated job applications | Ethical concerns, spam risk. Not aligned with skill-building focus. Offer strategy tips, not automation. |
| Real-time chat / messaging | High complexity, not core value. No user-to-user communication in v1. |
| AI-powered job matching | Shifts focus to job hunting. We're focused on skill development and career pivots. |

## Traceability

Which phases cover which requirements. Will be populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | TBD | Pending |
| INFRA-02 | TBD | Pending |
| INFRA-03 | TBD | Pending |
| INFRA-04 | TBD | Pending |
| INFRA-05 | TBD | Pending |
| INFRA-06 | TBD | Pending |
| INFRA-07 | TBD | Pending |
| INFRA-08 | TBD | Pending |
| INFRA-09 | TBD | Pending |
| INFRA-10 | TBD | Pending |
| INFRA-11 | TBD | Pending |
| INFRA-12 | TBD | Pending |
| ASSESS-01 | TBD | Pending |
| ASSESS-02 | TBD | Pending |
| ASSESS-03 | TBD | Pending |
| ASSESS-04 | TBD | Pending |
| ASSESS-05 | TBD | Pending |
| ASSESS-06 | TBD | Pending |
| ASSESS-07 | TBD | Pending |
| ASSESS-08 | TBD | Pending |
| ASSESS-09 | TBD | Pending |
| ASSESS-10 | TBD | Pending |
| VIRAL-01 | TBD | Pending |
| VIRAL-02 | TBD | Pending |
| VIRAL-03 | TBD | Pending |
| AUTH-01 | TBD | Pending |
| AUTH-02 | TBD | Pending |
| AUTH-03 | TBD | Pending |
| AUTH-04 | TBD | Pending |
| AUTH-05 | TBD | Pending |
| AUTH-06 | TBD | Pending |
| AUTH-07 | TBD | Pending |
| AUTH-08 | TBD | Pending |
| AUTH-09 | TBD | Pending |
| DEEP-01 | TBD | Pending |
| DEEP-02 | TBD | Pending |
| DEEP-03 | TBD | Pending |
| DEEP-04 | TBD | Pending |
| DEEP-05 | TBD | Pending |
| DEEP-06 | TBD | Pending |
| DEEP-07 | TBD | Pending |
| PIVOT-01 | TBD | Pending |
| PIVOT-02 | TBD | Pending |
| PIVOT-03 | TBD | Pending |
| PIVOT-04 | TBD | Pending |
| PIVOT-05 | TBD | Pending |
| PIVOT-06 | TBD | Pending |
| PIVOT-07 | TBD | Pending |
| PIVOT-08 | TBD | Pending |
| PIVOT-09 | TBD | Pending |
| PIVOT-10 | TBD | Pending |
| PIVOT-11 | TBD | Pending |
| PIVOT-12 | TBD | Pending |
| PAY-01 | TBD | Pending |
| PAY-02 | TBD | Pending |
| PAY-03 | TBD | Pending |
| PAY-04 | TBD | Pending |
| PAY-05 | TBD | Pending |
| PAY-06 | TBD | Pending |
| PAY-07 | TBD | Pending |
| PAY-08 | TBD | Pending |
| TRACK-01 | TBD | Pending |
| TRACK-02 | TBD | Pending |
| TRACK-03 | TBD | Pending |
| TRACK-04 | TBD | Pending |
| TRACK-05 | TBD | Pending |
| TRACK-06 | TBD | Pending |
| LEGAL-01 | TBD | Pending |
| LEGAL-02 | TBD | Pending |
| LEGAL-03 | TBD | Pending |
| LEGAL-04 | TBD | Pending |
| LEGAL-05 | TBD | Pending |

**Coverage:**
- v1 requirements: 81 total
- Mapped to phases: 0 (will be populated during roadmap creation)
- Unmapped: 81 ⚠️

---

## Requirements Summary

**By Category:**
- Core Assessment Flow: 10 requirements
- Viral Growth Mechanic: 3 requirements
- Account & Authentication: 9 requirements
- Deeper Assessment: 7 requirements
- Pivot Path Generation: 12 requirements
- Payment & Unlock: 8 requirements
- Progress Tracking: 6 requirements
- Support & Legal: 5 requirements
- Technical Infrastructure: 12 requirements

**Priority Breakdown:**
- Critical path (blocks everything): INFRA-01 to INFRA-12, ASSESS-01 to ASSESS-04
- High priority (core value): PIVOT-01 to PIVOT-12, PAY-01 to PAY-08
- Medium priority (retention): TRACK-01 to TRACK-06, AUTH-01 to AUTH-09
- Low priority (polish): LEGAL-01 to LEGAL-05, VIRAL-03

**Dependencies:**
- Job title fuzzy matching (ASSESS-02) → All downstream features
- O*NET data processing (INFRA-07) → Risk scoring (ASSESS-04) → Path generation (PIVOT-*)
- Authentication (AUTH-*) → Deeper assessment (DEEP-*) → Pivot generation (PIVOT-*)
- Pivot generation (PIVOT-*) → Payment (PAY-*) → Progress tracking (TRACK-*)

---
*Requirements defined: 2026-03-30*
*Last updated: 2026-03-30 after feature scoping*
