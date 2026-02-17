import { HelpCircle, ChevronRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StepContentProps {
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  validationLabel: string;
  isOptional: boolean;
  helpText?: string;
  animating: boolean;
  onValidate: () => void;
  onBack?: () => void;
  contextHint?: string;
}

const StepContent = ({
  title,
  description,
  imageUrl,
  videoUrl,
  validationLabel,
  isOptional,
  helpText,
  animating,
  onValidate,
  onBack,
  contextHint,
}: StepContentProps) => {
  const [showHelp, setShowHelp] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Immersive hero image */}
      {imageUrl && (
        <div className="relative -mx-5 -mt-2 mb-4">
          <div className="aspect-[4/3] relative overflow-hidden">
            <div className={cn(
              'absolute inset-0 bg-slate-100 z-10',
              !imgLoaded && 'animate-pulse'
            )} />
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              className={cn(
                'w-full h-full object-cover transition-all duration-700',
                imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              )}
              onLoad={() => setImgLoaded(true)}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-20" />

            {/* Back button on image */}
            {onBack && (
              <button
                onClick={onBack}
                className="absolute top-4 left-5 z-30 h-10 w-10 rounded-xl bg-white/70 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
            )}

            {/* Context hint on image */}
            {contextHint && (
              <div className="absolute top-4 right-5 z-30 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg">
                <p className="text-[10px] text-emerald-600 font-semibold tracking-wide">{contextHint}</p>
              </div>
            )}

            {/* Title overlaid on image */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 z-30">
              <h1 className="text-[24px] font-bold text-slate-900 tracking-tight leading-tight">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {!imageUrl && !videoUrl && (
        <div className="mt-4 mb-3 flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
          )}
          <div>
            {contextHint && (
              <p className="text-[10px] text-emerald-600 font-semibold tracking-wide mb-1">{contextHint}</p>
            )}
            <h1 className="text-[24px] font-bold text-slate-800 tracking-tight">{title}</h1>
          </div>
        </div>
      )}

      {/* Description card */}
      {description && (
        <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <p className="text-[15px] text-slate-600 leading-[1.6]">{description}</p>
        </div>
      )}

      {/* Help section */}
      {helpText && (
        <div className="mt-3">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-white/40 transition-all"
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
            <div className="p-4 rounded-[18px] bg-emerald-50/80 backdrop-blur-xl border border-emerald-200/40">
              <div className="flex items-start gap-3">
                <MessageCircle size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-[13px] text-slate-600 leading-relaxed">{helpText}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-6">
        <button
          onClick={onValidate}
          disabled={animating}
          className="group w-full h-[56px] rounded-2xl bg-slate-900 font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          {validationLabel}
          <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
        </button>
        {isOptional && (
          <button
            onClick={onValidate}
            className="w-full text-center mt-3 text-[13px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  );
};

export default StepContent;
