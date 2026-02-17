import { useState } from 'react';
import { ArrowLeft, Wifi, Copy, Check, Home, BookOpen, ShieldCheck, MapPin, Phone, Sparkles, ExternalLink, ChevronRight, Lock, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentSimulation from './PaymentSimulation';

interface Upsell {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  icon?: string;
}

interface Recommendation {
  category: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  items: { name: string; detail: string; mapsUrl?: string }[];
}

interface GuideHubProps {
  propertyName: string;
  hostName: string;
  welcomeMessage: string;
  wifiName?: string;
  wifiPassword?: string;
  houseRules: string[];
  upsells: Upsell[];
  acceptedUpsells: string[];
  onToggleUpsell: (id: string) => void;
  recommendations: Recommendation[];
  onBack: () => void;
  initialSection?: string;
  journeyLocked?: boolean;
  unlockLabel?: string;
  onStartJourney?: () => void;
}

type Section = 'menu' | 'info' | 'wifi' | 'rules' | 'upsells' | 'recommendations' | 'contact' | 'payment';

const GuideHub = ({
  propertyName,
  hostName,
  welcomeMessage,
  wifiName,
  wifiPassword,
  houseRules,
  upsells,
  acceptedUpsells,
  onToggleUpsell,
  recommendations,
  onBack,
  initialSection = 'menu',
  journeyLocked,
  unlockLabel,
  onStartJourney,
}: GuideHubProps) => {
  const [section, setSection] = useState<Section>(initialSection as Section);
  const [wifiCopied, setWifiCopied] = useState(false);

  const handleCopyWifi = () => {
    if (wifiPassword) {
      navigator.clipboard.writeText(wifiPassword).catch(() => {});
      setWifiCopied(true);
      setTimeout(() => setWifiCopied(false), 2000);
    }
  };

  const total = acceptedUpsells.reduce((sum, id) => {
    const u = upsells.find((x) => x.id === id);
    return sum + (u?.price ?? 0);
  }, 0);

  const menuItems = [
    { key: 'upsells' as Section, icon: Sparkles, label: 'Services extras', sublabel: `${upsells.length} disponible${upsells.length > 1 ? 's' : ''}` },
    { key: 'info' as Section, icon: Home, label: 'Informations du logement', sublabel: 'Message, détails' },
    { key: 'recommendations' as Section, icon: MapPin, label: 'À proximité', sublabel: 'Restaurants, bars, activités' },
    { key: 'wifi' as Section, icon: Wifi, label: 'WiFi', sublabel: wifiName || 'Connexion' },
    { key: 'rules' as Section, icon: BookOpen, label: 'Règles du logement', sublabel: `${houseRules.length} règle${houseRules.length > 1 ? 's' : ''}` },
    { key: 'contact' as Section, icon: Phone, label: 'Contact', sublabel: 'Disponible 24/7' },
  ];

  const transition = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
  };

  const renderSection = () => {
    switch (section) {
      case 'info':
        return (
          <motion.div key="info" {...transition} className="space-y-4">
            <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-3">Message de bienvenue</p>
              <p className="text-[15px] text-slate-600 leading-[1.65] italic">"{welcomeMessage}"</p>
            </div>
            <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-2">Logement</p>
              <p className="text-[15px] font-semibold text-slate-800">{propertyName}</p>
            </div>
          </motion.div>
        );

      case 'wifi':
        return (
          <motion.div key="wifi" {...transition}>
            <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-200/40">
                  <Wifi size={24} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-1">Réseau WiFi</p>
                  <p className="text-[17px] font-bold text-slate-800">{wifiName}</p>
                  <p className="text-[14px] text-slate-400 font-mono mt-1">{wifiPassword}</p>
                </div>
                <button
                  onClick={handleCopyWifi}
                  className={cn(
                    'h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300',
                    wifiCopied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 active:scale-95'
                  )}
                >
                  {wifiCopied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'rules':
        return (
          <motion.div key="rules" {...transition}>
            <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-4">Règles du logement</p>
              <div className="space-y-3">
                {houseRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200/40">
                      <ShieldCheck size={12} className="text-amber-600" />
                    </div>
                    <p className="text-[14px] text-slate-600 leading-relaxed">{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 'upsells':
        return (
          <motion.div key="upsells" {...transition} className="space-y-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] px-1">Améliorez votre séjour</p>
            {upsells.map((u) => {
              const accepted = acceptedUpsells.includes(u.id);
              return (
                <button
                  key={u.id}
                  onClick={() => onToggleUpsell(u.id)}
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
                      <span className="text-[15px] font-bold text-slate-700 tabular-nums">{u.price}{u.currency}</span>
                      <div className={cn(
                        'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300',
                        accepted ? 'bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.25)]' : 'bg-slate-100 border border-slate-200'
                      )}>
                        {accepted && <Check size={13} className="text-white" strokeWidth={2.5} />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {acceptedUpsells.length > 0 && (
              <>
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/40 flex items-center justify-between">
                  <span className="text-[12px] text-emerald-700/70 font-medium">
                    {acceptedUpsells.length} option{acceptedUpsells.length > 1 ? 's' : ''} sélectionnée{acceptedUpsells.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-[15px] font-bold text-emerald-600">{total} €</span>
                </div>
                <button
                  onClick={() => setSection('payment')}
                  className="w-full h-[52px] rounded-2xl bg-slate-900 font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                >
                  <CreditCard size={16} />
                  Payer {total} €
                </button>
              </>
            )}
          </motion.div>
        );

      case 'recommendations':
        return (
          <motion.div key="recommendations" {...transition} className="space-y-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] px-1">À proximité</p>
            {recommendations.map((cat) => (
              <div key={cat.category} className={cn('p-4 rounded-[22px] backdrop-blur-2xl border shadow-[0_4px_24px_rgba(0,0,0,0.04)]', cat.bg)}>
                <div className="flex items-center gap-2 mb-3">
                  <cat.icon size={15} className={cat.color} />
                  <p className="text-[13px] font-semibold text-slate-700">{cat.category}</p>
                </div>
                <div className="space-y-2">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                        <p className="text-[12px] text-slate-600 truncate">{item.name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[11px] text-slate-400">{item.detail}</span>
                        {item.mapsUrl && (
                          <a href={item.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600">
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        );

      case 'contact':
        return (
          <motion.div key="contact" {...transition}>
            <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)] text-center">
              <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-200/40">
                <Phone size={24} className="text-emerald-500" />
              </div>
              <p className="text-[17px] font-bold text-slate-800">{hostName}</p>
              <p className="text-[13px] text-slate-400 mt-1">Disponible 24/7 pour vous aider</p>
              <button className="mt-5 w-full h-[50px] rounded-2xl bg-emerald-500 font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(52,211,153,0.2)]">
                <Phone size={16} />
                Contacter
              </button>
            </div>
          </motion.div>
        );

      case 'payment':
        return (
          <motion.div key="payment" {...transition} className="min-h-[60vh]">
            <PaymentSimulation
              items={acceptedUpsells.map(id => {
                const u = upsells.find(x => x.id === id);
                return u ? { id: u.id, name: u.name, price: u.price, currency: u.currency } : { id, name: '', price: 0, currency: '€' };
              }).filter(i => i.name)}
              onBack={() => setSection('upsells')}
              onSuccess={() => setSection('menu')}
            />
          </motion.div>
        );

      default: // menu
        return (
          <motion.div key="menu" {...transition} className="space-y-2">
            {/* Journey CTA */}
            {onStartJourney && (
              <div className="mb-4">
                {journeyLocked ? (
                  <div className="p-4 rounded-[22px] bg-slate-100/80 backdrop-blur-xl border border-slate-200/50">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-200/60 flex items-center justify-center">
                        <Lock size={16} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-500">Parcours d'arrivée</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{unlockLabel}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={onStartJourney}
                    className="w-full p-4 rounded-[22px] bg-slate-900 text-white flex items-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <MapPin size={16} className="text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-[14px] font-semibold">Parcours d'arrivée</p>
                      <p className="text-[11px] text-white/60 mt-0.5">Commencer la visite guidée</p>
                    </div>
                    <ChevronRight size={16} className="text-white/60" />
                  </button>
                )}
              </div>
            )}

            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className="w-full flex items-center gap-3.5 px-5 py-3.5 rounded-[18px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-all duration-200 text-left group"
              >
                <div className="h-10 w-10 rounded-xl bg-slate-50/80 flex items-center justify-center shrink-0 border border-slate-100/60">
                  <item.icon size={18} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-slate-800">{item.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.sublabel}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
              </button>
            ))}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F7F9FB] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-[env(safe-area-inset-top,12px)] mt-3 pb-2">
        <div className="flex items-center gap-3">
          {section !== 'menu' ? (
            <button
              onClick={() => setSection('menu')}
              className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
            >
              <ArrowLeft size={18} className="text-slate-600" />
            </button>
          )}
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-slate-800">{propertyName}</p>
            <p className="text-[11px] text-slate-400">{section === 'menu' ? 'Votre séjour' : menuItems.find(m => m.key === section)?.label || ''}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 pt-2">
        <AnimatePresence mode="wait">
          {renderSection()}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 text-center">
        <p className="text-[10px] text-slate-300 tracking-wider">Powered by Noé</p>
      </div>
    </div>
  );
};

export default GuideHub;
