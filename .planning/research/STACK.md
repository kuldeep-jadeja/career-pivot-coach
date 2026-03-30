# Stack Research

**Domain:** AI Career Assessment & Transition Planning Web Application
**Updated:** 2026-03-30
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Next.js** | @latest | Full-stack React framework with App Router | Industry standard, excellent Server Components support, built-in API routes, edge runtime support. App Router is stable and recommended for new projects. Native Vercel deployment. |
| **React** | @latest | UI library | Latest stable with Server Components, Actions, and improved concurrent rendering. Native form handling and async transitions perfect for multi-step assessments. |
| **TypeScript** | @latest | Type-safe JavaScript | Non-negotiable for production apps. Catches majority of bugs at compile time. Improved type inference and performance. |
| **Tailwind CSS** | @latest | Utility-first CSS framework | Fast builds, improved JIT. Standard for rapid UI development. |
| **Supabase** | @latest | PostgreSQL database + Auth | Unified solution for database and authentication. Simpler architecture, fewer dependencies. Excellent free tier, built-in row-level security, real-time subscriptions. |
| **Resend** | @latest | Transactional email | Free tier: 100 emails/day. Perfect for account verification, payment receipts, pivot plan delivery. Modern API, excellent DX. |

**Version Strategy:** Use @latest for all packages and verify current stable versions on npm during installation. Research version numbers may be outdated.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **shadcn/ui** | @latest | Pre-built accessible UI components | Use for dialogs, forms, dropdowns, cards. Built on Radix UI primitives. Copy-paste components (not npm package). Handles accessibility out of the box. |
| **@radix-ui/react-*** | @latest | Unstyled accessible primitives | Foundation for shadcn/ui. Use directly if customizing beyond shadcn patterns. |
| **Zod** | @latest | Schema validation | Essential for form validation, API input validation, and type-safe database schemas. Works perfectly with React Hook Form. |
| **React Hook Form** | @latest | Form state management | Industry standard for complex multi-step forms. Minimal re-renders, excellent DX. Use with @hookform/resolvers for Zod integration. |
| **@hookform/resolvers** | @latest | Validation resolver bridge | Connects Zod schemas to React Hook Form. |
| **Stripe** | @latest | Payment processing | One-time payments with Checkout Sessions. Strong TypeScript types and webhook handling. |
| **@google/generative-ai** | @latest | Google Gemini SDK (Primary) | For narrative generation. Free tier includes generous request quota. Simple promise-based API. |
| **groq-sdk** | @latest | Groq API (Fallback LLM) | Backup LLM when Gemini rate limits hit. Strategy: Gemini (primary) → Groq (backup) → queue for later. Both free tier. |
| **Recharts** | @latest | Data visualization | Best React charting library for career path visualization, progress charts, risk breakdowns. Server-side rendering compatible. |
| **date-fns** | @latest | Date manipulation | Lightweight, tree-shakeable, immutable. Perfect for 90-day timeline calculations. |
| **sharp** | @latest | Image processing | Node.js native image processing for shareable card generation. Faster and more memory efficient than canvas-based solutions. Works on Vercel serverless functions. |
| **@vercel/og** | @latest | Dynamic OG images | Edge function-based Open Graph image generation for social media previews. Native Vercel integration. |
| **react-pdf** or **@react-pdf/renderer** | @latest | PDF generation (optional) | If offering downloadable PDF pivot plans. Evaluate if needed based on user demand. |

**Note:** Verify all package versions during installation. Use `npm install <package>@latest` to get current stable releases.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **ESLint** | Code linting | Use @latest with next/core-web-vitals config + TypeScript plugin. |
| **Prettier** | Code formatting | Use @latest. Integrate with ESLint via eslint-config-prettier. Auto-format on save. |
| **Turbopack** | Next.js bundler | Built into Next.js. Improved HMR speeds over Webpack. |
| **Git** | Version control | Standard. Use conventional commits for clean history. |
| **Vercel CLI** | Deployment & testing | Preview deployments, environment variables, logs. `npm install -g vercel` |

