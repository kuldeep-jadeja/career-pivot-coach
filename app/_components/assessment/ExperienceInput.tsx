"use client";

import { Input } from "@/app/_components/ui/input";
import { Slider } from "@/app/_components/ui/slider";

interface ExperienceInputProps {
  value: number;
  onChange: (value: number) => void;
}

function getExperienceLabel(years: number): string {
  if (years === 0) return "Just starting out";
  if (years <= 2) return "Early career";
  if (years <= 9) return "Experienced";
  return "Veteran";
}

export function ExperienceInput({ value, onChange }: ExperienceInputProps) {
  const clampedValue = Number.isFinite(value) ? Math.min(50, Math.max(0, value)) : 0;

  return (
    <div className="space-y-4">
      <Slider
        value={[clampedValue]}
        min={0}
        max={50}
        step={1}
        onValueChange={(next) => onChange(next[0] ?? 0)}
        aria-label="Years of experience"
      />

      <div className="flex items-center gap-3">
        <Input
          type="number"
          inputMode="numeric"
          min={0}
          max={50}
          step={1}
          className="h-11 text-base"
          value={clampedValue}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            if (Number.isNaN(parsed)) {
              onChange(0);
              return;
            }
            onChange(Math.min(50, Math.max(0, parsed)));
          }}
        />
        <p className="text-sm text-muted-foreground">{getExperienceLabel(clampedValue)}</p>
      </div>
    </div>
  );
}
