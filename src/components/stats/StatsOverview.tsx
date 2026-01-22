import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  CalendarDays, 
  Moon, 
  Percent, 
  Clock, 
  Calendar,
  Euro,
  TrendingUp,
  TrendingDown,
  Bed,
  BarChart3,
  Sparkles,
  AlertTriangle,
  Wrench,
  HelpCircle,
  CheckCircle,
  XCircle,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SparklinePoint {
  day: string;
  value: number;
}

interface OverviewKPI {
  label: string;
  value: string | number;
  change?: number;
  tooltip: string;
  icon: React.ElementType;
  isPriority?: boolean;
  sparklineData?: SparklinePoint[];
}

interface StatsOverviewProps {
  activityKpis: {
    reservations: number;
    reservationsChange: number;
    reservationsTrend: SparklinePoint[];
    nightsBooked: number;
    nightsBookedChange: number;
    occupancyRate: number;
    occupancyRateChange: number;
    occupancyTrend: SparklinePoint[];
    avgStayDuration: number;
    avgStayDurationChange: number;
    avgBookingWindow: number;
    avgBookingWindowChange: number;
  };
  revenueKpis: {
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    revenueTrend: SparklinePoint[];
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    avgRevenuePerNight: number;
    avgRevenuePerNightChange: number;
    revpar: number;
    revparChange: number;
    revparTrend: SparklinePoint[];
  };
  operationsKpis: {
    cleaningsCount: number;
    cleaningsCountChange: number;
    repasseRate: number;
    repasseRateChange: number;
    avgCleaningRating: number;
    avgCleaningRatingChange: number;
    incidentsCount: number;
    incidentsCountChange: number;
  };
  monthlyComparison: {
    currentMonth: {
      revenue: number;
      occupancy: number;
      reservations: number;
      adr: number;
      revpar: number;
      cleanings: number;
    };
    previousMonth: {
      revenue: number;
      occupancy: number;
      reservations: number;
      adr: number;
      revpar: number;
      cleanings: number;
    };
  };
}

function formatValue(value: number, type: 'number' | 'percent' | 'currency' | 'rating' | 'days'): string {
  if (value === null || value === undefined || isNaN(value)) return '-';
  
  switch (type) {
    case 'currency':
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'rating':
      return value.toFixed(1);
    case 'days':
      return `${value.toFixed(1)}j`;
    default:
      return value.toLocaleString('fr-FR');
  }
}

// Performance status based on change
type PerformanceStatus = 'good' | 'warning' | 'risk' | 'neutral';

function getPerformanceStatus(change: number | undefined, inverse: boolean = false): PerformanceStatus {
  if (change === undefined || isNaN(change)) return 'neutral';
  const threshold = inverse ? -change : change;
  if (threshold >= 5) return 'good';
  if (threshold >= -5) return 'neutral';
  if (threshold >= -15) return 'warning';
  return 'risk';
}

