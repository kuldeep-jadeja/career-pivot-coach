'use client';

import { useState } from 'react';
import { Check, Loader2, Mail } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';

import { sendAssessmentResults } from '@/app/_actions/email';
import { Button } from '@/app/_components/ui/button';
import { Input } from '@/app/_components/ui/input';
import { Label } from '@/app/_components/ui/label';

interface EmailCaptureProps {
  assessmentId: string;
  jobTitle: string;
  riskScore: number;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const emailSchema = z.email('Please enter a valid email address');

export function EmailCapture({ assessmentId, jobTitle, riskScore }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validatedEmail = emailSchema.safeParse(email.trim());
    if (!validatedEmail.success) {
      toast.error(validatedEmail.error.issues[0]?.message ?? 'Please enter a valid email');
      return;
    }

    setStatus('sending');

    const result = await sendAssessmentResults({
      to: validatedEmail.data,
      jobTitle,
      riskScore,
      assessmentId,
    });

    if (result.success) {
      setStatus('sent');
      toast.success('Results sent to your email!');
      return;
    }

    setStatus('error');
    toast.error(result.error || 'Failed to send email. Please try again.');
  };

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
        <Check className="h-5 w-5 text-green-600" />
        <span className="text-green-700 dark:text-green-300">Results sent to {email}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assessment-email" className="text-base">
          Get results in your inbox
        </Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="assessment-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-[44px] pl-10 text-base"
              disabled={status === 'sending'}
            />
          </div>
          <Button type="submit" disabled={status === 'sending'} className="min-h-[44px] px-6">
            {status === 'sending' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send'
            )}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          We&apos;ll send your risk score and a link to view your full results.
        </p>
      </div>
    </form>
  );
}

