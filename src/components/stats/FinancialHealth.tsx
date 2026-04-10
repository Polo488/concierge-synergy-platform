import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, Plus, Trash2, Share2, Trophy, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import logoNoe from '@/assets/logo-noe.png';

interface CustomCharge {
  id: string;
  name: string;
  amount: number;
}

interface CalculatedResults {
  charges: { label: string; monthly: number; perProperty: number }[];
  totalMonthly: number;
  totalPerProperty: number;
  properties: { name: string; commission: number; charges: number; status: 'rentable' | 'limite' | 'sous-performant' }[];
  rentableCount: number;
  totalProperties: number;
}

const MOCK_PROPERTIES = [
  { name: 'Studio Vieux-Port', commission: 420 },
  { name: 'T2 Castellane', commission: 380 },
  { name: 'T3 Prado Plage', commission: 620 },
  { name: 'Loft Joliette', commission: 510 },
  { name: 'T2 Cours Julien', commission: 290 },
  { name: 'Studio Corniche', commission: 350 },
  { name: 'T4 Bonneveine', commission: 780 },
  { name: 'T2 Endoume', commission: 310 },
  { name: 'Studio Réformés', commission: 260 },
  { name: 'T3 Cinq Avenues', commission: 540 },
];

const SectionTitle = ({ badge, badgeColor, title, description }: { icon?: string; badge: string; badgeColor: string; title: string; description: string }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide shadow-sm" style={{ background: badgeColor, color: badgeColor === '#F5C842' ? '#1A1A2E' : '#fff', fontFamily: 'Syne, sans-serif' }}>
        {badge}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <img src={logoNoe} alt="" className="h-5 w-5 object-contain opacity-60" />
      <h3 className="font-heading font-bold text-foreground" style={{ fontSize: 17 }}>{title}</h3>
    </div>
    <p className="text-[13px] text-muted-foreground mt-1 max-w-[560px]">
      {description}
    </p>
  </div>
);

const GradientSeparator = () => (
  <div className="my-8 h-px bg-gradient-to-r from-primary/30 to-transparent" />
);

