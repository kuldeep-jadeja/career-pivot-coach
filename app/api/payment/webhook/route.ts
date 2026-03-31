/**
 * Stripe Webhook Handler
 * 
 * Purpose: Process Stripe webhook events for payment confirmations
 * This is the source of truth for payment status (not browser redirects)
 * 
 * CRITICAL SECURITY:
 * - ALWAYS verify webhook signature before processing
 * - Use raw body (not parsed JSON) for signature verification
 * - Never trust client-side payment confirmations
 * 
 * SETUP:
 * 1. Development: Use Stripe CLI
 *    stripe login
 *    stripe listen --forward-to localhost:3000/api/payment/webhook
 *    Copy webhook signing secret to STRIPE_WEBHOOK_SECRET
 * 
 * 2. Production: Add webhook endpoint in Stripe dashboard
 *    URL: https://yourdomain.com/api/payment/webhook
 *    Events: checkout.session.completed, payment_intent.succeeded
 */

import { NextRequest, NextResponse } from 'next/server';
import { stripe, verifyWebhookSignature, handleCheckoutCompleted, WEBHOOK_EVENTS } from '@/lib/payment/stripe';
import { createAdminClient } from '@/lib/db/supabase';

/**
 * POST /api/payment/webhook
 * 
 * Receives Stripe webhook events
 */
export async function POST(req: NextRequest) {
  const body = await req.text(); // Get raw body for signature verification
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Webhook] Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature, webhookSecret);
    
    console.log('[Webhook] Received event:', event.type, event.id);

    // Handle different event types
    switch (event.type) {
      case WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
        const session = event.data.object;
        console.log('[Webhook] Checkout completed:', session.id);

        // Extract payment data
        const { userId, assessmentId, paymentId, amount } = await handleCheckoutCompleted(session);

        // Use admin client to bypass RLS (webhook is server-side)
        const supabase = createAdminClient();

        // 1. Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId,
            assessment_id: assessmentId,
            stripe_payment_id: paymentId,
            stripe_checkout_session_id: session.id,
            amount,
            currency: 'usd',
            status: 'completed',
            completed_at: new Date().toISOString(),
          });

        if (paymentError) {
          console.error('[Webhook] Failed to create payment record:', paymentError);
          throw paymentError;
        }

        // 2. Unlock pivot plan
        const { error: unlockError } = await supabase
          .from('pivot_plans')
          .update({
            status: 'unlocked',
            unlocked_at: new Date().toISOString(),
          })
          .eq('assessment_id', assessmentId)
          .eq('user_id', userId);

        if (unlockError) {
          console.error('[Webhook] Failed to unlock pivot plan:', unlockError);
          throw unlockError;
        }

        console.log('[Webhook] Payment processed successfully:', paymentId);
        
        // TODO (Phase 5): Send pivot plan unlocked email
        // await sendPivotPlanUnlockedEmail(userEmail, displayName, assessmentId);

        break;
      }

      case WEBHOOK_EVENTS.PAYMENT_SUCCEEDED: {
        const paymentIntent = event.data.object;
        console.log('[Webhook] Payment succeeded:', paymentIntent.id);
        // Additional handling if needed
        break;
      }

      case WEBHOOK_EVENTS.PAYMENT_FAILED: {
        const paymentIntent = event.data.object;
        console.error('[Webhook] Payment failed:', paymentIntent.id);
        
        // TODO: Update payment record status to 'failed'
        // TODO: Send payment failed email to user
        
        break;
      }

      case WEBHOOK_EVENTS.CHARGE_REFUNDED: {
        const charge = event.data.object;
        console.log('[Webhook] Charge refunded:', charge.id);
        
        // TODO: Update payment record status to 'refunded'
        // TODO: Potentially lock pivot plan again (business decision)
        
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    
    // Return 400 for signature verification failures
    // Stripe will retry on 500 errors
    if (error instanceof Error && error.message === 'Invalid webhook signature') {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Return 500 for other errors (Stripe will retry)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/payment/webhook
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'stripe-webhook',
    message: 'Webhook endpoint is active. POST to process webhook events.',
  });
}

/**
 * NOTES:
 * 
 * 1. Raw Body Requirement:
 *    Next.js automatically parses request bodies, but Stripe signature
 *    verification requires the raw body. We use req.text() to get it.
 * 
 * 2. Idempotency:
 *    Stripe may send the same webhook multiple times. Use stripe_payment_id
 *    as a unique constraint to prevent duplicate processing.
 * 
 * 3. Async Payment Flow:
 *    User may close browser before payment completes. Webhook is source of truth.
 *    - User clicks "Pay"
 *    - Redirects to Stripe Checkout
 *    - Completes payment
 *    - Stripe sends webhook (we unlock plan here)
 *    - Stripe redirects to success_url
 *    - We show success message (plan already unlocked)
 * 
 * 4. Testing:
 *    Use Stripe CLI for local testing:
 *    stripe trigger checkout.session.completed
 */
