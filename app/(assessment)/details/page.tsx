'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ExperienceInput } from '@/app/_components/assessment/ExperienceInput';
import { IndustrySelect } from '@/app/_components/assessment/IndustrySelect';
import { ProgressTracker } from '@/app/_components/assessment/ProgressTracker';
import { calculateAndSaveAssessment } from '@/app/_actions/assessment';
import { Button } from '@/app/_components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { useAssessmentFlow } from '@/lib/hooks/useAssessmentFlow';

export default function DetailsPage() {
  const router = useRouter();
  const { assessment, setField, isHydrated, goToStep } = useAssessmentFlow();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSubmit = async () => {
    if (!assessment.jobTitle?.code) {
      goToStep(1);
      router.push('/start');
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateAndSaveAssessment({
        jobTitle: assessment.jobTitle,
        industry: assessment.industry || 'other',
        yearsExperience: assessment.yearsExperience ?? 0,
      });

      if (result.success) {
        goToStep(3);

        if (typeof window !== 'undefined') {
          sessionStorage.setItem(`assessment-result:${result.assessmentId}`, JSON.stringify(result));
        }

        router.push(`/results?id=${result.assessmentId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to calculate risk score. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  if (!isHydrated) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <ProgressTracker currentStep={2} totalSteps={3} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Tell us a bit more</CardTitle>
          <CardDescription>
            This helps us provide a more accurate risk assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <IndustrySelect
              value={assessment.industry || null}
              onChange={(value) => setField('industry', value)}
            />

            <ExperienceInput
              value={assessment.yearsExperience ?? 0}
              onChange={(value) => setField('yearsExperience', value)}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => {
                goToStep(1);
                router.push('/start');
              }}
              className="min-h-[44px]"
            >
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={isCalculating} className="min-h-[44px] px-8">
              {isCalculating ? 'Calculating...' : 'See My Results'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
