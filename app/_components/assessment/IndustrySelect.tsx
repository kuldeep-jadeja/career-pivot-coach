"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface IndustrySelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Government",
  "Other",
];

export function IndustrySelect({ value, onChange }: IndustrySelectProps) {
  return (
    <Select
      value={value ?? ""}
      onValueChange={(next) => onChange(next || null)}
    >
      <SelectTrigger className="h-11 text-base">
        <SelectValue placeholder="Select your industry" />
      </SelectTrigger>
      <SelectContent>
        {INDUSTRY_OPTIONS.map((industry) => (
          <SelectItem key={industry} value={industry}>
            {industry}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
