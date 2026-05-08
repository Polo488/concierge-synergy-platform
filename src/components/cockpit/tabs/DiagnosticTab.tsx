import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, X, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { generateRadarScan, RadarFlaw, FlawSeverity } from '@/data/cockpit-mock';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const SEV: Record<FlawSeverity, { color: string; label: string }> = {
  critique: { color: '#E84545', label: 'CRITIQUE' },
  important: { color: '#FF8C42', label: 'IMPORTANT' },
  surveiller: { color: '#F5C842', label: 'À SURVEILLER' },
};

type Phase = 'idle' | 'scanning' | 'done';

export function CockpitDiagnosticTab({
  onGoToCleaning,
  onGoToAudit,
  onScoreChange,
}: {
  onGoToCleaning: () => void;
  onGoToAudit: () => void;
  onScoreChange: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [flaws, setFlaws] = useState<RadarFlaw[]>([]);
  const [revealed, setRevealed] = useState<number>(0);
  const [filter, setFilter] = useState<'all' | FlawSeverity>('all');
  const [selected, setSelected] = useState<RadarFlaw | null>(null);
  const [showAuditCTA, setShowAuditCTA] = useState(false);

  const totalImpact = flaws.filter((f) => !f.resolved).reduce((sum, f) => sum + f.monthlyImpact, 0);

  const startScan = () => {
    if (phase === 'scanning') return;
    setPhase('scanning');
    const newFlaws = generateRadarScan();
    setFlaws(newFlaws);
    setRevealed(0);

    // Reveal points progressively during the 4.5s scan
    newFlaws.forEach((_, i) => {
      setTimeout(() => setRevealed((r) => r + 1), 800 + i * 700);
    });
    setTimeout(() => setPhase('done'), 4800);
  };

  const markResolved = (flaw: RadarFlaw) => {
    setFlaws((fs) => fs.map((f) => (f.id === flaw.id ? { ...f, resolved: true } : f)));
    setSelected(null);
    onScoreChange();
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.4 }, colors: ['#FF5C1A', '#FF8C42', '#F5C842'] });
    }
    toast.success(`+${Math.round(flaw.monthlyImpact / 10)} €/mois récupérés. Continue !`);
    if (flaw.severity === 'critique') {
      const dismissed = document.cookie.includes('audit_last_dismissed=');
      if (!dismissed) setTimeout(() => setShowAuditCTA(true), 1200);
    }
  };

  const visible = flaws.filter((f) => filter === 'all' || f.severity === filter);

  return (
    <div className="space-y-5">
      {/* Radar */}
      <div
        className="rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #2A2A4E 100%)', minHeight: 540 }}
      >
        <div className="flex flex-col items-center">
          <Radar phase={phase} flaws={flaws} revealed={revealed} />

          {phase === 'idle' && (
            <>
              <button
                onClick={startScan}
                className="mt-6 px-7 py-3.5 rounded-xl text-white font-bold flex items-center gap-2 transition-all hover:-translate-y-0.5"
                style={{ background: '#FF5C1A', boxShadow: '0 8px 24px rgba(255,92,26,0.35)' }}
              >
                <Zap size={18} /> Lancer le scan
              </button>
              <p className="mt-3 text-white/55 text-[12px] text-center max-w-xs">
                Le scan analyse 12 indicateurs sur tes 41 logements. Durée : ~5 secondes.
              </p>
            </>
          )}
          {phase === 'scanning' && (
            <p className="mt-6 text-white text-[14px] font-medium">Analyse en cours…</p>
          )}
          {phase === 'done' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 text-center"
              >
                <div className="text-[#FF5C1A] text-[40px] font-bold tabular-nums leading-none">
                  {flaws.filter((f) => !f.resolved).length}
                </div>
                <div className="text-white/70 text-[13px]">faille{flaws.length > 1 ? 's' : ''} détectée{flaws.length > 1 ? 's' : ''}</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 px-4 py-3 rounded-xl bg-white/8 border border-white/10 text-center max-w-md"
              >
                <p className="text-white text-[15px] font-bold">
                  💸 {totalImpact.toLocaleString('fr-FR')} € de manque à gagner ce mois-ci
                </p>
                <p className="text-white/65 text-[12px] mt-1">
                  Tu peux récupérer une partie en suivant les recommandations ci-dessous.
                </p>
              </motion.div>
              <button
                onClick={startScan}
                className="mt-4 px-4 py-2 rounded-xl text-white/85 text-[12px] font-semibold border border-white/20 hover:bg-white/5"
              >
                Relancer un scan
              </button>
            </>
          )}
        </div>
      </div>

      {/* Flaws list */}
      {phase === 'done' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-[16px] font-bold text-[hsl(var(--label-1))]">Failles détectées ({flaws.length})</h3>
            <div className="flex gap-1.5 flex-wrap">
              {([
                ['all', 'Toutes'],
                ['critique', 'Critiques'],
                ['important', 'Importantes'],
                ['surveiller', 'À surveiller'],
              ] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={cn(
                    'px-2.5 h-7 rounded-full text-[11px] font-semibold transition-colors',
                    filter === k
                      ? 'bg-[hsl(var(--label-1))] text-[hsl(var(--bg-app))]'
                      : 'bg-[hsl(var(--label-1)/0.06)] text-[hsl(var(--label-2))] hover:bg-[hsl(var(--label-1)/0.10)]'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {visible.map((flaw) => (
            <FlawCard
              key={flaw.id}
              flaw={flaw}
              onClick={() => setSelected(flaw)}
              onResolve={() => markResolved(flaw)}
              isCleaning={flaw.category.includes('Ménage') || flaw.category.includes('ménage')}
              onCleaning={onGoToCleaning}
            />
          ))}
        </motion.div>
      )}

      <AnimatePresence>
        {selected && (
          <FlawDrawer flaw={selected} onClose={() => setSelected(null)} onResolve={() => markResolved(selected)} />
        )}
        {showAuditCTA && <AuditCTAModal onClose={() => setShowAuditCTA(false)} onAccept={onGoToAudit} />}
      </AnimatePresence>
    </div>
  );
}

function Radar({ phase, flaws, revealed }: { phase: Phase; flaws: RadarFlaw[]; revealed: number }) {
  // Place flaw points around the radar
  const points = flaws.slice(0, revealed).map((f, i) => {
    const angle = (i / Math.max(flaws.length, 1)) * Math.PI * 2;
    const r = 90 + (i % 3) * 25;
    return {
      x: 160 + Math.cos(angle) * r,
      y: 160 + Math.sin(angle) * r,
      color: SEV[f.severity].color,
      resolved: f.resolved,
    };
  });

  return (
    <div className="relative" style={{ width: 320, height: 320, maxWidth: '80vw' }}>
      <svg viewBox="0 0 320 320" className="w-full h-full">
        {[60, 100, 140, 160].map((r) => (
          <circle key={r} cx="160" cy="160" r={r} fill="none" stroke="rgba(255,92,26,0.18)" strokeWidth="1" />
        ))}
        <line x1="0" y1="160" x2="320" y2="160" stroke="rgba(255,92,26,0.18)" strokeWidth="1" />
        <line x1="160" y1="0" x2="160" y2="320" stroke="rgba(255,92,26,0.18)" strokeWidth="1" />

        {phase === 'scanning' && (
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '160px 160px' }}
          >
            <defs>
              <linearGradient id="scanGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FF5C1A" stopOpacity="0" />
                <stop offset="100%" stopColor="#FF5C1A" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path d="M 160 160 L 320 160 A 160 160 0 0 0 280 50 Z" fill="url(#scanGrad)" />
          </motion.g>
        )}

        {points.map((p, i) => (
          <motion.g
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.3, 1] }}
            transition={{ duration: 0.6 }}
          >
            <circle cx={p.x} cy={p.y} r="14" fill={p.color} opacity="0.25">
              <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0.05;0.25" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={p.x} cy={p.y} r="7" fill={p.color} stroke="white" strokeWidth="1.5" opacity={p.resolved ? 0.3 : 1} />
          </motion.g>
        ))}

        <circle cx="160" cy="160" r="22" fill="#1A1A2E" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="160" y="167" textAnchor="middle" fill="white" fontSize="16" fontWeight="700">n.</text>
      </svg>
    </div>
  );
}

