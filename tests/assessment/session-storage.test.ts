import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { z } from "zod";

import { useSessionStorage } from "@/lib/hooks/useSessionStorage";

const schema = z.object({
  step: z.number(),
  name: z.string(),
});

describe("useSessionStorage", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns [value, setValue, isHydrated] tuple", async () => {
    const { result } = renderHook(() =>
      useSessionStorage("test-key", schema, { step: 1, name: "" })
    );

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(3);
    expect(typeof result.current[1]).toBe("function");
    expect(typeof result.current[2]).toBe("boolean");
  });

  it("isHydrated is false initially then true after effect", async () => {
    const { result } = renderHook(() =>
      useSessionStorage("test-key", schema, { step: 1, name: "" })
    );

    expect(result.current[2]).toBe(false);

    await waitFor(() => {
      expect(result.current[2]).toBe(true);
    });
  });

  it("setValue persists updates to sessionStorage", async () => {
    const { result } = renderHook(() =>
      useSessionStorage("test-key", schema, { step: 1, name: "" })
    );

    await waitFor(() => {
      expect(result.current[2]).toBe(true);
    });

    act(() => {
      result.current[1]({ step: 2, name: "Ada" });
    });

    await waitFor(() => {
      expect(sessionStorage.getItem("test-key")).toBe(
        JSON.stringify({ step: 2, name: "Ada" })
      );
    });
  });

  it("loads initial value from existing sessionStorage entry", async () => {
    sessionStorage.setItem("test-key", JSON.stringify({ step: 3, name: "Lin" }));

    const { result } = renderHook(() =>
      useSessionStorage("test-key", schema, { step: 1, name: "" })
    );

    await waitFor(() => {
      expect(result.current[0]).toEqual({ step: 3, name: "Lin" });
    });
  });

  it("falls back to defaultValue when sessionStorage has invalid JSON", async () => {
    sessionStorage.setItem("test-key", "{invalid-json");

    const { result } = renderHook(() =>
      useSessionStorage("test-key", schema, { step: 1, name: "" })
    );

    await waitFor(() => {
      expect(result.current[2]).toBe(true);
    });

    expect(result.current[0]).toEqual({ step: 1, name: "" });
  });

  it("rejects malformed data with schema validation", async () => {
    sessionStorage.setItem("test-key", JSON.stringify({ step: "bad", name: 7 }));

    const { result } = renderHook(() =>
      useSessionStorage("test-key", schema, { step: 1, name: "" })
    );

    await waitFor(() => {
      expect(result.current[2]).toBe(true);
    });

    expect(result.current[0]).toEqual({ step: 1, name: "" });
  });
});
