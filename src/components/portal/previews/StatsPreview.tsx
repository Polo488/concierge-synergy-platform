import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Calendar, Euro, Star, Percent } from 'lucide-react';

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
}

const mockStats: StatCard[] = [
  { label: 'Taux d\'occupation', value: '87%', change: '+5%', trend: 'up', icon: Percent },
  { label: 'Revenus du mois', value: '24 890€', change: '+12%', trend: 'up', icon: Euro },
  { label: 'Réservations', value: '45', change: '+8', trend: 'up', icon: Calendar },
  { label: 'Note moyenne', value: '4.8', change: '+0.2', trend: 'up', icon: Star },
];

const chartData = [
  { month: 'Juil', value: 65 },
  { month: 'Août', value: 92 },
  { month: 'Sep', value: 78 },
  { month: 'Oct', value: 71 },
  { month: 'Nov', value: 58 },
  { month: 'Déc', value: 82 },
  { month: 'Jan', value: 87 },
];

const revenueData = [
  { month: 'Juil', value: 18500 },
  { month: 'Août', value: 28900 },
  { month: 'Sep', value: 22100 },
  { month: 'Oct', value: 19800 },
  { month: 'Nov', value: 15600 },
  { month: 'Déc', value: 21400 },
  { month: 'Jan', value: 24890 },
];

export function StatsPreview({ className }: { className?: string }) {
  const maxValue = Math.max(...chartData.map(d => d.value));
  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className={cn("bg-card rounded-2xl border border-border/50 shadow-elevated overflow-hidden", className)}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-status-error/60" />
          <div className="w-3 h-3 rounded-full bg-status-warning/60" />
          <div className="w-3 h-3 rounded-full bg-status-success/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">app.noe-conciergerie.com/stats</span>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Statistiques</h3>
        <p className="text-xs text-muted-foreground">Janvier 2026</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3 p-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-3 bg-muted/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div className={cn(
                  "flex items-center gap-0.5 text-2xs font-medium",
                  stat.trend === 'up' ? "text-status-success" : "text-status-error"
                )}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
              <p className="text-2xs text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        {/* Occupation chart */}
        <div className="p-3 bg-muted/30 rounded-xl">
          <p className="text-xs font-medium text-foreground mb-3">Taux d'occupation</p>
          <div className="flex items-end justify-between h-24 gap-1">
            {chartData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary rounded-t transition-all"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                />
                <span className="text-2xs text-muted-foreground">{item.month.slice(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue chart */}
        <div className="p-3 bg-muted/30 rounded-xl">
          <p className="text-xs font-medium text-foreground mb-3">Revenus</p>
          <div className="flex items-end justify-between h-24 gap-1">
            {revenueData.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-status-success rounded-t transition-all"
                  style={{ height: `${(item.value / maxRevenue) * 100}%` }}
                />
                <span className="text-2xs text-muted-foreground">{item.month.slice(0, 1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Properties */}
      <div className="px-4 pb-4">
        <div className="p-3 bg-muted/30 rounded-xl">
          <p className="text-xs font-medium text-foreground mb-2">Top propriétés</p>
          <div className="space-y-2">
            {[
              { name: 'Apt. Bellecour', revenue: '4 250€', occupation: '94%' },
              { name: 'Villa Presqu\'île', revenue: '3 890€', occupation: '89%' },
              { name: 'Studio Confluence', revenue: '2 150€', occupation: '82%' },
            ].map((prop, i) => (
              <div key={prop.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-2xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-xs text-foreground">{prop.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-status-success">{prop.revenue}</span>
                  <span className="text-2xs text-muted-foreground">{prop.occupation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
