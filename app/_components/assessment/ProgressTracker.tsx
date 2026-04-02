"use client";

import { Check } from "lucide-react";

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressTracker({ currentStep, totalSteps = 3 }: ProgressTrackerProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-between gap-2" aria-label="Assessment progress">
      {steps.map((step, index) => {
        const isComplete = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium",
                isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : isComplete
                    ? "border-primary text-primary"
                    : "border-muted-foreground/40 text-muted-foreground",
              ].join(" ")}
            >
              {isComplete ? <Check className="h-4 w-4" /> : step}
            </div>

            {index < steps.length - 1 ? (
              <div className="mx-2 h-px flex-1 bg-border" />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
