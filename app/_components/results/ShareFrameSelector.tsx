'use client';

import { cn } from '@/lib/utils';

export type ShareFrame = 'proactive' | 'curious' | 'data';

interface ShareFrameSelectorProps {
  selected: ShareFrame;
  onChange: (frame: ShareFrame) => void;
}

const FRAMES: { id: ShareFrame; label: string; description: string }[] = [
  {
    id: 'proactive',
    label: 'Proactive',
    description: "I'm preparing for AI changes in my industry",
  },
  {
    id: 'curious',
    label: 'Curious',
    description: 'Exploring how AI might impact my career',
  },
  {
    id: 'data',
    label: 'Data-Driven',
    description: 'Analyzing workforce trends with AI risk data',
  },
];

export function ShareFrameSelector({ selected, onChange }: ShareFrameSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Choose your message framing:</label>
      <div className="grid gap-2">
        {FRAMES.map((frame) => (
          <button
            key={frame.id}
            type="button"
            onClick={() => onChange(frame.id)}
            className={cn(
              'flex min-h-[44px] flex-col items-start rounded-lg border p-3 text-left transition-colors',
              selected === frame.id
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            )}
            aria-pressed={selected === frame.id}
          >
            <span className="text-sm font-medium">{frame.label}</span>
            <span className="text-xs text-muted-foreground">{frame.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
