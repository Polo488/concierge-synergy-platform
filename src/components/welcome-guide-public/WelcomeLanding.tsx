import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Moon, Home, Wifi, BookOpen, Sparkles, Star, MessageCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickMenuItem {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  onClick?: () => void;
}

interface WelcomeLandingProps {
  guestName: string;
  propertyName: string;
  propertyAddress?: string;
  cityName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  hostName?: string;
  hostInitial?: string;
  heroImage?: string;
  onStart: () => void;
  onNavigate?: (section: string) => void;
  journeyLocked?: boolean;
  unlockLabel?: string;
}

const WelcomeLanding = ({
  guestName,
  propertyName,
  propertyAddress = '',
  cityName = 'Lyon 2e',
  checkIn = '2026-02-20',
  checkOut = '2026-02-22',
  nights = 2,
  hostName = 'Noé Conciergerie',
  hostInitial = 'N',
  heroImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  onStart,
  onNavigate,
  journeyLocked = false,
  unlockLabel,
}: WelcomeLandingProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showAllMenu, setShowAllMenu] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  const quickMenuItems: QuickMenuItem[] = [
    { icon: Sparkles, label: 'Services extras', sublabel: 'Améliorez votre séjour', onClick: () => onNavigate?.('upsells') },
    { icon: Home, label: 'Guides du logement', sublabel: 'Tout savoir', onClick: () => onNavigate?.('info') },
    { icon: Star, label: 'Recommandations', sublabel: 'Restaurants, bars & activités', onClick: () => onNavigate?.('recommendations') },
    { icon: Wifi, label: 'WiFi', sublabel: 'Connexion instantanée', onClick: () => onNavigate?.('wifi') },
    { icon: BookOpen, label: 'Règles du logement', sublabel: 'À noter', onClick: () => onNavigate?.('rules') },
    { icon: MessageCircle, label: 'Contact hôte', sublabel: 'Disponible 24/7', onClick: () => onNavigate?.('contact') },
  ];

  const visibleItems = showAllMenu ? quickMenuItems : quickMenuItems.slice(0, 3);
  const hiddenCount = quickMenuItems.length - 3;

  return (
    <div className="min-h-[100dvh] relative flex flex-col overflow-hidden">
      {/* Full-bleed hero */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          loading="lazy"
          className={cn(
            'w-full h-full object-cover transition-all duration-[2s] ease-out',
            imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Light gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/40 to-white/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent" />
      </div>

      {/* Top bar: host + nights */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-[env(safe-area-inset-top,12px)] mt-3">
        <div
          className={cn(
            'transition-all duration-700 delay-200',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold">
              {hostInitial}
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-medium uppercase tracking-[0.15em]">Votre hôte</p>
              <p className="text-[13px] text-slate-800 font-semibold leading-none">{hostName}</p>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'transition-all duration-700 delay-300',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <Moon size={13} className="text-slate-500" />
            <span className="text-[13px] text-slate-700 font-semibold">{nights} nuit{nights > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-5 pb-8">
        {/* Main greeting */}
        <div
          className={cn(
            'mb-5 text-center transition-all duration-1000 delay-400',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <p className="text-slate-400 text-[11px] font-medium tracking-[0.2em] uppercase mb-2">Bienvenue</p>
          <h1 className="text-[48px] font-bold text-slate-900 leading-[1] tracking-tight">
            {guestName}
          </h1>
        </div>

        {/* Property card */}
        <div
          className={cn(
            'mb-5 transition-all duration-1000 delay-600',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-slate-100/80 flex items-center justify-center shrink-0">
                <Home size={18} className="text-slate-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-slate-800 leading-snug truncate">{propertyName}</p>
                {propertyAddress && (
                  <p className="text-[12px] text-slate-400 mt-0.5 truncate">{propertyAddress}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.12em]">Arrivée</p>
                <p className="text-[15px] font-bold text-slate-800 mt-0.5">{checkIn}</p>
              </div>
              <ArrowRight size={14} className="text-slate-300 mx-2" />
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.12em]">Départ</p>
                <p className="text-[15px] font-bold text-slate-800 mt-0.5">{checkOut}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick access menu */}
        <div
          className={cn(
            'mb-5 space-y-2 transition-all duration-1000 delay-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {visibleItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
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

          {!showAllMenu && hiddenCount > 0 && (
            <button
              onClick={() => setShowAllMenu(true)}
              className="w-full text-center py-2 text-[12px] text-slate-400 font-medium hover:text-slate-600 transition-colors"
            >
              + {hiddenCount} autres rubriques
            </button>
          )}
        </div>

        {/* CTA */}
        <div
          className={cn(
            'transition-all duration-1000 delay-900',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {journeyLocked ? (
            <div className="w-full py-4 px-5 rounded-2xl bg-slate-100/80 backdrop-blur-xl border border-slate-200/50 text-center">
              <p className="text-[13px] text-slate-500 font-medium">{unlockLabel || 'Parcours verrouillé'}</p>
            </div>
          ) : (
            <button
              onClick={onStart}
              className="group w-full h-[56px] rounded-2xl bg-slate-900 font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            >
              Découvrir mon livret
              <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
            </button>
          )}
        </div>
      </div>

      {/* Home indicator */}
      <div className="relative z-10 flex justify-center pb-3">
        <div className="w-[134px] h-[5px] rounded-full bg-slate-900/20" />
      </div>
    </div>
  );
};

export default WelcomeLanding;
