"use client";

import { useEffect, useState } from "react";
import { z } from "zod";

export function useSessionStorage<T>(
  key: string,
  schema: z.ZodSchema<T>,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;

    const stored = window.sessionStorage.getItem(key);
    if (!stored) return defaultValue;

    try {
      const parsed = JSON.parse(stored);
      const validated = schema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
    } catch (error) {
      console.warn(`Failed to parse sessionStorage key "${key}"`, error);
    }

    return defaultValue;
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = window.setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [key, schema]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value, isHydrated]);

  return [value, setValue, isHydrated];
}
