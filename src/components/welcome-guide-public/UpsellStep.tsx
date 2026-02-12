import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Upsell {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

interface UpsellStepProps {
  upsells: Upsell[];
  acceptedIds: string[];
  onToggle: (id: string) => void;
  validationLabel: string;
  animating: boolean;
  onValidate: () => void;
}

const UpsellStep = ({
  upsells,
  acceptedIds,
  onToggle,
  validationLabel,
  animating,
  onValidate,
}: UpsellStepProps) => (
  <div
    className={cn(
      'flex-1 flex flex-col transition-all duration-600 ease-out',
      animating ? 'opacity-0 scale-[0.97] translate-y-8' : 'opacity-100 scale-100 translate-y-0'
    )}
  >
    <div className="mt-4 mb-2 flex items-center gap-2">
      <Sparkles size={18} className="text-amber-400" />
      <h1 className="text-xl font-bold text-white tracking-tight">
        Envie de plus de confort ?
      </h1>
    </div>
    <p className="text-sm text-white/40 mb-5">
      Sélectionnez les options qui vous intéressent
    </p>

    <div className="space-y-3 flex-1">
      {upsells.map((u) => {
        const accepted = acceptedIds.includes(u.id);
        return (
          <button
            key={u.id}
            onClick={() => onToggle(u.id)}
            className={cn(
              'w-full p-4 rounded-2xl text-left transition-all duration-300 border backdrop-blur-2xl',
              accepted
                ? 'bg-emerald-500/12 border-emerald-400/25 shadow-lg shadow-emerald-500/5'
                : 'bg-white/6 border-white/10 hover:bg-white/10'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-3">
                <p className="text-sm font-semibold text-white">{u.name}</p>
                <p className="text-xs text-white/40 mt-0.5">{u.description}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold text-white">
                  {u.price}
                  {u.currency}
                </span>
                <div
                  className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300',
                    accepted
                      ? 'bg-emerald-500 scale-110'
                      : 'bg-white/10 border border-white/20'
                  )}
                >
                  {accepted && <Check size={14} className="text-white" />}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>

    {/* CTA */}
    <div className="mt-auto pt-6">
      <button
        onClick={onValidate}
        className="w-full h-14 rounded-2xl bg-white text-slate-900 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-2xl shadow-white/10"
      >
        {validationLabel}
        <ChevronRight size={18} />
      </button>
      <button
        onClick={onValidate}
        className="w-full text-center mt-3 text-sm text-white/30 font-medium"
      >
        Passer
      </button>
    </div>
  </div>
);

export default UpsellStep;
