import type { OnetOccupation } from "@/lib/data/types";

export interface OccupationMatch {
  socCode: string;
  title: string;
  description: string;
  confidence: number;
  alternateTitles?: string[];
}

export function fuzzyMatchOccupations(
  query: string,
  occupations: OnetOccupation[],
  limit: number = 5
): OccupationMatch[] {
  const trimmed = query.trim().toLowerCase();

  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const words = trimmed.split(/\s+/).filter(Boolean);

  return occupations
    .map((occupation) => {
      const titleLower = occupation.title.toLowerCase();
      let score = 0;

      if (titleLower === trimmed) score += 100;
      if (titleLower.startsWith(trimmed)) score += 50;
      if (titleLower.includes(trimmed)) score += 25;

      words.forEach((word) => {
        if (titleLower.includes(word)) score += 10;
      });

      return {
        socCode: occupation.socCode,
        title: occupation.title,
        description: occupation.description,
        alternateTitles: occupation.alternateTitles,
        confidence: Math.min(score / 100, 1),
      };
    })
    .filter((match) => match.confidence > 0.1)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
}
