import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PaymentItem {
  id: string;
  name: string;
  price: number;
  currency: string;
}

interface PaymentSimulationProps {
  items: PaymentItem[];
  onBack: () => void;
  onSuccess: () => void;
}

const PaymentSimulation = ({ items, onBack, onSuccess }: PaymentSimulationProps) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const total = items.reduce((s, i) => s + i.price, 0);

  const formatCardNumber = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => onSuccess(), 1800);
    }, 2000);
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length >= 12 && expiry.length >= 4 && cvc.length >= 3;

  if (step === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
      >
        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5 border border-emerald-200/40 shadow-[0_8px_32px_rgba(52,211,153,0.12)]">
          <Check size={36} className="text-emerald-500" />
        </div>
        <h2 className="text-[22px] font-bold text-slate-800 tracking-tight">Paiement confirmé</h2>
        <p className="text-[13px] text-slate-400 mt-1.5">Vos extras sont réservés !</p>
      </motion.div>
    );
  }

  if (step === 'processing') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
      >
        <Loader2 size={40} className="text-slate-400 animate-spin mb-5" />
        <p className="text-[15px] text-slate-600 font-medium">Traitement en cours…</p>
        <p className="text-[12px] text-slate-400 mt-1">Ne fermez pas cette page</p>
      </motion.div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-[env(safe-area-inset-top,12px)] mt-3 pb-3">
        <button
          onClick={onBack}
          className="h-10 w-10 rounded-xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-slate-800">Paiement</p>
          <p className="text-[11px] text-slate-400">Paiement sécurisé</p>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <Lock size={12} />
          <span className="text-[10px] font-medium">SSL</span>
        </div>
      </div>

      <div className="flex-1 px-5 pb-8 space-y-4">
        {/* Order summary */}
        <div className="p-4 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em] mb-3">Récapitulatif</p>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-1.5">
              <span className="text-[13px] text-slate-600">{item.name}</span>
              <span className="text-[13px] font-semibold text-slate-700">{item.price}{item.currency}</span>
            </div>
          ))}
          <div className="border-t border-slate-100 mt-2 pt-2 flex justify-between">
            <span className="text-[14px] font-bold text-slate-800">Total</span>
            <span className="text-[16px] font-bold text-slate-900">{total} €</span>
          </div>
        </div>

        {/* Card form */}
        <div className="p-5 rounded-[22px] bg-white/65 backdrop-blur-2xl border border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={16} className="text-slate-400" />
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-[0.15em]">Carte bancaire</p>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium mb-1 block">Numéro de carte</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-[15px] text-slate-800 font-mono placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 font-medium mb-1 block">Expiration</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/AA"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-[15px] text-slate-800 font-mono placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>
            <div className="w-28">
              <label className="text-[11px] text-slate-400 font-medium mb-1 block">CVC</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="123"
                value={cvc}
                maxLength={4}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full h-12 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 text-[15px] text-slate-800 font-mono placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={!isFormValid}
          className={cn(
            'w-full h-[56px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_8px_32px_rgba(0,0,0,0.15)]',
            isFormValid
              ? 'bg-slate-900 text-white active:scale-[0.97]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          <Lock size={14} />
          Payer {total} €
        </button>

        <p className="text-center text-[10px] text-slate-300 tracking-wider mt-2">
          Simulation · Aucun prélèvement réel
        </p>
      </div>
    </div>
  );
};

export default PaymentSimulation;
