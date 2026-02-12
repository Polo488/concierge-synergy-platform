import { HelpCircle, ChevronRight } from 'lucide-react';
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
}: StepContentProps) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div
      className={cn(
        'flex-1 flex flex-col transition-all duration-600 ease-out',
        animating ? 'opacity-0 scale-[0.97] translate-y-8' : 'opacity-100 scale-100 translate-y-0'
      )}
    >
      {/* Hero image */}
      {imageUrl && (
        <div className="rounded-3xl overflow-hidden mt-4 mb-5 aspect-[4/3] relative shadow-2xl shadow-black/30">
          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">
              {title}
            </h1>
          </div>
        </div>
      )}

      {!imageUrl && (
        <h1 className="text-2xl font-bold text-white tracking-tight mt-4">{title}</h1>
      )}

      {/* Description */}
      {description && (
        <div className="mt-4 p-5 rounded-2xl bg-white/8 backdrop-blur-2xl border border-white/10">
          <p className="text-[15px] text-white/80 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Help */}
      {helpText && (
        <div className="mt-3">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 px-1"
          >
            <HelpCircle size={14} /> Besoin d'aide ?
          </button>
          {showHelp && (
            <div className="mt-2 p-4 rounded-2xl bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 text-sm text-white/80 animate-fade-in">
              {helpText}
            </div>
          )}
        </div>
      )}

      {/* Spacer + CTA */}
      <div className="mt-auto pt-8">
        <button
          onClick={onValidate}
          className="w-full h-14 rounded-2xl bg-white text-slate-900 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-2xl shadow-white/10"
        >
          {validationLabel}
          <ChevronRight size={18} />
        </button>
        {isOptional && (
          <button
            onClick={onValidate}
            className="w-full text-center mt-3 text-sm text-white/30 font-medium"
          >
            Passer cette étape
          </button>
        )}
      </div>
    </div>
  );
};

export default StepContent;
