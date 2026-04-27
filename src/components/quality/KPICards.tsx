import { QualityKPIs } from '@/types/quality';
import { Star, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardsProps {
  kpis: QualityKPIs;
}

type Tone = 'success' | 'warning' | 'error' | 'info';

const toneStyles: Record<Tone, { value: string; iconBg: string; icon: string }> = {
  success: {
    value: 'text-[hsl(var(--status-success))]',
    iconBg: 'bg-[hsl(var(--status-success)/0.12)]',
    icon: 'text-[hsl(var(--status-success))]',
  },
  warning: {
    value: 'text-[hsl(var(--status-warning))]',
    iconBg: 'bg-[hsl(var(--status-warning)/0.12)]',
    icon: 'text-[hsl(var(--status-warning))]',
  },
  error: {
    value: 'text-[hsl(var(--status-error))]',
    iconBg: 'bg-[hsl(var(--status-error)/0.12)]',
    icon: 'text-[hsl(var(--status-error))]',
  },
  info: {
    value: 'text-[hsl(var(--ios-orange))]',
    iconBg: 'bg-[hsl(var(--ios-orange)/0.10)]',
    icon: 'text-[hsl(var(--ios-orange))]',
  },
};

export function KPICards({ kpis }: KPICardsProps) {
  const ratingTone: Tone =
    kpis.average_rating_overall >= 4 ? 'success' : kpis.average_rating_overall >= 3 ? 'warning' : 'error';
  const repasseTone: Tone =
    kpis.repasse_rate <= 5 ? 'success' : kpis.repasse_rate <= 15 ? 'warning' : 'error';
  const issuesTone: Tone =
    kpis.issues_per_task <= 0.5 ? 'success' : kpis.issues_per_task <= 1 ? 'warning' : 'error';

  const cards = [
    {
      title: 'Note moyenne globale',
      value: kpis.average_rating_overall.toFixed(2),
      subtitle: `${kpis.average_rating_last_30_days.toFixed(2)} sur 30 jours`,
      icon: Star,
      tone: ratingTone,
    },
    {
      title: 'Taux de repasse',
      value: `${kpis.repasse_rate.toFixed(1)}%`,
      subtitle: 'Tâches nécessitant repasse',
      icon: AlertTriangle,
      tone: repasseTone,
    },
    {
      title: 'Problèmes par tâche',
      value: kpis.issues_per_task.toFixed(2),
      subtitle: 'Moyenne des signalements',
      icon: AlertCircle,
      tone: issuesTone,
    },
    {
      title: 'Tâches réalisées',
      value: kpis.tasks_completed.toString(),
      subtitle: 'Sur la période',
      icon: CheckCircle,
      tone: 'info' as Tone,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card) => {
        const s = toneStyles[card.tone];
        return (
          <div
            key={card.title}
            className="glass-surface rounded-2xl p-4 md:p-5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <p className="text-[12px] md:text-[13px] font-medium text-[hsl(240_6%_25%/0.6)] tracking-[-0.005em] truncate">
                  {card.title}
                </p>
                <p className={cn('text-[26px] md:text-[30px] font-semibold leading-none tracking-[-0.02em]', s.value)}>
                  {card.value}
                </p>
                <p className="text-[11px] md:text-[12px] text-[hsl(240_6%_25%/0.55)] tracking-[-0.005em]">
                  {card.subtitle}
                </p>
              </div>
              <div
                className={cn(
                  'h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center flex-shrink-0',
                  s.iconBg
                )}
              >
                <card.icon className={cn('h-4 w-4 md:h-[18px] md:w-[18px]', s.icon)} strokeWidth={2.2} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
