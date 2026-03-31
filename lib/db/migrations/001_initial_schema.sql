/**
 * Migration 001: Initial Schema
 * 
 * Creates all database tables for the Unautomatable AI Career Pivot Coach
 * Run this via Supabase SQL Editor or CLI
 */

-- =====================================================
-- USER PROFILES (extends Supabase Auth)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ASSESSMENTS (Free Risk Assessments)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anonymous_id TEXT,
  job_title TEXT NOT NULL,
  occupation_code TEXT,
  industry TEXT,
  years_experience INTEGER,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  layer_breakdown JSONB,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DEEPER ASSESSMENTS (Detailed User Data)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.deeper_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skills JSONB,
  salary_requirements_encrypted TEXT,
  location_encrypted TEXT,
  time_availability INTEGER,
  industry_preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PIVOT PLANS (Generated Career Paths)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.pivot_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  paths JSONB NOT NULL,
  status TEXT DEFAULT 'preview' CHECK (status IN ('preview', 'unlocked', 'generating', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unlocked_at TIMESTAMPTZ
);

-- =====================================================
-- PAYMENTS (Stripe Integration)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  stripe_payment_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- =====================================================
-- O*NET REFERENCE TABLES (Read-only data)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.onet_occupations (
  soc_code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  alternate_titles JSONB,
  last_modified DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.onet_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soc_code TEXT REFERENCES public.onet_occupations(soc_code) ON DELETE CASCADE,
  task_id TEXT,
  description TEXT NOT NULL,
  importance DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.onet_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soc_code TEXT REFERENCES public.onet_occupations(soc_code) ON DELETE CASCADE,
  skill_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  level DECIMAL(5,2),
  importance DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.onet_work_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soc_code TEXT REFERENCES public.onet_occupations(soc_code) ON DELETE CASCADE,
  activity_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  importance DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_anonymous_id ON public.assessments(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON public.assessments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_deeper_assessments_assessment_id ON public.deeper_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_deeper_assessments_user_id ON public.deeper_assessments(user_id);

CREATE INDEX IF NOT EXISTS idx_pivot_plans_assessment_id ON public.pivot_plans(assessment_id);
CREATE INDEX IF NOT EXISTS idx_pivot_plans_user_id ON public.pivot_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_pivot_plans_status ON public.pivot_plans(status);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_id ON public.payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

CREATE INDEX IF NOT EXISTS idx_onet_tasks_soc_code ON public.onet_tasks(soc_code);
CREATE INDEX IF NOT EXISTS idx_onet_skills_soc_code ON public.onet_skills(soc_code);
CREATE INDEX IF NOT EXISTS idx_onet_work_activities_soc_code ON public.onet_work_activities(soc_code);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
