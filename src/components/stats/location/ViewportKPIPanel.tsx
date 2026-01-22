import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Euro, 
  Percent, 
  Moon, 
  CalendarDays, 
  AlertTriangle, 
  Building2,
  HelpCircle 
} from 'lucide-react';
import { ViewportKPIs } from '@/types/location';

interface ViewportKPIPanelProps {
  kpis: ViewportKPIs;
  isViewportFiltered?: boolean;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'EUR', 
    maximumFractionDigits: 0 
  }).format(value);
}

export function ViewportKPIPanel({ kpis, isViewportFiltered }: ViewportKPIPanelProps) {
  const kpiItems = [
    {
      label: 'Propriétés',
      value: kpis.propertyCount,
      icon: Building2,
      tooltip: 'Nombre de propriétés visibles sur la carte',
    },
    {
      label: 'CA Total',
      value: formatCurrency(kpis.totalRevenue),
      icon: Euro,
      tooltip: 'Chiffre d\'affaires cumulé des propriétés visibles',
    },
    {
      label: 'Occupation',
      value: `${kpis.occupancyRate.toFixed(1)}%`,
      icon: Percent,
      tooltip: 'Taux d\'occupation moyen des propriétés visibles',
    },
    {
      label: 'Nuits',
      value: kpis.bookedNights,
      icon: Moon,
      tooltip: 'Nuits réservées total',
    },
    {
      label: 'Réservations',
      value: kpis.reservations,
      icon: CalendarDays,
      tooltip: 'Nombre de réservations',
    },
    {
      label: 'Incidents',
      value: kpis.incidents,
      icon: AlertTriangle,
      tooltip: 'Nombre d\'incidents (ménage + maintenance)',
    },
  ];

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/30 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {isViewportFiltered ? 'Zone visible' : 'Toutes les propriétés'}
          </span>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">KPIs calculés pour les propriétés visibles sur la carte</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {kpiItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-default">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{item.value}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{item.label}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
