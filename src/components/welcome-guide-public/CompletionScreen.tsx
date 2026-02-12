import { useEffect } from 'react';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Upsell {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface CompletionScreenProps {
  guestName: string;
  acceptedUpsells: Upsell[];
}

const CompletionScreen = ({ guestName, acceptedUpsells }: CompletionScreenProps) => {
  useEffect(() => {
    const fire = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#60a5fa', '#fbbf24', '#f472b6'],
        disableForReducedMotion: true,
      });
    };
    const t = setTimeout(fire, 400);
    return () => clearTimeout(t);
  }, []);

  const total = acceptedUpsells.reduce((s, u) => s + u.price, 0);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 animate-scale-in">
      <div className="h-24 w-24 rounded-full bg-emerald-500/15 backdrop-blur-xl flex items-center justify-center mb-8 border border-emerald-500/20">
        <Check size={44} className="text-emerald-400" />
      </div>
      <h1 className="text-3xl font-bold text-white tracking-tight">
        Excellent séjour, {guestName} !
      </h1>
      <p className="text-white/40 mt-3 max-w-xs text-sm leading-relaxed">
        Votre parcours d'accueil est terminé. Profitez pleinement de votre logement.
      </p>

      {acceptedUpsells.length > 0 && (
        <div className="mt-8 p-5 rounded-2xl bg-white/8 backdrop-blur-2xl border border-white/10 w-full max-w-xs">
          <p className="text-[10px] text-white/40 font-semibold uppercase tracking-[0.15em] mb-3">
            Options sélectionnées
          </p>
          {acceptedUpsells.map((u) => (
            <div key={u.id} className="flex justify-between py-1.5 text-sm">
              <span className="text-white/70">{u.name}</span>
              <span className="font-semibold text-white">
                {u.price}
                {u.currency}
              </span>
            </div>
          ))}
          <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-sm font-bold">
            <span className="text-white/70">Total</span>
            <span className="text-white">{total} €</span>
          </div>
        </div>
      )}

      <div className="mt-10">
        <p className="text-[10px] text-white/20">Powered by Noé</p>
      </div>
    </div>
  );
};

export default CompletionScreen;
