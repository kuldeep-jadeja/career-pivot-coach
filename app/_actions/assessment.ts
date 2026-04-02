'use server';

import { randomUUID } from 'crypto';

import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/db/supabase';
import { getTasksForOccupation, loadOccupations } from '@/lib/data/onet-loader';
import { getTaskBreakdown } from '@/lib/scoring/layers/layer2-task-automation';
import { calculateRiskScore } from '@/lib/scoring/risk-calculator';

const assessmentInputSchema = z.object({
  jobTitle: z.object({
    code: z.string().min(1),
    title: z.string().min(1),
  }),
  industry: z.string().min(1),
  yearsExperience: z.number().min(0).max(50),
});

export type CalculateAssessmentInput = z.infer<typeof assessmentInputSchema>;

export async function calculateAndSaveAssessment(input: CalculateAssessmentInput) {
  const validated = assessmentInputSchema.parse(input);

  const score = await calculateRiskScore({
    occupationCode: validated.jobTitle.code,
    industryCode: validated.industry,
    yearsExperience: validated.yearsExperience,
  });

  const tasks = getTaskBreakdown(await getTasksForOccupation(validated.jobTitle.code));
  const taskAnalysis = [
    ...tasks.high_risk.map((task) => ({
      taskId: task.taskId,
      description: task.description,
      riskLevel: 'HIGH' as const,
      automationProbability: 0.8,
    })),
    ...tasks.medium_risk.map((task) => ({
      taskId: task.taskId,
      description: task.description,
      riskLevel: 'MEDIUM' as const,
      automationProbability: 0.5,
    })),
    ...tasks.low_risk.map((task) => ({
      taskId: task.taskId,
      description: task.description,
      riskLevel: 'LOW' as const,
      automationProbability: 0.2,
    })),
  ];

  const assessmentId = randomUUID();
  const occupations = await loadOccupations();
  const canonicalJobTitle =
    occupations.find((occupation) => occupation.socCode === validated.jobTitle.code)?.title ??
    validated.jobTitle.title;

  try {
    // Use admin client to bypass RLS for anonymous assessments
    // TODO: Replace with proper RLS policy once auth is implemented (Phase 3)
    const { createAdminClient } = await import('@/lib/db/supabase');
    const supabase = createAdminClient();
    
    const { error } = await supabase.from('assessments').insert({
      id: assessmentId,
      job_title: canonicalJobTitle,
      occupation_code: validated.jobTitle.code,
      industry: validated.industry,
      years_experience: validated.yearsExperience,
      risk_score: score.overall,
      layer_breakdown: {
        layer1: score.breakdown.layer1_ai_exposure,
        layer2: score.breakdown.layer2_task_automation,
        layer3: score.breakdown.layer3_industry_modifier,
        layer4: score.breakdown.layer4_experience_modifier,
      },
      confidence: score.confidence,
      anonymous_id: null,
      user_id: null,
    });
    
    if (error) {
      console.error('Failed to persist assessment:', error);
    }
  } catch (error) {
    console.error('Failed to persist assessment', error);
  }

  return {
    success: true,
    assessmentId,
    riskScore: score.overall,
    breakdown: score.breakdown,
    band: score.band,
    taskAnalysis,
    jobTitle: canonicalJobTitle,
  };
}
