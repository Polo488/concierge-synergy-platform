import { Wifi, Copy, ChevronRight, ChevronLeft, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface WelcomeStepProps {
  welcomeMessage: string;
  wifiName?: string;
  wifiPassword?: string;
  houseRules: string[];
  validationLabel: string;
  animating: boolean;
  onValidate: () => void;
  onBack?: () => void;
}

const WelcomeStep = ({
  welcomeMessage,
  wifiName,
  wifiPassword,
  houseRules,
  validationLabel,
  animating,
  onValidate,
  onBack,
}: WelcomeStepProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyWifi = () => {
    if (wifiPassword) {
      navigator.clipboard.writeText(wifiPassword).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header with back */}
      <div className="flex items-center gap-3 mt-2 mb-4">
        {onBack && (
          <button
            onClick={onBack}
            className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <ChevronLeft size={18} className="text-slate-600" />
          </button>
        )}
      </div>

      {/* Celebration header */}
      <div className="mb-5 text-center">
        <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 backdrop-blur-2xl items-center justify-center mb-4 border border-emerald-200/40 shadow-[0_8px_32px_rgba(52,211,153,0.12)]">
          <span className="text-[38px]">🏠</span>
        </div>
        <h1 className="text-[26px] font-bold text-slate-800 tracking-tight leading-tight">
          Bienvenue chez vous !
        </h1>
        <p className="text-[13px] text-slate-400 mt-1.5">Tout est prêt pour votre séjour</p>
      </div>

      <div className="space-y-3 flex-1">
        {/* Welcome message */}
        <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <p className="text-[15px] text-slate-600 leading-[1.65] italic">"{welcomeMessage}"</p>
        </div>

        {/* WiFi card */}
        {wifiName && (
          <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 backdrop-blur-xl flex items-center justify-center border border-blue-200/40">
                <Wifi size={20} className="text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-0.5">WiFi</p>
                <p className="text-sm font-semibold text-slate-800">{wifiName}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{wifiPassword}</p>
              </div>
              <button
                onClick={handleCopyWifi}
                className={cn(
                  'h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300',
                  copied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        {/* House rules */}
        {houseRules.length > 0 && (
          <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-3">À noter</p>
            <div className="space-y-2">
              {houseRules.map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                  <p className="text-[13px] text-slate-500 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
      </div>
    </div>
  );
};

export default WelcomeStep;
