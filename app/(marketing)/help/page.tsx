import type { Metadata } from 'next';
import Link from 'next/link';

import { ContactSection } from '@/app/_components/legal/ContactSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/_components/ui/card';

export const metadata: Metadata = {
  title: 'Help & FAQ | Unautomatable',
  description:
    'Frequently asked questions about AI displacement risk assessment and career pivot planning.',
};

const FAQ_ITEMS = [
  {
    question: 'How accurate is the AI displacement risk score?',
    answer:
      "Our scores are based on peer-reviewed research and official occupational data, but predicting AI's impact on jobs involves inherent uncertainty. We round scores to 5% increments and provide confidence levels to avoid false precision. Use the score as a starting point for career planning, not a definitive prediction.",
  },
  {
    question: 'Why do I need to select my job title from a list?',
    answer:
      'We match your job title to the O*NET occupational database, which contains detailed task and skill information for over 1,000 occupations. This matching ensures we can provide accurate, research-backed analysis of your specific role.',
  },
  {
    question: 'How is the risk score calculated?',
    answer:
      'We use a 4-layer algorithm: (1) AI exposure baseline from published research, (2) task-level automation analysis using O*NET data, (3) industry adoption speed modifier, and (4) experience-based resilience factor. See our methodology page for detailed explanations.',
  },
  {
    question: 'Is my assessment data private?',
    answer:
      "Yes. We store assessment results to generate your results page, but we don't share individual data with third parties. If you provide an email, we only use it to send your results. See our Privacy Policy for details.",
  },
  {
    question: 'Can I retake the assessment?',
    answer:
      "Yes, you can take the assessment as many times as you like. Each assessment generates a unique results page. We don't require an account for the free assessment.",
  },
  {
    question: 'What should I do if my score is high?',
    answer:
      "A high score indicates that many tasks in your current role could be automated. This doesn't mean you'll lose your job immediately — it means proactive career planning is advisable. Consider developing skills that complement AI, or explore adjacent roles with lower automation risk.",
  },
  {
    question: 'How often is the data updated?',
    answer:
      'The O*NET database is updated quarterly. We track data freshness and display the current version in our methodology section. AI capability research is incorporated as new peer-reviewed studies are published.',
  },
  {
    question: 'Why does experience affect my score?',
    answer:
      'Senior professionals often possess tacit knowledge, professional networks, and judgment honed over years that AI cannot easily replicate. The experience modifier provides a small reduction in risk to reflect this resilience, though it does not eliminate automation risk entirely.',
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Help &amp; FAQ</h1>
      <p className="mb-8 text-muted-foreground">
        Common questions about AI displacement risk assessment
      </p>

      <div className="mb-12 space-y-4">
        {FAQ_ITEMS.map((item) => (
          <Card key={item.question}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Want to understand how we calculate scores?</p>
          <Link href="/methodology" className="font-medium text-primary hover:underline">
            Read our methodology documentation →
          </Link>
        </div>

        <ContactSection />
      </div>
    </div>
  );
}
