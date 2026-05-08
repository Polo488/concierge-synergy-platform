import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Target, ArrowRight, Zap, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { overviewMock } from '@/data/cockpit-mock';
import { cn } from '@/lib/utils';

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function CountNumber({ value, decimals = 0, suffix = '' }: { value: number; decimals?: number; suffix?: string }) {
  const v = useCountUp(value);
  return <span className="tabular-nums">{v.toFixed(decimals)}{suffix}</span>;
}

export function CockpitOverviewTab({ onGoToDiagnostic }: { onGoToDiagnostic: () => void }) {
  const [flashOpen, setFlashOpen] = useState(false);
  const totalImpact = 1247;

  return (
    <div className="space-y-5">
      {/* Alert banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap border"
        style={{
          background: 'linear-gradient(90deg, hsl(0 75% 55% / 0.08), transparent)',
          borderColor: 'hsl(0 75% 55% / 0.18)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#E84545' }} />
          <p className="text-[14px] text-[hsl(var(--label-1))]">
            <strong>3 failles critiques détectées</strong> — {totalImpact.toLocaleString('fr-FR')} € / mois en jeu
          </p>
        </div>
        <button
          onClick={onGoToDiagnostic}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#E84545] hover:underline"
        >
          Lancer le diagnostic complet <ArrowRight size={14} />
        </button>
      </motion.div>

      {/* 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PillarCard
          color="#FF5C1A"
          badge="NOÉ SCORE"
          title="Rentabilité par logement"
          icon={<span className="text-[14px] font-bold text-white">n.</span>}
          main={
            <>
              <CountNumber value={overviewMock.noeScore.rentables} /> / {overviewMock.noeScore.total}
              <span className="text-[14px] font-medium text-[hsl(var(--label-2))] ml-1">logements rentables</span>
            </>
          }
        >
          <div className="h-2 rounded-full overflow-hidden flex bg-[hsl(var(--label-1)/0.06)]">
            <div className="h-full" style={{ width: '20%', background: '#E84545' }} />
            <div className="h-full" style={{ width: '20%', background: '#FF8C42' }} />
            <div className="h-full" style={{ width: '60%', background: '#34C759' }} />
          </div>
          <div className="mt-3 space-y-1.5">
            {overviewMock.noeScore.priorities.map((p) => (
              <div key={p.id} className="flex items-center justify-between text-[12px] text-[hsl(var(--label-2))]">
                <span className="truncate">📌 {p.label}</span>
                <span className="tabular-nums font-semibold text-[hsl(var(--label-1))]">{p.commission} €</span>
              </div>
            ))}
          </div>
        </PillarCard>

        <PillarCard
          color="#6B7AE8"
          badge="TRÉSO PULSE"
          title="Trésorerie & BFR"
          icon={<Activity size={14} className="text-white" />}
        >
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'BFR estimé', value: `${(overviewMock.treso.bfr / 1000).toFixed(0)}k €` },
              { label: 'Jours tréso', value: `${overviewMock.treso.daysCash}j` },
              { label: 'À reverser', value: `${(overviewMock.treso.pendingFlow / 1000).toFixed(1)}k €` },
            ].map((m) => (
              <div key={m.label}>
                <div className="text-[10px] uppercase text-[hsl(var(--label-3))] tracking-wider mb-0.5">{m.label}</div>
                <div className="text-[15px] font-bold tabular-nums text-[hsl(var(--label-1))]">{m.value}</div>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-[hsl(var(--label-1)/0.06)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6B7AE8, #34C759)' }}
            />
          </div>
          <p className="mt-2 text-[12px] text-[hsl(var(--label-2))]">✓ Trésorerie correcte — couverture &gt; 1 mois</p>
        </PillarCard>

        <PillarCard
          color="#F5C842"
          badge="PERF INDEX"
          title="Performance opérationnelle"
          badgeText="navy"
          icon={<Target size={14} className="text-[#1A1A2E]" />}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--label-1)/0.06)" strokeWidth="3" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#F5C842"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="100 100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - overviewMock.perf.score }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  pathLength={100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[18px] font-bold tabular-nums text-[hsl(var(--label-1))]">
                <CountNumber value={overviewMock.perf.score} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              {overviewMock.perf.sub.map((s) => (
                <div key={s.label} className="text-[11px]">
                  <div className="text-[hsl(var(--label-3))]">{s.label}</div>
                  <div className="font-bold tabular-nums text-[hsl(var(--label-1))]">{s.value}/100</div>
                </div>
              ))}
            </div>
          </div>
        </PillarCard>
      </div>

      {/* Évolution 6 mois */}
      <div className="rounded-2xl p-5 glass-thin border border-[hsl(var(--hairline))]">
        <h3 className="text-[15px] font-bold text-[hsl(var(--label-1))] mb-4">Évolution sur 6 mois</h3>
        <div className="space-y-3">
          {[
            { name: 'Noé Score', data: overviewMock.evolution.noe, color: '#FF5C1A', delta: '+12 %', up: true },
            { name: 'Tréso Pulse', data: overviewMock.evolution.treso, color: '#6B7AE8', delta: '-5 %', up: false },
            { name: 'Perf Index', data: overviewMock.evolution.perf, color: '#F5C842', delta: '+8 %', up: true },
          ].map((row) => (
            <div key={row.name} className="grid grid-cols-[110px_1fr_70px] sm:grid-cols-[140px_1fr_80px] items-center gap-3">
              <span className="text-[13px] font-medium text-[hsl(var(--label-1))]">{row.name}</span>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={row.data.map((v, i) => ({ i, v }))}>
                    <Line type="monotone" dataKey="v" stroke={row.color} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <span className={cn('text-[13px] font-bold tabular-nums text-right', row.up ? 'text-[#34C759]' : 'text-[#E84545]')}>
                {row.delta} {row.up ? '↑' : '↓'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bilan flash CTA */}
      <button
        onClick={() => setFlashOpen(true)}
        className="w-full rounded-2xl p-5 text-left text-white relative overflow-hidden group"
        style={{ background: 'linear-gradient(120deg, #FF5C1A 0%, #1A1A2E 110%)' }}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap size={16} /> <span className="text-[12px] uppercase tracking-wider font-bold opacity-80">Bilan flash</span>
            </div>
            <h3 className="text-[18px] font-bold mb-1">5 questions pour affiner ton diagnostic</h3>
            <p className="text-[13px] opacity-85">Débloque des recommandations sur-mesure en 60 secondes.</p>
          </div>
          <span className="px-4 py-2 rounded-full bg-white text-[#FF5C1A] text-[13px] font-bold flex items-center gap-1.5 group-hover:scale-105 transition-transform">
            Commencer <ArrowRight size={14} />
          </span>
        </div>
      </button>

      {flashOpen && <BilanFlashModal onClose={() => setFlashOpen(false)} />}
    </div>
  );
}

function PillarCard({
  color,
  badge,
  title,
  icon,
  badgeText = 'white',
  main,
  children,
}: {
  color: string;
  badge: string;
  title: string;
  icon: React.ReactNode;
  badgeText?: 'white' | 'navy';
  main?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 glass-thin border border-[hsl(var(--hairline))]"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5"
          style={{ background: color, color: badgeText === 'navy' ? '#1A1A2E' : '#fff' }}
        >
          {icon}
          {badge}
        </span>
      </div>
      <h3 className="text-[14px] font-semibold text-[hsl(var(--label-2))] mb-2">{title}</h3>
      {main && <div className="text-[24px] font-bold text-[hsl(var(--label-1))] mb-3 leading-tight">{main}</div>}
      {children}
    </div>
  );
}

const FLASH_QUESTIONS = [
  { q: 'Combien de logements gères-tu actuellement ?', type: 'slider', min: 1, max: 200 },
  { q: 'Quel est ton tarif de ménage facturé moyen ?', type: 'number', unit: '€' },
  { q: 'As-tu déjà négocié tes tarifs prestataires cette année ?', type: 'choice', options: ['Oui', 'Non', 'Pas encore'] },
  { q: 'Quel est ton objectif de croissance sur 12 mois ?', type: 'choice', options: ['+20 %', '+50 %', 'x2', 'Stabiliser'] },
  { q: 'Combien de temps passes-tu sur la facturation chaque mois ?', type: 'choice', options: ['<2h', '2–5h', '5–10h', '>10h'] },
] as const;

function BilanFlashModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [num, setNum] = useState(50);
  const [n2, setN2] = useState(60);
  const done = step >= FLASH_QUESTIONS.length;

  const next = (val: string | number) => {
    setAnswers((a) => ({ ...a, [step]: val }));
    setStep((s) => s + 1);
  };

  const current = FLASH_QUESTIONS[step];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#1A1A2E]/95 backdrop-blur-xl flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div className="flex-1 mr-3">
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((done ? FLASH_QUESTIONS.length : step) / FLASH_QUESTIONS.length) * 100}%` }}
              className="h-full bg-[#FF5C1A]"
            />
          </div>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-5">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="max-w-md w-full text-center"
          >
            <p className="text-white/50 text-[12px] uppercase tracking-wider mb-3">Question {step + 1} / {FLASH_QUESTIONS.length}</p>
            <h2 className="text-white text-[22px] sm:text-[28px] font-bold mb-8 leading-tight" style={{ fontFamily: '"Plus Jakarta Sans", Inter' }}>
              {current.q}
            </h2>

            {current.type === 'slider' && (
              <div className="space-y-5">
                <div className="text-[#FF5C1A] text-[48px] font-bold tabular-nums">{num}</div>
                <input
                  type="range"
                  min={current.min}
                  max={current.max}
                  value={num}
                  onChange={(e) => setNum(parseInt(e.target.value))}
                  className="w-full accent-[#FF5C1A]"
                />
                <button onClick={() => next(num)} className="w-full h-12 rounded-xl bg-[#FF5C1A] text-white font-bold">Continuer</button>
              </div>
            )}

            {current.type === 'number' && (
              <div className="space-y-5">
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setN2((v) => Math.max(0, v - 5))} className="w-12 h-12 rounded-full bg-white/10 text-white text-xl">−</button>
                  <div className="text-[#FF5C1A] text-[48px] font-bold tabular-nums min-w-[120px]">{n2} €</div>
                  <button onClick={() => setN2((v) => v + 5)} className="w-12 h-12 rounded-full bg-white/10 text-white text-xl">+</button>
                </div>
                <button onClick={() => next(n2)} className="w-full h-12 rounded-xl bg-[#FF5C1A] text-white font-bold">Continuer</button>
              </div>
            )}

            {current.type === 'choice' && (
              <div className="space-y-2.5">
                {(current.options as readonly string[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => next(opt)}
                    className="w-full h-12 rounded-xl bg-white/8 hover:bg-white/15 text-white font-semibold transition-colors border border-white/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center text-white"
          >
            <div className="text-[48px] mb-3">✨</div>
            <h2 className="text-[24px] font-bold mb-2" style={{ fontFamily: '"Plus Jakarta Sans"' }}>Bilan terminé !</h2>
            <p className="text-white/70 text-[14px] mb-6">3 axes prioritaires identifiés pour toi</p>
            <div className="space-y-2.5 text-left mb-6">
              {[
                { a: 'Réajuster les tarifs ménage sous-facturés', g: '+540 €/mois' },
                { a: 'Activer la tarification dynamique haute saison', g: '+380 €/mois' },
                { a: 'Renégocier les abonnements métier', g: '+120 €/mois' },
              ].map((it, i) => (
                <div key={i} className="rounded-xl bg-white/8 border border-white/10 p-3.5">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FF5C1A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold">{it.a}</p>
                      <p className="text-[12px] text-[#FF5C1A] font-bold tabular-nums mt-0.5">{it.g}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="w-full h-12 rounded-xl bg-[#FF5C1A] text-white font-bold">
              Voir le diagnostic complet
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
