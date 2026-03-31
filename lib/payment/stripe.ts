/**
 * Stripe Payment Client
 * 
 * Purpose: Handle Stripe payments for unlocking career pivot plans
 * One-time payment: $19 (1900 cents)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create Stripe account at https://stripe.com
 * 2. Enable Test Mode (toggle in dashboard)
 * 3. Get test API keys from Developers > API Keys
 * 4. Add to .env.local:
 *    STRIPE_SECRET_KEY=sk_test_xxxxx
 *    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
 * 5. For webhooks: STRIPE_WEBHOOK_SECRET=whsec_xxxxx (from Developers > Webhooks)
 * 
 * WEBHOOK SETUP:
 * - Development: Use Stripe CLI (`stripe listen --forward-to localhost:3000/api/payment/webhook`)
 * - Production: Add webhook endpoint in Stripe dashboard
 * - Events to listen for: checkout.session.completed, payment_intent.succeeded
 */

import Stripe from 'stripe';

// Initialize Stripe with the latest API version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  appInfo: {
    name: 'Unautomatable Career Pivot Coach',
    version: '1.0.0',
  },
});

/**
 * Price configuration
 */
export const PRICING = {
  PIVOT_PLAN_UNLOCK: {
    amount: 1900, // $19.00 in cents
    currency: 'usd',
    name: 'Career Pivot Plans (3 paths)',
    description: 'Unlock all 3 personalized career pivot plans with 90-day roadmaps',
  },
} as const;

/**
 * Create a Stripe Checkout session for pivot plan payment
 * 
 * @param userId - Authenticated user ID
 * @param assessmentId - Assessment ID to link payment to
 * @param userEmail - User email for receipt
 * @returns Stripe Checkout session
 */
export async function createCheckoutSession({
  userId,
  assessmentId,
  userEmail,
  priceInCents = PRICING.PIVOT_PLAN_UNLOCK.amount,
}: {
  userId: string;
  assessmentId: string;
  userEmail: string;
  priceInCents?: number;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // One-time payment
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: PRICING.PIVOT_PLAN_UNLOCK.currency,
            product_data: {
              name: PRICING.PIVOT_PLAN_UNLOCK.name,
              description: PRICING.PIVOT_PLAN_UNLOCK.description,
              images: [
                `${process.env.NEXT_PUBLIC_APP_URL}/images/pivot-plans-og.png`,
              ],
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pivot-plans?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pivot-plans?canceled=true`,
      metadata: {
        userId,
        assessmentId,
        productType: 'pivot_plan_unlock',
      },
      // Automatically expire after 24 hours
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    });

    console.log('[Stripe] Checkout session created:', session.id);
    return session;
  } catch (error) {
    console.error('[Stripe] Failed to create checkout session:', error);
    throw error;
  }
}

/**
 * Retrieve a checkout session by ID
 * Used to verify payment after redirect
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('[Stripe] Failed to retrieve checkout session:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 * CRITICAL: Always verify webhook signatures to prevent fraud
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  webhookSecret: string
): Stripe.Event {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
    return event;
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
}

/**
 * Handle successful checkout session
 * Called from webhook handler after payment confirmed
 */
export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<{
  userId: string;
  assessmentId: string;
  paymentId: string;
  amount: number;
}> {
  const { metadata } = session;

  if (!metadata?.userId || !metadata?.assessmentId) {
    throw new Error('Missing required metadata in checkout session');
  }

  return {
    userId: metadata.userId,
    assessmentId: metadata.assessmentId,
    paymentId: session.payment_intent as string,
    amount: session.amount_total || 0,
  };
}

/**
 * Create a refund for a payment
 * Admin function - use sparingly
 */
export async function createRefund(
  paymentIntentId: string,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason,
    });

    console.log('[Stripe] Refund created:', refund.id);
    return refund;
  } catch (error) {
    console.error('[Stripe] Failed to create refund:', error);
    throw error;
  }
}

/**
 * Test Stripe connection
 * Use this to verify API keys are correct
 */
export async function testStripeConnection() {
  try {
    // Attempt to list products (limit 1) to verify API key
    await stripe.products.list({ limit: 1 });
    console.log('[Stripe] Connection successful ✓');
    return true;
  } catch (error) {
    console.error('[Stripe] Connection failed:', error);
    return false;
  }
}

/**
 * Stripe webhook event types we handle
 */
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
  CHARGE_REFUNDED: 'charge.refunded',
} as const;

/**
 * Type helpers
 */
export type CheckoutSession = Stripe.Checkout.Session;
export type PaymentIntent = Stripe.PaymentIntent;
export type WebhookEvent = Stripe.Event;
