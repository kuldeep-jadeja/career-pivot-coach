/**
 * Methodology Page
 * 
 * Documents the 4-layer risk scoring algorithm, scoring formula,
 * risk bands, limitations, and sources.
 */

import Link from 'next/link';

export default function MethodologyPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">How We Calculate AI Displacement Risk</h1>
      <p className="text-xl text-gray-600 mb-12">
        A transparent, research-backed methodology for measuring career automation potential
      </p>

      {/* Core Formula */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">The 4-Layer Scoring Model</h2>
        <p className="text-lg text-gray-700 mb-6">
          Our risk score combines four evidence-based factors, each weighted according to its impact on automation potential. 
          The result is a 0-100 score that reflects how susceptible your occupation is to AI displacement.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-8 font-mono text-center text-lg">
          <div className="font-semibold mb-2">Risk Score Formula</div>
          <div>
            (Layer 1 × 35%) + (Layer 2 × 35%) + (Layer 3 × 15%) + (Layer 4 × 15%)
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-semibold mb-2">Layer 1: AI Exposure Baseline (35%)</h3>
            <p className="text-gray-700 mb-3">
              Based on peer-reviewed research measuring how susceptible occupation tasks are to large language models 
              and AI systems. We use pre-computed exposure scores from published academic studies.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Primary sources:</strong> Eloundou et al. "GPTs are GPTs" (2023), Felten et al. "Occupational Exposure to AI" (2023)
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-semibold mb-2">Layer 2: Task Automation Analysis (35%)</h3>
            <p className="text-gray-700 mb-3">
              Analysis of O*NET task descriptions for automation indicators. Tasks involving data entry, routine processing, 
              and pattern-based work score higher. Tasks requiring physical dexterity, emotional intelligence, 
              or novel problem-solving score lower.
            </p>
            <p className="text-sm text-gray-600">
              <strong>Data source:</strong> O*NET occupational task descriptions (U.S. Department of Labor)
            </p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="text-xl font-semibold mb-2">Layer 3: Industry Adoption Speed (15%)</h3>
            <p className="text-gray-700 mb-3">
              Modifier based on how quickly your industry is adopting AI. Technology and finance sectors see faster adoption 
              (+10-15% risk increase), while construction and hospitality adopt more slowly (-5-10% risk decrease).
            </p>
            <p className="text-sm text-gray-600">
              <strong>Method:</strong> Industry-specific multipliers (0.85-1.15) based on AI adoption trends
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-semibold mb-2">Layer 4: Experience Level (15%)</h3>
            <p className="text-gray-700 mb-3">
              Modifier based on career stage. Entry-level workers (0-2 years) face slightly less risk (-5%) due to 
              easier pivoting. Mid-career (3-10 years) in routine roles face higher risk (+5%). 
              Senior professionals (10+ years) with specialized expertise face lower risk (-5-10%).
            </p>
            <p className="text-sm text-gray-600">
              <strong>Method:</strong> Experience-based multipliers (0.90-1.05) reflecting career adaptability
            </p>
          </div>
        </div>
      </section>

      {/* Risk Bands */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Understanding Your Score</h2>
        <p className="text-lg text-gray-700 mb-6">
          Scores are rounded to the nearest 5% to avoid false precision. Each score maps to a risk band 
          with actionable guidance.
        </p>
        
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
            <span className="text-3xl font-bold text-green-700 min-w-[80px]">0-20%</span>
            <div>
              <span className="font-semibold text-green-900">Low Risk</span>
              <p className="text-gray-700 mt-1">
                Your role relies heavily on human skills that AI cannot replicate: physical work in varied environments, 
                emotional intelligence, creative problem-solving in unpredictable contexts.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <span className="text-3xl font-bold text-yellow-700 min-w-[80px]">21-40%</span>
            <div>
              <span className="font-semibold text-yellow-900">Moderate Risk</span>
              <p className="text-gray-700 mt-1">
                Some tasks may be automated (scheduling, basic analysis), but core functions remain human 
                (teaching, healthcare, skilled trades). Stay current with AI tools in your field.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-orange-50 rounded-lg border border-orange-200">
            <span className="text-3xl font-bold text-orange-700 min-w-[80px]">41-60%</span>
            <div>
              <span className="font-semibold text-orange-900">Elevated Risk</span>
              <p className="text-gray-700 mt-1">
                Significant portions of your work may change within 5-10 years. AI will augment or replace 
                routine aspects. Focus on developing uniquely human skills and exploring adjacent roles.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-red-50 rounded-lg border border-red-200">
            <span className="text-3xl font-bold text-red-700 min-w-[80px]">61-80%</span>
            <div>
              <span className="font-semibold text-red-900">High Risk</span>
              <p className="text-gray-700 mt-1">
                Many tasks in your role are prime candidates for AI automation. Consider developing expertise 
                in AI oversight, strategy, or pivoting to roles with more human-centric work.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-6 bg-red-100 rounded-lg border border-red-300">
            <span className="text-3xl font-bold text-red-800 min-w-[80px]">81-100%</span>
            <div>
              <span className="font-semibold text-red-950">Very High Risk</span>
              <p className="text-gray-700 mt-1">
                Your role faces significant disruption within 3-5 years. Highly routine, repetitive, or text-based 
                work is rapidly automatable. Career pivot strongly recommended—our plans show you how.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Validation */}
      <section className="mb-16 bg-blue-50 p-8 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-4">Validation & Accuracy</h2>
        <p className="text-gray-700 mb-4">
          Our scoring algorithm has been validated against published research and real-world occupation data:
        </p>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>
              <strong>Research correlation:</strong> Our scores correlate strongly (Pearson r &gt; 0.70) with 
              Eloundou et al. AI exposure rankings
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>
              <strong>Golden dataset:</strong> Validated against 60+ occupations spanning all risk bands and 
              major industry categories
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">✓</span>
            <span>
              <strong>Real-world testing:</strong> Scores align with observed AI adoption trends across sectors
            </span>
          </li>
        </ul>
      </section>

      {/* Limitations */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Limitations & Disclaimers</h2>
        <p className="text-lg text-gray-700 mb-6">
          We believe in transparency. Here's what our risk score can and cannot tell you:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700">
          <li>
            <strong>Scores are estimates</strong> based on current AI capabilities and occupational data. 
            They reflect automation potential, not certainty.
          </li>
          <li>
            <strong>Individual jobs vary.</strong> Your specific role may differ significantly from O*NET 
            occupation averages. A "Software Developer" at a startup has different tasks than one at a bank.
          </li>
          <li>
            <strong>AI evolves rapidly.</strong> Scores reflect a snapshot in time (data version displayed on results page). 
            We update quarterly as new research emerges.
          </li>
          <li>
            <strong>Regulatory and ethical factors</strong> may slow or prevent automation in certain fields 
            (healthcare, legal, education) even when technically feasible.
          </li>
          <li>
            <strong>Economic incentives matter.</strong> Just because a task can be automated doesn't mean 
            it will be. Labor costs, quality concerns, and customer preferences all influence adoption.
          </li>
          <li>
            <strong>Your workplace is unique.</strong> Some companies adopt AI aggressively, others slowly. 
            Industry-level modifiers are averages, not predictions for your specific employer.
          </li>
        </ul>
      </section>

      {/* Data Sources */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Data Sources & Updates</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-gray-300 pl-4">
            <h3 className="font-semibold mb-1">Occupational Data</h3>
            <p>
              O*NET database (v28.3, released March 2024) from the U.S. Department of Labor. 
              Updated quarterly with new releases.
            </p>
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <h3 className="font-semibold mb-1">AI Exposure Research</h3>
            <p>
              Eloundou et al. (2023), Felten et al. (2023), and other peer-reviewed studies. 
              See our <Link href="/sources" className="text-blue-600 underline hover:text-blue-800">full bibliography</Link> for citations.
            </p>
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <h3 className="font-semibold mb-1">Industry Adoption Trends</h3>
            <p>
              Industry reports from McKinsey, Gartner, and sector-specific AI adoption surveys. 
              Updated semi-annually.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to see your risk score?</h2>
        <p className="text-gray-700 mb-6">
          Get your personalized AI displacement assessment in 5 minutes. Free, no login required.
        </p>
        <Link 
          href="/assessment"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          Start Free Assessment
        </Link>
      </section>

      {/* Back Link */}
      <div className="mt-12 text-center">
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
