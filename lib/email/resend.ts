/**
 * Resend Email Client
 * 
 * Purpose: Transactional email service using Resend
 * Free tier: 100 emails/day, 3,000 emails/month
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create account at https://resend.com
 * 2. Verify your domain (or use onboarding@resend.dev for testing)
 * 3. Generate API key in dashboard
 * 4. Add to .env.local: RESEND_API_KEY=re_xxxxx
 * 5. Test by calling sendWelcomeEmail with your email
 * 
 * PRODUCTION SETUP:
 * - Verify your domain in Resend dashboard
 * - Update FROM_EMAIL to your verified domain
 * - Configure SPF, DKIM, DMARC records
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Unautomatable <onboarding@resend.dev>';
const REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO_EMAIL || 'support@unautomatable.com';

/**
 * Generic email sender
 * 
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param html - HTML email body
 * @returns Resend response data
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo = REPLY_TO_EMAIL,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error('[Resend] Email send failed:', error);
      throw new Error(`Email send failed: ${error.message}`);
    }

    console.log('[Resend] Email sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('[Resend] Unexpected error:', error);
    throw error;
  }
}

/**
 * Send welcome email after signup
 */
export async function sendWelcomeEmail(to: string, displayName?: string) {
  const name = displayName || 'there';
  
  return sendEmail({
    to,
    subject: 'Welcome to Unautomatable',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to Unautomatable, ${name}!</h1>
        <p>Thanks for joining us. We're here to help you navigate AI displacement risk and build a resilient career.</p>
        <p>Here's what you can do now:</p>
        <ul>
          <li><strong>Complete your free risk assessment</strong> - Get your AI displacement score in minutes</li>
          <li><strong>Unlock your personalized pivot plan</strong> - See 3 tailored career paths for just $19</li>
          <li><strong>Track your progress</strong> - Use your dashboard to monitor your career transformation</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/assessment" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Start Your Assessment
          </a>
        </p>
        <p>Questions? Just reply to this email.</p>
        <p>— The Unautomatable Team</p>
      </div>
    `,
  });
}

/**
 * Send email when pivot plan is unlocked
 */
export async function sendPivotPlanUnlockedEmail(
  to: string,
  displayName?: string,
  assessmentId?: string
) {
  const name = displayName || 'there';
  
  return sendEmail({
    to,
    subject: 'Your Career Pivot Plans Are Ready! 🎯',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Your Personalized Career Pivot Plans Are Ready!</h1>
        <p>Hi ${name},</p>
        <p>Great news! Your payment is confirmed and all 3 personalized career pivot plans are now unlocked.</p>
        <p>Here's what you'll find in your plans:</p>
        <ul>
          <li><strong>3 Tailored Career Paths</strong> - Adjacent moves, upskilling, and full pivots</li>
          <li><strong>Detailed Skill Gap Analysis</strong> - Exactly what to learn and where</li>
          <li><strong>90-Day Action Timeline</strong> - Week-by-week roadmap customized to your availability</li>
          <li><strong>Resource Recommendations</strong> - Curated courses, certifications, and learning paths</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/pivot-plans${assessmentId ? `?id=${assessmentId}` : ''}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Pivot Plans
          </a>
        </p>
        <p>Ready to make your move? Start with the plan that resonates most and take the first action this week.</p>
        <p>— The Unautomatable Team</p>
      </div>
    `,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, resetLink: string) {
  return sendEmail({
    to,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Reset Your Password</h1>
        <p>We received a request to reset your password for Unautomatable.</p>
        <p>Click the button below to create a new password:</p>
        <p>
          <a href="${resetLink}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>— The Unautomatable Team</p>
      </div>
    `,
  });
}

/**
 * Send assessment completion reminder
 * (for users who started but didn't finish)
 */
export async function sendAssessmentReminderEmail(to: string, displayName?: string) {
  const name = displayName || 'there';
  
  return sendEmail({
    to,
    subject: 'Complete Your AI Risk Assessment',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Your Assessment is Waiting</h1>
        <p>Hi ${name},</p>
        <p>We noticed you started your AI displacement risk assessment but didn't finish.</p>
        <p>It only takes 5 minutes to complete and you'll get:</p>
        <ul>
          <li>Your personalized AI risk score</li>
          <li>4-layer risk breakdown</li>
          <li>Preview of your career pivot options</li>
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/assessment" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Complete Your Assessment
          </a>
        </p>
        <p>The sooner you know your risk, the sooner you can take action.</p>
        <p>— The Unautomatable Team</p>
      </div>
    `,
  });
}

/**
 * Test email sender
 * Use this to verify Resend setup
 */
export async function sendTestEmail(to: string) {
  return sendEmail({
    to,
    subject: 'Resend Test Email',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Resend Setup Successful! ✅</h1>
        <p>If you're reading this, your Resend integration is working correctly.</p>
        <p>You can now send transactional emails from your application.</p>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px;">
          From: ${FROM_EMAIL}<br>
          Reply To: ${REPLY_TO_EMAIL}
        </p>
      </div>
    `,
  });
}
