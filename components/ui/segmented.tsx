'use client';

import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  hint?: string;
}

interface SegmentedProps<T extends string | number> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Equal-width segmented control with a sliding indicator — the main way of switching
 * between calendar systems, languages and themes.
 */
export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  size = 'md',
  className,
}: SegmentedProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'relative isolate flex w-full items-center rounded-full border border-line bg-surface-3/70 p-1',
        size === 'sm' ? 'text-xs' : 'text-sm',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 -z-10 rounded-full bg-surface-2 shadow-[0_1px_2px_rgba(13,32,24,0.12)] transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="tab"
            aria-selected={active}
            title={option.hint}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex min-w-0 flex-1 basis-0 items-center justify-center gap-1.5 rounded-full font-medium transition-colors duration-200',
              size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5',
              active ? 'text-ink' : 'text-muted hover:text-ink',
            )}
          >
            {option.icon}
            <span className="min-w-0 text-balance break-words text-center leading-tight">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
