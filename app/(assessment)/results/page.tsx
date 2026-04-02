import { notFound } from 'next/navigation';

import { ProgressTracker } from '@/app/_components/assessment/ProgressTracker';
import { LayerBreakdown } from '@/app/_components/results/LayerBreakdown';
import { EmailCapture } from '@/app/_components/results/EmailCapture';
import { RiskScoreGauge } from '@/app/_components/results/RiskScoreGauge';
import { ScoreInterpretation } from '@/app/_components/results/ScoreInterpretation';
import { ShareButtons } from '@/app/_components/results/ShareButtons';
import { TaskRiskList } from '@/app/_components/results/TaskRiskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';
import { createServerSupabaseClient } from '@/lib/db/supabase';

interface ResultsPageProps {
  searchParams: Promise<{ id?: string }>;
}

async function getAssessment(id: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('assessments').select('*').eq('id', id).single();
  return data as
    | {
        job_title: string;
        risk_score: number | null;
        layer_breakdown: { layer1?: number; layer2?: number; layer3?: number; layer4?: number } | null;
      }
    | null;
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const assessment = await getAssessment(id);
  if (!assessment) {
    notFound();
  }

  const fallbackBreakdown = {
    layer1_ai_exposure: assessment.layer_breakdown?.layer1 ?? 0,
    layer2_task_automation: assessment.layer_breakdown?.layer2 ?? 0,
    layer3_industry_modifier: assessment.layer_breakdown?.layer3 ?? 1,
    layer4_experience_modifier: assessment.layer_breakdown?.layer4 ?? 1,
    weighted_base:
      Math.round(
        ((assessment.layer_breakdown?.layer1 ?? 0) + (assessment.layer_breakdown?.layer2 ?? 0)) / 2
      ) || 0,
    final_adjusted: assessment.risk_score ?? 0,
  };

  return (
    <div className="space-y-8">
      <ProgressTracker currentStep={3} totalSteps={3} />

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Your AI Displacement Risk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <RiskScoreGauge score={assessment.risk_score ?? 0} />
          <ScoreInterpretation score={assessment.risk_score ?? 0} jobTitle={assessment.job_title} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <LayerBreakdown breakdown={fallbackBreakdown} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <TaskRiskList tasks={[]} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <ShareButtons
            assessmentId={id}
            jobTitle={assessment.job_title}
            riskScore={assessment.risk_score ?? 0}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <EmailCapture
            assessmentId={id}
            jobTitle={assessment.job_title}
            riskScore={assessment.risk_score ?? 0}
          />
        </CardContent>
      </Card>
    </div>
  );
}
