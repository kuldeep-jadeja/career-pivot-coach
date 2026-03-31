# Career Pivot Coach

AI displacement risk assessment and personalized 90-day career pivot plans at an impulse-buy price point ($19 one-time).

## Tech Stack

- **Frontend:** Next.js 16+ (App Router), React 19+, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Server Actions
- **Database:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe (one-time payments)
- **LLM:** Google Gemini (primary) + Groq (fallback)
- **Email:** Resend
- **Deployment:** Vercel (free tier)

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-pivot-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local and fill in your values
   # You'll need:
   # - Supabase credentials (create free project at https://supabase.com)
   # - Stripe API keys (create account at https://stripe.com)
   # - Gemini API key (get from https://makersuite.google.com/app/apikey)
   # - Groq API key (get from https://console.groq.com/keys)
   # - Resend API key (get from https://resend.com/api-keys)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to http://localhost:3000
   - The app should be running!

## Available Scripts

- `npm run dev` - Start development server (with Turbopack)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests (Vitest)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
career-pivot-coach/
├── app/                        # Next.js App Router
│   ├── (marketing)/           # Landing page route group
│   ├── (assessment)/          # Assessment flow route group
│   ├── api/                   # API routes
│   ├── _components/           # UI components (shadcn/ui)
│   └── _actions/              # Server actions
├── lib/                       # Shared utilities
│   ├── scoring/               # Risk scoring engine
│   ├── db/                    # Database clients (Supabase)
│   ├── llm/                   # LLM integration (Gemini, Groq)
│   └── utils/                 # Utilities (validation, etc.)
├── public/                    # Static assets
│   └── data/                  # O*NET processed data (JSON)
├── data-processing/           # Data processing scripts
│   └── scripts/               # O*NET CSV to JSON converters
└── .planning/                 # Project planning docs (GSD workflow)
```

## Deployment to Vercel

### First-time Deployment

1. **Install Vercel CLI** (optional - you can also use the dashboard)
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   # Using CLI
   vercel --prod
   
   # Or connect your GitHub repo at https://vercel.com/new
   ```

3. **Set environment variables in Vercel Dashboard**
   - Go to your project settings
   - Add all variables from `.env.example`
   - **IMPORTANT:** Update `NEXT_PUBLIC_APP_URL` to your Vercel domain

4. **Configure webhooks** (after first deployment)
   - Stripe webhook: Point to `https://your-domain.vercel.app/api/webhooks/stripe`

### Continuous Deployment

Once connected to GitHub, Vercel automatically deploys:
- **Production:** Pushes to `main` branch
- **Preview:** Pull requests and other branches

## Health Check

After deployment, verify the app is running:
```bash
curl https://your-domain.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-03-31T10:00:00.000Z",
  "service": "career-pivot-coach"
}
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Contributing

This is a solo project built with Claude AI assistance using the GSD (Get Shit Done) workflow.

## License

Proprietary - All rights reserved
