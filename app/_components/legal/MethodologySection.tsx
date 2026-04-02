import { ExternalLink } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';

interface Citation {
  authors: string;
  year: number;
  title: string;
  source: string;
  url?: string;
}

const CITATIONS: Citation[] = [
  {
    authors: 'O*NET Resource Center',
    year: 2024,
    title: 'O*NET Database Version 28.3',
    source: 'U.S. Department of Labor, Employment and Training Administration',
    url: 'https://www.onetcenter.org/database.html',
  },
  {
    authors: 'Eloundou, T., Manning, S., Mishkin, P., & Rock, D.',
    year: 2023,
    title:
      'GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models',
    source: 'arXiv preprint arXiv:2303.10130',
    url: 'https://arxiv.org/abs/2303.10130',
  },
  {
    authors: 'Felten, E., Raj, M., & Seamans, R.',
    year: 2023,
    title:
      'How will Language Modelers like ChatGPT Affect Occupations and Industries?',
    source: 'SSRN Working Paper',
    url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4375268',
  },
];

export function MethodologySection() {
  return (
    <section className="space-y-6">
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <h2 className="text-2xl font-semibold">How We Calculate Your Risk Score</h2>

        <p>
          Our AI displacement risk assessment uses a 4-layer scoring algorithm
          that combines occupational data with published AI capability research:
        </p>

        <h3>Layer 1: AI Exposure Baseline (35%)</h3>
        <p>
          Based on research by Eloundou et al. (2023), we calculate how much of
          your occupation&apos;s task portfolio overlaps with current large language
          model capabilities. This provides a research-grounded baseline for AI
          exposure.
        </p>

        <h3>Layer 2: Task Automation Potential (35%)</h3>
        <p>
          Using O*NET&apos;s detailed task descriptions for your occupation, we analyze
          which specific tasks are automatable with current AI technology and
          weight by task importance.
        </p>

        <h3>Layer 3: Industry Adoption Speed (15%)</h3>
        <p>
          Different industries adopt AI at different rates. Technology and finance
          sectors typically lead adoption, while healthcare and education face more
          regulatory friction. This modifier adjusts your score based on likely
          adoption timelines.
        </p>

        <h3>Layer 4: Experience Modifier (15%)</h3>
        <p>
          Years of experience provide some buffer against displacement. Senior
          professionals often have tacit knowledge, relationships, and judgment
          that AI cannot easily replicate. This modifier slightly reduces risk for
          experienced workers.
        </p>

        <h3>Score Precision</h3>
        <p>
          Final scores are rounded to the nearest 5% to avoid false precision.
          AI displacement prediction is inherently uncertain — we present ranges
          and confidence levels rather than exact percentages.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Academic Citations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {CITATIONS.map((citation) => (
              <li key={citation.title} className="text-sm">
                <p className="font-medium">
                  {citation.authors} ({citation.year})
                </p>
                <p className="text-muted-foreground italic">{citation.title}</p>
                <p className="text-muted-foreground">{citation.source}</p>
                {citation.url && (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
