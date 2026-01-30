import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function ProductPreviewStats({ className }: { className?: string }) {
  const stats = [
    { label: "Taux d'occupation", value: '87%', change: '+12%', trend: 'up' },
    { label: 'Revenu mensuel', value: '24 580 €', change: '+8%', trend: 'up' },
    { label: 'Durée moyenne', value: '4.2 nuits', change: '-0.3', trend: 'down' },
    { label: 'Note moyenne', value: '4.8', change: 'stable', trend: 'stable' },
  ];

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-md transition-shadow"
        >
          <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">{stat.value}</span>
            <span className={cn(
              'text-xs font-medium flex items-center gap-0.5',
              stat.trend === 'up' && 'text-[hsl(152,50%,45%)]',
              stat.trend === 'down' && 'text-[hsl(0,65%,55%)]',
              stat.trend === 'stable' && 'text-muted-foreground'
            )}>
              {stat.trend === 'up' && <TrendingUp size={12} />}
              {stat.trend === 'down' && <TrendingDown size={12} />}
              {stat.trend === 'stable' && <Minus size={12} />}
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
