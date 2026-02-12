import { cn } from '@/lib/utils';

interface StepProgressProps {
  total: number;
  current: number;
  completedIds: string[];
  stepIds: string[];
}

const StepProgress = ({ total, current, completedIds, stepIds }: StepProgressProps) => (
  <div className="px-5 pt-5 pb-1">
    {/* Pill progress bar */}
    <div className="flex items-center gap-1">
      {stepIds.map((id, i) => {
        const done = completedIds.includes(id);
        const active = i === current;
        return (
          <div
            key={id}
            className="relative flex-1 h-[3px] rounded-full overflow-hidden bg-white/[0.06]"
          >
            <div
              className={cn(
                'absolute inset-0 rounded-full transition-all duration-700 ease-out origin-left',
                done
                  ? 'scale-x-100 bg-gradient-to-r from-emerald-400 to-emerald-300'
                  : active
                    ? 'scale-x-50 bg-emerald-400/50'
                    : 'scale-x-0'
              )}
            />
          </div>
        );
      })}
    </div>
    <div className="flex items-center justify-between mt-2.5 px-0.5">
      <p className="text-[10px] text-white/25 font-medium tracking-wider uppercase">
        Étape {current + 1}/{total}
      </p>
      <p className="text-[10px] text-white/25 font-medium">
        {Math.round(((completedIds.length) / total) * 100)}%
      </p>
    </div>
  </div>
);

export default StepProgress;
