import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Calendar, Moon, User } from 'lucide-react';
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
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[100dvh] relative flex flex-col overflow-hidden">
      {/* Full-screen hero background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className={cn(
            'w-full h-full object-cover transition-all duration-[1.5s]',
            imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-10 pt-20">
        {/* Host badge */}
        <div
          className={cn(
            'transition-all duration-700 delay-300',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 mb-6">
            <User size={12} className="text-white/70" />
            <span className="text-[11px] text-white/80 font-medium tracking-wide">
              Votre hôte · {hostName}
            </span>
          </div>
        </div>

        {/* Welcome text */}
        <div
          className={cn(
            'transition-all duration-700 delay-500',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <h1 className="text-[40px] font-bold text-white leading-[1.1] tracking-tight mb-2">
            Bienvenue,
            <br />
            {guestName}
          </h1>
        </div>

        {/* Property info card */}
        <div
          className={cn(
            'mt-5 transition-all duration-700 delay-700',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15">
            <p className="text-base font-semibold text-white mb-3">{propertyName}</p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-white/70">
                <MapPin size={13} />
                <span className="text-xs font-medium">{cityName}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Calendar size={13} />
                <span className="text-xs font-medium">
                  {checkIn} → {checkOut}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70">
                <Moon size={13} />
                <span className="text-xs font-medium">
                  {nights} nuit{nights > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={cn(
            'mt-8 transition-all duration-700 delay-1000',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <button
            onClick={onStart}
            className="w-full h-14 rounded-2xl bg-white text-slate-900 font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-2xl shadow-white/20"
          >
            Découvrir mon livret
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Powered by */}
      <div
        className={cn(
          'relative z-10 px-6 pb-6 text-center transition-all duration-700 delay-1200',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      >
        <p className="text-[10px] text-white/30">Powered by Noé</p>
      </div>
    </div>
  );
};

export default WelcomeLanding;
