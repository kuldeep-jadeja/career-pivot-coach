/**
 * Pivot Plan Queries
 * 
 * Purpose: Type-safe database operations for pivot plans
 * Handles creation, retrieval, and unlocking of career pivot plans
 */

import { createClient, createServerSupabaseClient } from '../supabase';
import type { PivotPlan, PivotPlanInsert, PivotPlanUpdate } from '../types';

/**
 * Create a new pivot plan
 * Called after generating 3 career paths
 */
export async function createPivotPlan(
  data: PivotPlanInsert,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data: plan, error } = await supabase
    .from('pivot_plans')
    // @ts-ignore - Supabase type inference issue
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to create pivot plan:', error);
    throw error;
  }

  return plan as PivotPlan;
}

/**
 * Get pivot plan by ID
 * RLS ensures users can only access their own plans
 */
export async function getPivotPlanById(
  id: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('pivot_plans')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('[DB] Failed to get pivot plan:', error);
    return null;
  }

  return data as PivotPlan;
}

/**
 * Get pivot plan by assessment ID
 * Most common lookup pattern
 */
export async function getPivotPlanByAssessmentId(
  assessmentId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('pivot_plans')
    .select()
    .eq('assessment_id', assessmentId)
    .single();

  if (error) {
    console.error('[DB] Failed to get pivot plan by assessment:', error);
    return null;
  }

  return data as PivotPlan;
}

/**
 * Get all pivot plans for a user
 * Ordered by creation date (newest first)
 */
export async function getUserPivotPlans(
  userId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('pivot_plans')
    .select('*, assessments(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] Failed to get user pivot plans:', error);
    return [];
  }

  return data;
}

/**
 * Unlock pivot plan after payment
 * Called from webhook handler
 */
export async function unlockPivotPlan(
  assessmentId: string,
  userId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('pivot_plans')
    // @ts-ignore - Supabase type inference issue
    .update({
      status: 'unlocked',
      unlocked_at: new Date().toISOString(),
    })
    .eq('assessment_id', assessmentId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to unlock pivot plan:', error);
    throw error;
  }

  return data as PivotPlan;
}

/**
 * Update pivot plan status
 * Used for generation flow (preview → generating → unlocked/failed)
 */
export async function updatePivotPlanStatus(
  id: string,
  status: PivotPlan['status'],
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('pivot_plans')
    // @ts-ignore - Supabase type inference issue
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to update pivot plan status:', error);
    throw error;
  }

  return data as PivotPlan;
}

/**
 * Update pivot plan paths
 * Used to regenerate or modify career paths
 */
export async function updatePivotPlanPaths(
  id: string,
  data: Pick<PivotPlanUpdate, 'paths'>,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data: updated, error } = await supabase
    .from('pivot_plans')
    // @ts-ignore - Supabase type inference issue
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to update pivot plan paths:', error);
    throw error;
  }

  return updated as PivotPlan;
}

/**
 * Check if pivot plan is unlocked
 * Quick check for paywall logic
 */
export async function isPivotPlanUnlocked(
  assessmentId: string,
  useServerClient = false
): Promise<boolean> {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('pivot_plans')
    .select('status')
    .eq('assessment_id', assessmentId)
    .single();

  if (error || !data) {
    return false;
  }

  return (data as PivotPlan).status === 'unlocked';
}

/**
 * Delete pivot plan
 * Cascade deletes handled by database
 */
export async function deletePivotPlan(
  id: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { error } = await supabase
    .from('pivot_plans')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[DB] Failed to delete pivot plan:', error);
    throw error;
  }

  return true;
}
