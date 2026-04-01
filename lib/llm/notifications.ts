/**
 * LLM Request Notifications
 * 
 * Purpose: Email notifications for queued and completed LLM requests
 */

import { sendEmail } from '@/lib/email/resend';
import { getQueuedRequest } from './queue';

/**
 * Notify user that their LLM request has been queued
 */
export async function notifyUserOfQueuedRequest(
  queueId: string,
  userEmail: string
): Promise<void> {
  const request = getQueuedRequest(queueId);
  if (!request) return;
  
  await sendEmail({
    to: userEmail,
    subject: 'Your career pivot plan is being prepared',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>We're working on your personalized plan</h1>
        <p>Our AI systems are currently experiencing high demand. Your career pivot plan is in our queue and will be ready within the next hour.</p>
        <p>We'll send you another email as soon as your personalized plan is available.</p>
        <p>Thank you for your patience!</p>
        <p>— The Unautomatable Team</p>
      </div>
    `,
  });
}

/**
 * Notify user that their queued plan is ready
 */
export async function notifyUserPlanReady(
  userEmail: string,
  dashboardUrl: string
): Promise<void> {
  await sendEmail({
    to: userEmail,
    subject: '🎉 Your career pivot plan is ready!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Your personalized career pivot plan is ready!</h1>
        <p>Great news! We've finished generating your 3 personalized career pivot paths.</p>
        <p>
          <a href="${dashboardUrl}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Plans
          </a>
        </p>
        <p>Thank you for using Unautomatable!</p>
        <p>— The Unautomatable Team</p>
      </div>
    `,
  });
}
