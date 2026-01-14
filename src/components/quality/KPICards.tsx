
import { Card, CardContent } from '@/components/ui/card';
import { QualityKPIs } from '@/types/quality';
import { Star, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  kpis: QualityKPIs;
}

export function KPICards({ kpis }: KPICardsProps) {
  const cards = [
    {
      title: 'Note moyenne globale',
      value: kpis.average_rating_overall.toFixed(2),
      subtitle: `${kpis.average_rating_last_30_days.toFixed(2)} sur 30j`,
      icon: Star,
      color: kpis.average_rating_overall >= 4 ? 'text-green-500' : kpis.average_rating_overall >= 3 ? 'text-yellow-500' : 'text-red-500',
      bgColor: kpis.average_rating_overall >= 4 ? 'bg-green-500/10' : kpis.average_rating_overall >= 3 ? 'bg-yellow-500/10' : 'bg-red-500/10',
    },
    {
      title: 'Taux de repasse',
      value: `${kpis.repasse_rate.toFixed(1)}%`,
      subtitle: 'Tâches nécessitant repasse',
      icon: AlertTriangle,
      color: kpis.repasse_rate <= 5 ? 'text-green-500' : kpis.repasse_rate <= 15 ? 'text-yellow-500' : 'text-red-500',
      bgColor: kpis.repasse_rate <= 5 ? 'bg-green-500/10' : kpis.repasse_rate <= 15 ? 'bg-yellow-500/10' : 'bg-red-500/10',
    },
    {
      title: 'Problèmes par tâche',
      value: kpis.issues_per_task.toFixed(2),
      subtitle: 'Moyenne des signalements',
      icon: AlertCircle,
      color: kpis.issues_per_task <= 0.5 ? 'text-green-500' : kpis.issues_per_task <= 1 ? 'text-yellow-500' : 'text-red-500',
      bgColor: kpis.issues_per_task <= 0.5 ? 'bg-green-500/10' : kpis.issues_per_task <= 1 ? 'bg-yellow-500/10' : 'bg-red-500/10',
    },
    {
      title: 'Tâches réalisées',
      value: kpis.tasks_completed.toString(),
      subtitle: 'Sur la période',
      icon: CheckCircle,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className={cn("text-2xl font-bold", card.color)}>{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className={cn("p-2 rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-5 w-5", card.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
