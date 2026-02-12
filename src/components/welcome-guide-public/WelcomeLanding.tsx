import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Calendar, Moon, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WelcomeLandingProps {
  guestName: string;
  propertyName: string;
  cityName?: string;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  hostName?: string;
  heroImage?: string;
  onStart: () => void;
}

const WelcomeLanding = ({
  guestName,
  propertyName,
  cityName = 'Lyon',
  checkIn = '15 juin',
  checkOut = '18 juin',
  nights = 3,
  hostName = 'Noé Conciergerie',
  heroImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
  onStart,
}: WelcomeLandingProps) => {
  const [loaded, setLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100dvh] relative flex flex-col overflow-hidden bg-black">
      {/* Full-bleed hero with parallax-like zoom */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className={cn(
            'w-full h-full object-cover transition-all duration-[2s] ease-out',
            imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-8 pt-20">
        {/* Host badge */}
        <div
          className={cn(
            'transition-all duration-700 delay-200',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] backdrop-blur-2xl border border-white/[0.08] mb-5">
            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles size={10} className="text-emerald-400" />
            </div>
            <span className="text-[11px] text-white/60 font-medium tracking-wide">
              {hostName}
            </span>
          </div>
        </div>

        {/* Main greeting */}
        <div
          className={cn(
            'transition-all duration-1000 delay-400',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <p className="text-white/40 text-sm font-medium mb-1.5 tracking-wide">Bienvenue,</p>
          <h1 className="text-[44px] font-bold text-white leading-[1.05] tracking-tight">
            {guestName}
          </h1>
        </div>

        {/* Property card */}
        <div
          className={cn(
            'mt-6 transition-all duration-1000 delay-600',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <div className="p-5 rounded-[20px] bg-white/[0.07] backdrop-blur-3xl border border-white/[0.08] shadow-2xl shadow-black/20">
            <p className="text-[17px] font-semibold text-white mb-4 leading-snug">{propertyName}</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1.5 py-2.5 rounded-2xl bg-white/[0.05]">
                <MapPin size={14} className="text-white/40" />
                <span className="text-[11px] text-white/50 font-medium">{cityName}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 py-2.5 rounded-2xl bg-white/[0.05]">
                <Calendar size={14} className="text-white/40" />
                <span className="text-[11px] text-white/50 font-medium">{checkIn} → {checkOut}</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 py-2.5 rounded-2xl bg-white/[0.05]">
                <Moon size={14} className="text-white/40" />
                <span className="text-[11px] text-white/50 font-medium">{nights} nuit{nights > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={cn(
            'mt-7 transition-all duration-1000 delay-900',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <button
            onClick={onStart}
            className="group w-full h-[56px] rounded-2xl bg-white font-semibold text-[15px] text-slate-900 flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(255,255,255,0.12)]"
          >
            Découvrir mon livret
            <ChevronRight size={16} className="transition-transform group-active:translate-x-0.5" />
          </button>
          <p className="text-center text-[11px] text-white/20 mt-3">
            Votre guide d'arrivée personnalisé
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          'relative z-10 px-6 pb-5 text-center transition-all duration-700 delay-[1.2s]',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-[10px] text-white/15 tracking-wider">Powered by Noé</p>
      </div>
    </div>
  );
};

export default WelcomeLanding;
