import { Card, CardContent } from '@/components/ui/card';
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
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface OverviewKPI {
  label: string;
  value: string | number;
  change?: number;
  tooltip: string;
  icon: React.ElementType;
}

interface StatsOverviewProps {
  activityKpis: {
    reservations: number;
    reservationsChange: number;
    nightsBooked: number;
    nightsBookedChange: number;
    occupancyRate: number;
    occupancyRateChange: number;
    avgStayDuration: number;
    avgStayDurationChange: number;
    avgBookingWindow: number;
    avgBookingWindowChange: number;
  };
  revenueKpis: {
    monthlyRevenue: number;
    monthlyRevenueChange: number;
    avgRevenuePerStay: number;
    avgRevenuePerStayChange: number;
    avgRevenuePerNight: number;
    avgRevenuePerNightChange: number;
    revpar: number;
    revparChange: number;
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

function KPICard({ kpi, valueType }: { kpi: OverviewKPI; valueType: 'number' | 'percent' | 'currency' | 'rating' | 'days' }) {
  const Icon = kpi.icon;
  const hasChange = kpi.change !== undefined && !isNaN(kpi.change);
  const isPositive = hasChange && kpi.change > 0;
  const isNegative = hasChange && kpi.change < 0;
  
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/30 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground">
                  <HelpCircle className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
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
        </div>
        
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight">
            {typeof kpi.value === 'number' ? formatValue(kpi.value, valueType) : kpi.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function KPISection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {children}
      </div>
    </div>
  );
}

export function StatsOverview({ activityKpis, revenueKpis, operationsKpis }: StatsOverviewProps) {
  const activityCards: { kpi: OverviewKPI; valueType: 'number' | 'percent' | 'currency' | 'rating' | 'days' }[] = [
    {
      kpi: {
        label: 'Réservations',
        value: activityKpis.reservations,
        change: activityKpis.reservationsChange,
        tooltip: 'Nombre total de réservations pour le mois en cours',
        icon: CalendarDays
      },
      valueType: 'number'
    },
    {
      kpi: {
        label: 'Nuits réservées',
        value: activityKpis.nightsBooked,
        change: activityKpis.nightsBookedChange,
        tooltip: 'Nombre total de nuits réservées ce mois',
        icon: Moon
      },
      valueType: 'number'
    },
    {
      kpi: {
        label: "Taux d'occupation",
        value: activityKpis.occupancyRate,
        change: activityKpis.occupancyRateChange,
        tooltip: 'Pourcentage de nuits occupées par rapport aux nuits disponibles',
        icon: Percent
      },
      valueType: 'percent'
    },
    {
      kpi: {
        label: 'Durée moy. séjour',
        value: activityKpis.avgStayDuration,
        change: activityKpis.avgStayDurationChange,
        tooltip: 'Durée moyenne des séjours en jours',
        icon: Clock
      },
      valueType: 'days'
    },
    {
      kpi: {
        label: 'Fenêtre résa. moy.',
        value: activityKpis.avgBookingWindow,
        change: activityKpis.avgBookingWindowChange,
        tooltip: 'Délai moyen entre la réservation et l\'arrivée',
        icon: Calendar
      },
      valueType: 'days'
    }
  ];

  const revenueCards: { kpi: OverviewKPI; valueType: 'number' | 'percent' | 'currency' | 'rating' | 'days' }[] = [
    {
      kpi: {
        label: 'CA du mois',
        value: revenueKpis.monthlyRevenue,
        change: revenueKpis.monthlyRevenueChange,
        tooltip: 'Chiffre d\'affaires total généré ce mois',
        icon: Euro
      },
      valueType: 'currency'
    },
    {
      kpi: {
        label: 'Revenu moy. / séjour',
        value: revenueKpis.avgRevenuePerStay,
        change: revenueKpis.avgRevenuePerStayChange,
        tooltip: 'Revenu moyen par réservation',
        icon: Bed
      },
      valueType: 'currency'
    },
    {
      kpi: {
        label: 'Revenu moy. / nuit',
        value: revenueKpis.avgRevenuePerNight,
        change: revenueKpis.avgRevenuePerNightChange,
        tooltip: 'Revenu moyen par nuit réservée (ADR)',
        icon: TrendingUp
      },
      valueType: 'currency'
    },
    {
      kpi: {
        label: 'RevPAR',
        value: revenueKpis.revpar,
        change: revenueKpis.revparChange,
        tooltip: 'Revenu par nuit disponible = Taux occupation × ADR',
        icon: BarChart3
      },
      valueType: 'currency'
    }
  ];

  const operationsCards: { kpi: OverviewKPI; valueType: 'number' | 'percent' | 'currency' | 'rating' | 'days' }[] = [
    {
      kpi: {
        label: 'Ménages effectués',
        value: operationsKpis.cleaningsCount,
        change: operationsKpis.cleaningsCountChange,
        tooltip: 'Nombre de ménages réalisés ce mois',
        icon: Sparkles
      },
      valueType: 'number'
    },
    {
      kpi: {
        label: 'Taux de repasse',
        value: operationsKpis.repasseRate,
        change: operationsKpis.repasseRateChange,
        tooltip: 'Pourcentage de ménages ayant nécessité une repasse',
        icon: AlertTriangle
      },
      valueType: 'percent'
    },
    {
      kpi: {
        label: 'Note ménage moy.',
        value: operationsKpis.avgCleaningRating,
        change: operationsKpis.avgCleaningRatingChange,
        tooltip: 'Note moyenne attribuée aux ménages (sur 5)',
        icon: BarChart3
      },
      valueType: 'rating'
    },
    {
      kpi: {
        label: 'Incidents',
        value: operationsKpis.incidentsCount,
        change: operationsKpis.incidentsCountChange,
        tooltip: 'Nombre d\'incidents ménage et maintenance ce mois',
        icon: Wrench
      },
      valueType: 'number'
    }
  ];

  return (
    <div className="space-y-6" data-tutorial="stats-overview">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Snapshot mensuel</h2>
          <p className="text-sm text-muted-foreground">Vision instantanée du mois en cours</p>
        </div>
      </div>

      <KPISection title="Activité">
        {activityCards.map((card, idx) => (
          <KPICard key={idx} kpi={card.kpi} valueType={card.valueType} />
        ))}
      </KPISection>

      <KPISection title="Revenus">
        {revenueCards.map((card, idx) => (
          <KPICard key={idx} kpi={card.kpi} valueType={card.valueType} />
        ))}
      </KPISection>

      <KPISection title="Opérations">
        {operationsCards.map((card, idx) => (
          <KPICard key={idx} kpi={card.kpi} valueType={card.valueType} />
        ))}
      </KPISection>
    </div>
  );
}
