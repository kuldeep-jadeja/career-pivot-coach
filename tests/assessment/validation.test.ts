import { describe, expect, it } from "vitest";

import { assessmentSchema } from "@/lib/validation/assessment-schema";

describe("assessmentSchema", () => {
  it("validates selected job title with code and title", () => {
    const parsed = assessmentSchema.parse({
      jobTitle: { code: "15-1252.00", title: "Software Developers" },
      industry: "Technology",
      yearsExperience: 5,
    });

    expect(parsed.jobTitle?.code).toBe("15-1252.00");
    expect(parsed.jobTitle?.title).toBe("Software Developers");
  });

  it("rejects yearsExperience below 0", () => {
    const result = assessmentSchema.safeParse({
      jobTitle: null,
      industry: null,
      yearsExperience: -1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects yearsExperience above 50", () => {
    const result = assessmentSchema.safeParse({
      jobTitle: null,
      industry: null,
      yearsExperience: 51,
    });

    expect(result.success).toBe(false);
  });

  it("accepts optional empty email string", () => {
    const parsed = assessmentSchema.parse({
      jobTitle: null,
      industry: null,
      yearsExperience: null,
      email: "",
    });

    expect(parsed.email).toBe("");
  });
});
