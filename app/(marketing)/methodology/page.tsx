import type { Metadata } from 'next';
import Link from 'next/link';

import { ContactSection } from '@/app/_components/legal/ContactSection';
import { DataFreshness } from '@/app/_components/legal/DataFreshness';
import { MethodologySection } from '@/app/_components/legal/MethodologySection';
import { getDataFreshness } from '@/lib/data/freshness';

export const metadata: Metadata = {
  title: 'Methodology | Unautomatable',
  description:
    'How we calculate AI displacement risk scores using O*NET data and published research.',
};

export default async function MethodologyPage() {
  const freshness = await getDataFreshness();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Research Methodology</h1>
      <p className="mb-8 text-muted-foreground">
        How we assess AI displacement risk using occupational data and academic research
      </p>

      <div className="space-y-8">
        <DataFreshness
          version={freshness.version}
          releaseDate={freshness.releaseDate}
          downloadDate={freshness.downloadDate}
          freshnessLevel={freshness.freshnessLevel}
        />

        <MethodologySection />

        <section className="prose prose-zinc dark:prose-invert max-w-none">
          <h2 className="text-2xl font-semibold">Limitations</h2>

          <ul>
            <li>
              <strong>Prediction uncertainty:</strong> AI technology evolves rapidly. Our scores
              reflect current capabilities and published research, but cannot predict future
              breakthroughs or adoption patterns.
            </li>
            <li>
              <strong>Occupation granularity:</strong> O*NET classifies ~1,000 occupations. Your
              specific role may combine tasks from multiple occupations, affecting accuracy.
            </li>
            <li>
              <strong>Geographic variation:</strong> AI adoption rates vary by region and country.
              Our industry modifiers reflect general patterns, not local conditions.
            </li>
            <li>
              <strong>Task vs. job replacement:</strong> High task automation potential
              doesn&apos;t necessarily mean job elimination — roles may evolve rather than disappear.
            </li>
          </ul>
        </section>

        <div className="space-y-4 text-center">
          <p className="text-muted-foreground">Questions about our methodology?</p>
          <Link href="/help" className="font-medium text-primary hover:underline">
            Visit our Help &amp; FAQ page →
          </Link>
        </div>
        <ContactSection />
      </div>
    </div>
  );
}
