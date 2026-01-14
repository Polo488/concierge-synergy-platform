
import { Card, CardContent } from '@/components/ui/card';
import { QualityKPIs } from '@/types/quality';
import { 
  Star, 
  RefreshCw, 
  Clock, 
  Timer, 
  AlertTriangle, 
  Camera, 
  CheckCircle2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  kpis: QualityKPIs;
}

export function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      title: 'Note moyenne',
      value: kpis.average_rating_overall.toFixed(1),
      subtitle: `30j: ${kpis.average_rating_last_30_days.toFixed(1)}`,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      trend: kpis.average_rating_last_30_days > kpis.average_rating_overall ? 'up' : 'down',
    },
    {
      title: 'Taux de reprise',
      value: `${kpis.rework_rate.toFixed(1)}%`,
      subtitle: 'Nettoyages à refaire',
      icon: RefreshCw,
      color: kpis.rework_rate > 10 ? 'text-red-500' : 'text-green-500',
      bgColor: kpis.rework_rate > 10 ? 'bg-red-500/10' : 'bg-green-500/10',
      trend: kpis.rework_rate > 10 ? 'down' : 'up',
    },
    {
      title: 'Ponctualité',
      value: `${kpis.on_time_rate.toFixed(1)}%`,
      subtitle: 'À l\'heure',
      icon: Clock,
      color: kpis.on_time_rate >= 90 ? 'text-green-500' : 'text-orange-500',
      bgColor: kpis.on_time_rate >= 90 ? 'bg-green-500/10' : 'bg-orange-500/10',
      trend: kpis.on_time_rate >= 90 ? 'up' : 'down',
    },
    {
      title: 'Durée moyenne',
      value: `${Math.round(kpis.average_cleaning_duration_minutes)} min`,
      subtitle: `Écart: ±${Math.round(kpis.average_variance_minutes)} min`,
      icon: Timer,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Problèmes/tâche',
      value: kpis.issues_per_task.toFixed(2),
      subtitle: 'Moyenne par nettoyage',
      icon: AlertTriangle,
      color: kpis.issues_per_task > 1 ? 'text-red-500' : 'text-green-500',
      bgColor: kpis.issues_per_task > 1 ? 'bg-red-500/10' : 'bg-green-500/10',
    },
    {
      title: 'Photos conformes',
      value: `${kpis.photo_compliance_rate.toFixed(0)}%`,
      subtitle: 'Tâches avec photos',
      icon: Camera,
      color: kpis.photo_compliance_rate >= 80 ? 'text-green-500' : 'text-orange-500',
      bgColor: kpis.photo_compliance_rate >= 80 ? 'bg-green-500/10' : 'bg-orange-500/10',
    },
    {
      title: 'Tâches réalisées',
      value: kpis.tasks_completed.toString(),
      subtitle: 'Sur la période',
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardContent className="p-4">
            <div className={cn("absolute top-3 right-3 p-2 rounded-full", card.bgColor)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">{card.title}</p>
              <div className="flex items-baseline gap-1">
                <p className={cn("text-2xl font-bold", card.color)}>{card.value}</p>
                {card.trend && (
                  card.trend === 'up' 
                    ? <TrendingUp className="h-4 w-4 text-green-500" />
                    : <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
