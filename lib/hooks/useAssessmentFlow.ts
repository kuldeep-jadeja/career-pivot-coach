"use client";

import { useMemo } from "react";
import { z } from "zod";

import {
  assessmentSchema,
  type AssessmentInput,
} from "@/lib/validation/assessment-schema";
import { useSessionStorage } from "@/lib/hooks/useSessionStorage";

const assessmentFlowSchema = assessmentSchema.extend({
  step: z.number().int().min(1).max(3),
});

type AssessmentDraft = AssessmentInput & { step: number };

const defaultAssessment: AssessmentDraft = {
  step: 1,
  jobTitle: null,
  industry: null,
  yearsExperience: null,
  email: "",
};

export function useAssessmentFlow() {
  const [assessment, setAssessment, isHydrated] = useSessionStorage<AssessmentDraft>(
    "assessment-draft",
    assessmentFlowSchema,
    defaultAssessment
  );

  const currentStep = assessment.step;

  const api = useMemo(
    () => ({
      assessment,
      currentStep,
      isHydrated,
      setField<K extends keyof AssessmentDraft>(field: K, value: AssessmentDraft[K]) {
        setAssessment((prev) => ({ ...prev, [field]: value }));
      },
      goToStep(step: number) {
        const clamped = Math.min(3, Math.max(1, Math.floor(step)));
        setAssessment((prev) => ({ ...prev, step: clamped }));
      },
    }),
    [assessment, currentStep, isHydrated, setAssessment]
  );

  return api;
}
