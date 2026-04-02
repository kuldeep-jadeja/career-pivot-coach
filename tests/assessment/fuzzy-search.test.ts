import { describe, expect, it } from "vitest";

import { fuzzyMatchOccupations } from "@/lib/utils/fuzzy-search";
import type { OnetOccupation } from "@/lib/data/types";

const occupations: OnetOccupation[] = [
  {
    socCode: "15-1252.00",
    title: "Software Developers",
    description: "Develop and maintain software systems.",
  },
  {
    socCode: "17-2081.00",
    title: "Environmental Engineers",
    description: "Develop solutions to environmental problems.",
  },
  {
    socCode: "29-1141.00",
    title: "Registered Nurses",
    description: "Provide and coordinate patient care.",
  },
  {
    socCode: "13-2011.00",
    title: "Accountants and Auditors",
    description: "Prepare and examine financial records.",
  },
  {
    socCode: "11-1021.00",
    title: "General and Operations Managers",
    description: "Plan and direct operations.",
  },
  {
    socCode: "41-3099.00",
    title: "Sales Representatives, Services, All Other",
    description: "Sell services to businesses and individuals.",
  },
];

describe("fuzzyMatchOccupations", () => {
  it('returns "Software Developers" with confidence > 0.5 for "software"', () => {
    const result = fuzzyMatchOccupations("software", occupations);
    const software = result.find((match) => match.title === "Software Developers");

    expect(software).toBeDefined();
    expect(software?.confidence).toBeGreaterThan(0.5);
  });

  it('returns at most 5 results for "eng"', () => {
    const result = fuzzyMatchOccupations("eng", occupations);
    expect(result.length).toBeLessThanOrEqual(5);
  });

  it("returns an empty array for empty query", () => {
    const result = fuzzyMatchOccupations("", occupations);
    expect(result).toEqual([]);
  });

  it('returns an empty array when no matches are found for "xyz123"', () => {
    const result = fuzzyMatchOccupations("xyz123", occupations);
    expect(result).toEqual([]);
  });
});
