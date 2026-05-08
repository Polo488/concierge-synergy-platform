import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, FileText, Video, Calculator } from 'lucide-react';
import { getAuditSlots, auditTestimonials } from '@/data/cockpit-mock';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CockpitAuditTab() {
  const slots = getAuditSlots();
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState<'30' | '60'>('30');

  const book = () => {
    if (!selectedSlot) return;
    toast.success(`Créneau réservé : ${slots[selectedDay].weekday} ${slots[selectedDay].date} à ${selectedSlot}`);
    setSelectedSlot(null);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'linear-gradient(135deg,#1A1A2E,#2A2A4E)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-[#FF5C1A] text-white text-[10px] font-bold uppercase tracking-wider">Offert</span>
          <span className="text-white/70 text-[12px]">Sans engagement</span>
        </div>
        <h2 className="text-white text-[22px] sm:text-[26px] font-bold mb-1" style={{ fontFamily: '"Plus Jakarta Sans"' }}>
          🎯 Audit financier avec un expert Noé
        </h2>
        <p className="text-white/75 text-[14px]">30 minutes pour identifier ce qui te coûte de l'argent</p>
      </div>

      {/* Pitch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { n: '1', t: 'Diagnostic personnalisé', d: 'Analyse de tes données réelles avec un expert. Pas de baratin, que des chiffres.' },
          { n: '2', t: 'Plan d\'action sur 90 jours', d: '3 optimisations concrètes priorisées par impact €. Tu repars avec une roadmap claire.' },
          { n: '3', t: 'Aucun engagement', d: 'L\'audit est offert, sans suite obligatoire. Tu décides après si tu veux qu\'on aille plus loin.' },
        ].map((c) => (
          <div key={c.n} className="rounded-2xl p-4 glass-thin border border-[hsl(var(--hairline))]">
            <span className="w-8 h-8 rounded-full bg-[#FF5C1A] text-white text-[13px] font-bold flex items-center justify-center mb-3">{c.n}</span>
            <h4 className="text-[14px] font-bold mb-1">{c.t}</h4>
            <p className="text-[12px] text-[hsl(var(--label-2))]">{c.d}</p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="rounded-2xl p-5 glass-thin border border-[hsl(var(--hairline))]">
        <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2"><Calendar size={16} /> Choisis ton créneau</h3>
        <div className="flex gap-2 mb-4">
          {(['30', '60'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={cn(
                'flex-1 sm:flex-initial px-4 h-9 rounded-lg text-[12px] font-semibold border transition-colors',
                duration === d ? 'bg-[#1A1A2E] text-white border-transparent' : 'border-[hsl(var(--hairline))] text-[hsl(var(--label-2))]'
              )}
            >
              {d} min — {d === '30' ? 'Audit standard (gratuit)' : 'Audit approfondi'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none mb-4 pb-1">
          {slots.map((s, i) => (
            <button
              key={i}
              onClick={() => { setSelectedDay(i); setSelectedSlot(null); }}
              className={cn(
                'flex-shrink-0 w-16 py-2 rounded-xl border text-center transition-colors',
                i === selectedDay ? 'bg-[#FF5C1A] text-white border-transparent' : 'border-[hsl(var(--hairline))] text-[hsl(var(--label-2))]'
              )}
            >
              <div className="text-[10px] uppercase">{s.weekday}</div>
              <div className="text-[14px] font-bold tabular-nums">{s.date}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {slots[selectedDay]?.slots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedSlot(time)}
              className={cn(
                'h-10 rounded-lg text-[13px] font-semibold border transition-colors',
                selectedSlot === time ? 'bg-[#1A1A2E] text-white border-transparent' : 'border-[hsl(var(--hairline))] hover:bg-[hsl(var(--label-1)/0.04)]'
              )}
            >
              {time}
            </button>
          ))}
        </div>

        {selectedSlot && (
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            onClick={book}
            className="w-full mt-4 h-12 rounded-xl bg-[#FF5C1A] text-white font-bold flex items-center justify-center gap-2"
          >
            <Check size={16} /> Confirmer mon créneau
          </motion.button>
        )}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {auditTestimonials.map((t, i) => (
          <div key={i} className="rounded-2xl p-4 glass-thin border border-[hsl(var(--hairline))]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[hsl(var(--label-1)/0.08)] flex items-center justify-center font-bold text-[14px]">{t.name[0]}</div>
              <div>
                <p className="text-[13px] font-bold">{t.name}</p>
                <p className="text-[11px] text-[hsl(var(--label-3))]">{t.company}</p>
              </div>
            </div>
            <p className="text-[12px] text-[hsl(var(--label-2))] italic mb-2">« {t.quote} »</p>
            <p className="text-[#34C759] font-bold tabular-nums text-[13px]">{t.gain}</p>
          </div>
        ))}
      </div>

      {/* Resources */}
      <div className="rounded-2xl p-5 glass-thin border border-[hsl(var(--hairline))]">
        <h3 className="text-[15px] font-bold mb-3">Ressources complémentaires</h3>
        <div className="space-y-2">
          {[
            { i: <FileText size={16} />, l: 'Le guide de la rentabilité en conciergerie', s: 'PDF · 24 pages' },
            { i: <Video size={16} />, l: 'Webinaire : 5 leviers pour booster ta marge', s: 'Replay · 38 min' },
            { i: <Calculator size={16} />, l: 'Calculateur de seuil de rentabilité', s: 'Mini-outil interactif' },
          ].map((r, i) => (
            <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--label-1)/0.04)] hover:bg-[hsl(var(--label-1)/0.08)] text-left transition-colors">
              <span className="w-9 h-9 rounded-lg bg-[#FF5C1A]/10 text-[#FF5C1A] flex items-center justify-center">{r.i}</span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{r.l}</p>
                <p className="text-[11px] text-[hsl(var(--label-3))]">{r.s}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