export function FinancialHealth() {
  const [rent, setRent] = useState<number>(650);
  const [otherFixed, setOtherFixed] = useState<number>(200);
  const [ftpCount, setFtpCount] = useState<number>(1);
  const [salaryPerFtp, setSalaryPerFtp] = useState<number>(2100);
  const [noeCost, setNoeCost] = useState<string>('5');
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [chargesOpen, setChargesOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [leverDrawerOpen, setLeverDrawerOpen] = useState(false);
  const [selectedLeverProperty, setSelectedLeverProperty] = useState<string>('');

  const [fluxEntrants, setFluxEntrants] = useState<number>(15000);
  const [reversementDay, setReversementDay] = useState<string>('5');
  const [chargesFixesDebut, setChargesFixesDebut] = useState<number>(0);
  const [tresoDisponible, setTresoDisponible] = useState<number>(8000);

  const propertyCount = MOCK_PROPERTIES.length;

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setShowResults(true);
      setIsCalculating(false);
    }, 800);
  }, []);

  const results = useMemo<CalculatedResults | null>(() => {
    if (!showResults) return null;
    const salaryTotal = ftpCount * salaryPerFtp;
    const noeTotal = parseFloat(noeCost) * propertyCount;
    const customTotal = customCharges.reduce((s, c) => s + c.amount, 0);
    const totalMonthly = rent + otherFixed + salaryTotal + noeTotal + customTotal;
    const totalPerProperty = totalMonthly / propertyCount;

    const charges: CalculatedResults['charges'] = [
      { label: 'Loyer du local', monthly: rent, perProperty: rent / propertyCount },
      { label: 'Autres charges fixes', monthly: otherFixed, perProperty: otherFixed / propertyCount },
      { label: `Masse salariale (${ftpCount} ETP)`, monthly: salaryTotal, perProperty: salaryTotal / propertyCount },
      { label: `Logiciel Noé (${noeCost}€/log)`, monthly: noeTotal, perProperty: parseFloat(noeCost) },
      ...customCharges.map(c => ({ label: c.name || 'Charge perso', monthly: c.amount, perProperty: c.amount / propertyCount })),
    ];

    const properties = MOCK_PROPERTIES.map(p => {
      const status: 'rentable' | 'limite' | 'sous-performant' =
        p.commission > 2 * totalPerProperty ? 'rentable' :
        p.commission > totalPerProperty ? 'limite' : 'sous-performant';
      return { name: p.name, commission: p.commission, charges: totalPerProperty, status };
    });

    const rentableCount = properties.filter(p => p.status === 'rentable').length;
    return { charges, totalMonthly, totalPerProperty, properties, rentableCount, totalProperties: propertyCount };
  }, [showResults, rent, otherFixed, ftpCount, salaryPerFtp, noeCost, customCharges, propertyCount]);

  const tresoResults = useMemo(() => {
    const chargesTotal = results ? results.totalMonthly : chargesFixesDebut;
    const bfr = fluxEntrants - chargesTotal;
    const joursTreso = chargesTotal > 0 ? Math.round((tresoDisponible / chargesTotal) * 30) : 999;
    const fluxAReverser = fluxEntrants * 0.85;
    return { bfr: Math.max(0, bfr), joursTreso, fluxAReverser: Math.round(fluxAReverser), chargesTotal };
  }, [fluxEntrants, chargesFixesDebut, tresoDisponible, results]);

  const perfScore = useMemo(() => {
    const indicators = [
      { label: 'Ménages validés à temps', score: 21, max: 25, tip: 'Objectif : 95% des ménages validés avant l\'heure de check-in' },
      { label: 'Taux de réponse < 1h', score: 18, max: 25, tip: 'Objectif : répondre dans l\'heure à 90% des messages' },
      { label: 'Taux d\'occupation', score: 22, max: 25, tip: 'Objectif : maintenir un taux d\'occupation > 75% sur la saison' },
      { label: 'Incidents résolus avant départ', score: 12, max: 25, tip: 'Objectif : résoudre 90% des incidents avant le check-out du voyageur' },
    ];
    const total = indicators.reduce((s, i) => s + i.score, 0);
    return { total, indicators };
  }, []);

  const addCustomCharge = () => setCustomCharges(prev => [...prev, { id: Date.now().toString(), name: '', amount: 0 }]);
  const removeCustomCharge = (id: string) => setCustomCharges(prev => prev.filter(c => c.id !== id));
  const updateCustomCharge = (id: string, field: 'name' | 'amount', value: string | number) => {
    setCustomCharges(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const getScoreColor = (score: number) => score < 50 ? '#ef4444' : score < 75 ? '#f59e0b' : '#22c55e';

  const getStatusBadge = (status: 'rentable' | 'limite' | 'sous-performant') => {
    const config = {
      'rentable': { cls: 'bg-status-success-light text-status-success', label: '✅ RENTABLE' },
      'limite': { cls: 'bg-status-warning-light text-status-warning', label: '⚠️ LIMITE' },
      'sous-performant': { cls: 'bg-status-error-light text-status-error', label: '❌ SOUS-PERFORMANT' },
    };
    const c = config[status];
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm ${c.cls}`}>{c.label}</span>;
  };

  const scoreArcPath = (score: number) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return { circumference, offset };
  };

  const { circumference, offset } = scoreArcPath(perfScore.total);

  const getBadgeInfo = (score: number) => {
    if (score > 85) return { icon: '🏆', label: 'Elite', color: '#E8621A' };
    if (score > 70) return { icon: '🥇', label: 'Expert', color: '#22c55e' };
    if (score > 50) return { icon: '🥈', label: 'Confirmé', color: '#f59e0b' };
    return { icon: '🥉', label: 'En progression', color: '#ef4444' };
  };

  const rankPercentile = 28;
  const badge = getBadgeInfo(perfScore.total);

  const handleShare = async () => {
    const text = `Mon score Noé ce mois : ${perfScore.total}/100 🏆\n${perfScore.indicators.map(i => `${i.label}: ${i.score}/${i.max}`).join('\n')}\n\nGéré avec Noé — noe-beta1.fr`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Mon score Noé', text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  const underperforming = results?.properties.filter(p => p.status !== 'rentable') || [];
  const priorityProps = underperforming.slice(0, 3);

  return (
    <div className="space-y-0 bg-gradient-to-b from-background to-muted/30 min-h-full">
      {/* Header */}
      <div className="pb-2">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 bg-primary text-primary-foreground shadow-md" style={{ fontFamily: 'Syne, sans-serif' }}>
          ✨ EXCLUSIF NOÉ
        </span>
        <h2 className="font-heading text-foreground" style={{ fontWeight: 800, fontSize: 24 }}>
          Santé financière
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-[640px]">
          Analyse ta rentabilité, ton BFR et ta performance opérationnelle. Des indicateurs pensés par des conciergeries, pour des conciergeries.
        </p>
        <GradientSeparator />
      </div>

      {/* KPI 1 — NOÉ SCORE */}
      <div className="rounded-2xl overflow-hidden bg-card border border-border" style={{ borderLeft: '3px solid hsl(var(--primary))' }}>
        <div className="p-5 sm:p-6">
          <SectionTitle badge="NOÉ SCORE" badgeColor="hsl(var(--primary))" title="Rentabilité par logement" description="Compare tes revenus de commission aux charges réparties par logement. Un bien est rentable si ses revenus couvrent 2× ses charges." />

          <Collapsible open={chargesOpen} onOpenChange={setChargesOpen} className="mt-5">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium font-heading text-foreground">
              Personnaliser mes charges
              <ChevronDown className={`h-4 w-4 transition-transform ${chargesOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">Charges fixes mensuelles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block text-foreground">Loyer du local (€/mois)</label>
                    <Input type="number" placeholder="ex. 650" value={rent || ''} onChange={e => setRent(Number(e.target.value))} className="text-base" />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block text-foreground">Autres charges fixes (€/mois)</label>
                    <Input type="number" placeholder="ex. frais bancaires, assurances..." value={otherFixed || ''} onChange={e => setOtherFixed(Number(e.target.value))} className="text-base" />
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">Masse salariale</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block text-foreground">Nombre de salariés ETP</label>
                    <Input type="number" step={0.5} value={ftpCount} onChange={e => setFtpCount(Number(e.target.value))} className="text-base" />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block text-foreground">Salaire chargé mensuel par ETP (€)</label>
                    <Input type="number" value={salaryPerFtp} onChange={e => setSalaryPerFtp(Number(e.target.value))} className="text-base" />
                  </div>
                </div>
                <div className="mt-2 p-2.5 rounded-lg bg-muted text-muted-foreground text-xs italic">
                  💡 Calculé sur la base du SMIC chargé 2025. Pour les conciergeries de plus de 20 logements, 1 ETP pour ~23 logements est la norme observée sur le marché.
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">Logiciel</p>
                <label className="text-xs mb-1 block text-foreground">Coût Noé (€/logement/mois)</label>
                <Select value={noeCost} onValueChange={setNoeCost}>
                  <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5€ Classic</SelectItem>
                    <SelectItem value="7">7€ Classic + Billing</SelectItem>
                    <SelectItem value="11.5">11.50€ Pimp my Noé</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs mt-1 text-muted-foreground italic">Pré-rempli avec ton offre actuelle</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-muted-foreground">Charges variables</p>
                {customCharges.map(c => (
                  <div key={c.id} className="flex gap-2 mb-2 items-center">
                    <Input placeholder="Nom" value={c.name} onChange={e => updateCustomCharge(c.id, 'name', e.target.value)} className="flex-1 text-base" />
                    <Input type="number" placeholder="€/mois" value={c.amount || ''} onChange={e => updateCustomCharge(c.id, 'amount', Number(e.target.value))} className="w-28 text-base" />
                    <button onClick={() => removeCustomCharge(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="h-4 w-4 text-destructive" /></button>
                  </div>
                ))}
                <button onClick={addCustomCharge} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted">
                  <Plus className="h-3.5 w-3.5" /> Ajouter une charge
                </button>
              </div>

              {/* Sticky calculate button */}
              <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm pt-3 pb-1 -mx-1 px-1 z-[5]">
                <Button onClick={handleCalculate} disabled={isCalculating} className="w-full font-heading font-bold rounded-xl py-3.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  {isCalculating ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Calcul en cours...</> : 'Calculer'}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Results */}
          {results && (
            <div className="mt-6 space-y-5">
              <div className="rounded-xl overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left px-4 py-2.5 font-semibold text-xs text-foreground">Charge</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-xs text-foreground">Mensuel total</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-xs text-foreground">Par logement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.charges.map((c, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-card' : 'bg-muted/50'}>
                        <td className="px-4 py-2 text-foreground">{c.label}</td>
                        <td className="px-4 py-2 text-right text-foreground">{c.monthly.toFixed(0)} €</td>
                        <td className="px-4 py-2 text-right text-foreground">{c.perProperty.toFixed(0)} €</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[hsl(240,33%,14%)] dark:bg-primary">
                      <td className="px-4 py-2.5 font-bold text-white font-heading">TOTAL</td>
                      <td className="px-4 py-2.5 text-right font-bold text-white">{results.totalMonthly.toFixed(0)} €</td>
                      <td className="px-4 py-2.5 text-right font-bold text-white">{results.totalPerProperty.toFixed(0)} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Reformulated summary */}
              <div className="text-center py-5 px-4 rounded-2xl bg-muted/50 border border-border">
                <p className="font-heading text-foreground" style={{ fontWeight: 800, fontSize: 32, lineHeight: 1.2 }}>
                  {results.rentableCount} / {results.totalProperties}
                </p>
                <p className="text-sm mt-1 text-muted-foreground">logements rentables ce mois-ci</p>
                <div className="mx-auto mt-3 h-3 rounded-full overflow-hidden bg-muted" style={{ maxWidth: 400 }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${(results.rentableCount / results.totalProperties) * 100}%`,
                    background: results.rentableCount / results.totalProperties > 0.7 ? '#22c55e' : results.rentableCount / results.totalProperties > 0.4 ? '#f59e0b' : '#ef4444'
                  }} />
                </div>
                <p className="text-sm mt-2 text-muted-foreground">
                  {Math.round((results.rentableCount / results.totalProperties) * 100)}% de ton portefeuille est rentable ce mois-ci.
                </p>
              </div>

              {/* Priority properties */}
              {priorityProps.length > 0 && (
                <div className="p-4 rounded-xl bg-status-error-light border border-status-error/20">
                  <p className="text-sm font-bold mb-3 text-foreground">📌 {priorityProps.length} logement{priorityProps.length > 1 ? 's' : ''} à prioriser :</p>
                  <div className="space-y-2">
                    {priorityProps.map((p, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <p className="text-sm text-foreground/70">
                          → {p.name} <span className="text-muted-foreground">({p.commission}€ commission — {p.status === 'sous-performant' ? 'en dessous du seuil' : 'à la limite'})</span>
                        </p>
                        <button
                          onClick={() => { setSelectedLeverProperty(p.name); setLeverDrawerOpen(true); }}
                          className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          Voir les leviers
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All properties */}
              <div className="space-y-2">
                {results.properties.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                    <div>
                      <p className="font-medium text-sm font-heading text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">Commission : {p.commission}€ · Charges : {p.charges.toFixed(0)}€</p>
                    </div>
                    {getStatusBadge(p.status)}
                  </div>
                ))}
              </div>
            </div>
          )}
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
              { icon: '📊', title: 'Revoir le taux de commission', desc: 'Négocie un taux plus élevé ou ajoute des frais de service au voyageur.' },
              { icon: '📅', title: 'Optimiser le calendrier', desc: 'Réduis les nuits bloquées et améliore le taux d\'occupation avec des tarifs dynamiques.' },
              { icon: '🏠', title: 'Évaluer le maintien au parc', desc: 'Si le logement n\'est pas rentable depuis 3+ mois, discute avec le propriétaire.' },
            ].map((l, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted border border-border">
                <p className="font-medium text-sm text-foreground">{l.icon} {l.title}</p>
                <p className="text-xs mt-1 text-muted-foreground">{l.desc}</p>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <GradientSeparator />

      {/* KPI 2 — TRÉSO PULSE */}
      <div className="rounded-2xl overflow-hidden bg-card border border-border" style={{ borderLeft: '3px solid #6B7AE8' }}>
        <div className="p-5 sm:p-6">
          <SectionTitle badge="TRÉSO PULSE" badgeColor="#6B7AE8" title="Gestion de trésorerie & BFR" description="En carte G, tu reçois les flux locatifs mais tu dois les reverser aux propriétaires. Noé calcule ton besoin en fonds de roulement pour que tu ne sois jamais à découvert en début de mois." />

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block text-foreground">Total flux entrants ce mois (€)</label>
              <Input type="number" value={fluxEntrants} onChange={e => setFluxEntrants(Number(e.target.value))} className="text-base" />
            </div>
            <div>
              <label className="text-xs mb-1 block text-foreground">Date de reversement propriétaires</label>
              <Select value={reversementDay} onValueChange={setReversementDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>Le {i + 1} du mois</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs mb-1 block text-foreground">Charges fixes début de mois (€)</label>
              <Input type="number" value={results ? results.totalMonthly : chargesFixesDebut} onChange={e => setChargesFixesDebut(Number(e.target.value))} className="text-base" />
              {results && <p className="text-[11px] mt-0.5 text-muted-foreground italic">Auto-rempli depuis le NOÉ SCORE</p>}
            </div>
            <div>
              <label className="text-xs mb-1 block text-foreground">Trésorerie disponible aujourd'hui (€)</label>
              <Input type="number" value={tresoDisponible} onChange={e => setTresoDisponible(Number(e.target.value))} className="text-base" />
            </div>
          </div>

          {/* BFR simplified formula */}
          <div className="mt-4 p-3 rounded-xl text-center bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground">Calcul simplifié</p>
            <p className="text-sm font-medium mt-1 text-foreground">
              {fluxEntrants.toLocaleString()}€ − {tresoResults.chargesTotal.toLocaleString()}€ = <strong>BFR {tresoResults.bfr.toLocaleString()}€</strong>
            </p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'BFR estimé', value: `${tresoResults.bfr.toLocaleString()} €` },
              { label: 'Jours de tréso', value: `${tresoResults.joursTreso} jours` },
              { label: 'Flux à reverser', value: `${tresoResults.fluxAReverser.toLocaleString()} €` },
            ].map((m, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-muted/50">
                <p className="text-xs mb-1 text-muted-foreground">{m.label}</p>
                <p className="text-foreground" style={{ fontWeight: 800, fontSize: 18 }}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="h-3 rounded-full overflow-hidden flex bg-muted">
              <div style={{ width: '33%', background: '#ef4444', opacity: 0.7 }} />
              <div style={{ width: '34%', background: '#f59e0b', opacity: 0.7 }} />
              <div style={{ width: '33%', background: '#22c55e', opacity: 0.7 }} />
            </div>
            <div className="relative h-4 mt-1">
              <div className="absolute w-3 h-3 rounded-full border-2 border-background bg-foreground shadow-md" style={{
                left: `${Math.min(100, (tresoResults.joursTreso / 90) * 100)}%`,
                transform: 'translateX(-50%)', top: -2,
              }} />
            </div>
            <p className="text-xs mt-2 text-muted-foreground italic">
              {tresoResults.joursTreso < 30 ? '⚠️ Attention — ta trésorerie couvre moins d\'un mois de charges. Anticipe tes encaissements.'
                : tresoResults.joursTreso < 60 ? '✓ Trésorerie correcte — surveille tes échéances de début de mois.'
                : '✅ Excellente santé de trésorerie.'}
            </p>
          </div>
        </div>
      </div>

      <GradientSeparator />

      {/* KPI 3 — PERF INDEX */}
      <div className="rounded-2xl overflow-hidden bg-card border border-border" style={{ borderLeft: '3px solid #F5C842' }}>
        <div className="p-5 sm:p-6">
          <SectionTitle badge="PERF INDEX" badgeColor="#F5C842" title="Performance opérationnelle" description="Un score sur 100 qui mesure la qualité de ta gestion ce mois-ci. Calculé sur 4 indicateurs clés observés sur les meilleures conciergeries." />

          <div className="flex justify-center mt-6">
            <div className="relative" style={{ width: 140, height: 140 }}>
              <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="54" className="stroke-muted" strokeWidth="8" fill="none" />
                <circle cx="60" cy="60" r="54" stroke={getScoreColor(perfScore.total)} strokeWidth="8" fill="none"
                  strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-foreground" style={{ fontWeight: 800, fontSize: 48, lineHeight: 1 }}>{perfScore.total}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm mt-2 text-muted-foreground">Score Noé ce mois</p>

          <div className="mt-6 space-y-4">
            {perfScore.indicators.map((ind, i) => {
              const pct = (ind.score / ind.max) * 100;
              const color = pct < 50 ? '#ef4444' : pct < 75 ? '#f59e0b' : '#22c55e';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{ind.label}</span>
                    <span className="text-sm font-bold text-foreground">{ind.score}/{ind.max}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-muted">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="text-[11px] mt-1 text-muted-foreground italic">{ind.tip}</p>
                </div>
              );
            })}
          </div>

          {/* Share button */}
          <div className="flex justify-center mt-6">
            <Button onClick={handleShare} variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10 rounded-xl">
              <Share2 className="h-4 w-4" />
              Partager ma performance
            </Button>
          </div>
        </div>
      </div>

      <GradientSeparator />

      {/* CLASSEMENT NOÉ */}
      <div className="rounded-2xl overflow-hidden bg-card border border-border" style={{ borderLeft: '3px solid hsl(var(--primary))' }}>
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-heading font-bold text-foreground" style={{ fontSize: 17 }}>Ta position ce mois</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary text-primary-foreground" style={{ fontFamily: 'Syne, sans-serif' }}>CLASSEMENT NOÉ</span>
          </div>

          <p className="text-sm mb-4 text-muted-foreground">
            Tu es dans les <strong className="text-foreground">{rankPercentile}%</strong> des meilleures conciergeries ce mois-ci.
          </p>

          {/* Ranking bar */}
          <div className="relative">
            <div className="h-4 rounded-full overflow-hidden flex">
              <div style={{ width: '20%', background: '#ef4444', opacity: 0.6 }} />
              <div style={{ width: '30%', background: '#f59e0b', opacity: 0.6 }} />
              <div style={{ width: '30%', background: '#22c55e', opacity: 0.6 }} />
              <div style={{ width: '20%', background: 'hsl(var(--primary))', opacity: 0.8 }} />
            </div>
            <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
              <span>🔴 20% bas</span>
              <span>🟡 50% milieu</span>
              <span>🟢 20% top</span>
              <span>🏆 10% elite</span>
            </div>
            <div className="absolute" style={{ left: `${100 - rankPercentile}%`, top: -6, transform: 'translateX(-50%)' }}>
              <div className="text-center">
                <span className="text-foreground" style={{ fontSize: 16 }}>▲</span>
                <p className="text-[10px] font-bold text-primary">Tu es ici</p>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="mt-8 flex items-center gap-3 p-4 rounded-xl bg-muted/50">
            <span className="text-3xl">{badge.icon}</span>
            <div>
              <p className="font-bold text-sm font-heading text-foreground">Badge : {badge.label}</p>
              <p className="text-xs text-muted-foreground">Score {perfScore.total}/100</p>
            </div>
          </div>

          {/* Badges unlocked */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-status-success-light">
              <span className="text-sm">✅</span>
              <p className="text-xs text-status-success">Top 30% Taux d'occupation</p>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-status-warning-light">
              <span className="text-sm">⏳</span>
              <p className="text-xs text-status-warning">Top 10% Réactivité — encore 2 pts pour débloquer</p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] mt-4 text-center text-muted-foreground/60 italic">
            Classement basé sur le score opérationnel uniquement — tes données financières restent privées.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 px-6 rounded-2xl mt-8 bg-[hsl(240,33%,14%)] dark:bg-accent">
        <p className="text-[13px] italic text-white/50 dark:text-foreground/50 max-w-[520px] mx-auto">
          Ces indicateurs sont calculés par Noé à partir de tes données réelles. Ils ne remplacent pas un expert-comptable mais te donnent une vision opérationnelle claire de ta rentabilité.
        </p>
        <div className="flex justify-center mt-4">
          <img src={logoNoe} alt="Noé" className="h-6 opacity-40" />
        </div>
      </div>
    </div>
  );
}
