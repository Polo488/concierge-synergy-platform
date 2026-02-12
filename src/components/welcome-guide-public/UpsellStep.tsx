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
}: UpsellStepProps) => {
  const total = acceptedIds.reduce((sum, id) => {
    const u = upsells.find((x) => x.id === id);
    return sum + (u?.price ?? 0);
  }, 0);

  return (
    <div
      className={cn(
        'flex-1 flex flex-col transition-all duration-500 ease-out',
        animating ? 'opacity-0 translate-y-10 scale-[0.96]' : 'opacity-100 translate-y-0 scale-100'
      )}
    >
      {/* Header */}
      <div className="mt-4 mb-5 text-center">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-amber-500/10 backdrop-blur-2xl items-center justify-center mb-3 border border-amber-500/15">
          <Sparkles size={22} className="text-amber-400" />
        </div>
        <h1 className="text-[22px] font-bold text-white tracking-tight">
          Envie de plus de confort ?
        </h1>
        <p className="text-[13px] text-white/30 mt-1">
          Des options pensées pour votre séjour
        </p>
      </div>

      <div className="space-y-2.5 flex-1">
        {upsells.map((u) => {
          const accepted = acceptedIds.includes(u.id);
          return (
            <button
              key={u.id}
              onClick={() => onToggle(u.id)}
              className={cn(
                'w-full p-4 rounded-[20px] text-left transition-all duration-300 border backdrop-blur-3xl',
                accepted
                  ? 'bg-emerald-500/[0.08] border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.05)]'
                  : 'bg-white/[0.05] border-white/[0.06] active:scale-[0.98]'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-3">
                  <p className="text-[14px] font-semibold text-white">{u.name}</p>
                  <p className="text-[12px] text-white/35 mt-0.5 leading-relaxed">{u.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-white tabular-nums">
                    {u.price}{u.currency}
                  </span>
                  <div
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300',
                      accepted
                        ? 'bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                        : 'bg-white/[0.08] border border-white/15'
                    )}
                  >
                    {accepted && <Check size={13} className="text-white" strokeWidth={2.5} />}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Total summary */}
      {acceptedIds.length > 0 && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/10 flex items-center justify-between">
          <span className="text-[12px] text-emerald-400/60 font-medium">
            {acceptedIds.length} option{acceptedIds.length > 1 ? 's' : ''} sélectionnée{acceptedIds.length > 1 ? 's' : ''}
          </span>
          <span className="text-[15px] font-bold text-emerald-400">{total} €</span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-5">
        <button
          onClick={onValidate}
          className="group w-full h-[56px] rounded-2xl bg-white font-semibold text-[15px] text-slate-900 flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
        >
          {validationLabel}
          <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
        </button>
        <button
          onClick={onValidate}
          className="w-full text-center mt-3 text-[13px] text-white/20 font-medium hover:text-white/40 transition-colors"
        >
          Passer
        </button>
      </div>
    </div>
  );
};

export default UpsellStep;
