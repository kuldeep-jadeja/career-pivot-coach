"use client";

import { useRouter } from "next/navigation";

import { JobTitleCombobox } from "@/app/_components/assessment/JobTitleCombobox";
import { ProgressTracker } from "@/app/_components/assessment/ProgressTracker";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { useAssessmentFlow } from "@/lib/hooks/useAssessmentFlow";

export default function StartPage() {
  const router = useRouter();
  const { assessment, setField, isHydrated, goToStep } = useAssessmentFlow();

  const handleNext = () => {
    if (assessment.jobTitle?.code) {
      goToStep(2);
      router.push("/details");
    }
  };

  if (!isHydrated) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <ProgressTracker currentStep={1} totalSteps={3} />

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">What&apos;s your current job title?</CardTitle>
          <CardDescription>
            Search for your role to begin your AI displacement risk assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <JobTitleCombobox
            value={
              assessment.jobTitle
                ? {
                    socCode: assessment.jobTitle.code,
                    title: assessment.jobTitle.title,
                    description: "",
                    confidence: 1,
                  }
                : null
            }
            onChange={(match) =>
              setField(
                "jobTitle",
                match ? { code: match.socCode, title: match.title } : null
              )
            }
          />

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleNext}
              disabled={!assessment.jobTitle?.code}
              className="min-h-[44px] px-8"
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
