import { Wifi, Copy, ChevronRight, ShieldCheck } from 'lucide-react';
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
}

const WelcomeStep = ({
  welcomeMessage,
  wifiName,
  wifiPassword,
  houseRules,
  validationLabel,
  animating,
  onValidate,
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
    <div
      className={cn(
        'flex-1 flex flex-col transition-all duration-500 ease-out',
        animating ? 'opacity-0 translate-y-10 scale-[0.96]' : 'opacity-100 translate-y-0 scale-100'
      )}
    >
      {/* Celebration header */}
      <div className="mt-6 mb-5 text-center">
        <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-2xl items-center justify-center mb-4 border border-emerald-500/15 shadow-[0_0_40px_rgba(52,211,153,0.1)]">
          <span className="text-[38px]">🏠</span>
        </div>
        <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
          Bienvenue chez vous !
        </h1>
        <p className="text-[13px] text-white/30 mt-1.5">Tout est prêt pour votre séjour</p>
      </div>

      <div className="space-y-3 flex-1">
        {/* Welcome message */}
        <div className="p-5 rounded-[20px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06]">
          <p className="text-[15px] text-white/70 leading-[1.65] italic">"{welcomeMessage}"</p>
        </div>

        {/* WiFi card */}
        {wifiName && (
          <div className="p-4 rounded-[20px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06]">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 backdrop-blur-xl flex items-center justify-center border border-blue-500/15">
                <Wifi size={20} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/30 font-semibold uppercase tracking-[0.15em] mb-0.5">WiFi</p>
                <p className="text-sm font-semibold text-white">{wifiName}</p>
                <p className="text-xs text-white/40 font-mono mt-0.5 truncate">{wifiPassword}</p>
              </div>
              <button
                onClick={handleCopyWifi}
                className={cn(
                  'h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300',
                  copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.06] text-white/30 hover:text-white/50'
                )}
              >
                {copied ? <ShieldCheck size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}

        {/* House rules */}
        {houseRules.length > 0 && (
          <div className="p-4 rounded-[20px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06]">
            <p className="text-[10px] text-white/30 font-semibold uppercase tracking-[0.15em] mb-3">
              À noter
            </p>
            <div className="space-y-2">
              {houseRules.map((rule, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/20 mt-1.5 shrink-0" />
                  <p className="text-[13px] text-white/50 leading-relaxed">{rule}</p>
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
          className="group w-full h-[56px] rounded-2xl bg-white font-semibold text-[15px] text-slate-900 flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
        >
          {validationLabel}
          <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeStep;
