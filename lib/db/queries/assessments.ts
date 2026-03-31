/**
 * Assessment Queries
 * 
 * Purpose: Type-safe database operations for assessments
 * Uses Supabase client with RLS policies
 */

import { createClient, createServerSupabaseClient } from '../supabase';
import type { Assessment, AssessmentInsert, AssessmentUpdate } from '../types';

/**
 * Create a new assessment
 * Works for both authenticated and anonymous users
 */
export async function createAssessment(
  data: AssessmentInsert,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data: assessment, error } = await supabase
    .from('assessments')
    // @ts-ignore - Supabase type inference issue with Database generic
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to create assessment:', error);
    throw error;
  }

  return assessment as Assessment;
}

/**
 * Get assessment by ID
 * RLS ensures users can only access their own assessments
 */
export async function getAssessmentById(
  id: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('assessments')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('[DB] Failed to get assessment:', error);
    return null;
  }

  return data as Assessment;
}

/**
 * Get all assessments for a user
 * Ordered by creation date (newest first)
 */
export async function getUserAssessments(
  userId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('assessments')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] Failed to get user assessments:', error);
    return [];
  }

  return data as Assessment[];
}

/**
 * Get assessment by anonymous ID
 * For anonymous users who haven't signed up yet
 */
export async function getAssessmentByAnonymousId(
  anonymousId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('assessments')
    .select()
    .eq('anonymous_id', anonymousId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('[DB] Failed to get anonymous assessment:', error);
    return null;
  }

  return data as Assessment;
}

/**
 * Update assessment with risk score and breakdown
 * Called after scoring engine calculates risk
 */
export async function updateAssessmentScore(
  id: string,
  data: Pick<AssessmentUpdate, 'risk_score' | 'layer_breakdown' | 'confidence'>,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data: updated, error } = await supabase
    .from('assessments')
    // @ts-ignore - Supabase type inference issue with Database generic
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to update assessment score:', error);
    throw error;
  }

  return updated as Assessment;
}

/**
 * Link anonymous assessment to user after signup
 * Called when anonymous user creates account
 */
export async function linkAssessmentToUser(
  anonymousId: string,
  userId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('assessments')
    // @ts-ignore - Supabase type inference issue
    .update({ user_id: userId })
    .eq('anonymous_id', anonymousId)
    .is('user_id', null) // Only link if not already linked
    .select();

  if (error) {
    console.error('[DB] Failed to link assessment to user:', error);
    throw error;
  }

  return data as Assessment[];
}

/**
 * Delete assessment
 * Users can delete their own assessments
 */
export async function deleteAssessment(
  id: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { error } = await supabase
    .from('assessments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[DB] Failed to delete assessment:', error);
    throw error;
  }

  return true;
}

/**
 * Get assessment with related pivot plan
 * Useful for dashboard display
 */
export async function getAssessmentWithPivotPlan(
  assessmentId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select('*, pivot_plans(*)')
    .eq('id', assessmentId)
    .single();

  if (assessmentError) {
    console.error('[DB] Failed to get assessment with pivot plan:', assessmentError);
    return null;
  }

  return assessment;
}
