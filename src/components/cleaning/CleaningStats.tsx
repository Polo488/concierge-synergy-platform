import { Clock, Loader2, Flame, Calendar as CalendarIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';

type Tone = 'blue' | 'slate' | 'orange' | 'sky' | 'red' | 'green';

const TONE_STYLES: Record<Tone, { icon: string; iconBg: string; cardBg: string; cardBorder: string; value: string }> = {
  blue:   { icon: 'text-[hsl(213,84%,40%)]', iconBg: 'bg-[hsl(213,100%,95%)]', cardBg: 'bg-card', cardBorder: 'border-border', value: 'text-foreground' },
  slate:  { icon: 'text-muted-foreground', iconBg: 'bg-muted', cardBg: 'bg-card', cardBorder: 'border-border', value: 'text-foreground' },
  orange: { icon: 'text-primary', iconBg: 'bg-[hsl(21,100%,95%)]', cardBg: 'bg-[hsl(21,100%,98%)]', cardBorder: 'border-[hsl(21,100%,90%)]', value: 'text-primary' },
  sky:    { icon: 'text-[hsl(213,84%,40%)]', iconBg: 'bg-[hsl(213,100%,95%)]', cardBg: 'bg-card', cardBorder: 'border-border', value: 'text-foreground' },
  red:    { icon: 'text-[hsl(0,72%,50%)]', iconBg: 'bg-[hsl(0,86%,96%)]', cardBg: 'bg-[hsl(0,86%,98%)]', cardBorder: 'border-[hsl(0,86%,92%)]', value: 'text-[hsl(0,72%,50%)]' },
  green:  { icon: 'text-[hsl(142,71%,35%)]', iconBg: 'bg-[hsl(142,71%,93%)]', cardBg: 'bg-card', cardBorder: 'border-border', value: 'text-foreground' },
};

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone: Tone;
}

const KpiCard = ({ icon, label, value, tone }: KpiCardProps) => {
  const s = TONE_STYLES[tone];
  return (
    <div className={`rounded-2xl border ${s.cardBorder} ${s.cardBg} p-3.5 flex flex-col gap-2 min-w-0`}>
      <div className={`h-8 w-8 rounded-full ${s.iconBg} ${s.icon} flex items-center justify-center`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className={`text-[26px] font-bold leading-none tabular-nums ${s.value}`}>{value}</div>
        <div className="text-[12px] text-muted-foreground mt-1.5 truncate">{label}</div>
      </div>
    </div>
  );
};

export const CleaningStats = () => {
  const { todayCleaningTasks, tomorrowCleaningTasks, completedCleaningTasks } = useCleaning();

  const today = todayCleaningTasks.length;
  const inProgress = todayCleaningTasks.filter((t) => t.status === 'inProgress').length;
  const sameDay = todayCleaningTasks.filter((t) => t.isSameDayCheckin && t.status !== 'completed').length;
  const tomorrow = tomorrowCleaningTasks.length;
  // Mock "en retard" — pourrait être calculé sur l'heure d'arrivée vs maintenant
  const late = todayCleaningTasks.filter((t) => t.status === 'todo' && t.isSameDayCheckin).length > 4
    ? 4
    : todayCleaningTasks.filter((t) => t.status === 'todo' && t.isSameDayCheckin).length;
  const done = completedCleaningTasks.filter((t) => t.status === 'completed').length +
    todayCleaningTasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <KpiCard icon={<Clock className="h-4 w-4" />} label="Aujourd'hui" value={today} tone="blue" />
      <KpiCard icon={<Loader2 className="h-4 w-4" />} label="En cours" value={inProgress} tone="slate" />
      <KpiCard icon={<Flame className="h-4 w-4" />} label="Check-in jour J" value={sameDay} tone="orange" />
      <KpiCard icon={<CalendarIcon className="h-4 w-4" />} label="Demain" value={tomorrow} tone="sky" />
      <KpiCard icon={<AlertCircle className="h-4 w-4" />} label="En retard" value={late} tone="red" />
      <KpiCard icon={<CheckCircle2 className="h-4 w-4" />} label="Terminés" value={done} tone="green" />
    </div>
  );
};
