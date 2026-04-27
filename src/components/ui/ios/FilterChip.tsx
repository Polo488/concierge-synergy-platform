import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  showChevron?: boolean;
}

export function FilterChip({
  label,
  icon,
  count,
  active = false,
  onClick,
  className,
  showChevron = true,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={cn('ios-chip', className)}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full bg-[hsl(var(--ios-orange))] text-white text-[10px] font-bold tabular">
          {count}
        </span>
      )}
      {showChevron && (
        <ChevronDown
          size={12}
          strokeWidth={2}
          className={cn(
            'transition-transform',
            active ? 'text-[hsl(var(--ios-orange))]' : 'text-[hsl(240_6%_25%/_0.4)]'
          )}
        />
      )}
    </button>
  );
}
