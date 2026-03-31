/**
 * Migration 002: Row Level Security Policies
 * 
 * Implements security policies for all tables
 * Run after 001_initial_schema.sql
 */

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deeper_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pivot_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_occupations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_work_activities ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Assessments policies
CREATE POLICY "Users can view own assessments" ON public.assessments
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert assessments" ON public.assessments
  FOR INSERT WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can update own assessments" ON public.assessments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments" ON public.assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Deeper assessments policies
CREATE POLICY "Users can view own deeper assessments" ON public.deeper_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deeper assessments" ON public.deeper_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deeper assessments" ON public.deeper_assessments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deeper assessments" ON public.deeper_assessments
  FOR DELETE USING (auth.uid() = user_id);

-- Pivot plans policies
CREATE POLICY "Users can view own pivot plans" ON public.pivot_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert pivot plans" ON public.pivot_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update pivot plans" ON public.pivot_plans
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pivot plans" ON public.pivot_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

-- O*NET tables policies (public read-only)
CREATE POLICY "Anyone can read occupations" ON public.onet_occupations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read tasks" ON public.onet_tasks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read skills" ON public.onet_skills
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read work activities" ON public.onet_work_activities
  FOR SELECT USING (true);
