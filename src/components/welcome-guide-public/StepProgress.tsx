import { cn } from '@/lib/utils';

interface StepProgressProps {
  total: number;
  current: number;
  completedIds: string[];
  stepIds: string[];
}

const StepProgress = ({ total, current, completedIds, stepIds }: StepProgressProps) => (
  <div className="px-6 pt-6 pb-2">
    <div className="flex items-center gap-1.5">
      {stepIds.map((id, i) => (
        <div
          key={id}
          className={cn(
            'h-[3px] rounded-full flex-1 transition-all duration-700 ease-out',
            completedIds.includes(id)
              ? 'bg-emerald-400'
              : i === current
                ? 'bg-emerald-400/40'
                : 'bg-white/10'
          )}
        />
      ))}
    </div>
    <p className="text-[10px] text-white/40 text-center mt-2.5 font-semibold tracking-[0.15em] uppercase">
      Étape {current + 1} sur {total}
    </p>
  </div>
);

export default StepProgress;
