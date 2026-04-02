"use client";

import { useEffect, useMemo, useState } from "react";

import type { OnetOccupation } from "@/lib/data/types";
import { loadOccupations } from "@/lib/data/onet-loader";
import {
  type OccupationMatch,
  fuzzyMatchOccupations,
} from "@/lib/utils/fuzzy-search";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/_components/ui/command";

interface JobTitleComboboxProps {
  value: OccupationMatch | null;
  onChange: (match: OccupationMatch | null) => void;
}

export function JobTitleCombobox({ value, onChange }: JobTitleComboboxProps) {
  const [query, setQuery] = useState(value?.title ?? "");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [occupations, setOccupations] = useState<OnetOccupation[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    loadOccupations()
      .then((data) => {
        if (!isMounted) return;
        setOccupations(data);
      })
      .catch(() => {
        if (!isMounted) return;
        setOccupations([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const matches = useMemo(
    () => fuzzyMatchOccupations(debouncedQuery, occupations, 5),
    [debouncedQuery, occupations]
  );

  return (
    <div className="space-y-2">
      <Command shouldFilter={false} className="rounded-md border">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          className="h-11 text-base"
          placeholder="Search job title (e.g., Software Engineer, Teacher, Nurse)..."
          aria-label="Search job title"
        />
        <CommandList>
          {debouncedQuery.trim().length >= 2 && matches.length === 0 ? (
            <CommandEmpty>No matches found. Try a different term.</CommandEmpty>
          ) : null}

          {matches.map((match) => (
            <CommandItem
              key={match.socCode}
              value={match.title}
              onSelect={() => {
                onChange(match);
                setQuery(match.title);
              }}
              className="min-h-11 items-start py-3"
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{match.title}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {Math.round(match.confidence * 100)}%
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {match.description}
                </p>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </div>
  );
}
