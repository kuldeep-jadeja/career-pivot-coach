# Feature Landscape

**Domain:** AI Career Transition & Risk Assessment Platforms
**Researched:** 2025-01-21
**Confidence:** MEDIUM (based on training data and domain knowledge, WebSearch unavailable)

## Overview

Career assessment and AI displacement risk platforms sit at the intersection of three product categories:
1. **Career assessment tools** (MyPlan, PathSource, YouScience, 16Personalities Career)
2. **Job market analytics platforms** (LinkedIn Career Explorer, Indeed Career Guide)
3. **AI automation risk calculators** (Will Robots Take My Job, BBC AI Jobs Prediction)

This domain has clear table stakes from traditional career assessment, but AI displacement risk assessment is an emerging category with no dominant player yet. The differentiation opportunity lies in **actionable transition plans** rather than just risk scores.

---

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Free initial assessment** | Industry standard; users won't pay before seeing value | Low | Must be fast (<5 min), no account required |
| **Personalized results** | Generic advice = no value; must feel tailored to user | Medium | Requires matching user input to job/skill taxonomies |
| **Risk score / assessment output** | Users expect quantitative measure of their situation | Low | Visual presentation matters (charts, gauges, cards) |
| **Job title input** | Primary way users describe themselves | Low | Requires fuzzy matching (e.g., "Software Dev" → "Software Developer") |
| **Skills inventory** | Users expect to list what they can do | Medium | Auto-suggest from job title + manual additions |
| **Career path recommendations** | "What should I do next?" is the core question | High | Must be specific, not generic categories |
| **Educational requirements** | Users need to know what learning is required | Medium | Degree requirements, certifications, self-study options |
| **Salary information** | Career changers need to know financial implications | Medium | Requires salary data by occupation and location |
| **Time estimate** | "How long will this take?" is critical for planning | Low | Weeks/months to transition credibility |
| **Mobile responsiveness** | Users research careers on phone during commute, breaks | Low | Standard web development practice |
| **Email delivery of results** | Users want to save/revisit their assessment | Low | Requires email capture, templated emails |
| **Account creation** | To save progress and access detailed results | Low | Email/password or social auth |
| **Privacy policy / terms** | Legal requirement, builds trust | Low | Standard legal documents |

---

## Differentiators

Features that set product apart. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI displacement risk scoring** | **[CORE DIFFERENTIATOR]** Addresses modern anxiety; no major competitor does this well | High | Requires credible methodology (O*NET + published research) |
| **Shareable visual score cards** | Viral growth mechanic; social proof | Medium | Dynamic OG tags + downloadable images |
| **Task-level breakdown** | Shows *which* parts of job are at risk, not just overall score | Medium | Requires mapping job → tasks → AI exposure |
| **90-day action plans** | Concrete, time-bound plans vs vague advice | High | Week-by-week milestones, specific actions |
| **Skill gap analysis** | Shows exact skills needed for target role | Medium | Requires skill taxonomy comparison (current vs target) |
| **Free learning resources** | Curated list of courses/resources for skill gaps | Medium | Pre-mapped resources per skill, kept current |
| **Multiple pivot path options** | Shows alternatives, not single "right answer" | High | Requires ranking algorithm (fit score) |
| **Fit score explanation** | Transparent reasoning for recommendations | Medium | "You're a good fit because..." builds trust |
| **AI-safety ratings** | Shows which pivot paths are future-proof | Medium | Forward-looking risk assessment for target roles |
| **Preview before paywall** | Reduces purchase anxiety; builds trust | Low | Show enough to prove value, blur details |
| **Progress tracking dashboard** | Motivational; helps users stay on track | Medium | Checklists, streaks, timeline view |
| **One-time payment** | No subscription anxiety; impulse-buy friendly | Low | Stripe integration |
| **Industry adoption speed** | Contextualizes risk timeline ("3-5 years" vs "imminent") | Medium | Requires industry-specific data |
| **Transferable strengths identification** | Positive framing; shows what carries over | Medium | Maps skills between source/target occupations |
| **Research-backed methodology** | Credibility through academic citations | Low | Transparency about data sources (O*NET, Eloundou, Felten) |
| **No recurring costs** | Users own their plan forever; revisit anytime | Low | Business model differentiation |

