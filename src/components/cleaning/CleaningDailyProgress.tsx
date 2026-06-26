import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useCleaning } from '@/contexts/cleaning/CleaningContext';

export const CleaningDailyProgress = () => {
  const { todayCleaningTasks } = useCleaning();

  const stats = useMemo(() => {
    const total = todayCleaningTasks.length;
    const done = todayCleaningTasks.filter((t) => t.status === 'completed').length;
    const sameDay = todayCleaningTasks.filter((t) => t.isSameDayCheckin && t.status !== 'completed').length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, sameDay, pct };
  }, [todayCleaningTasks]);

  const barColor =
    stats.pct >= 80
      ? 'bg-[hsl(142,71%,35%)]'
      : stats.pct >= 50
      ? 'bg-[hsl(45,93%,55%)]'
      : 'bg-primary';

  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            Progression du jour
          </span>
          <span className="text-[20px] font-bold text-foreground tabular-nums leading-none">
            {stats.done}
          </span>
          <span className="text-[13px] text-muted-foreground">
            / {stats.total} ménages effectués
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          {stats.sameDay > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(21,100%,95%)] text-primary px-2.5 py-1 text-[11px] font-bold">
              <Flame className="h-3 w-3" />
              {stats.sameDay} check-in J
            </span>
          )}
          <span className="text-[13px] font-bold text-foreground tabular-nums">{stats.pct}%</span>
        </div>
      </div>
      <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${stats.pct}%` }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </div>
  );
};
