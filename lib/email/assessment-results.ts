export function getRiskLevel(score: number): string {
  if (score <= 20) return 'Low Risk';
  if (score <= 40) return 'Moderate Risk';
  if (score <= 60) return 'Elevated Risk';
  if (score <= 80) return 'High Risk';
  return 'Very High Risk';
}

