import { useEffect } from 'react';
import { Check, Sparkles, Home } from 'lucide-react';
import { motion } from 'framer-motion';
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
  propertyName?: string;
  onGoToHub: () => void;
}

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const CompletionScreen = ({
  guestName,
  acceptedUpsells,
  propertyName = 'Votre logement',
  onGoToHub,
}: CompletionScreenProps) => {
  useEffect(() => {
    const t = setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.4 },
        colors: ['#34d399', '#60a5fa', '#fbbf24', '#f472b6'],
        disableForReducedMotion: true,
      });
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const total = acceptedUpsells.reduce((s, u) => s + u.price, 0);

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="flex-1 flex flex-col px-5 pb-8 pt-10 items-center justify-center"
    >
      {/* Success icon */}
      <motion.div variants={fadeUp} className="mb-6">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center border border-emerald-200/40 shadow-[0_12px_40px_rgba(52,211,153,0.15)]">
          <Check size={40} className="text-emerald-500" />
        </div>
      </motion.div>

      {/* Message */}
      <motion.div variants={fadeUp} className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-slate-800 tracking-tight">
          Excellent séjour, {guestName} !
        </h1>
        <p className="text-[14px] text-slate-400 mt-2 max-w-[300px] mx-auto leading-relaxed">
          Votre parcours d'accueil est terminé. Retrouvez toutes les informations de votre séjour dans votre livret.
        </p>
      </motion.div>

      {/* Upsell summary */}
      {acceptedUpsells.length > 0 && (
        <motion.div variants={fadeUp} className="w-full p-5 rounded-[22px] bg-emerald-50/80 backdrop-blur-2xl border border-emerald-200/30 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-emerald-600" />
            <p className="text-[10px] text-emerald-700/60 font-semibold uppercase tracking-widest">
              Vos options confirmées
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
        </motion.div>
      )}

      {/* CTA to hub */}
      <motion.div variants={fadeUp} className="w-full">
        <button
          onClick={onGoToHub}
          className="group w-full h-[56px] rounded-2xl bg-slate-900 font-semibold text-[15px] text-white flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
        >
          <Home size={16} />
          Accéder à mon livret
        </button>
      </motion.div>

      {/* Footer */}
      <motion.div variants={fadeUp} className="mt-auto pt-8">
        <p className="text-[10px] text-slate-300 tracking-wider">Powered by Noé · {propertyName}</p>
      </motion.div>
    </motion.div>
  );
};

export default CompletionScreen;
