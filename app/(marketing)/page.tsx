/**
 * Landing Page - Marketing route group
 * 
 * Purpose: Main landing page for Career Pivot Coach
 * Will contain hero section, value proposition, CTA to assessment
 */

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Career Pivot Coach</h1>
        <p className="text-muted-foreground">
          Assess your AI displacement risk and get personalized pivot plans
        </p>
        {/* TODO: Add hero section, features, testimonials, CTA */}
      </div>
    </div>
  );
}
