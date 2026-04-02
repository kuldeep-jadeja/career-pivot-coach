interface ScoreInterpretationProps {
  score: number;
  jobTitle: string;
}

const INTERPRETATIONS = {
  LOW: {
    headline: 'Your role shows strong resilience to AI automation',
    context:
      'Most tasks in your occupation require uniquely human capabilities that current AI cannot replicate effectively.',
  },
  MODERATE: {
    headline: 'Some aspects of your role may evolve with AI',
    context:
      'While AI can assist with certain tasks, core responsibilities still require human judgment and interpersonal skills.',
  },
  ELEVATED: {
    headline: 'Your role faces meaningful AI integration potential',
    context:
      'Several routine tasks may become automated. Consider developing skills that complement AI capabilities.',
  },
  HIGH: {
    headline: 'Significant portions of your role are automatable',
    context:
      'Many tasks overlap with current AI capabilities. A proactive career strategy is recommended.',
  },
  VERY_HIGH: {
    headline: 'Your role is highly exposed to AI automation',
    context:
      'Most core tasks can be performed by AI systems. Career pivot planning is strongly advised.',
  },
} as const;

type Band = keyof typeof INTERPRETATIONS;

function resolveBand(score: number): Band {
  if (score <= 20) return 'LOW';
  if (score <= 40) return 'MODERATE';
  if (score <= 60) return 'ELEVATED';
  if (score <= 80) return 'HIGH';
  return 'VERY_HIGH';
}

export function ScoreInterpretation({ score, jobTitle }: ScoreInterpretationProps) {
  const interpretation = INTERPRETATIONS[resolveBand(score)];

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{interpretation.headline}</h2>
      <p className="text-muted-foreground">{interpretation.context}</p>
      <p className="text-sm text-muted-foreground">
        Based on analysis of <strong>{jobTitle}</strong> using O*NET occupational data and
        published AI exposure research.
      </p>
    </div>
  );
}

