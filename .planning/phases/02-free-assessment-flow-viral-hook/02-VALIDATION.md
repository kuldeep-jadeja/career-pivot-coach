---
phase: 02
slug: free-assessment-flow-viral-hook
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-02
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.2 + React Testing Library 16.3.2 |
| **Config file** | `vitest.config.ts` (already exists from Phase 1) |
| **Quick run command** | `npm test` |
| **Full suite command** | `npm run test:coverage` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test`
- **After every plan wave:** Run `npm run test:coverage`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-T1 | 01 | 1 | ASSESS-02 | unit | `npm test tests/assessment/fuzzy-search.test.ts` | ❌ Wave 0 | ⬜ pending |
| 02-01-T1 | 01 | 1 | ASSESS-03 | unit | `npm test tests/assessment/validation.test.ts` | ❌ Wave 0 | ⬜ pending |
| 02-01-T2 | 01 | 1 | ASSESS-10 | unit | `npm test tests/assessment/session-storage.test.ts` | ❌ Wave 0 | ⬜ pending |
| 02-01-T3 | 01 | 1 | ASSESS-02,03 | build | `npm run build` | ✅ | ⬜ pending |
| 02-02-T1 | 02 | 1 | ASSESS-05 | unit | `npm test tests/components/RiskScoreGauge.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-02-T2 | 02 | 1 | ASSESS-05 | unit | `npm test tests/components/LayerBreakdown.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-02-T3 | 02 | 1 | ASSESS-06 | unit | `npm test tests/components/TaskRiskList.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-03-T1 | 03 | 2 | ASSESS-01 | build | `npm run build` | ✅ | ⬜ pending |
| 02-03-T2 | 03 | 2 | ASSESS-04 | build | `npm run build` | ✅ | ⬜ pending |
| 02-03-T3 | 03 | 2 | ASSESS-01 | integration | `npm test tests/assessment/anonymous-flow.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-04-T1 | 04 | 2 | VIRAL-01 | build | `npm run build` | ✅ | ⬜ pending |
| 02-04-T2 | 04 | 2 | VIRAL-02 | build | `npm run build` | ✅ | ⬜ pending |
| 02-04-T3 | 04 | 2 | VIRAL-01,02 | unit | `npm test tests/sharing/` | ❌ Wave 0 | ⬜ pending |
| 02-05-T1 | 05 | 3 | ASSESS-08 | build | `npm run build` | ✅ | ⬜ pending |
| 02-05-T2 | 05 | 3 | ASSESS-07,08 | build | `npm run build` | ✅ | ⬜ pending |
| 02-05-T3 | 05 | 3 | ASSESS-08 | unit | `npm test tests/email/results-email.test.tsx` | ❌ Wave 0 | ⬜ pending |
| 02-06-T1 | 06 | 3 | LEGAL-01,04,05 | build | `npm run build` | ✅ | ⬜ pending |
| 02-06-T2 | 06 | 3 | LEGAL-01 | build | `npm run build` | ✅ | ⬜ pending |
| 02-06-T3 | 06 | 3 | LEGAL-01,05 | unit | `npm test tests/legal/` | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

**13 new test files needed (from RESEARCH.md):**

- [ ] `tests/assessment/anonymous-flow.test.tsx` — End-to-end anonymous assessment flow (ASSESS-01)
- [ ] `tests/assessment/job-title-search.test.ts` — Fuzzy search with confidence scoring (ASSESS-02)
- [ ] `tests/assessment/form-validation.test.ts` — Industry/experience input validation (ASSESS-03)
- [ ] `tests/assessment/session-storage.test.ts` — Progress persistence (ASSESS-10)
- [ ] `tests/results/risk-visualization.test.tsx` — Score display components (ASSESS-04)
- [ ] `tests/results/task-breakdown.test.tsx` — Task-level analysis (ASSESS-05)
- [ ] `tests/sharing/og-image.test.ts` — Dynamic OG tag generation (VIRAL-01)
- [ ] `tests/sharing/png-download.test.tsx` — Share card PNG export (VIRAL-01)
- [ ] `tests/email/results-email.test.tsx` — Email template rendering (ASSESS-08)
- [ ] `tests/email/delivery.test.ts` — Resend integration (ASSESS-08)
- [ ] `tests/components/mobile-responsive.test.tsx` — Mobile viewport rendering (ASSESS-09)
- [ ] `tests/legal/help-page.test.tsx` — Help/FAQ page (LEGAL-01)
- [ ] `tests/legal/methodology-page.test.tsx` — Methodology page (LEGAL-04)

**Additional infrastructure:**
- [ ] `tests/fixtures/assessment-data.ts` — Shared test fixtures
- [ ] `tests/setup.ts` — Test environment setup (already exists, may need updates)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mobile responsiveness on real devices | ASSESS-09 | Simulators miss device-specific issues (keyboard behavior, touch targets, font rendering) | Test on iOS Safari (iPhone 13+) and Android Chrome (Pixel 6+). Verify: 1) Font size ≥16px on inputs (no auto-zoom), 2) Touch targets ≥44px, 3) Keyboard doesn't obscure inputs, 4) Forms work in landscape orientation |
| Social share card rendering on platforms | VIRAL-01 | Platform-specific OG rendering (LinkedIn/Twitter/Facebook validators) | Use platform debugging tools: 1) LinkedIn Post Inspector, 2) Twitter Card Validator, 3) Facebook Sharing Debugger. Verify 1200x630 image renders correctly with score, job title, and branding |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
