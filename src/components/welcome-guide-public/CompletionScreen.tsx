import { useEffect, useState } from 'react';
import { Check, Wifi, MapPin, Phone, Clock, Sparkles, Utensils, Bus, ShieldCheck, Copy, ExternalLink } from 'lucide-react';
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
    color: 'text-orange-600',
    bg: 'bg-orange-50/80 border-orange-200/30',
    items: [
      { name: 'Le Comptoir du Vin', detail: '5 min à pied' },
      { name: 'Café Mokka', detail: 'brunch le week-end' },
      { name: 'Brasserie des Jacobins', detail: '3 min' },
    ],
  },
  {
    icon: Bus,
    title: 'Transports',
    color: 'text-blue-600',
    bg: 'bg-blue-50/80 border-blue-200/30',
    items: [
      { name: 'Métro Bellecour', detail: 'ligne A/D, 2 min' },
      { name: "Station Vélo'v", detail: 'en face' },
      { name: 'Gare Part-Dieu', detail: '10 min' },
    ],
  },
  {
    icon: MapPin,
    title: 'À découvrir',
    color: 'text-pink-600',
    bg: 'bg-pink-50/80 border-pink-200/30',
    items: [
      { name: 'Place Bellecour', detail: '1 min' },
      { name: 'Vieux Lyon & traboules', detail: '8 min' },
      { name: "Parc de la Tête d'Or", detail: '15 min' },
    ],
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
  const [wifiCopied, setWifiCopied] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 100);
    const t2 = setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.4 },
        colors: ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa'],
        disableForReducedMotion: true,
      });
    }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(wifiPassword).catch(() => {});
    setWifiCopied(true);
    setTimeout(() => setWifiCopied(false), 2000);
  };

  const total = acceptedUpsells.reduce((s, u) => s + u.price, 0);

  return (
    <div className={cn(
      'flex-1 flex flex-col px-5 pb-8 pt-6 overflow-y-auto transition-all duration-700',
      show ? 'opacity-100' : 'opacity-0'
    )}>
      {/* Hero completion */}
      <div className="text-center mb-6">
        <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 items-center justify-center mb-4 border border-emerald-200/40 shadow-[0_8px_32px_rgba(52,211,153,0.15)]">
          <Check size={36} className="text-emerald-500" />
        </div>
        <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">
          Excellent séjour, {guestName} !
        </h1>
        <p className="text-[13px] text-slate-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
          Votre parcours d'accueil est terminé. Voici tout ce dont vous avez besoin.
        </p>
      </div>

      {/* Quick info cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {/* WiFi */}
        <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <Wifi size={16} className="text-blue-500" />
            <button onClick={handleCopyWifi} className="text-slate-300 hover:text-slate-500 transition-colors">
              {wifiCopied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            </button>
          </div>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">WiFi</p>
          <p className="text-[13px] text-slate-800 font-semibold mt-0.5">{wifiName}</p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">{wifiPassword}</p>
        </div>

        {/* Contact */}
        <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <Phone size={16} className="text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Contact</p>
          <p className="text-[13px] text-slate-800 font-semibold mt-0.5">{hostName}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Disponible 24/7</p>
        </div>
      </div>

      {/* Upsell summary */}
      {acceptedUpsells.length > 0 && (
        <div className="p-4 rounded-[22px] bg-emerald-50/80 backdrop-blur-2xl border border-emerald-200/30 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-emerald-600" />
            <p className="text-[10px] text-emerald-700/60 font-semibold uppercase tracking-widest">
              Vos options
            </p>
          </div>
          {acceptedUpsells.map((u) => (
            <div key={u.id} className="flex justify-between py-1.5 text-[13px]">
              <span className="text-slate-500">{u.name}</span>
              <span className="font-semibold text-slate-700">{u.price}{u.currency}</span>
            </div>
          ))}
          <div className="border-t border-emerald-200/40 mt-2 pt-2 flex justify-between text-[13px] font-bold">
            <span className="text-slate-500">Total</span>
            <span className="text-emerald-600">{total} €</span>
          </div>
        </div>
      )}

      {/* Local recommendations – horizontal scroll */}
      <div className="mb-4">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mb-3 px-1">
          À proximité
        </p>
        <div className="space-y-2.5">
          {RECO_SECTIONS.map((section) => (
            <div
              key={section.title}
              className={cn('p-4 rounded-[22px] backdrop-blur-2xl border shadow-[0_4px_24px_rgba(0,0,0,0.04)]', section.bg)}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <section.icon size={15} className={section.color} />
                <p className="text-[13px] font-semibold text-slate-700">{section.title}</p>
              </div>
              <div className="space-y-1.5">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-slate-300 shrink-0" />
                      <p className="text-[12px] text-slate-500">{item.name}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practical tips */}
      <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)] mb-4">
        <div className="flex items-center gap-2 mb-2.5">
          <ShieldCheck size={15} className="text-slate-500" />
          <p className="text-[13px] font-semibold text-slate-700">Infos pratiques</p>
        </div>
        <div className="space-y-2 text-[12px] text-slate-500">
          <div className="flex items-start gap-2">
            <Clock size={12} className="mt-0.5 shrink-0 text-slate-400" />
            <p>Check-out avant 11h – déposez les clés dans la boîte</p>
          </div>
          <div className="flex items-start gap-2">
            <ShieldCheck size={12} className="mt-0.5 shrink-0 text-slate-400" />
            <p>En cas d'urgence, contactez-nous via le chat</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 text-center">
        <p className="text-[10px] text-slate-300 tracking-wider">Powered by Noé · {propertyName}</p>
      </div>
    </div>
  );
};

export default CompletionScreen;
