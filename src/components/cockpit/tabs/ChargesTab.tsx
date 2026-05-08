import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileSpreadsheet, Check, X, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getCSVImportMock, CSVLine, CSVCategory } from '@/data/cockpit-mock';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Phase = 'idle' | 'detecting' | 'classifying' | 'validation' | 'result';

const CAT_META: Record<CSVCategory, { color: string; label: string; icon: string }> = {
  essentielle: { color: '#34C759', label: 'Essentielles', icon: '🟢' },
  'non-essentielle': { color: '#E84545', label: 'Non essentielles', icon: '🔴' },
  'a-valider': { color: '#F5C842', label: 'À valider', icon: '🟡' },
};

export function CockpitChargesTab({ onGoToAudit, onGoToCleaning }: { onGoToAudit: () => void; onGoToCleaning: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [lines, setLines] = useState<CSVLine[]>([]);
  const [showAudit, setShowAudit] = useState(false);
  const [progress, setProgress] = useState(0);

  const startImport = () => {
    setPhase('detecting');
    setTimeout(() => {
      setPhase('classifying');
      const data = getCSVImportMock();
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setProgress(i);
        if (i >= data.length) {
          clearInterval(interval);
          setLines(data);
          setTimeout(() => setPhase('validation'), 400);
        }
      }, 100);
    }, 1500);
  };

  const reclassify = (id: string, cat: CSVCategory) => {
    setLines((arr) => arr.map((l) => (l.id === id ? { ...l, category: cat } : l)));
  };

  const finishValidation = () => {
    setPhase('result');
    if (!document.cookie.includes('audit_first_csv_shown=')) {
      document.cookie = 'audit_first_csv_shown=1; max-age=31536000; path=/';
      setTimeout(() => setShowAudit(true), 2000);
    }
  };

  const cats = lines.reduce(
    (acc, l) => {
      acc[l.category].count++;
      acc[l.category].total += Math.abs(l.amount);
      return acc;
    },
    {
      essentielle: { count: 0, total: 0 },
      'non-essentielle': { count: 0, total: 0 },
      'a-valider': { count: 0, total: 0 },
    } as Record<CSVCategory, { count: number; total: number }>
  );

  return (
    <div className="space-y-5">
      {phase === 'idle' && (
        <div className="rounded-3xl p-8 sm:p-12 text-center glass-thin border border-[hsl(var(--hairline))]">
          <FileSpreadsheet size={56} className="mx-auto mb-4 text-[#FF5C1A]" />
          <h2 className="text-[20px] font-bold mb-2">Importe ton relevé bancaire</h2>
          <p className="text-[13px] text-[hsl(var(--label-2))] mb-5 max-w-md mx-auto">
            Glisse-dépose ton CSV bancaire. Noé détecte le format automatiquement et pré-classe tes lignes en 30 secondes.
          </p>
          <button onClick={startImport} className="px-6 h-11 rounded-xl bg-[#FF5C1A] text-white font-bold inline-flex items-center gap-2">
            <Upload size={16} /> Lancer un import (démo)
          </button>
          <p className="mt-4 text-[11px] text-[hsl(var(--label-3))]">
            Banques supportées : BNP, Crédit Agricole, SG, CIC, Boursorama, Qonto…
          </p>
        </div>
      )}

      {(phase === 'detecting' || phase === 'classifying') && (
        <div className="rounded-3xl p-10 text-center glass-thin border border-[hsl(var(--hairline))]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="inline-block mb-4">
            <FileSpreadsheet size={48} className="text-[#FF5C1A]" />
          </motion.div>
          <p className="text-[15px] font-bold mb-1">{phase === 'detecting' ? 'Détection du format…' : 'Classification en cours…'}</p>
          <p className="text-[12px] text-[hsl(var(--label-2))]">
            {phase === 'detecting'
              ? 'Banque détectée : Crédit Agricole — Format CSV (point-virgule)'
              : `${progress} / 17 lignes traitées`}
          </p>
        </div>
      )}

      {phase === 'validation' && (
        <>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(Object.keys(CAT_META) as CSVCategory[]).map((k) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-3 glass-thin border border-[hsl(var(--hairline))]"
                style={{ borderTop: `3px solid ${CAT_META[k].color}` }}
              >
                <div className="text-[10px] uppercase tracking-wider font-bold text-[hsl(var(--label-3))] mb-1">{CAT_META[k].label}</div>
                <div className="text-[20px] font-bold tabular-nums">{cats[k].count}</div>
                <div className="text-[12px] text-[hsl(var(--label-2))] tabular-nums">{cats[k].total.toFixed(0)} €</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.keys(CAT_META) as CSVCategory[]).map((k) => (
              <div key={k} className="rounded-2xl p-3 glass-thin border border-[hsl(var(--hairline))]">
                <h4 className="text-[12px] font-bold mb-2 flex items-center gap-1">
                  <span>{CAT_META[k].icon}</span> {CAT_META[k].label} ({lines.filter((l) => l.category === k).length})
                </h4>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {lines.filter((l) => l.category === k).map((l) => (
                    <div key={l.id} className="rounded-lg p-2.5 bg-[hsl(var(--label-1)/0.04)] group">
                      <div className="text-[10px] text-[hsl(var(--label-3))]">{l.date}</div>
                      <div className="text-[12px] font-semibold truncate">{l.label}</div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[12px] tabular-nums font-bold">{l.amount.toFixed(2)} €</span>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(['essentielle', 'non-essentielle', 'a-valider'] as CSVCategory[]).filter((c) => c !== k).map((c) => (
                            <button
                              key={c}
                              onClick={() => reclassify(l.id, c)}
                              className="w-5 h-5 rounded text-[10px]"
                              style={{ background: CAT_META[c].color, color: 'white' }}
                              title={`Vers ${CAT_META[c].label}`}
                            >
                              ↦
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={finishValidation} className="w-full sm:w-auto sm:mx-auto sm:flex h-11 rounded-xl bg-[#1A1A2E] text-white font-bold px-6 items-center justify-center gap-2 mx-auto">
            Valider et voir le résultat <ArrowRight size={16} />
          </button>
        </>
      )}

      {phase === 'result' && (
        <ResultView lines={lines} onGoToCleaning={onGoToCleaning} onGoToAudit={onGoToAudit} />
      )}

      <AnimatePresence>
        {showAudit && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-md w-full rounded-3xl p-6 text-white" style={{ background: 'linear-gradient(135deg,#1A1A2E,#2A2A4E)' }}>
              <div className="text-[36px] mb-2">✨</div>
              <h3 className="text-[20px] font-bold mb-2">Bilan importé !</h3>
              <p className="text-[14px] text-white/80 mb-5">
                Tu connais maintenant tes vrais chiffres. Noé a détecté 3 postes où tu pourrais optimiser pour <strong>+480 €/mois</strong>. On peut les analyser ensemble en 30 minutes.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowAudit(false)} className="flex-1 h-11 rounded-xl border border-white/20 text-white/80 font-semibold">Plus tard</button>
                <button onClick={() => { setShowAudit(false); onGoToAudit(); }} className="flex-1 h-11 rounded-xl bg-[#FF5C1A] text-white font-bold">Réserver mon créneau</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultView({ lines, onGoToCleaning, onGoToAudit }: { lines: CSVLine[]; onGoToCleaning: () => void; onGoToAudit: () => void }) {
  const essential = lines.filter((l) => l.category === 'essentielle');
  const totalEssential = essential.reduce((s, l) => s + Math.abs(l.amount), 0);
  const totalNonEssential = lines.filter((l) => l.category === 'non-essentielle').reduce((s, l) => s + Math.abs(l.amount), 0);
  const flowIn = 6510; // mock revenue
  const result = flowIn - totalEssential;

  const subTotals = essential.reduce((acc, l) => {
    acc[l.subCategory] = (acc[l.subCategory] || 0) + Math.abs(l.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(subTotals).map(([name, value]) => ({ name, value }));
  const COLORS = ['#FF5C1A', '#6B7AE8', '#F5C842', '#34C759', '#E84545', '#FF8C42', '#94A3B8', '#1A1A2E'];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 glass-thin border border-[hsl(var(--hairline))]">
        <h3 className="text-[15px] font-bold mb-4">📊 Tes charges réelles — Mai 2026</h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[13px] font-semibold">
              <span>Charges essentielles</span>
              <span className="tabular-nums">{totalEssential.toFixed(0)} €</span>
            </div>
            {Object.entries(subTotals).map(([k, v]) => (
              <div key={k} className="flex justify-between text-[12px] text-[hsl(var(--label-2))] pl-3">
                <span>{k}</span>
                <span className="tabular-nums">{v.toFixed(0)} €</span>
              </div>
            ))}
            <div className="flex justify-between text-[13px] pt-2 border-t border-[hsl(var(--hairline))] mt-2">
              <span>Charges non essentielles (hors P&L)</span>
              <span className="tabular-nums">{totalNonEssential.toFixed(0)} €</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold pt-3 border-t border-[hsl(var(--hairline))] mt-2">
              <span>Résultat net estimé</span>
              <span className="tabular-nums text-[#34C759]">+{result.toFixed(0)} € ✅</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-5 glass-thin border border-[hsl(var(--hairline))]">
        <h3 className="text-[15px] font-bold mb-3">🎯 3 optimisations pour toi</h3>
        <div className="space-y-2.5">
          {[
            { t: 'Tes abonnements métier représentent 12,7 % de tes charges fixes. La moyenne Noé est à 8 %.', g: '+120 €/mois', a: null },
            { t: 'Tes coûts ménage absorbés sont à 4,3 % du flux entrant. Le seuil sain est à 3 %.', g: '+90 €/mois', a: { l: 'Onglet Ménage', f: onGoToCleaning } },
            { t: 'Ton ratio salaires/CA est à 31 %. Au-dessus du seuil critique de 28 %.', g: '+270 €/mois', a: { l: 'Audit financier offert', f: onGoToAudit } },
          ].map((it, i) => (
            <div key={i} className="rounded-xl p-3 bg-[hsl(var(--label-1)/0.04)]">
              <p className="text-[13px]">{it.t}</p>
              <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
                <span className="text-[#FF5C1A] font-bold tabular-nums text-[13px]">{it.g}</span>
                {it.a && (
                  <button onClick={it.a.f} className="text-[12px] font-semibold text-[hsl(var(--label-1))] underline">
                    → {it.a.l}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
