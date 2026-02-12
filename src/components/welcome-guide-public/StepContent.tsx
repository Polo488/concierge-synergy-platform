import { HelpCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StepContentProps {
  title: string;
  description: string;
  imageUrl?: string;
  validationLabel: string;
  isOptional: boolean;
  helpText?: string;
  animating: boolean;
  onValidate: () => void;
  contextHint?: string;
}

const StepContent = ({
  title,
  description,
  imageUrl,
  validationLabel,
  isOptional,
  helpText,
  animating,
  onValidate,
  contextHint,
}: StepContentProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={cn(
        'flex-1 flex flex-col transition-all duration-500 ease-out',
        animating ? 'opacity-0 translate-y-10 scale-[0.96]' : 'opacity-100 translate-y-0 scale-100'
      )}
    >
      {/* Context hint */}
      {contextHint && (
        <p className="text-center text-[11px] text-emerald-400/60 font-medium tracking-wide mt-3 mb-1">
          {contextHint}
        </p>
      )}

      {/* Hero image */}
      {imageUrl && (
        <div className="rounded-[24px] overflow-hidden mt-3 mb-4 aspect-[4/3] relative shadow-2xl shadow-black/40">
          <div className={cn(
            'absolute inset-0 bg-white/[0.03] z-10',
            !imgLoaded && 'animate-pulse'
          )} />
          <img
            src={imageUrl}
            alt=""
            className={cn(
              'w-full h-full object-cover transition-all duration-700',
              imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-20" />
          <div className="absolute bottom-0 left-0 right-0 p-5 z-30">
            <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight drop-shadow-lg">
              {title}
            </h1>
          </div>
        </div>
      )}

      {!imageUrl && (
        <div className="mt-4 mb-2">
          <h1 className="text-[22px] font-bold text-white tracking-tight">{title}</h1>
        </div>
      )}

      {/* Description card */}
      {description && (
        <div className="p-5 rounded-[20px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06]">
          <p className="text-[15px] text-white/75 leading-[1.6]">{description}</p>
        </div>
      )}

      {/* Help section */}
      {helpText && (
        <div className="mt-3">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium text-white/30 hover:text-white/50 hover:bg-white/[0.04] transition-all"
          >
            <HelpCircle size={14} />
            Besoin d'aide ?
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              showHelp ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
            )}
          >
            <div className="p-4 rounded-[18px] bg-emerald-500/[0.08] backdrop-blur-2xl border border-emerald-500/[0.12]">
              <div className="flex items-start gap-3">
                <MessageCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-white/70 leading-relaxed">{helpText}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-6">
        <button
          onClick={onValidate}
          className="group w-full h-[56px] rounded-2xl bg-white font-semibold text-[15px] text-slate-900 flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
        >
          {validationLabel}
          <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
        </button>
        {isOptional && (
          <button
            onClick={onValidate}
            className="w-full text-center mt-3 text-[13px] text-white/20 font-medium hover:text-white/40 transition-colors"
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  );
};

export default StepContent;