function PerformanceIndicator({ status }: { status: PerformanceStatus }) {
  const config = {
    good: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-500/10', label: 'Performant' },
    warning: { icon: Minus, color: 'text-amber-600', bg: 'bg-amber-500/10', label: 'À surveiller' },
    risk: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-500/10', label: 'Sous-performant' },
    neutral: { icon: Minus, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Stable' }
  };
  
  const { icon: Icon, color, bg, label } = config[status];
  
  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full", bg, color)}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}

function Sparkline({ data, color }: { data: SparklinePoint[]; color: string }) {
  return (
    <div className="h-12 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkline-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#sparkline-gradient-${color})`}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function PriorityKPICard({ kpi, valueType }: { kpi: OverviewKPI; valueType: 'number' | 'percent' | 'currency' | 'rating' | 'days' }) {
  const Icon = kpi.icon;
  const hasChange = kpi.change !== undefined && !isNaN(kpi.change);
  const isPositive = hasChange && kpi.change > 0;
  const isNegative = hasChange && kpi.change < 0;
  
  // Determine sparkline color based on trend
  const sparklineColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280';
  
  return (
    <Card className="bg-gradient-to-br from-card to-card/80 border-border/50 hover:shadow-lg transition-all hover:scale-[1.01] overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            {hasChange && (
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                isPositive && "bg-emerald-500/10 text-emerald-600",
                isNegative && "bg-red-500/10 text-red-600",
                !isPositive && !isNegative && "bg-muted text-muted-foreground"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : null}
                {isPositive && '+'}{kpi.change.toFixed(1)}%
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <p className="text-3xl font-bold tracking-tight">
          {typeof kpi.value === 'number' ? formatValue(kpi.value, valueType) : kpi.value}
        </p>
        <p className="text-sm text-muted-foreground">{kpi.label}</p>
        
        {kpi.sparklineData && kpi.sparklineData.length > 0 && (
          <div className="mt-1">
            <Sparkline data={kpi.sparklineData} color={sparklineColor} />
            <p className="text-[10px] text-muted-foreground text-right mt-0.5">7 derniers jours</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SecondaryKPICard({ kpi, valueType }: { kpi: OverviewKPI; valueType: 'number' | 'percent' | 'currency' | 'rating' | 'days' }) {
  const Icon = kpi.icon;
  const hasChange = kpi.change !== undefined && !isNaN(kpi.change);
  const isPositive = hasChange && kpi.change > 0;
  const isNegative = hasChange && kpi.change < 0;
  
  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-background">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {typeof kpi.value === 'number' ? formatValue(kpi.value, valueType) : kpi.value}
          </p>
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {hasChange && (
          <span className={cn(
            "text-xs font-medium",
            isPositive && "text-emerald-600",
            isNegative && "text-red-600",
            !isPositive && !isNegative && "text-muted-foreground"
          )}>
            {isPositive && '+'}{kpi.change.toFixed(1)}%
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground/50 hover:text-muted-foreground">
              <HelpCircle className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">{kpi.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

interface ComparisonMetric {
  label: string;
  current: number;
  previous: number;
  format: 'currency' | 'percent' | 'number';
  icon: React.ElementType;
}

function ComparisonBar({ metric }: { metric: ComparisonMetric }) {
  const Icon = metric.icon;
  const change = metric.previous > 0 ? ((metric.current - metric.previous) / metric.previous) * 100 : 0;
  const isPositive = change > 0;
  const isNegative = change < 0;
  
  // Calculate percentage for progress bars (relative to max of both values)
  const maxValue = Math.max(metric.current, metric.previous);
  const currentPercent = maxValue > 0 ? (metric.current / maxValue) * 100 : 0;
  const previousPercent = maxValue > 0 ? (metric.previous / maxValue) * 100 : 0;
  
  const formatMetricValue = (value: number) => {
    if (metric.format === 'currency') {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
    }
    if (metric.format === 'percent') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString('fr-FR');
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{metric.label}</span>
        </div>
        <div className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          isPositive && "bg-emerald-500/10 text-emerald-600",
          isNegative && "bg-red-500/10 text-red-600",
          !isPositive && !isNegative && "bg-muted text-muted-foreground"
        )}>
          {isPositive && '+'}{change.toFixed(1)}%
        </div>
      </div>
      
      <div className="space-y-1.5">
        {/* Current month bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20">Ce mois</span>
          <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
          <span className="text-sm font-medium w-24 text-right">{formatMetricValue(metric.current)}</span>
        </div>
        
        {/* Previous month bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-20">Mois préc.</span>
          <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-muted-foreground/40 rounded-full transition-all duration-500"
              style={{ width: `${previousPercent}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground w-24 text-right">{formatMetricValue(metric.previous)}</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, icon: Icon, status }: { title: string; icon: React.ElementType; status?: PerformanceStatus }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      </div>
      {status && <PerformanceIndicator status={status} />}
    </div>
  );
}

export function StatsOverview({ activityKpis, revenueKpis, operationsKpis, monthlyComparison }: StatsOverviewProps) {
  // Calculate overall performance status
  const overallStatus = getPerformanceStatus(
    (revenueKpis.monthlyRevenueChange + activityKpis.occupancyRateChange + revenueKpis.revparChange) / 3
  );
  
  const financeStatus = getPerformanceStatus(
    (revenueKpis.monthlyRevenueChange + revenueKpis.revparChange) / 2
  );
  
  const operationsStatus = getPerformanceStatus(
    operationsKpis.repasseRateChange,
    true // Inverse: lower repasse rate is better
  );

  // Priority KPIs for instant understanding
  const priorityKpis = [
    {
      kpi: {
        label: 'Réservations ce mois',
        value: activityKpis.reservations,
        change: activityKpis.reservationsChange,
        tooltip: 'Nombre total de réservations pour le mois en cours',
        icon: CalendarDays,
        isPriority: true,
        sparklineData: activityKpis.reservationsTrend
      },
      valueType: 'number' as const
    },
    {
      kpi: {
        label: "Taux d'occupation",
        value: activityKpis.occupancyRate,
        change: activityKpis.occupancyRateChange,
        tooltip: 'Pourcentage de nuits occupées par rapport aux nuits disponibles',
        icon: Percent,
        isPriority: true,
        sparklineData: activityKpis.occupancyTrend
      },
      valueType: 'percent' as const
    },
    {
      kpi: {
        label: 'Chiffre d\'affaires',
        value: revenueKpis.monthlyRevenue,
        change: revenueKpis.monthlyRevenueChange,
        tooltip: 'Chiffre d\'affaires total généré ce mois',
        icon: Euro,
        isPriority: true,
        sparklineData: revenueKpis.revenueTrend
      },
      valueType: 'currency' as const
    },
    {
      kpi: {
        label: 'RevPAR',
        value: revenueKpis.revpar,
        change: revenueKpis.revparChange,
        tooltip: 'Revenu par nuit disponible = Taux occupation × ADR',
        icon: BarChart3,
        isPriority: true,
        sparklineData: revenueKpis.revparTrend
      },
      valueType: 'currency' as const
    }
  ];

  // Secondary activity KPIs
  const secondaryActivityKpis = [
    {
      kpi: {
        label: 'Nuits réservées',
        value: activityKpis.nightsBooked,
        change: activityKpis.nightsBookedChange,
        tooltip: 'Nombre total de nuits réservées ce mois',
        icon: Moon
      },
      valueType: 'number' as const
    },
    {
      kpi: {
        label: 'Durée moy. séjour',
        value: activityKpis.avgStayDuration,
        change: activityKpis.avgStayDurationChange,
        tooltip: 'Durée moyenne des séjours en jours',
        icon: Clock
      },
      valueType: 'days' as const
    },
    {
      kpi: {
        label: 'Fenêtre résa. moy.',
        value: activityKpis.avgBookingWindow,
        change: activityKpis.avgBookingWindowChange,
        tooltip: 'Délai moyen entre la réservation et l\'arrivée',
        icon: Calendar
      },
      valueType: 'days' as const
    }
  ];

  // Secondary revenue KPIs
  const secondaryRevenueKpis = [
    {
      kpi: {
        label: 'Revenu moy. / séjour',
        value: revenueKpis.avgRevenuePerStay,
        change: revenueKpis.avgRevenuePerStayChange,
        tooltip: 'Revenu moyen par réservation',
        icon: Bed
      },
      valueType: 'currency' as const
    },
    {
      kpi: {
        label: 'ADR (Revenu moy. / nuit)',
        value: revenueKpis.avgRevenuePerNight,
        change: revenueKpis.avgRevenuePerNightChange,
        tooltip: 'Average Daily Rate - Revenu moyen par nuit réservée',
        icon: TrendingUp
      },
      valueType: 'currency' as const
    }
  ];

  // Operations KPIs
  const operationsKpisList = [
    {
      kpi: {
        label: 'Ménages effectués',
        value: operationsKpis.cleaningsCount,
        change: operationsKpis.cleaningsCountChange,
        tooltip: 'Nombre de ménages réalisés ce mois',
        icon: Sparkles
      },
      valueType: 'number' as const
    },
    {
      kpi: {
        label: 'Taux de repasse',
        value: operationsKpis.repasseRate,
        change: operationsKpis.repasseRateChange,
        tooltip: 'Pourcentage de ménages ayant nécessité une repasse (négatif = amélioration)',
        icon: AlertTriangle
      },
      valueType: 'percent' as const
    },
    {
      kpi: {
        label: 'Note ménage moy.',
        value: operationsKpis.avgCleaningRating,
        change: operationsKpis.avgCleaningRatingChange,
        tooltip: 'Note moyenne attribuée aux ménages (sur 5)',
        icon: BarChart3
      },
      valueType: 'rating' as const
    },
    {
      kpi: {
        label: 'Incidents',
        value: operationsKpis.incidentsCount,
        change: operationsKpis.incidentsCountChange,
        tooltip: 'Nombre d\'incidents ménage et maintenance ce mois (négatif = amélioration)',
        icon: Wrench
      },
      valueType: 'number' as const
    }
  ];

  return (
    <div className="space-y-8" data-tutorial="stats-overview">
      {/* Header with overall status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Ce mois-ci</h2>
          <p className="text-sm text-muted-foreground">Snapshot instantané de votre performance</p>
        </div>
        <PerformanceIndicator status={overallStatus} />
      </div>

      {/* Priority KPIs - Top 4 for instant understanding */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {priorityKpis.map((item, idx) => (
          <PriorityKPICard key={idx} kpi={item.kpi} valueType={item.valueType} />
        ))}
      </div>

      {/* Detailed sections in 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <SectionHeader title="Activité" icon={CalendarDays} />
          </CardHeader>
          <CardContent className="space-y-2">
            {secondaryActivityKpis.map((item, idx) => (
              <SecondaryKPICard key={idx} kpi={item.kpi} valueType={item.valueType} />
            ))}
          </CardContent>
        </Card>

        {/* Revenue Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <SectionHeader title="Revenus" icon={Euro} status={financeStatus} />
          </CardHeader>
          <CardContent className="space-y-2">
            {secondaryRevenueKpis.map((item, idx) => (
              <SecondaryKPICard key={idx} kpi={item.kpi} valueType={item.valueType} />
            ))}
          </CardContent>
        </Card>

        {/* Operations Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/30">
          <CardHeader className="pb-2">
            <SectionHeader title="Opérations" icon={Sparkles} status={operationsStatus} />
          </CardHeader>
          <CardContent className="space-y-2">
            {operationsKpisList.map((item, idx) => (
              <SecondaryKPICard key={idx} kpi={item.kpi} valueType={item.valueType} />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison Section */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/30">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Comparaison mensuelle
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Performance du mois en cours vs mois précédent
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComparisonBar
              metric={{
                label: 'Chiffre d\'affaires',
                current: monthlyComparison.currentMonth.revenue,
                previous: monthlyComparison.previousMonth.revenue,
                format: 'currency',
                icon: Euro
              }}
            />
            <ComparisonBar
              metric={{
                label: 'Taux d\'occupation',
                current: monthlyComparison.currentMonth.occupancy,
                previous: monthlyComparison.previousMonth.occupancy,
                format: 'percent',
                icon: Percent
              }}
            />
            <ComparisonBar
              metric={{
                label: 'Réservations',
                current: monthlyComparison.currentMonth.reservations,
                previous: monthlyComparison.previousMonth.reservations,
                format: 'number',
                icon: CalendarDays
              }}
            />
            <ComparisonBar
              metric={{
                label: 'ADR',
                current: monthlyComparison.currentMonth.adr,
                previous: monthlyComparison.previousMonth.adr,
                format: 'currency',
                icon: Bed
              }}
            />
            <ComparisonBar
              metric={{
                label: 'RevPAR',
                current: monthlyComparison.currentMonth.revpar,
                previous: monthlyComparison.previousMonth.revpar,
                format: 'currency',
                icon: BarChart3
              }}
            />
            <ComparisonBar
              metric={{
                label: 'Ménages',
                current: monthlyComparison.currentMonth.cleanings,
                previous: monthlyComparison.previousMonth.cleanings,
                format: 'number',
                icon: Sparkles
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
