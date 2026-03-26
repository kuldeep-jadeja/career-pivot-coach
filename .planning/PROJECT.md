# Unautomatable — AI Career Pivot Coach

## What This Is

Unautomatable is a web application that helps mid-career professionals assess their AI displacement risk and get personalized career pivot plans. Users get an instant, shareable risk score (free viral hook), then unlock detailed 90-day pivot pathways with specific skill gaps, learning resources, and action plans for a one-time $19 payment.

## Core Value

Provide an honest, research-backed assessment of AI displacement risk paired with actionable, personalized career transition plans that people can actually execute.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Free risk assessment generates shareable score card with task breakdown, timeline, and transferable strengths
- [ ] Risk scoring engine built on O*NET data + published AI exposure research (Eloundou, Felten)
- [ ] Fuzzy job title matching maps user input to O*NET occupation codes
- [ ] Shareable visual cards (downloadable image + dynamic OG meta tags for link previews)
- [ ] User accounts (email/password auth) created after free assessment
- [ ] Deeper assessment captures tasks, skills, salary needs, location, time available, preferences
- [ ] Generate 3 personalized pivot paths ranked by fit score
- [ ] Free preview shows: path titles, fit reasoning, AI-safety ratings, blurred full plan
- [ ] $19 one-time payment unlocks all 3 full pivot plans
- [ ] Full pivot plans include: skill gap analysis, 90-day week-by-week action plan, free learning resources, full narrative
- [ ] User dashboard with checklist, progress bar, timeline view, and optional manual tracking
- [ ] Payment processing via Stripe
- [ ] Email confirmations and receipts
- [ ] Admin panel: view users/assessments, payment/revenue dashboard, analytics (traffic, conversions)
- [ ] Landing page with marketing copy
- [ ] Terms of Service, Privacy Policy pages
- [ ] Help/FAQ section
- [ ] Fully responsive design (mobile + desktop)
- [ ] Google Gemini integration for personalized narrative generation (1 API call per assessment, free tier)

### Out of Scope

- Recurring subscriptions — One-time payment model keeps it simple and reduces churn anxiety
- Real-time career coaching — Automated guidance only, no human advisors in v1
- Job board integration — Focus on skill transition, not job matching
- Community features — No forums or user-to-user interaction in v1
- Resume building tools — External services handle this better
- Mobile native apps — Web-first, mobile via responsive design

## Context

**Target Users:**
- Mid-career professionals anxious about AI displacement
- Recent layoffs due to AI/automation
- Workers in shrinking industries seeking structured transition plans

**Viral Growth Mechanic:**
The free risk score is designed for social media sharing. Users post "I got 74% AI displacement risk!" with a visual card, driving organic traffic. Both downloadable image cards and dynamic OG meta previews for link sharing.

**Risk Scoring Approach:**
Multi-layer algorithmic scoring (not LLM-dependent):
- Layer 1 (35%): Research-based AI exposure baseline (Eloundou et al. "GPTs are GPTs")
- Layer 2 (35%): Task-level automation analysis using O*NET task data
- Layer 3 (15%): Industry adoption speed modifier
- Layer 4 (15%): Experience level modifier
- Pre-processed O*NET bulk data (static JSON files) + published research scores
- Deterministic scoring (same inputs = same score)

**LLM Usage:**
Google Gemini free tier used ONLY for personalized narrative text in pivot plans (~1 API call per assessment). Risk scoring is purely algorithmic.

**Conversion Flow:**
1. Land on site → Take free risk assessment (no account required)
2. Get shareable risk score → Share socially or proceed
3. Create account (email/password) to access deeper assessment
4. Complete deeper assessment → System generates 3 pivot paths
5. See preview (titles, fit reasoning, AI-safety ratings, blurred details)
6. Pay $19 → Unlock all 3 full pivot plans
7. Access dashboard to track progress (optional)

**Dashboard Philosophy:**
Progress tracking is motivational, not mandatory. The plan delivers value whether users log progress or not. Dashboard offers lightweight checkboxes, timestamps, streak nudges — but never blocks access to plan content.

## Constraints

- **Tech Stack**: Next.js (App Router), React, shadcn/ui components — Keep it simple, no over-engineering
- **Backend**: MongoDB Atlas for database, NextAuth or similar for authentication
- **Deployment**: Digital Ocean KVM droplet
- **Payment**: Stripe (tentative, to be finalized)
- **LLM Costs**: Stay within Google Gemini free tier limits (minimize API calls)
- **Data Sources**: O*NET bulk data (free CSV downloads from onetcenter.org), published AI exposure research papers
- **Pricing Model**: $19 one-time fee (starting point, will validate through usage)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Algorithmic risk scoring (not LLM) | Deterministic, fast, free, no API costs for viral hook | — Pending |
| O*NET + published research | Grounded in real occupational data and peer-reviewed AI exposure metrics | — Pending |
| One-time $19 unlock | Simple pricing, no subscription anxiety, impulse-buy friendly | — Pending |
| Preview before paywall | Build trust, prove personalization, increase conversion after time investment | — Pending |
| MongoDB Atlas | Flexible schema for assessments, familiar, easy scaling | — Pending |
| Next.js App Router | Modern React framework, server components, easy deployment | — Pending |
| shadcn/ui components | High-quality, accessible UI components without heavy framework lock-in | — Pending |
| Dashboard is optional | Plans deliver value without forced engagement, respects user agency | — Pending |

---
*Last updated: 2026-03-26 after initialization*
