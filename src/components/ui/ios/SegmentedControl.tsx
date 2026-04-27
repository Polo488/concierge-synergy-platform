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
  return (
    <div
      className={cn('ios-segmented relative', fullWidth && 'w-full', className)}
      role="tablist"
    >
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
              'relative z-10 inline-flex items-center justify-center gap-1.5 whitespace-nowrap',
              'rounded-[7px] sm:rounded-[8px] font-semibold tracking-[-0.01em]',
              'transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
              'active:scale-[0.97]',
              // Compact iOS sizing — smaller on mobile, slightly larger on desktop
              size === 'sm'
                ? 'px-2.5 sm:px-3 py-[3px] sm:py-[5px] text-[11px] sm:text-[12px]'
                : 'px-3 sm:px-4 py-[4px] sm:py-[6px] text-[12px] sm:text-[13px]',
              fullWidth && 'flex-1',
              active
                ? 'text-[hsl(var(--label-1))]'
                : 'text-[hsl(var(--label-1)/0.55)] hover:text-[hsl(var(--label-1)/0.8)]'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
