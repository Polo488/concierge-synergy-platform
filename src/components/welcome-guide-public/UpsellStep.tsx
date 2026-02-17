import { Check, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
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
  onBack?: () => void;
}

const UpsellStep = ({
  upsells,
  acceptedIds,
  onToggle,
  validationLabel,
  animating,
  onValidate,
  onBack,
}: UpsellStepProps) => {
  const total = acceptedIds.reduce((sum, id) => {
    const u = upsells.find((x) => x.id === id);
    return sum + (u?.price ?? 0);
  }, 0);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with back */}
      <div className="flex items-center gap-3 mt-2 mb-2">
        {onBack && (
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
        )}
      </div>

      {/* Header */}
      <div className="mb-5 text-center">
        <div className="inline-flex h-14 w-14 rounded-2xl bg-amber-50 backdrop-blur-2xl items-center justify-center mb-3 border border-amber-200/40">
          <Sparkles size={22} className="text-amber-500" />
        </div>
        <h1 className="text-[22px] font-bold text-slate-800 tracking-tight">
          Envie de plus de confort ?
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
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
                'w-full p-4 rounded-[22px] text-left transition-all duration-300 border backdrop-blur-2xl',
                accepted
                  ? 'bg-emerald-50/80 border-emerald-300/40 shadow-[0_4px_20px_rgba(52,211,153,0.08)]'
                  : 'bg-white/65 border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)] active:scale-[0.98]'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-3">
                  <p className="text-[14px] font-semibold text-slate-800">{u.name}</p>
                  <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{u.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-bold text-slate-700 tabular-nums">
                    {u.price}{u.currency}
                  </span>
                  <div
                    className={cn(
                      'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300',
                      accepted
                        ? 'bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                        : 'bg-slate-100 border border-slate-200'
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
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/40 flex items-center justify-between">
          <span className="text-[12px] text-emerald-700/70 font-medium">
            {acceptedIds.length} option{acceptedIds.length > 1 ? 's' : ''} sélectionnée{acceptedIds.length > 1 ? 's' : ''}
          </span>
          <span className="text-[15px] font-bold text-emerald-600">{total} €</span>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-5">
        <button
          onClick={onValidate}
          disabled={animating}
          className="group w-full h-[56px] rounded-2xl bg-slate-900 font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          {validationLabel}
          <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
        </button>
        <button
          onClick={onValidate}
          className="w-full text-center mt-3 text-[13px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
        >
          Passer
        </button>
      </div>
    </div>
  );
};

export default UpsellStep;