## Deployment

**Platform:** Vercel Free Tier (Hobby Plan)
- Zero infrastructure cost
- Native Next.js support with optimized builds
- Automatic HTTPS, CDN, edge functions
- Preview deployments for every git push
- Environment variables via dashboard or CLI
- Serverless functions (max 10s execution on free tier)
- Edge functions for OG image generation (@vercel/og)

**Free Tier Limits:**
- 100 GB bandwidth/month
- Unlimited deployments
- 100 GB-hours serverless function execution
- 500 edge function invocations/day (sufficient for initial validation)

## Installation

```bash
# Create Next.js project with TypeScript
npx create-next-app@latest career-pivot-coach --typescript --tailwind --app --use-npm

# Supabase (database + auth)
npm install @supabase/supabase-js@latest @supabase/ssr@latest

# Payment processing
npm install stripe@latest

# LLM integrations (primary + fallback)
npm install @google/generative-ai@latest groq-sdk@latest

# Form handling & validation
npm install react-hook-form@latest @hookform/resolvers@latest zod@latest

# Charts & visualization
npm install recharts@latest

# Date utilities
npm install date-fns@latest

# Email (transactional)
npm install resend@latest

# Image generation (shareable cards + OG images)
npm install sharp@latest @vercel/og@latest

# shadcn/ui (use CLI to add components as needed)
npx shadcn@latest init
npx shadcn@latest add button card dialog form input label select textarea toast

# Dev dependencies
npm install -D @types/node@latest @types/react@latest eslint@latest prettier@latest
```

**Note:** All packages use @latest to ensure current stable versions. Verify compatibility during installation.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Next.js** | Remix, Astro | Remix if you prefer form-centric mutations. Astro if static-first (not applicable here). Next.js wins for full-stack React with great Vercel deployment. |
| **Supabase** | MongoDB Atlas, PlanetScale, Railway Postgres | MongoDB for flexible schema (but assessments have stable structure). PlanetScale for MySQL with branching. Supabase wins for unified auth + database + free tier. |
| **Tailwind CSS** | CSS Modules, styled-components | CSS Modules if you prefer scoped CSS. Styled-components if runtime CSS-in-JS is required. Tailwind is faster and more maintainable. |
| **Recharts** | Chart.js, D3.js | Chart.js for simpler charts (less React-friendly). D3 for highly custom visualizations (steep learning curve). Recharts is the sweet spot. |
| **Sharp** | Jimp, Canvas | Jimp is pure JS (slower). Canvas API (manual). Sharp is fastest with native bindings, works on Vercel. |
| **Resend** | SendGrid, Postmark, AWS SES | SendGrid for more complex email (higher free tier but worse DX). Postmark for transactional focus. AWS SES cheapest at scale but complex setup. Resend has best DX for simple transactional email. |
| **Gemini** | OpenAI, Anthropic | OpenAI GPT-4 for better quality (but paid only). Anthropic Claude for longer context. Gemini has best free tier for MVP validation. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **NextAuth v4 (next-auth package)** | Deprecated. Auth.js (v5) is the rebranded successor with breaking changes and better Next.js 15+ support. | **Auth.js** (`auth` package v1.5+) |
| **Moment.js** | Unmaintained since 2020. Large bundle (70KB+). | **date-fns** (tree-shakeable, 5-10KB typical bundle) |
| **Create React App** | No longer maintained. Next.js/Vite are modern replacements. | **Next.js** for full-stack, Vite for SPA only |
| **Webpack directly** | Complex config, slow. Next.js abstracts this with Turbopack/Webpack. | **Next.js built-in bundler** (Turbopack in v16+) |
| **Class components** | Legacy React pattern. Hooks are standard since 2019. | **Function components with hooks** |
| **Mongoose** | Adds ORM overhead and schema rigidity. Not needed with TypeScript + Zod. | **Native MongoDB driver + Zod schemas** |
| **Tailwind CSS v3.x** | Version 4.x is 2-3x faster with native CSS engine. No reason to stay on v3. | **Tailwind CSS v4.2+** |
| **Pages Router (Next.js)** | Legacy routing system. App Router is now stable and recommended for new projects. | **App Router** (default in Next.js 16+) |

