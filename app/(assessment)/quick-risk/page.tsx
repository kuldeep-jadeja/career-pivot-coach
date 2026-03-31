/**
 * Quick Risk Assessment Page - Assessment route group
 * 
 * Purpose: Quick 3-minute risk assessment form
 * Collects job title, years of experience, industry
 * Shows instant risk score without requiring account
 */

export default function QuickRiskPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-6 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Quick Risk Assessment</h1>
          <p className="text-muted-foreground">
            3-minute assessment to check your AI displacement risk
          </p>
        </div>
        {/* TODO: Add assessment form with job title, experience, industry */}
        {/* TODO: Integrate with scoring engine */}
      </div>
    </div>
  );
}
