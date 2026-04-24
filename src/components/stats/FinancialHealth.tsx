import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, Plus, Trash2, Share2, Loader2, ArrowUpDown, Wrench, ArrowRight, Award, Target, Hourglass, Lock, Mountain, Building2, Trees, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import noeIconOrange from '@/assets/noe-icon-orange.png';
import noeIconWhite from '@/assets/noe-icon-white.png';

interface CustomCharge {
  id: string;
  name: string;
  amount: number;
}

const MOCK_PROPERTIES = [
  { name: 'Villa Azur — Nice', icon: 'image', revenue: 3800, charges: 1200 },
  { name: 'Chalet Écrins — Chamonix', icon: 'mountain', revenue: 2100, charges: 980 },
  { name: 'Studio Bastille — Paris', icon: 'building', revenue: 1450, charges: 820 },
  { name: 'Gîte Luberon — Gordes', icon: 'trees', revenue: 890, charges: 1100 },
];

const PropIcon = ({ type }: { type: string }) => {
  const cls = "h-5 w-5 text-foreground/70";
  if (type === 'mountain') return <Mountain className={cls} />;
  if (type === 'building') return <Building2 className={cls} />;
  if (type === 'trees') return <Trees className={cls} />;
  return <ImageIcon className={cls} />;
};