---

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Job board / listings** | Crowded space; shifts focus from skill building to job hunting | Link to external job boards (LinkedIn, Indeed) |
| **Resume builder** | Better tools exist (Zety, Resume.io, Canva); maintenance burden | Recommend external tools |
| **Live career coaching** | Doesn't scale; expensive; defeats automated model | Offer AI-generated personalized guidance |
| **Community forums** | Moderation burden; scope creep; v1 complexity | Defer to Phase 2 or never |
| **Personality assessments** | Saturated market (Myers-Briggs, Big 5); not core value | Focus on skills/tasks, not personality |
| **Networking features** | Not core to product; adds social complexity | Recommend LinkedIn, industry groups |
| **Recurring content updates** | Users pay once; expecting fresh content monthly is unsustainable | Static plan based on assessment date |
| **Mobile native apps** | Development/maintenance overhead; web works fine | Responsive web app |
| **Detailed certification tracking** | Feature creep; external tools handle this | Link to credential databases (Credly, etc.) |
| **Interview prep tools** | Adjacent market; dilutes focus | Recommend Pramp, InterviewBit, etc. |
| **Company reviews / culture fit** | Glassdoor/Blind own this; not differentiating | Link to external resources |
| **Automated job application** | Ethical concerns; spam risk; not aligned with skill-building focus | Offer application strategy tips, not automation |

---

## Feature Dependencies

```
Account Creation → Deeper Assessment → Pivot Path Generation
                                      → Payment → Full Plan Access
                                                → Progress Dashboard

Free Risk Assessment → Shareable Score Card (standalone, no account)
                    → Account Creation (optional gate)

Skill Gap Analysis → Learning Resources (resources map to gaps)

Task Breakdown → AI Exposure Scoring (tasks are atomic units)

Job Title Input → Fuzzy Matching → O*NET Occupation Code → All downstream features
```

**Critical path:**
```
Job Title → O*NET Mapping → Task/Skill Extraction → Risk Scoring → Path Generation
```

**Viral loop:**
```
Free Assessment → Score Card → Social Share → Inbound Traffic → Free Assessment
```

---

## MVP Recommendation

### Phase 1 (Validate Core Hook)

**Prioritize:**
1. **Free risk assessment** (table stakes) — Fast, no account required
2. **Job title fuzzy matching** (table stakes) — Enables O*NET mapping
3. **AI displacement risk score** (differentiator) — Core unique value
4. **Task-level breakdown** (differentiator) — Shows "why" behind score
5. **Shareable visual score cards** (differentiator) — Viral growth mechanic
6. **Basic email capture** (table stakes) — Build audience, enable follow-up

**Defer:**
- Account creation (Phase 2, needed for deeper assessment)
- Pivot path generation (Phase 2, paywall unlock)
- Progress dashboard (Phase 3, post-conversion)

**Rationale:** Validate that people care about AI displacement risk. If free assessment doesn't generate engagement, paid plans won't convert.

---

### Phase 2 (Validate Conversion)

**Prioritize:**
1. **Account creation** (table stakes) — Gate to deeper value
2. **Deeper assessment** (skills, preferences, constraints) — Personalization inputs
3. **Pivot path generation** (differentiator) — Core paid value
4. **Skill gap analysis** (differentiator) — Actionable insights
5. **90-day action plans** (differentiator) — Concrete next steps
6. **Preview + paywall** (differentiator) — Build trust before purchase
7. **Stripe payment** (table stakes) — Revenue
8. **Learning resources** (differentiator) — Completes action plan value

**Defer:**
- Progress dashboard (Phase 3)
- Multiple pivot paths (start with 1 best-fit path, add 3 paths if conversion validates)

**Rationale:** Once free assessment proves engagement, validate willingness to pay for actionable plans.

---

### Phase 3 (Optimize Retention)

**Prioritize:**
1. **Progress dashboard** (differentiator) — Increase plan completion
2. **Multiple pivot path options** (differentiator) — More value for $19
3. **AI-safety ratings** (differentiator) — Future-proof recommendations
4. **Fit score transparency** (differentiator) — Build trust in recommendations