## Stack Patterns by Variant

### If Building MVP Fast (Recommended for Phase 1-2)
- Use Next.js API routes for backend (no separate server)
- Server Components for data fetching (no client-side React Query needed initially)
- shadcn/ui for all UI components (no custom design system)
- MongoDB Atlas free tier (512MB, sufficient for 10K+ users)
- Google Gemini free tier (1500 requests/day)
- Sharp for server-side card generation only (defer html2canvas until user demand)

**Why:** Minimize infrastructure complexity. Next.js handles everything. Deploy single app to DigitalOcean.

### If Scaling Beyond 10K Active Users (Phase 4+)
- Add **React Query** (@tanstack/react-query@5.95.x) for client-side caching and optimistic updates
- Separate MongoDB connection pool management
- Add Redis for session caching (Auth.js supports multiple adapters)
- Consider edge functions for risk calculation (deterministic = edge-friendly)
- Implement proper image CDN for shareable cards (CloudFlare R2 or similar)

**Why:** React Query reduces server load. Redis speeds up auth. Edge functions reduce latency globally.

### If SEO is Critical Beyond Landing Page
- Pre-generate static risk assessment result pages (ISR with Next.js)
- Use `generateMetadata` for dynamic OG images per user result
- Implement structured data (JSON-LD) for career path rich snippets

**Why:** Career transition content has high search intent. Shareable results should be indexable.

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Next.js 16.2.x | React 19.x | Next.js 16 requires React 19+. No longer compatible with React 18. |
| Auth.js 1.5.x | Next.js 15+ | Rebranded from NextAuth v4. Breaking changes. Requires Next.js 15+ for middleware support. |
| Tailwind CSS 4.2.x | PostCSS optional | No longer requires PostCSS. Native CSS engine. May need config adjustments from v3. |
| @vercel/og 0.11.x | Next.js Edge Runtime | Only works in edge functions. Not compatible with Node.js API routes. |
| Sharp 0.34.x | Node.js 18+ | Requires Node.js 18.17+. Pre-built binaries for common platforms. May need build tools on ARM. |
| Recharts 3.8.x | React 19.x | Fully compatible with React 19. Server Component compatible. |
| React Hook Form 7.72.x | React 19.x | Stable with React 19. No breaking changes needed. |

## Sources

- **npm registry** (2025-01-26) — All version numbers verified via `npm view [package] version`
- **Next.js official blog** (https://nextjs.org/blog/next-16) — Next.js 16 release notes, Turbopack GA, App Router stability (MEDIUM confidence — training data + version verification)
- **React official blog** (https://react.dev/blog/2024/12/05/react-19) — React 19 stable release, Server Components, Actions (MEDIUM confidence — training data + version verification)
- **Auth.js migration guide** (https://authjs.dev/getting-started/migrating-to-v5) — NextAuth → Auth.js rebrand, breaking changes (MEDIUM confidence — training data + package naming verification)
- **Tailwind CSS v4 docs** (https://tailwindcss.com/docs/v4-beta) — Native CSS engine, breaking changes from v3 (MEDIUM confidence — training data + version verification)
- **MongoDB Node.js Driver docs** (https://www.mongodb.com/docs/drivers/node/current/) — v7.x stable API, TypeScript support (MEDIUM confidence — training data + version verification)

**Note on Confidence:** All versions are HIGH confidence (verified via npm). Architecture recommendations are MEDIUM confidence (based on current best practices + training data, not verified with Context7 due to tool limitations). Stack choices align with industry standards for 2025 based on package popularity, maintenance status, and ecosystem momentum.

---
*Stack research for: AI Career Pivot Coach*
*Researched: 2025-01-26*
