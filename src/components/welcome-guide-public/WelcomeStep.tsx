import { Wifi, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}: WelcomeStepProps) => (
  <div
    className={cn(
      'flex-1 flex flex-col transition-all duration-600 ease-out',
      animating ? 'opacity-0 scale-[0.97] translate-y-8' : 'opacity-100 scale-100 translate-y-0'
    )}
  >
    {/* Celebration header */}
    <div className="mt-6 mb-4 text-center">
      <div className="inline-flex h-20 w-20 rounded-full bg-emerald-500/15 backdrop-blur-xl items-center justify-center mb-4 border border-emerald-500/20">
        <span className="text-4xl">🏠</span>
      </div>
      <h1 className="text-2xl font-bold text-white tracking-tight">
        Bienvenue chez vous !
      </h1>
    </div>

    <div className="space-y-3 flex-1">
      {/* Welcome message */}
      <div className="p-5 rounded-2xl bg-white/8 backdrop-blur-2xl border border-white/10">
        <p className="text-[15px] text-white/80 leading-relaxed">{welcomeMessage}</p>
      </div>

      {/* WiFi */}
      {wifiName && (
        <div className="p-4 rounded-2xl bg-white/8 backdrop-blur-2xl border border-white/10 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/15 backdrop-blur-xl flex items-center justify-center border border-blue-500/20">
            <Wifi size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 font-semibold uppercase tracking-[0.15em]">WiFi</p>
            <p className="text-sm font-semibold text-white">{wifiName}</p>
            <p className="text-xs text-white/50 font-mono mt-0.5">{wifiPassword}</p>
          </div>
        </div>
      )}

      {/* House rules */}
      {houseRules.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/8 backdrop-blur-2xl border border-white/10">
          <p className="text-[10px] text-white/40 font-semibold uppercase tracking-[0.15em] mb-2.5">
            À noter
          </p>
          {houseRules.map((rule, i) => (
            <p key={i} className="text-sm text-white/70 py-1">
              • {rule}
            </p>
          ))}
        </div>
      )}
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
    </div>
  </div>
);

export default WelcomeStep;
