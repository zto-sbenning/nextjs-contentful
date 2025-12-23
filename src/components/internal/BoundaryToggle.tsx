'use client';

import { Droplets, Layers, Square } from 'lucide-react';
import { useBoundaryMode } from './BoundaryProvider';
import type { BoundaryMode } from './BoundaryProvider';

const modes: { icon: React.ReactNode; label: string; mode: BoundaryMode }[] = [
  { icon: <Square className="size-4" />, label: 'Off', mode: 'off' },
  { icon: <Droplets className="size-4" />, label: 'Hydration', mode: 'hydration' },
  { icon: <Layers className="size-4" />, label: 'Rendering', mode: 'rendering' },
];

export default function BoundaryToggle() {
  const { mode, setMode } = useBoundaryMode();

  return (
    <div className="fixed right-8 bottom-4 z-50">
      <div className="bg-neutral-50 dark:bg-neutral-900 flex gap-1 rounded-md p-1 shadow-lg">
        {modes.map(({ icon, label, mode: modeOption }) => {
          const isActive = mode === modeOption;

          return (
            <button
              key={modeOption}
              className={`font-body focus:ring-primary-500 flex items-center gap-2 rounded px-3 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-200 focus:ring-offset-2 focus-visible:ring-2 focus-visible:outline-none dark:focus:ring-offset-neutral-900 ${
                isActive
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm'
                  : 'bg-transparent text-neutral-900 hover:bg-neutral-200 dark:text-neutral-50 dark:hover:bg-neutral-800'
              }`}
              onClick={() => {
                setMode(modeOption);
              }}
              title={`Switch to ${label} boundaries`}
              type="button"
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