function FlawCard({
  flaw,
  onClick,
  onResolve,
  isCleaning,
  onCleaning,
}: {
  flaw: RadarFlaw;
  onClick: () => void;
  onResolve: () => void;
  isCleaning: boolean;
  onCleaning: () => void;
}) {
  const sev = SEV[flaw.severity];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-2xl p-4 sm:p-5 glass-thin border border-[hsl(var(--hairline))] transition-all hover:-translate-y-0.5',
        flaw.resolved && 'opacity-60'
      )}
      style={{ borderLeft: `4px solid ${flaw.resolved ? '#34C759' : sev.color}` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <span
          className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-white flex items-center gap-1"
          style={{ background: flaw.resolved ? '#34C759' : sev.color }}
        >
          {flaw.resolved ? <Check size={10} /> : <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          {flaw.resolved ? 'RÉSOLU' : sev.label}
        </span>
        <span className="text-[12px] text-[hsl(var(--label-2))]">🏠 {flaw.property}</span>
      </div>
      <h4 className="text-[15px] font-bold text-[hsl(var(--label-1))] mb-1">{flaw.title}</h4>
      <p className="text-[13px] text-[hsl(var(--label-2))] mb-3">{flaw.diagnosis}</p>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[13px] tabular-nums">
          💰 <span className="text-[hsl(var(--label-2))]">Manque à gagner :</span>{' '}
          <strong className="text-[hsl(var(--label-1))]">{flaw.monthlyImpact} € / mois</strong>
        </p>
        {!flaw.resolved && (
          <div className="flex gap-2">
            {isCleaning && (
              <button onClick={onCleaning} className="px-3 h-8 rounded-lg text-[12px] font-semibold bg-[hsl(var(--label-1)/0.06)] hover:bg-[hsl(var(--label-1)/0.10)]">
                Voir l'onglet Ménage
              </button>
            )}
            <button onClick={onClick} className="px-3 h-8 rounded-lg text-[12px] font-semibold bg-[#1A1A2E] text-white flex items-center gap-1 hover:opacity-90">
              Voir le détail <ChevronRight size={12} />
            </button>
            <button onClick={onResolve} className="px-3 h-8 rounded-lg text-[12px] font-semibold border border-[hsl(var(--hairline))] text-[hsl(var(--label-2))] hover:bg-[hsl(var(--label-1)/0.04)]">
              Marquer résolu
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function FlawDrawer({ flaw, onClose, onResolve }: { flaw: RadarFlaw; onClose: () => void; onResolve: () => void }) {
  const sev = SEV[flaw.severity];
  const ratio = flaw.details.you / flaw.details.market;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="ml-auto w-full sm:w-[480px] bg-[hsl(var(--bg-app))] h-full overflow-y-auto"
      >
        <div className="p-5 border-b border-[hsl(var(--hairline))] flex items-center justify-between sticky top-0 bg-[hsl(var(--bg-app))]/90 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: sev.color }}>
              {sev.label}
            </span>
            <span className="text-[12px] text-[hsl(var(--label-2))]">{flaw.category}</span>
          </div>
          <button onClick={onClose} className="text-[hsl(var(--label-2))] hover:text-[hsl(var(--label-1))]"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-[20px] font-bold mb-1">{flaw.title}</h3>
            <p className="text-[14px] text-[hsl(var(--label-2))]">{flaw.diagnosis}</p>
          </div>

          <div className="rounded-2xl p-4 glass-thin border border-[hsl(var(--hairline))]">
            <h4 className="text-[12px] uppercase tracking-wider font-bold text-[hsl(var(--label-3))] mb-3">Toi vs marché</h4>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span>Toi</span>
                  <strong className="tabular-nums">{flaw.details.you} {flaw.details.unit}</strong>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--label-1)/0.06)]">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, ratio * 100)}%`, background: sev.color }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[12px] mb-1">
                  <span>Marché</span>
                  <strong className="tabular-nums">{flaw.details.market} {flaw.details.unit}</strong>
                </div>
                <div className="h-2 rounded-full bg-[hsl(var(--label-1)/0.06)]">
                  <div className="h-full rounded-full bg-[#34C759]" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[14px] font-bold mb-2">Comment corriger</h4>
            <div className="space-y-2">
              {flaw.actions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--label-1)/0.04)]">
                  <span className="w-6 h-6 rounded-full bg-[#FF5C1A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-[13px] text-[hsl(var(--label-1))]">{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(120deg,#FF5C1A,#FF8C42)' }}>
            <p className="text-[12px] uppercase tracking-wider opacity-90 font-bold mb-1">Si tu corriges</p>
            <p className="text-[28px] font-bold tabular-nums">+{(flaw.monthlyImpact * 12).toLocaleString('fr-FR')} € / an</p>
            <p className="text-[12px] opacity-90 mt-1">Soit {flaw.monthlyImpact} €/mois récupérés sur ce poste.</p>
          </div>

          <button
            onClick={onResolve}
            className="w-full h-12 rounded-xl bg-[#1A1A2E] text-white font-bold flex items-center justify-center gap-2"
          >
            <Check size={16} /> Marquer comme résolu
          </button>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function AuditCTAModal({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) {
  const dismiss = () => {
    document.cookie = `audit_last_dismissed=1; max-age=${7 * 24 * 3600}; path=/`;
    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full rounded-3xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg,#1A1A2E,#2A2A4E)' }}
      >
        <div className="text-[36px] mb-2">✨</div>
        <h3 className="text-[20px] font-bold mb-2">Bien joué !</h3>
        <p className="text-[14px] text-white/80 mb-5">
          Tu viens de récupérer une faille. Tu veux qu'on identifie ensemble les autres optimisations sur l'ensemble de ton portefeuille ?
        </p>
        <div className="rounded-xl p-3 bg-white/8 mb-5">
          <p className="text-[13px] font-semibold">📞 Audit financier 30 min — offert</p>
          <p className="text-[11px] text-white/65 mt-0.5">Avec un expert Noé. Sans engagement.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={dismiss} className="flex-1 h-11 rounded-xl border border-white/20 text-white/80 font-semibold">Plus tard</button>
          <button
            onClick={() => { onAccept(); onClose(); }}
            className="flex-1 h-11 rounded-xl bg-[#FF5C1A] text-white font-bold"
          >
            Réserver un créneau
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
