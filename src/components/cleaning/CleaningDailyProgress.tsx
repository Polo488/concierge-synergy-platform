import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export const CleaningDailyProgress = () => {
  const { todayCleaningTasks } = useCleaning();
  const [open, setOpen] = useState(false);

  const stats = useMemo(() => {
    const total = todayCleaningTasks.length;
    const done = todayCleaningTasks.filter((t) => t.status === 'completed').length;
    const inProgress = todayCleaningTasks.filter((t) => t.status === 'inProgress').length;
    const todo = todayCleaningTasks.filter((t) => t.status === 'todo' || t.status === 'scheduled').length;
    const sameDay = todayCleaningTasks.filter((t) => t.isSameDayCheckin && t.status !== 'completed').length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, todo, sameDay, pct };
  }, [todayCleaningTasks]);

  const colorClass =
    stats.pct >= 80
      ? 'bg-[hsl(142,76%,36%)]'
      : stats.pct >= 50
      ? 'bg-[hsl(45,93%,55%)]'
      : 'bg-[hsl(21,100%,53%)]';

  const labelColor =
    stats.pct >= 80 ? 'text-[hsl(142,76%,30%)]' : stats.pct >= 50 ? 'text-[hsl(38,92%,30%)]' : 'text-primary';

  return (
    <div className="sticky top-0 z-20 -mx-1 px-1 pt-1 pb-2 bg-background/80 backdrop-blur-md">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full text-left rounded-2xl border border-border bg-card shadow-sm px-4 py-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className={`h-4 w-4 ${labelColor} flex-shrink-0`} />
                <span className="text-[13px] font-semibold text-foreground truncate">
                  {stats.done} / {stats.total} ménages effectués aujourd'hui
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {stats.sameDay > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(21,100%,95%)] text-primary px-2 py-0.5 text-[11px] font-bold">
                    <Flame className="h-3 w-3" />
                    {stats.sameDay} check-in J
                  </span>
                )}
                <span className={`text-[13px] font-bold ${labelColor}`}>{stats.pct}%</span>
              </div>
            </div>
            <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className={`h-full ${colorClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${stats.pct}%` }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-3" align="end">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            Détail journée
          </p>
          <div className="space-y-2">
            <Row icon={<CheckCircle2 className="h-3.5 w-3.5 text-[hsl(142,76%,36%)]" />} label="Effectués" value={stats.done} />
            <Row icon={<Loader2 className="h-3.5 w-3.5 text-[hsl(213,84%,40%)]" />} label="En cours" value={stats.inProgress} />
            <Row icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />} label="Restants" value={stats.todo} />
            <div className="border-t border-border my-2" />
            <Row
              icon={<Flame className="h-3.5 w-3.5 text-primary" />}
              label="Dont check-in jour J"
              value={stats.sameDay}
              highlight
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

const Row = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2 min-w-0">
      {icon}
      <span className={`text-[13px] ${highlight ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{label}</span>
    </div>
    <span className={`text-[13px] tabular-nums ${highlight ? 'font-bold text-primary' : 'font-semibold text-foreground'}`}>{value}</span>
  </div>
);
