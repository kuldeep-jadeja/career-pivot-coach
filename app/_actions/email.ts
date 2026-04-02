'use server';

import { z } from 'zod';

import { AssessmentResultsEmail } from '@/app/_components/emails/AssessmentResults';
import { getRiskLevel } from '@/lib/email/assessment-results';
import { resend } from '@/lib/email/resend';

const emailSchema = z.object({
  to: z.string().trim().email('Invalid email address'),
  jobTitle: z.string().min(1),
  riskScore: z.number().min(0).max(100),
  assessmentId: z.string().min(1),
});

export async function sendAssessmentResults(input: z.infer<typeof emailSchema>) {
  try {
    const validated = emailSchema.parse(input);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://unautomatable.ai';
    const resultsUrl = `${baseUrl}/results?id=${encodeURIComponent(validated.assessmentId)}`;
    const riskLevel = getRiskLevel(validated.riskScore);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Unautomatable <onboarding@resend.dev>',
      to: validated.to,
      replyTo: process.env.RESEND_REPLY_TO_EMAIL || 'support@unautomatable.com',
      subject: `Your ${validated.riskScore}% AI Risk Score - ${validated.jobTitle}`,
      react: AssessmentResultsEmail({
        jobTitle: validated.jobTitle,
        riskScore: validated.riskScore,
        resultsUrl,
        riskLevel,
      }),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false as const, error: 'Failed to send email' };
    }

    return { success: true as const, messageId: data?.id };
  } catch (error) {
    console.error('Email send error:', error);

    if (error instanceof z.ZodError) {
      return { success: false as const, error: error.issues[0]?.message ?? 'Invalid input' };
    }

    return { success: false as const, error: 'Failed to send email' };
  }
}

