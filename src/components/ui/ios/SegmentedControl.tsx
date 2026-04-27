import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

interface Props<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = 'md',
  fullWidth = false,
}: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ left: 3, width: 0 });

  useEffect(() => {
    const el = containerRef.current?.querySelector<HTMLButtonElement>(
      `button[data-value="${value}"]`
    );
    if (!el || !containerRef.current) return;
    const cRect = containerRef.current.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    setThumb({ left: eRect.left - cRect.left, width: eRect.width });
  }, [value, options.length]);

  return (
    <div
      ref={containerRef}
      className={cn('ios-segmented relative', fullWidth && 'w-full', className)}
      role="tablist"
    >
      <div className="ios-segmented-thumb" style={{ left: thumb.left, width: thumb.width }} />
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            data-value={opt.value}
            data-state={active ? 'active' : 'inactive'}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative z-10 rounded-[8px] font-semibold transition-colors duration-200',
              size === 'sm' ? 'px-3 py-[5px] text-[12px]' : 'px-4 py-[7px] text-[13px]',
              fullWidth && 'flex-1',
              active ? 'text-[hsl(var(--label-1))]' : 'text-[hsl(240_6%_25%/_0.6)]'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
