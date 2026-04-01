/**
 * Sources & Bibliography Page
 * 
 * Full academic citations and data sources for the risk scoring methodology
 */

import Link from 'next/link';

export default function SourcesPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Sources & Bibliography</h1>
      <p className="text-xl text-gray-600 mb-12">
        Academic research, data sources, and methodological foundations for our AI displacement risk scoring
      </p>

      {/* Primary Research */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Primary Research (Layer 1: AI Exposure)</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              GPTs are GPTs: An Early Look at the Labor Market Impact Potential of Large Language Models
            </h3>
            <p className="text-gray-600 mb-2">
              Eloundou, T., Manning, S., Mishkin, P., & Rock, D. (2023). <em>arXiv preprint arXiv:2303.10130.</em>
            </p>
            <p className="text-gray-700 mb-2">
              Foundational study measuring occupation-level exposure to GPT capabilities. Provides baseline 
              AI exposure scores for hundreds of occupations using task-level analysis.
            </p>
            <a 
              href="https://arxiv.org/abs/2303.10130" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View paper on arXiv →
            </a>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              Occupational Exposure to Artificial Intelligence: Cross-Country Evidence
            </h3>
            <p className="text-gray-600 mb-2">
              Felten, E., Raj, M., & Seamans, R. (2023). <em>Research Policy, 52(4), 104674.</em>
            </p>
            <p className="text-gray-700 mb-2">
              Cross-country analysis of AI exposure across occupations. Provides validation data and 
              international perspective on automation potential.
            </p>
            <a 
              href="https://www.sciencedirect.com/science/article/pii/S0048733322001895" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View paper on ScienceDirect →
            </a>
          </div>

          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              The Future of Employment: How Susceptible Are Jobs to Computerisation?
            </h3>
            <p className="text-gray-600 mb-2">
              Frey, C. B., & Osborne, M. A. (2017). <em>Technological Forecasting and Social Change, 114, 254-280.</em>
            </p>
            <p className="text-gray-700 mb-2">
              Pioneering 2013 study on automation potential. While pre-LLM era, provides historical context 
              for task automation patterns.
            </p>
            <a 
              href="https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View paper (PDF) →
            </a>
          </div>
        </div>
      </section>

      {/* Occupational Data */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Occupational Data (Layer 2: Task Analysis)</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              O*NET Database (v28.3)
            </h3>
            <p className="text-gray-600 mb-2">
              U.S. Department of Labor, Employment and Training Administration. Released March 2024.
            </p>
            <p className="text-gray-700 mb-2">
              Comprehensive occupational database with detailed task descriptions, skill requirements, 
              work activities, and labor market data for 900+ occupations. Updated quarterly.
            </p>
            <a 
              href="https://www.onetcenter.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Visit O*NET Center →
            </a>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              Standard Occupational Classification (SOC) System
            </h3>
            <p className="text-gray-600 mb-2">
              U.S. Bureau of Labor Statistics. 2018 SOC (current standard).
            </p>
            <p className="text-gray-700 mb-2">
              Federal statistical standard for classifying workers into occupational categories. 
              Provides consistent taxonomy for cross-referencing research and labor data.
            </p>
            <a 
              href="https://www.bls.gov/soc/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View SOC system →
            </a>
          </div>
        </div>
      </section>

      {/* Industry Trends */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Industry Adoption Data (Layer 3: Industry Speed)</h2>
        <div className="space-y-6">
          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              The State of AI in 2024
            </h3>
            <p className="text-gray-600 mb-2">
              McKinsey & Company. Annual AI Survey (2024).
            </p>
            <p className="text-gray-700 mb-2">
              Industry-level AI adoption rates across sectors. Tracks enterprise investment, 
              implementation timelines, and organizational readiness.
            </p>
            <a 
              href="https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View McKinsey AI report →
            </a>
          </div>

          <div className="border-l-4 border-yellow-500 pl-6">
            <h3 className="font-semibold text-lg mb-2">
              Gartner AI and ML Hype Cycle
            </h3>
            <p className="text-gray-600 mb-2">
              Gartner Research. Updated annually.
            </p>
            <p className="text-gray-700 mb-2">
              Technology maturity and adoption timeline predictions by industry vertical. 
              Informs industry-specific risk modifiers.
            </p>
            <a 
              href="https://www.gartner.com/en/research/methodologies/gartner-hype-cycle" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Learn about Hype Cycle →
            </a>
          </div>
        </div>
      </section>

      {/* Supporting Research */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Supporting Research</h2>
        <div className="space-y-4 text-gray-700">
          <div className="pl-6">
            <p className="mb-1">
              <strong>Acemoglu, D., & Restrepo, P. (2020).</strong> "Robots and Jobs: Evidence from US Labor Markets." 
              <em>Journal of Political Economy, 128(6), 2188-2244.</em>
            </p>
            <p className="text-sm text-gray-600">
              Empirical evidence on automation's impact on employment and wages across industries.
            </p>
          </div>

          <div className="pl-6">
            <p className="mb-1">
              <strong>Brynjolfsson, E., & McAfee, A. (2014).</strong> "The Second Machine Age: Work, Progress, and Prosperity in a Time of Brilliant Technologies." 
              <em>W. W. Norton & Company.</em>
            </p>
            <p className="text-sm text-gray-600">
              Framework for understanding technological unemployment and skill-biased technical change.
            </p>
          </div>

          <div className="pl-6">
            <p className="mb-1">
              <strong>Autor, D. H., Levy, F., & Murnane, R. J. (2003).</strong> "The Skill Content of Recent Technological Change: An Empirical Exploration." 
              <em>The Quarterly Journal of Economics, 118(4), 1279-1333.</em>
            </p>
            <p className="text-sm text-gray-600">
              Task-based framework for analyzing automation: routine vs. non-routine, cognitive vs. manual tasks.
            </p>
          </div>

          <div className="pl-6">
            <p className="mb-1">
              <strong>Webb, M. (2020).</strong> "The Impact of Artificial Intelligence on the Labor Market." 
              <em>Available at SSRN 3482150.</em>
            </p>
            <p className="text-sm text-gray-600">
              Patent-based measurement of AI's impact on specific occupational tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="mb-16 bg-gray-50 p-8 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">How We Use These Sources</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Layer 1 (AI Exposure):</strong> We use pre-computed exposure scores from Eloundou et al. (2023) 
            as our baseline, validated against Felten et al. (2023) rankings.
          </p>
          <p>
            <strong>Layer 2 (Task Automation):</strong> O*NET task descriptions are analyzed for automation indicators 
            using keyword matching and manual review informed by Autor et al.'s task framework.
          </p>
          <p>
            <strong>Layer 3 (Industry Speed):</strong> Industry modifiers derived from McKinsey and Gartner adoption 
            data, cross-referenced with sector-specific AI investment reports.
          </p>
          <p>
            <strong>Layer 4 (Experience):</strong> Modifiers based on career mobility research and observed 
            re-skilling patterns across experience levels.
          </p>
        </div>
      </section>

      {/* Updates */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6">Data Freshness & Updates</h2>
        <p className="text-gray-700 mb-4">
          We update our scoring model on the following schedule:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>O*NET data:</strong> Quarterly updates (within 30 days of new release)
          </li>
          <li>
            <strong>Research scores:</strong> As new peer-reviewed studies are published (typically 2-4 times per year)
          </li>
          <li>
            <strong>Industry modifiers:</strong> Semi-annually (aligned with major industry reports)
          </li>
          <li>
            <strong>Algorithm refinements:</strong> Continuous improvement based on validation testing
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          Your assessment results page shows the exact O*NET version and data freshness status.
        </p>
      </section>

      {/* Contact */}
      <section className="bg-blue-50 p-8 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-4">Questions About Our Methodology?</h2>
        <p className="text-gray-700 mb-4">
          We're committed to transparency and academic rigor. If you have questions about our sources, 
          methodology, or want to report an error, please reach out.
        </p>
        <p className="text-gray-700">
          Email: <a href="mailto:research@unautomatable.com" className="text-blue-600 underline hover:text-blue-800">research@unautomatable.com</a>
        </p>
      </section>

      {/* Footer Links */}
      <div className="mt-12 flex justify-center gap-8">
        <Link href="/methodology" className="text-blue-600 hover:text-blue-800 underline">
          ← Methodology
        </Link>
        <Link href="/" className="text-blue-600 hover:text-blue-800 underline">
          Home
        </Link>
        <Link href="/assessment" className="text-blue-600 hover:text-blue-800 underline">
          Start Assessment →
        </Link>
      </div>
    </main>
  );
}