// Status pill colors for property ratios
const ratioStatus = (ratio: number) => {
  if (ratio >= 3) return { label: 'TOP', bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (ratio >= 2) return { label: 'RENTABLE', bg: 'bg-emerald-100', text: 'text-emerald-700' };
  if (ratio >= 1.5) return { label: 'LIMITE', bg: 'bg-amber-100', text: 'text-amber-700' };
  return { label: 'À REVOIR', bg: 'bg-rose-100', text: 'text-rose-700' };
};

// Reusable pill badge ("EXCLUSIF NOÉ", "NOÉ SCORE", etc.)
const SectionBadge = ({ children, color, icon }: { children: React.ReactNode; color: 'orange' | 'indigo' | 'yellow' | 'navy' | 'pink'; icon?: 'orange' | 'white' | 'dot' }) => {
  const palette: Record<string, string> = {
    orange: 'bg-[#FF5C1A] text-white',
    indigo: 'bg-[#4F46E5] text-white',
    yellow: 'bg-[#F5C842] text-[#1A1A2E]',
    navy: 'bg-[#1A1A2E] text-white border border-white/10',
    pink: 'bg-gradient-to-r from-[#FF8A4C] to-[#FF5C1A] text-white',
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${palette[color]}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.08em' }}>
      {icon === 'orange' && <img src={noeIconOrange} alt="" className="h-3 w-3 object-contain" />}
      {icon === 'white' && <img src={noeIconWhite} alt="" className="h-3 w-3 object-contain" />}
      {icon === 'dot' && <span className="h-2 w-2 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  );
};

// Watermark — giant background "n." logo
const Watermark = ({ tone }: { tone: 'light' | 'dark' }) => (
  <img
    src={tone === 'dark' ? noeIconWhite : noeIconOrange}
    alt=""
    aria-hidden
    className="absolute pointer-events-none select-none"
    style={{
      right: '-60px',
      top: '-30px',
      width: '380px',
      height: 'auto',
      opacity: tone === 'dark' ? 0.04 : 0.08,
    }}
  />
);

// Section title with small "n." mark + heading (used inside light cards)
const SectionTitle = ({ title, accent }: { title: string; accent?: string }) => (
  <div className="flex items-baseline gap-2.5">
    <img src={noeIconOrange} alt="" className="h-6 w-6 object-contain shrink-0 self-center" />
    <h3 className="font-heading font-bold text-[#1A1A2E]" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
      {title}
      {accent && <span className="ml-2 italic font-normal text-[#FF5C1A]" style={{ fontFamily: 'Instrument Serif, serif' }}>{accent}</span>}
    </h3>
  </div>
);

export function FinancialHealth() {
  // ---- State (calculator) ----
  const [rent, setRent] = useState<number>(650);
  const [otherFixed, setOtherFixed] = useState<number>(200);
  const [ftpCount, setFtpCount] = useState<number>(1);
  const [salaryPerFtp, setSalaryPerFtp] = useState<number>(2100);
  const [noeCost, setNoeCost] = useState<string>('5');
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [chargesOpen, setChargesOpen] = useState(false);
  const [leverDrawerOpen, setLeverDrawerOpen] = useState(false);
  const [selectedLeverProperty, setSelectedLeverProperty] = useState<string>('');

  // ---- State (treso) ----
  const [fluxEntrants, setFluxEntrants] = useState<number>(15000);
  const [reversementDay, setReversementDay] = useState<string>('5');
  const [chargesFixesDebut, setChargesFixesDebut] = useState<number>(2250);
  const [tresoDisponible, setTresoDisponible] = useState<number>(8000);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => setIsCalculating(false), 600);
  }, []);

  // ---- Derived: portfolio ratio (from mock props) ----
  const portfolioRatio = useMemo(() => {
    const rev = MOCK_PROPERTIES.reduce((s, p) => s + p.revenue, 0);
    const ch = MOCK_PROPERTIES.reduce((s, p) => s + p.charges, 0);
    return ch > 0 ? rev / ch : 0;
  }, []);

  // ---- Derived: BFR ----
  const tresoResults = useMemo(() => {
    const bfr = Math.max(0, fluxEntrants - chargesFixesDebut);
    const joursTreso = chargesFixesDebut > 0 ? Math.round((tresoDisponible / chargesFixesDebut) * 30) : 99;
    return { bfr, joursTreso, fluxAReverser: bfr };
  }, [fluxEntrants, chargesFixesDebut, tresoDisponible]);

  // ---- Derived: perf score ----
  const perfScore = useMemo(() => {
    const indicators = [
      { label: 'Ménages validés à temps', score: 21, max: 25, tip: "Objectif : 95% des ménages validés avant l'heure de check-in", color: '#22c55e' },
      { label: 'Taux de réponse < 1h', score: 18, max: 25, tip: 'Objectif : répondre dans l\'heure à 90% des messages', color: '#F5C842' },
      { label: "Taux d'occupation", score: 22, max: 25, tip: "Objectif : maintenir un taux d'occupation > 75% sur la saison", color: '#22c55e' },
      { label: 'Incidents résolus avant départ', score: 12, max: 25, tip: 'Objectif : résoudre 90% des incidents avant le check-out du voyageur', color: '#f43f5e' },
    ];
    const total = indicators.reduce((s, i) => s + i.score, 0);
    return { total, indicators };
  }, []);

  const addCustomCharge = () => setCustomCharges(prev => [...prev, { id: Date.now().toString(), name: '', amount: 0 }]);
  const removeCustomCharge = (id: string) => setCustomCharges(prev => prev.filter(c => c.id !== id));
  const updateCustomCharge = (id: string, field: 'name' | 'amount', value: string | number) => {
    setCustomCharges(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleShare = async () => {
    const text = `Mon score Noé ce mois : ${perfScore.total}/100 🏆\nGéré avec Noé — noe-beta1.fr`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Mon score Noé', text }); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  // ---- Score arc (Perf Index) ----
  const scoreCirc = 2 * Math.PI * 54;
  const scoreOffset = scoreCirc - (perfScore.total / 100) * scoreCirc;

  // ---- Donut for portfolio ratio (Rentabilité) ----
  // Map ratio 0-3+ to a percentage (cap visual at 3.0×)
  const ratioPct = Math.min(100, (portfolioRatio / 3) * 100);
  const donutCirc = 2 * Math.PI * 70;
  const donutOffset = donutCirc - (ratioPct / 100) * donutCirc;

  // ---- Time formatting helper ----
  const nowLabel = useMemo(() => {
    const d = new Date();
    return `aujourd'hui · ${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0')}`;
  }, []);

  return (
    <div className="space-y-6 bg-[#FBF6EC] -mx-4 sm:-mx-6 px-4 sm:px-6 py-6 rounded-2xl">

      {/* ============ 1. HERO (dark navy) ============ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E1530] px-8 sm:px-14 py-10 sm:py-14">
        <Watermark tone="dark" />
        <div className="relative z-10 max-w-3xl">
          <SectionBadge color="orange" icon="white">Exclusif Noé</SectionBadge>

          <h1 className="mt-6 font-heading font-extrabold text-white" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}>
            Santé{' '}
            <span className="italic font-normal text-[#FF5C1A]" style={{ fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>
              financière
            </span>
            <br />
            à l'échelle de ta<br />
            conciergerie.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
            Analyse ta rentabilité, ton BFR et ta performance opérationnelle. Des indicateurs pensés par des conciergeries, pour des conciergeries.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-12 gap-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">Données</p>
              <p className="flex items-center gap-2 text-white font-semibold text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                Temps réel
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">Modules</p>
              <p className="text-white font-semibold text-sm">4 indicateurs Noé</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">Mis à jour</p>
              <p className="text-white font-semibold text-sm">{nowLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ 2. RENTABILITÉ PAR LOGEMENT (cream + orange top border) ============ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FFF4E6]" style={{ borderTop: '3px solid #FF5C1A' }}>
        <Watermark tone="light" />
        <div className="relative z-10 p-8 sm:p-10">
          <SectionBadge color="orange" icon="white">Noé Score</SectionBadge>

          <div className="mt-5">
            <SectionTitle title="Rentabilité par logement" />
          </div>
          <p className="mt-3 text-[#1A1A2E]/60 max-w-xl leading-relaxed">
            Compare tes revenus de commission aux charges réparties par logement. Un bien est rentable si ses revenus couvrent <strong className="text-[#1A1A2E]">2× ses charges</strong>.
          </p>

          {/* Donut + property list */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-center">
            {/* Donut */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative" style={{ width: 280, height: 280 }}>
                <svg viewBox="0 0 160 160" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="80" cy="80" r="70" stroke="#FFE0CC" strokeWidth="14" fill="none" />
                  <circle
                    cx="80" cy="80" r="70"
                    stroke="#FF5C1A" strokeWidth="14" fill="none"
                    strokeDasharray={donutCirc}
                    strokeDashoffset={donutOffset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-heading font-extrabold text-[#1A1A2E]" style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {portfolioRatio.toFixed(1)}<span className="text-[#FF5C1A] font-light italic" style={{ fontFamily: 'Instrument Serif, serif' }}>×</span>
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50 mt-3">Ratio portefeuille</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Rentable
                  </span>
                </div>
              </div>
            </div>

            {/* Property cards */}
            <div className="space-y-3">
              {MOCK_PROPERTIES.map((p, i) => {
                const ratio = p.revenue / p.charges;
                const status = ratioStatus(ratio);
                return (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl bg-white border border-[#1A1A2E]/5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                    <div className="h-11 w-11 rounded-xl bg-[#FFF4E6] flex items-center justify-center shrink-0">
                      <PropIcon type={p.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-[#1A1A2E] truncate">{p.name}</p>
                      <p className="text-xs text-[#1A1A2E]/50 mt-0.5 font-mono tracking-tight">
                        Revenus {p.revenue.toLocaleString('fr-FR')} €  /  Charges {p.charges.toLocaleString('fr-FR')} €
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono font-semibold text-[#1A1A2E] text-sm tabular-nums">{ratio.toFixed(2)}×</span>
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Personnaliser mes charges */}
              <Collapsible open={chargesOpen} onOpenChange={setChargesOpen} className="mt-2">
                <CollapsibleTrigger className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-[#FF5C1A]/30 hover:border-[#FF5C1A]/60 transition-colors group">
                  <span className="flex items-center gap-2.5 font-semibold text-[#1A1A2E]">
                    <Wrench className="h-4 w-4 text-[#FF5C1A]" />
                    Personnaliser mes charges
                  </span>
                  <span className="flex items-center gap-1.5 text-[#FF5C1A] font-semibold text-sm">
                    Ouvrir <ArrowRight className={`h-4 w-4 transition-transform ${chargesOpen ? 'rotate-90' : ''}`} />
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 space-y-4 p-4 rounded-2xl bg-white border border-[#1A1A2E]/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs mb-1 block text-[#1A1A2E]/70">Loyer du local (€/mois)</label>
                      <Input type="number" value={rent || ''} onChange={e => setRent(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block text-[#1A1A2E]/70">Autres charges fixes (€/mois)</label>
                      <Input type="number" value={otherFixed || ''} onChange={e => setOtherFixed(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block text-[#1A1A2E]/70">Salariés ETP</label>
                      <Input type="number" step={0.5} value={ftpCount} onChange={e => setFtpCount(Number(e.target.value))} />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block text-[#1A1A2E]/70">Salaire chargé/ETP (€)</label>
                      <Input type="number" value={salaryPerFtp} onChange={e => setSalaryPerFtp(Number(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs mb-1 block text-[#1A1A2E]/70">Coût Noé (€/logement/mois)</label>
                    <Select value={noeCost} onValueChange={setNoeCost}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5€ Classic</SelectItem>
                        <SelectItem value="7">7€ Classic + Billing</SelectItem>
                        <SelectItem value="11.5">11.50€ Pimp my Noé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-[#1A1A2E]/60">Charges variables</p>
                    {customCharges.map(c => (
                      <div key={c.id} className="flex gap-2 mb-2 items-center">
                        <Input placeholder="Nom" value={c.name} onChange={e => updateCustomCharge(c.id, 'name', e.target.value)} className="flex-1" />
                        <Input type="number" placeholder="€/mois" value={c.amount || ''} onChange={e => updateCustomCharge(c.id, 'amount', Number(e.target.value))} className="w-28" />
                        <button onClick={() => removeCustomCharge(c.id)} className="p-1.5 rounded-lg hover:bg-rose-50"><Trash2 className="h-4 w-4 text-rose-500" /></button>
                      </div>
                    ))}
                    <button onClick={addCustomCharge} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-[#1A1A2E]/10 text-[#1A1A2E] hover:bg-[#FFF4E6]">
                      <Plus className="h-3.5 w-3.5" /> Ajouter une charge
                    </button>
                  </div>
                  <Button onClick={handleCalculate} disabled={isCalculating} className="w-full font-heading font-bold rounded-xl py-3 bg-[#FF5C1A] text-white hover:bg-[#FF5C1A]/90">
                    {isCalculating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Calcul…</> : 'Recalculer'}
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>

      {/* ============ 3. TRÉSO PULSE (lavender + indigo top border) ============ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#EEEDFB]" style={{ borderTop: '3px solid #4F46E5' }}>
        <Watermark tone="light" />
        <div className="relative z-10 p-8 sm:p-10">
          <SectionBadge color="indigo" icon="dot">Tréso Pulse</SectionBadge>

          <div className="mt-5">
            <SectionTitle title="Gestion de trésorerie & BFR" />
          </div>
          <p className="mt-3 text-[#1A1A2E]/60 max-w-2xl leading-relaxed">
            En carte G, tu reçois les flux locatifs mais tu dois les reverser aux propriétaires. Noé calcule ton besoin en fonds de roulement pour que tu ne sois jamais à découvert en début de mois.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50 mb-2 block">Total flux entrants ce mois</label>
              <div className="relative">
                <Input type="number" value={fluxEntrants} onChange={e => setFluxEntrants(Number(e.target.value))} className="bg-white border-[#1A1A2E]/10 h-12 rounded-xl pr-10 font-mono tabular-nums" />
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1A1A2E]/40" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50 mb-2 block">Date de reversement propriétaires</label>
              <Select value={reversementDay} onValueChange={setReversementDay}>
                <SelectTrigger className="bg-white border-[#1A1A2E]/10 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>Le {i + 1} du mois</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50 mb-2 block">Charges fixes début de mois</label>
              <Input type="number" value={chargesFixesDebut} onChange={e => setChargesFixesDebut(Number(e.target.value))} className="bg-white border-[#1A1A2E]/10 h-12 rounded-xl font-mono tabular-nums" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50 mb-2 block">Trésorerie disponible aujourd'hui</label>
              <Input type="number" value={tresoDisponible} onChange={e => setTresoDisponible(Number(e.target.value))} className="bg-white border-[#1A1A2E]/10 h-12 rounded-xl font-mono tabular-nums" />
            </div>
          </div>

          {/* Calcul simplifié — dark bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-[#0E1530] text-white">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[#A5B4FC]" />
              Calcul simplifié par Noé
            </span>
            <p className="font-mono text-base sm:text-lg tabular-nums">
              <span className="text-white/80">{fluxEntrants.toLocaleString('fr-FR')} €</span>
              <span className="text-white/40 mx-2">−</span>
              <span className="text-white/80">{chargesFixesDebut.toLocaleString('fr-FR')} €</span>
              <span className="text-white/40 mx-2">=</span>
              <span className="text-[#A5B4FC] font-semibold">BFR {tresoResults.bfr.toLocaleString('fr-FR')} €</span>
            </p>
          </div>

          {/* 3 result cards */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-5 rounded-2xl bg-white border border-[#1A1A2E]/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50">BFR estimé</p>
              <p className="mt-2 font-heading font-extrabold text-[#1A1A2E] text-3xl tabular-nums">{tresoResults.bfr.toLocaleString('fr-FR')} €</p>
              <p className="mt-1.5 text-xs text-emerald-600 font-medium">▼ -580 € vs mois dernier</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#1A1A2E]/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50">Jours de tréso</p>
              <p className="mt-2 font-heading font-extrabold text-[#1A1A2E] text-3xl tabular-nums">{tresoResults.joursTreso} <span className="text-base font-medium text-[#1A1A2E]/60">jours</span></p>
              <p className="mt-1.5 text-xs text-emerald-600 font-medium">▲ +3 jours de marge</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#1A1A2E]/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A2E]/50">Flux à reverser</p>
              <p className="mt-2 font-heading font-extrabold text-[#1A1A2E] text-3xl tabular-nums">{tresoResults.fluxAReverser.toLocaleString('fr-FR')} €</p>
              <p className="mt-1.5 text-xs text-[#1A1A2E]/60">Dans 5 jours</p>
            </div>
          </div>

          {/* Health bar */}
          <div className="mt-6">
            <div className="relative h-3 rounded-full overflow-hidden flex bg-white">
              <div style={{ width: '25%', background: '#FCA5A5' }} />
              <div style={{ width: '25%', background: '#FCD34D' }} />
              <div style={{ width: '25%', background: '#86EFAC' }} />
              <div style={{ width: '25%', background: '#22C55E' }} />
              <div className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-[#0E1530] border-2 border-white shadow-lg" style={{ left: '78%', transform: 'translate(-50%, -50%)' }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-[#1A1A2E]/50">
              <span>⚠ Risque</span>
              <span>Moyen</span>
              <span>Bon</span>
              <span>Excellent</span>
            </div>
            <p className="mt-3 text-sm text-emerald-700 font-medium flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500 text-white text-xs">✓</span>
              <span><strong>Excellente santé de trésorerie</strong> — tu peux avancer sereinement sur tes reversements.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ============ 4. PERFORMANCE OPÉRATIONNELLE (cream + yellow top border) ============ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#FFF8E6]" style={{ borderTop: '3px solid #F5C842' }}>
        <Watermark tone="light" />
        <div className="relative z-10 p-8 sm:p-10">
          <SectionBadge color="yellow" icon="dot">Perf Index</SectionBadge>

          <div className="mt-5">
            <SectionTitle title="Performance opérationnelle" />
          </div>
          <p className="mt-3 text-[#1A1A2E]/60 max-w-2xl leading-relaxed">
            Un score sur 100 qui mesure la qualité de ta gestion ce mois-ci. Calculé sur 4 indicateurs clés observés sur les meilleures conciergeries.
          </p>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
            {/* Score card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] to-[#2D1B4E] p-6 flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="relative" style={{ width: 200, height: 200 }}>
                  <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="54" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
                    <circle cx="60" cy="60" r="54" stroke="#F5C842" strokeWidth="6" fill="none"
                      strokeDasharray={scoreCirc} strokeDashoffset={scoreOffset} strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-heading font-extrabold text-white" style={{ fontSize: 64, lineHeight: 1 }}>{perfScore.total}</span>
                    <span className="text-xs text-white/40 mt-1">/100</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-[#F5C842]">
                  <img src={noeIconOrange} alt="" className="h-3 w-3" />
                  Score Noé · Mars 2026
                </span>
                <p className="mt-3 text-xs text-white/60">Mieux que <strong className="text-white">72%</strong> des conciergeries de ta taille.</p>
              </div>
            </div>

            {/* Indicators */}
            <div className="space-y-5">
              {perfScore.indicators.map((ind, i) => {
                const pct = (ind.score / ind.max) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-[#1A1A2E]">{ind.label}</span>
                      <span className="font-mono font-bold text-[#1A1A2E] tabular-nums">{ind.score}/{ind.max}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-[#1A1A2E]/5">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: ind.color }} />
                    </div>
                    <p className="text-xs mt-2 text-[#1A1A2E]/50 italic" style={{ fontFamily: 'Instrument Serif, serif', fontSize: 13 }}>
                      {ind.tip}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={handleShare} variant="outline" className="gap-2 rounded-full px-6 py-5 border-[#1A1A2E]/15 bg-white hover:bg-[#FFF4E6] text-[#1A1A2E] font-semibold">
              <Share2 className="h-4 w-4" />
              Partager ma performance
            </Button>
          </div>
        </div>
      </div>

      {/* ============ 5. CLASSEMENT NOÉ (dark + pink/orange gradient top) ============ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] via-[#2A1A3E] to-[#3D1A2E]" style={{ borderTop: '3px solid', borderImage: 'linear-gradient(90deg, #FF8AB8, #FF5C1A) 1' }}>
        <Watermark tone="dark" />
        <div className="relative z-10 p-8 sm:p-10">
          <SectionBadge color="pink" icon="white">🏆 Classement Noé</SectionBadge>

          <div className="mt-5 flex items-baseline gap-2.5">
            <img src={noeIconOrange} alt="" className="h-6 w-6 self-center" />
            <h3 className="font-heading font-bold text-white" style={{ fontSize: 28, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Ta position{' '}
              <span className="italic font-normal text-white/80" style={{ fontFamily: 'Instrument Serif, serif' }}>ce mois</span>
            </h3>
          </div>
          <p className="mt-3 text-white/60 max-w-2xl leading-relaxed">
            Tu es dans les <strong className="text-white">28%</strong> des meilleures conciergeries ce mois-ci. Un ranking basé uniquement sur le score opérationnel — tes données financières restent privées.
          </p>

          {/* Badge unlocked */}
          <div className="mt-7 flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-[#FF5C1A]/40" />
              <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-[#FF8A4C] to-[#FF5C1A] flex items-center justify-center shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Badge débloqué</p>
              <p className="mt-0.5 font-heading font-bold text-white text-xl">
                Expert <span className="italic font-normal text-[#FF8A4C]" style={{ fontFamily: 'Instrument Serif, serif' }}>— {perfScore.total}/100</span>
              </p>
            </div>
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8A4C] to-[#FF5C1A] text-white text-xs font-bold shadow-lg">
              TOP 28%
            </span>
          </div>

          {/* Ranking gradient bar */}
          <div className="mt-8 relative">
            <div className="h-3 rounded-full overflow-hidden flex">
              <div style={{ width: '20%', background: '#FCA5A5' }} />
              <div style={{ width: '50%', background: '#FCD34D' }} />
              <div style={{ width: '20%', background: '#22C55E' }} />
              <div style={{ width: '10%', background: '#FF5C1A' }} />
            </div>
            {/* "Tu es ici" pin */}
            <div className="absolute" style={{ left: '78%', top: -2 }}>
              <div className="relative -translate-x-1/2 flex flex-col items-center">
                <div className="h-7 w-px bg-white" />
                <div className="mt-1 px-2.5 py-1 rounded-md bg-[#FF5C1A] text-white text-[10px] font-bold shadow-lg whitespace-nowrap">
                  TU ES ICI
                </div>
              </div>
            </div>
            <div className="mt-10 flex justify-between text-[11px] text-white/60">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#FCA5A5]" />20% bas</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#FCD34D]" />50% milieu</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#22C55E]" />20% top</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#FF5C1A]" />10% élite</span>
            </div>
          </div>

          {/* Sub-badges */}
          <div className="mt-6 space-y-2.5">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-emerald-400/20">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Target className="h-4.5 w-4.5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">Top 30% — Taux d'occupation</p>
                <p className="text-xs text-white/50 mt-0.5">Tu maintiens un remplissage au-dessus de la moyenne haute du marché.</p>
              </div>
              <span className="text-emerald-400 font-mono font-semibold text-sm shrink-0">+8 pts</span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-[#FF5C1A]/20">
              <div className="h-9 w-9 rounded-lg bg-[#FF5C1A]/20 flex items-center justify-center shrink-0">
                <Hourglass className="h-4.5 w-4.5 text-[#FF8A4C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">Top 10% — Réactivité</p>
                <p className="text-xs text-white/50 mt-0.5">Encore 2 pts pour débloquer le badge Élite.</p>
              </div>
              <span className="text-[#FF8A4C] font-mono font-semibold text-sm shrink-0">73 → 75</span>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Lock className="h-4.5 w-4.5 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">Classement anonyme garanti</p>
                <p className="text-xs text-white/50 mt-0.5">Tes données financières restent privées, seul le score opérationnel est comparé.</p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/40 italic" style={{ fontFamily: 'Instrument Serif, serif', fontSize: 13 }}>
            Classement basé sur le score opérationnel uniquement — les données financières restent privées.
          </p>
        </div>
      </div>

      {/* ============ 6. FOOTER signé Noé ============ */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E1530] px-8 sm:px-12 py-8 text-center">
        <Watermark tone="dark" />
        <div className="relative z-10">
          <p className="italic text-white/50 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16 }}>
            « Ces indicateurs sont calculés par Noé à partir de tes données réelles. Ils ne remplacent pas un expert-comptable mais te donnent une vision opérationnelle claire de la rentabilité. »
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Signé</span>
            <span className="font-heading font-extrabold text-white text-2xl" style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic' }}>
              <span className="text-[#FF5C1A]">n</span>oé<span className="text-[#FF5C1A]">.</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lever drawer */}
      <Sheet open={leverDrawerOpen} onOpenChange={setLeverDrawerOpen}>
        <SheetContent side="right" className="w-[340px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="font-heading">Leviers — {selectedLeverProperty}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {[
              { title: 'Revoir le taux de commission', desc: 'Négocie un taux plus élevé ou ajoute des frais de service au voyageur.' },
              { title: 'Optimiser le calendrier', desc: "Réduis les nuits bloquées et améliore le taux d'occupation avec des tarifs dynamiques." },
              { title: 'Évaluer le maintien au parc', desc: "Si le logement n'est pas rentable depuis 3+ mois, discute avec le propriétaire." },
            ].map((l, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted border border-border">
                <p className="font-medium text-sm text-foreground">{l.title}</p>
                <p className="text-xs mt-1 text-muted-foreground">{l.desc}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
