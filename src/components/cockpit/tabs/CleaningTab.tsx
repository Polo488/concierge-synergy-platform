import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { TrendingUp, MessageCircle, Search, Repeat, X, Check, Copy } from 'lucide-react';
import { getCleaningAnalysis, CleaningProperty, CleaningStatus } from '@/data/cockpit-mock';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STATUS_META: Record<CleaningStatus, { label: string; color: string; bg: string }> = {
  'sous-facture': { label: 'Sous-facturé', color: '#E84545', bg: '#E84545' },
  equilibre: { label: 'Équilibré', color: '#6B7AE8', bg: '#6B7AE8' },
  marge: { label: 'Marge positive', color: '#34C759', bg: '#34C759' },
  'a-valider': { label: 'À valider', color: '#94A3B8', bg: '#94A3B8' },
};

export function CockpitCleaningTab({ onGoToAudit }: { onGoToAudit: () => void }) {
  const [props, setProps] = useState<CleaningProperty[]>(() => getCleaningAnalysis());
  const [filter, setFilter] = useState<'all' | CleaningStatus>('all');
  const [selected, setSelected] = useState<CleaningProperty | null>(null);

  const stats = useMemo(() => {
    const equilibres = props.filter((p) => p.status === 'equilibre' || p.status === 'marge').length;
    const sous = props.filter((p) => p.status === 'sous-facture');
    const aValider = props.filter((p) => p.status === 'a-valider').length;
    const lossEstimate = sous.reduce((sum, p) => sum + (p.prestataire - p.facture) * p.rotations, 0);
    return { equilibres, sousCount: sous.length, lossEstimate, aValider };
  }, [props]);

  const visible = props.filter((p) => filter === 'all' || p.status === filter);

  const applyLever = (p: CleaningProperty, newFacture: number) => {
    setProps((arr) =>
      arr.map((x) => (x.id === p.id ? { ...x, facture: newFacture, status: newFacture >= x.prestataire - 3 ? 'equilibre' : 'sous-facture' } : x))
    );
    setSelected(null);
    if (typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 }, colors: ['#FF5C1A', '#34C759'] });
    }
    const gain = (newFacture - p.facture) * p.rotations;
    toast.success(`+${gain} €/mois récupérés sur ${p.name}`);
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="rounded-2xl p-4 sm:p-5 glass-thin border border-[hsl(var(--hairline))]">
        <h2 className="text-[16px] font-bold mb-1">🧹 Analyse du coût ménage</h2>
        <p className="text-[13px] text-[hsl(var(--label-2))] mb-4">Détecte où tu absorbes silencieusement les frais de prestataires</p>
        <div className="grid grid-cols-3 gap-3">
          <Stat color="#34C759" value={stats.equilibres} label="ménages équilibrés" />
          <Stat color="#E84545" value={stats.sousCount} label={`sous-facturés · -${stats.lossEstimate} €/mois`} />
          <Stat color="#94A3B8" value={stats.aValider} label="à valider" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {([
          ['all', 'Tous'],
          ['sous-facture', 'Sous-facturés'],
          ['equilibre', 'Équilibrés'],
          ['marge', 'Marge positive'],
          ['a-valider', 'À valider'],
        ] as const).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={cn(
              'px-3 h-8 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors',
              filter === k
                ? 'bg-[hsl(var(--label-1))] text-[hsl(var(--bg-app))]'
                : 'bg-[hsl(var(--label-1)/0.06)] text-[hsl(var(--label-2))] hover:bg-[hsl(var(--label-1)/0.10)]'
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {visible.map((p) => {
          const meta = STATUS_META[p.status];
          const diff = p.facture - p.prestataire;
          const diffPct = Math.round((diff / p.prestataire) * 100);
          const yearLoss = diff < 0 ? diff * p.rotations * 12 : 0;
          return (
            <motion.div
              key={p.id}
              layout
              className="rounded-2xl p-4 glass-thin border border-[hsl(var(--hairline))]"
              style={{ borderLeft: `4px solid ${meta.color}` }}
            >
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <h4 className="text-[14px] font-bold">🏠 {p.name}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: meta.bg }}>
                  {meta.label}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[12px] mb-2">
                <div><span className="text-[hsl(var(--label-3))]">Facturé</span><div className="font-bold tabular-nums">{p.facture} €</div></div>
                <div><span className="text-[hsl(var(--label-3))]">Prestataire</span><div className="font-bold tabular-nums">{p.prestataire} €</div></div>
                <div><span className="text-[hsl(var(--label-3))]">Écart</span><div className={cn('font-bold tabular-nums', diff < 0 ? 'text-[#E84545]' : 'text-[#34C759]')}>{diff > 0 ? '+' : ''}{diff} €</div></div>
              </div>
              <div className="h-1.5 rounded-full bg-[hsl(var(--label-1)/0.06)] mb-2">
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.abs(diffPct))}%`, background: meta.color }} />
              </div>
              <p className="text-[11px] text-[hsl(var(--label-2))] mb-3">
                {p.rotations} rotations / mois{yearLoss !== 0 && ` · Perte annuelle : ${yearLoss} €`}
              </p>
              {p.status !== 'a-valider' && (
                <button
                  onClick={() => setSelected(p)}
                  className="w-full h-9 rounded-lg bg-[#1A1A2E] text-white text-[12px] font-semibold hover:opacity-90"
                >
                  Voir les 4 leviers →
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <LeversDrawer property={selected} onClose={() => setSelected(null)} onApply={applyLever} onAudit={onGoToAudit} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ color, value, label }: { color: string; value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-[24px] font-bold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-[11px] text-[hsl(var(--label-2))]">{label}</div>
    </div>
  );
}

function LeversDrawer({
  property,
  onClose,
  onApply,
  onAudit,
}: {
  property: CleaningProperty;
  onClose: () => void;
  onApply: (p: CleaningProperty, newFacture: number) => void;
  onAudit: () => void;
}) {
  const [newPrice, setNewPrice] = useState(property.prestataire);
  const [showAudit, setShowAudit] = useState(false);
  const yearGain = (newPrice - property.facture) * property.rotations * 12;

  const handleApply = () => {
    onApply(property, newPrice);
    setTimeout(() => setShowAudit(true), 400);
  };

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
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="ml-auto w-full sm:w-[520px] bg-[hsl(var(--bg-app))] h-full overflow-y-auto"
      >
        <div className="p-5 border-b border-[hsl(var(--hairline))] flex items-start justify-between sticky top-0 bg-[hsl(var(--bg-app))]/90 backdrop-blur z-10">
          <div>
            <h3 className="text-[18px] font-bold">🏠 {property.name}</h3>
            <p className="text-[12px] text-[hsl(var(--label-2))] mt-1 max-w-sm">
              Tu factures {property.facture} € de ménage mais ton prestataire te coûte {property.prestataire} €. Tu absorbes {property.prestataire - property.facture} € par rotation.
            </p>
          </div>
          <button onClick={onClose} className="text-[hsl(var(--label-2))]"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* L1 */}
          <Lever icon={<TrendingUp size={16} className="text-[#FF5C1A]" />} title="Revoir le tarif facturation" mins="2 min" subtitle="Augmente le montant facturé pour couvrir le coût réel">
            <div className="flex items-center gap-2 mb-3">
              <button onClick={() => setNewPrice((v) => Math.max(0, v - 5))} className="w-9 h-9 rounded-lg bg-[hsl(var(--label-1)/0.06)] font-bold">−</button>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                className="flex-1 h-9 rounded-lg border border-[hsl(var(--hairline))] bg-transparent px-3 text-center text-[16px] font-bold tabular-nums"
              />
              <button onClick={() => setNewPrice((v) => v + 5)} className="w-9 h-9 rounded-lg bg-[hsl(var(--label-1)/0.06)] font-bold">+</button>
              <span className="text-[14px] text-[hsl(var(--label-2))]">€</span>
            </div>
            <p className="text-[12px] text-[hsl(var(--label-2))] mb-3">
              → {newPrice >= property.prestataire ? '✅ Coût couvert' : `⚠️ Reste ${property.prestataire - newPrice} € absorbé`} —{' '}
              <strong className="text-[hsl(var(--label-1))]">+{Math.max(0, yearGain)} €/an</strong>
            </p>
            <button onClick={handleApply} className="w-full h-10 rounded-lg bg-[#FF5C1A] text-white font-semibold">
              Mettre à jour ce tarif
            </button>
          </Lever>

          {/* L2 */}
          <Lever icon={<MessageCircle size={16} className="text-[#6B7AE8]" />} title="Négocier le tarif prestataire" mins="5 min" subtitle={`Tu fais ${property.rotations} rotations/mois. C'est un volume qui mérite une négociation.`}>
            <div className="rounded-lg p-3 bg-[hsl(var(--label-1)/0.04)] text-[12px] font-mono leading-relaxed mb-3 whitespace-pre-wrap">
{`Bonjour,
Sur les 6 derniers mois, j'ai fait appel à vous pour ${property.rotations} interventions par mois en moyenne. Au regard de ce volume, je souhaite renégocier le tarif unitaire actuellement à ${property.prestataire} €. Pourriez-vous m'indiquer votre meilleure offre pour ce volume récurrent ?
Cordialement,`}
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`Bonjour, [...] ${property.rotations} interventions à ${property.prestataire} €.`);
                toast.success('Template copié');
              }}
              className="w-full h-10 rounded-lg border border-[hsl(var(--hairline))] text-[13px] font-semibold flex items-center justify-center gap-2"
            >
              <Copy size={14} /> Copier le template
            </button>
          </Lever>

          {/* L3 */}
          <Lever icon={<Search size={16} className="text-[#F5C842]" />} title="Changer de prestataire" mins="15 min" subtitle="Le tarif médian dans ta zone est de 58 €. Tu paies 21 % au-dessus de la médiane.">
            <div className="space-y-1.5 mb-3">
              {[
                ['Toi', property.prestataire, '#E84545'],
                ['Médiane', 58, '#6B7AE8'],
                ['Top 25 %', 50, '#34C759'],
              ].map(([n, v, c]) => (
                <div key={n as string}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span>{n}</span>
                    <strong className="tabular-nums">{v} €</strong>
                  </div>
                  <div className="h-1.5 rounded-full bg-[hsl(var(--label-1)/0.06)]">
                    <div className="h-full rounded-full" style={{ width: `${((v as number) / 100) * 100}%`, background: c as string }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full h-10 rounded-lg border border-[hsl(var(--hairline))] text-[13px] font-semibold">
              Demander une recommandation à Noé
            </button>
          </Lever>

          {/* L4 */}
          <Lever icon={<Repeat size={16} className="text-[#34C759]" />} title="Passer en débours" mins="3 min" subtitle="Le ménage peut être facturé directement au propriétaire en débours, sans impacter ton compte de résultat.">
            <p className="text-[12px] text-[#34C759] mb-3">✅ Configurable immédiatement</p>
            <p className="text-[12px] text-[hsl(var(--label-2))] mb-3">
              Ce changement retire <strong>{property.prestataire} €/mois</strong> de tes charges opérationnelles.
            </p>
            <button className="w-full h-10 rounded-lg bg-[#34C759] text-white font-semibold">
              Configurer en débours
            </button>
          </Lever>
        </div>

        <AnimatePresence>
          {showAudit && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="sticky bottom-0 left-0 right-0 m-4 rounded-2xl p-4 text-white"
              style={{ background: 'linear-gradient(135deg,#1A1A2E,#2A2A4E)' }}
            >
              <p className="text-[13px] mb-3">
                ✨ Bien joué ! Tu veux qu'on identifie les 5 autres optimisations sur ton portefeuille ?
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowAudit(false)} className="flex-1 h-10 rounded-lg border border-white/20 text-white/80 text-[12px] font-semibold">Plus tard</button>
                <button onClick={() => { onClose(); onAudit(); }} className="flex-1 h-10 rounded-lg bg-[#FF5C1A] text-white text-[12px] font-bold">Audit 30 min offert →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </motion.div>
  );
}

function Lever({ icon, title, mins, subtitle, children }: { icon: React.ReactNode; title: string; mins: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 glass-thin border border-[hsl(var(--hairline))]">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-8 h-8 rounded-lg bg-[hsl(var(--label-1)/0.06)] flex items-center justify-center">{icon}</span>
        <h4 className="text-[14px] font-bold flex-1">{title}</h4>
        <span className="text-[10px] text-[hsl(var(--label-3))]">⏱ {mins}</span>
      </div>
      <p className="text-[12px] text-[hsl(var(--label-2))] mb-3 ml-10">{subtitle}</p>
      <div>{children}</div>
    </div>
  );
}
