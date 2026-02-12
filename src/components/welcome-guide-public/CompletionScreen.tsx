import { useEffect, useState } from 'react';
import { Check, Wifi, MapPin, Phone, Clock, Sparkles, Utensils, Bus, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface Upsell {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface CompletionScreenProps {
  guestName: string;
  acceptedUpsells: Upsell[];
  wifiName?: string;
  wifiPassword?: string;
  hostName?: string;
  propertyName?: string;
}

const RECO_SECTIONS = [
  {
    icon: Utensils,
    title: 'Restaurants & bars',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/15',
    items: ['Le Comptoir du Vin – 5 min à pied', 'Café Mokka – brunch le week-end', 'Brasserie des Jacobins'],
  },
  {
    icon: Bus,
    title: 'Transports',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/15',
    items: ['Métro Bellecour – ligne A/D, 2 min', 'Station Vélo\'v en face', 'Gare Part-Dieu – 10 min'],
  },
  {
    icon: MapPin,
    title: 'À découvrir',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/15',
    items: ['Place Bellecour', 'Vieux Lyon & traboules', 'Parc de la Tête d\'Or – 15 min'],
  },
];

const CompletionScreen = ({
  guestName,
  acceptedUpsells,
  wifiName = 'Bellecour_Guest',
  wifiPassword = 'Welcome2024!',
  hostName = 'Noé Conciergerie',
  propertyName = 'Apt Bellecour',
}: CompletionScreenProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa'],
        disableForReducedMotion: true,
      });
    }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const total = acceptedUpsells.reduce((s, u) => s + u.price, 0);

  return (
    <div className={cn(
      'flex-1 flex flex-col px-5 pb-8 pt-6 overflow-y-auto transition-all duration-700',
      show ? 'opacity-100' : 'opacity-0'
    )}>
      {/* Hero completion */}
      <div className="text-center mb-6">
        <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 backdrop-blur-2xl items-center justify-center mb-4 border border-emerald-500/15 shadow-[0_0_40px_rgba(52,211,153,0.12)]">
          <Check size={36} className="text-emerald-400" />
        </div>
        <h1 className="text-[28px] font-bold text-white tracking-tight">
          Excellent séjour, {guestName} !
        </h1>
        <p className="text-[13px] text-white/30 mt-2 max-w-[280px] mx-auto leading-relaxed">
          Votre parcours d'accueil est terminé. Voici tout ce dont vous avez besoin.
        </p>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* WiFi */}
        <div className="p-4 rounded-[18px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06]">
          <Wifi size={16} className="text-blue-400 mb-2" />
          <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">WiFi</p>
          <p className="text-[13px] text-white font-semibold mt-0.5">{wifiName}</p>
          <p className="text-[11px] text-white/30 font-mono mt-0.5">{wifiPassword}</p>
        </div>

        {/* Contact */}
        <div className="p-4 rounded-[18px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06]">
          <Phone size={16} className="text-emerald-400 mb-2" />
          <p className="text-[10px] text-white/30 font-semibold uppercase tracking-widest">Contact</p>
          <p className="text-[13px] text-white font-semibold mt-0.5">{hostName}</p>
          <p className="text-[11px] text-white/30 mt-0.5">Disponible 24/7</p>
        </div>
      </div>

      {/* Upsell summary */}
      {acceptedUpsells.length > 0 && (
        <div className="p-4 rounded-[18px] bg-emerald-500/[0.06] backdrop-blur-3xl border border-emerald-500/10 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-emerald-400" />
            <p className="text-[10px] text-emerald-400/60 font-semibold uppercase tracking-widest">
              Vos options
            </p>
          </div>
          {acceptedUpsells.map((u) => (
            <div key={u.id} className="flex justify-between py-1.5 text-[13px]">
              <span className="text-white/50">{u.name}</span>
              <span className="font-semibold text-white">{u.price}{u.currency}</span>
            </div>
          ))}
          <div className="border-t border-emerald-500/10 mt-2 pt-2 flex justify-between text-[13px] font-bold">
            <span className="text-white/50">Total</span>
            <span className="text-emerald-400">{total} €</span>
          </div>
        </div>
      )}

      {/* Local recommendations */}
      <div className="mb-4">
        <p className="text-[10px] text-white/25 font-semibold uppercase tracking-widest mb-3 px-1">
          À proximité
        </p>
        <div className="space-y-2.5">
          {RECO_SECTIONS.map((section) => (
            <div
              key={section.title}
              className={cn('p-4 rounded-[18px] backdrop-blur-3xl border', section.bg)}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <section.icon size={15} className={section.color} />
                <p className="text-[13px] font-semibold text-white">{section.title}</p>
              </div>
              <div className="space-y-1.5">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-white/15 shrink-0" />
                    <p className="text-[12px] text-white/40">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical tips */}
      <div className="p-4 rounded-[18px] bg-white/[0.06] backdrop-blur-3xl border border-white/[0.06] mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <ShieldCheck size={15} className="text-white/40" />
          <p className="text-[13px] font-semibold text-white">Infos pratiques</p>
        </div>
        <div className="space-y-2 text-[12px] text-white/40">
          <div className="flex items-start gap-2">
            <Clock size={12} className="mt-0.5 shrink-0 text-white/25" />
            <p>Check-out avant 11h – déposez les clés dans la boîte</p>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck size={12} className="mt-0.5 shrink-0 text-white/25" />
            <p>En cas d'urgence, contactez-nous via le chat</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-[10px] text-white/15 tracking-wider">Powered by Noé · {propertyName}</p>
      </div>
    </div>
  );
};

export default CompletionScreen;
