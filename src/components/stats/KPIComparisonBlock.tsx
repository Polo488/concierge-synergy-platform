import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeltaProps {
  label: string;
  value?: number;
  inverse?: boolean;
  compact?: boolean;
}

function Delta({ label, value, inverse = false, compact = false }: DeltaProps) {
  if (value === undefined || isNaN(value)) {
    return (
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60">
        <span>{label}</span>
        <span>—</span>
      </div>
    );
  }
  const positive = inverse ? value < 0 : value > 0;
  const negative = inverse ? value > 0 : value < 0;
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className={cn('text-muted-foreground', compact ? 'text-[10px]' : 'text-[11px]')}>{label}</span>
      <span
        className={cn(
          'inline-flex items-center gap-0.5 font-medium tabular-nums',
          compact ? 'text-[10px]' : 'text-[11px]',
          positive && 'text-emerald-600',
          negative && 'text-red-600',
          !positive && !negative && 'text-muted-foreground'
        )}
      >
        <Icon className={cn(compact ? 'h-2.5 w-2.5' : 'h-3 w-3')} />
        {value > 0 && '+'}
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

interface KPIComparisonBlockProps {
  vsM1?: number;
  vsN1?: number;
  ytd?: number;
  inverse?: boolean;
  compact?: boolean;
  className?: string;
}

export function KPIComparisonBlock({
  vsM1,
  vsN1,
  ytd,
  inverse = false,
  compact = false,
  className,
}: KPIComparisonBlockProps) {
  return (
    <div className={cn('flex flex-col gap-0.5 min-w-[110px]', className)}>
      <Delta label="vs M-1" value={vsM1} inverse={inverse} compact={compact} />
      <Delta label="vs N-1" value={vsN1} inverse={inverse} compact={compact} />
      <Delta label="YTD" value={ytd} inverse={inverse} compact={compact} />
    </div>
  );
}
