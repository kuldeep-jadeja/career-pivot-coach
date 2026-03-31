/**
 * Row Level Security (RLS) Policies
 * 
 * Purpose: Enforce data access control at the database level
 * Users can only access their own data, O*NET data is public read-only
 * 
 * SETUP INSTRUCTIONS:
 * 1. Run schema.sql or 001_initial_schema.sql first
 * 2. Go to Supabase SQL Editor
 * 3. Copy and paste this entire file
 * 4. Run the SQL commands
 * 5. Verify policies in Table Editor > [table] > Policies tab
 * 
 * TESTING RLS:
 * Use Supabase SQL Editor with different user contexts:
 * - SELECT * FROM assessments WHERE user_id = auth.uid(); -- Should work
 * - SELECT * FROM assessments WHERE user_id != auth.uid(); -- Should return empty
 */

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deeper_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pivot_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_occupations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onet_work_activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (after signup)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- ASSESSMENTS POLICIES
-- =====================================================

-- Users can view their own assessments OR anonymous assessments
CREATE POLICY "Users can view own assessments" ON public.assessments
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL -- Anonymous assessments
  );

-- Anyone can insert assessments (authenticated or anonymous)
CREATE POLICY "Anyone can insert assessments" ON public.assessments
  FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR -- Authenticated user
    (user_id IS NULL) -- Anonymous user
  );

-- Users can update only their own assessments
CREATE POLICY "Users can update own assessments" ON public.assessments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own assessments
CREATE POLICY "Users can delete own assessments" ON public.assessments
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- DEEPER ASSESSMENTS POLICIES
-- =====================================================

-- Users can only view their own deeper assessments
CREATE POLICY "Users can view own deeper assessments" ON public.deeper_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own deeper assessments
CREATE POLICY "Users can insert own deeper assessments" ON public.deeper_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own deeper assessments
CREATE POLICY "Users can update own deeper assessments" ON public.deeper_assessments
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own deeper assessments
CREATE POLICY "Users can delete own deeper assessments" ON public.deeper_assessments
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- PIVOT PLANS POLICIES
-- =====================================================

-- Users can view their own pivot plans
CREATE POLICY "Users can view own pivot plans" ON public.pivot_plans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service/users can insert pivot plans (via server actions)
CREATE POLICY "Users can insert pivot plans" ON public.pivot_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service can update pivot plans (e.g., unlock after payment)
CREATE POLICY "Users can update pivot plans" ON public.pivot_plans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own pivot plans
CREATE POLICY "Users can delete own pivot plans" ON public.pivot_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- PAYMENTS POLICIES
-- =====================================================

-- Users can view their own payment records
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert payments (via webhook)
-- Note: This will be handled by service role key in webhook handler
-- Users cannot directly insert payment records

-- Only service role can update payment status
-- Users can view but not modify payment records

-- =====================================================
-- O*NET TABLES POLICIES (Public Read-Only)
-- =====================================================

-- Anyone can read occupations (needed for assessment UI)
CREATE POLICY "Anyone can read occupations" ON public.onet_occupations
  FOR SELECT
  USING (true);

-- Anyone can read tasks
CREATE POLICY "Anyone can read tasks" ON public.onet_tasks
  FOR SELECT
  USING (true);

-- Anyone can read skills
CREATE POLICY "Anyone can read skills" ON public.onet_skills
  FOR SELECT
  USING (true);

-- Anyone can read work activities
CREATE POLICY "Anyone can read work activities" ON public.onet_work_activities
  FOR SELECT
  USING (true);

-- Only service role can insert/update/delete O*NET data
-- (populated by data pipeline in Plan 03)

-- =====================================================
-- TESTING QUERIES
-- =====================================================

-- Test as authenticated user:
-- SELECT * FROM profiles WHERE id = auth.uid(); -- Should return your profile
-- SELECT * FROM profiles WHERE id != auth.uid(); -- Should return empty

-- Test anonymous assessment:
-- INSERT INTO assessments (job_title, anonymous_id) VALUES ('Software Engineer', 'session-123');
-- SELECT * FROM assessments WHERE anonymous_id = 'session-123'; -- Should work

-- Test O*NET read access:
-- SELECT * FROM onet_occupations LIMIT 10; -- Should work for anyone

-- =====================================================
-- NOTES
-- =====================================================

/**
 * SECURITY CONSIDERATIONS:
 * 
 * 1. Anonymous Assessments: We allow anonymous_id-based assessments for 
 *    the free viral hook. Session IDs should be validated in application code.
 * 
 * 2. Payment Inserts: Only webhook handler (using service role key) should
 *    create payment records. This prevents users from faking payment status.
 * 
 * 3. Encrypted Fields: salary_requirements_encrypted and location_encrypted
 *    are encrypted at the application level before storage. RLS prevents
 *    cross-user access, encryption prevents database admin access.
 * 
 * 4. Service Role Usage: Use SUPABASE_SERVICE_ROLE_KEY sparingly and only
 *    in server-side code (never expose to client). Used for:
 *    - Payment webhook handler
 *    - O*NET data pipeline
 *    - Admin operations
 */