**Rationale:** After validating conversion, optimize for users successfully executing plans (testimonials, word-of-mouth).

---

## Feature Complexity Matrix

| Complexity | Features | Notes |
|------------|----------|-------|
| **Low** | Free assessment, risk score display, email capture, job title input, account creation, preview/blur, one-time payment, mobile responsive, privacy policy, time estimates | Standard web development patterns |
| **Medium** | Personalized results, skills inventory, fuzzy job matching, task breakdown, skill gap analysis, free learning resources, progress dashboard, shareable cards, salary data, fit scoring | Requires data modeling, taxonomy mapping, or integration work |
| **High** | AI displacement risk scoring, career path recommendations, 90-day action plans, multiple pivot paths, AI-safety ratings | Requires algorithm development, O*NET data processing, LLM integration |

---

## Domain-Specific Considerations

### Career Assessment Space
- **Established players:** MyPlan ($29.99/year), YouScience ($30-50 school licenses), PathSource (free with upsells)
- **Typical features:** Personality tests, interest inventories, skills assessments, career matches
- **Pain point:** Generic advice; "You'd be good at marketing!" without actionable steps

### AI Displacement Risk Space
- **Emerging category:** No dominant player
- **Existing tools:** BBC "Will AI Take My Job?" (toy/PR stunt), various academic calculators (not consumer-ready)
- **Opportunity:** First to market with credible, actionable risk assessment

### Career Transition Planning
- **Established players:** LinkedIn Learning (subscription), Coursera Career Academy (courses), General Assembly (bootcamps)
- **Pain point:** Either too generic (LinkedIn skill assessments) or too expensive (bootcamps)
- **Opportunity:** Middle ground — personalized guidance at impulse-buy price point

---

## Competitive Feature Benchmarking

| Feature | Traditional Career Assessments | AI Risk Calculators | This Product |
|---------|-------------------------------|---------------------|--------------|
| Free entry point | ✅ (trial) | ✅ | ✅ |
| Personalized results | ✅ | ❌ (generic) | ✅ |
| AI displacement focus | ❌ | ✅ | ✅ |
| Actionable plans | ❌ (generic advice) | ❌ | ✅ |
| Task-level analysis | ❌ | ❌ (job-level only) | ✅ |
| Skill gap analysis | ✅ | ❌ | ✅ |
| Learning resources | ✅ (courses to buy) | ❌ | ✅ (free resources) |
| Shareable results | ❌ | ✅ (toy-like) | ✅ (professional) |
| One-time pricing | ❌ (subscription) | N/A (free toys) | ✅ |
| Progress tracking | ✅ | ❌ | ✅ |

**Competitive gap:** No one combines credible AI risk assessment with actionable transition plans. This product sits in white space.

---

## Sources & Confidence Notes

**Confidence: MEDIUM**

- **Career assessment features:** Based on training data knowledge of MyPlan, PathSource, YouScience, O*NET Interest Profiler, 16Personalities Career Reports
- **AI risk calculators:** Based on training data knowledge of BBC "Will AI Take My Job?", Oxford Martin School calculator, various academic tools
- **Career transition platforms:** Based on training data knowledge of LinkedIn Learning, Coursera, Udacity, General Assembly offerings
- **Limitation:** WebSearch unavailable; could not verify current (2024-2025) feature sets or new entrants
- **Recommendation:** Validate feature assumptions by directly exploring competitor products before Phase 1 development

**Verification needed:**
- [ ] Current feature sets of MyPlan, PathSource, YouScience (as of 2024-2025)
- [ ] Any new AI displacement risk platforms launched 2023-2025
- [ ] Pricing models of competitors (confirm subscription vs one-time trends)
- [ ] User reviews mentioning missing features (Reddit, Product Hunt, G2)

**High confidence areas:**
- Table stakes features (industry standard for 10+ years)
- Anti-features rationale (clear scope boundaries)
- Feature dependencies (architectural constraints)

**Low confidence areas:**
- Exact pricing of competitors (may have changed)
- New entrants in AI displacement risk space (emerging category)
- Current best practices for social sharing (platform changes)
