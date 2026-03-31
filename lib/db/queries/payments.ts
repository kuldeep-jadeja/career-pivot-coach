/**
 * Payment Queries
 * 
 * Purpose: Type-safe database operations for payments
 * Handles payment creation, retrieval, and status updates
 */

import { createClient, createServerSupabaseClient, createAdminClient } from '../supabase';
import type { Payment, PaymentInsert, PaymentUpdate } from '../types';

/**
 * Create a new payment record
 * Usually called from webhook handler after Stripe payment
 * Requires admin client to bypass RLS
 */
export async function createPayment(data: PaymentInsert) {
  const supabase = createAdminClient();

  const { data: payment, error } = await supabase
    .from('payments')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to create payment:', error);
    throw error;
  }

  return payment as Payment;
}

/**
 * Get payment by ID
 * RLS ensures users can only access their own payments
 */
export async function getPaymentById(
  id: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('payments')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('[DB] Failed to get payment:', error);
    return null;
  }

  return data as Payment;
}

/**
 * Get payment by Stripe payment ID
 * Used for idempotency checks in webhook
 */
export async function getPaymentByStripeId(stripePaymentId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('payments')
    .select()
    .eq('stripe_payment_id', stripePaymentId)
    .single();

  if (error) {
    // Not found is expected for new payments
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('[DB] Failed to get payment by Stripe ID:', error);
    return null;
  }

  return data as Payment;
}

/**
 * Get all payments for a user
 * Ordered by creation date (newest first)
 */
export async function getUserPayments(
  userId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('*, assessments(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB] Failed to get user payments:', error);
    return [];
  }

  return data;
}

/**
 * Get payment for specific assessment
 * Check if user has paid for this assessment
 */
export async function getPaymentByAssessmentId(
  assessmentId: string,
  useServerClient = false
) {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('payments')
    .select()
    .eq('assessment_id', assessmentId)
    .eq('status', 'completed')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // No payment found
    }
    console.error('[DB] Failed to get payment by assessment:', error);
    return null;
  }

  return data as Payment;
}

/**
 * Update payment status
 * Usually called from webhook handler
 */
export async function updatePaymentStatus(
  id: string,
  status: Payment['status'],
  completedAt?: string
) {
  const supabase = createAdminClient();

  const updateData: PaymentUpdate = { status };
  if (completedAt) {
    updateData.completed_at = completedAt;
  }

  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[DB] Failed to update payment status:', error);
    throw error;
  }

  return data as Payment;
}

/**
 * Check if user has paid for assessment
 * Quick boolean check for paywall logic
 */
export async function hasUserPaidForAssessment(
  assessmentId: string,
  userId: string,
  useServerClient = false
): Promise<boolean> {
  const supabase = useServerClient 
    ? await createServerSupabaseClient() 
    : createClient();

  const { data, error } = await supabase
    .from('payments')
    .select('status')
    .eq('assessment_id', assessmentId)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .single();

  if (error || !data) {
    return false;
  }

  return true;
}

/**
 * Get total revenue (admin only)
 * Use for dashboard metrics
 */
export async function getTotalRevenue() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'completed');

  if (error) {
    console.error('[DB] Failed to get total revenue:', error);
    return 0;
  }

  const total = data.reduce((sum, payment) => sum + payment.amount, 0);
  return total;
}

/**
 * Get payment count by status (admin only)
 * Use for dashboard metrics
 */
export async function getPaymentCountByStatus() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('payments')
    .select('status');

  if (error) {
    console.error('[DB] Failed to get payment counts:', error);
    return {
      pending: 0,
      completed: 0,
      failed: 0,
      refunded: 0,
    };
  }

  const counts = data.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    pending: counts.pending || 0,
    completed: counts.completed || 0,
    failed: counts.failed || 0,
    refunded: counts.refunded || 0,
  };
}
