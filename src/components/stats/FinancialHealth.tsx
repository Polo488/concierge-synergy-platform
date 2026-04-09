import { useState, useMemo } from 'react';
import { ChevronDown, Plus, Trash2, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';

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

// Mock properties for demo
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

export function FinancialHealth() {
  // KPI 1 state
  const [rent, setRent] = useState<number>(650);
  const [otherFixed, setOtherFixed] = useState<number>(200);
  const [ftpCount, setFtpCount] = useState<number>(1);
  const [salaryPerFtp, setSalaryPerFtp] = useState<number>(2100);
  const [noeCost, setNoeCost] = useState<string>('5');
  const [customCharges, setCustomCharges] = useState<CustomCharge[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [chargesOpen, setChargesOpen] = useState(false);

  // KPI 2 state
  const [fluxEntrants, setFluxEntrants] = useState<number>(15000);
  const [reversementDay, setReversementDay] = useState<string>('5');
  const [chargesFixesDebut, setChargesFixesDebut] = useState<number>(0);
  const [tresoDisponible, setTresoDisponible] = useState<number>(8000);

  const propertyCount = MOCK_PROPERTIES.length;

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

  // KPI 2 calculations
  const tresoResults = useMemo(() => {
    const chargesTotal = results ? results.totalMonthly : chargesFixesDebut;
    const fluxAReverser = fluxEntrants * 0.85; // ~85% goes to owners
    const bfr = fluxAReverser + chargesTotal - tresoDisponible;
    const joursTreso = chargesTotal > 0 ? Math.round((tresoDisponible / chargesTotal) * 30) : 999;
    return { bfr: Math.max(0, bfr), joursTreso, fluxAReverser: Math.round(fluxAReverser) };
  }, [fluxEntrants, chargesFixesDebut, tresoDisponible, results]);

  // KPI 3 calculations (mock-based)
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

  const addCustomCharge = () => {
    setCustomCharges(prev => [...prev, { id: Date.now().toString(), name: '', amount: 0 }]);
  };

  const removeCustomCharge = (id: string) => {
    setCustomCharges(prev => prev.filter(c => c.id !== id));
  };

  const updateCustomCharge = (id: string, field: 'name' | 'amount', value: string | number) => {
    setCustomCharges(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const getScoreColor = (score: number) => {
    if (score < 50) return '#ef4444';
    if (score < 75) return '#f59e0b';
    return '#22c55e';
  };

  const getStatusBadge = (status: 'rentable' | 'limite' | 'sous-performant') => {
    if (status === 'rentable') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a' }}>✅ RENTABLE</span>;
    if (status === 'limite') return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(245,200,66,0.15)', color: '#d97706' }}>⚠️ LIMITE</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>❌ SOUS-PERFORMANT</span>;
  };

  const scoreArcPath = (score: number) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return { circumference, offset };
  };

  const { circumference, offset } = scoreArcPath(perfScore.total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3" style={{ background: '#FF5C1A', color: '#FFFFFF', fontFamily: 'Syne, sans-serif' }}>
          EXCLUSIF NOÉ
        </span>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#1A1A2E', fontSize: 24 }}>
          Santé financière
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, color: 'rgba(26,26,46,0.5)', fontSize: 14, marginTop: 4, maxWidth: 640 }}>
          Analyse ta rentabilité, ton BFR et ta performance opérationnelle. Des indicateurs pensés par des conciergeries, pour des conciergeries.
        </p>
        <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', marginTop: 20, marginBottom: 32 }} />
      </div>

      {/* KPI 1 — NOÉ SCORE */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(255,92,26,0.03), rgba(255,92,26,0.01))', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ borderLeft: '4px solid #FF5C1A', padding: '24px' }}>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2" style={{ background: '#FF5C1A', color: '#fff', fontFamily: 'Syne, sans-serif' }}>NOÉ SCORE</span>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1A1A2E', fontSize: 17, marginBottom: 4 }}>Rentabilité par logement</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, color: 'rgba(26,26,46,0.55)', fontSize: 13, maxWidth: 560 }}>
            Compare tes revenus de commission aux charges réparties par logement. Un bien est rentable si ses revenus couvrent 2× ses charges.
          </p>

          {/* Accordion */}
          <Collapsible open={chargesOpen} onOpenChange={setChargesOpen} className="mt-5">
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium" style={{ color: '#1A1A2E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Personnaliser mes charges
              <ChevronDown className={`h-4 w-4 transition-transform ${chargesOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-5">
              {/* Charges fixes */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(26,26,46,0.4)' }}>Charges fixes mensuelles</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>Loyer du local (€/mois)</label>
                    <Input type="number" placeholder="ex. 650" value={rent || ''} onChange={e => setRent(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>Autres charges fixes (€/mois)</label>
                    <Input type="number" placeholder="ex. frais bancaires, assurances..." value={otherFixed || ''} onChange={e => setOtherFixed(Number(e.target.value))} />
                  </div>
                </div>
              </div>

              {/* Masse salariale */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(26,26,46,0.4)' }}>Masse salariale</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Nombre de salariés ETP</label>
                    <Input type="number" step={0.5} value={ftpCount} onChange={e => setFtpCount(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Salaire chargé mensuel par ETP (€)</label>
                    <Input type="number" value={salaryPerFtp} onChange={e => setSalaryPerFtp(Number(e.target.value))} />
                  </div>
                </div>
                <div className="mt-2 p-2.5 rounded-lg" style={{ background: '#F8F8F8', fontSize: 12, fontFamily: 'Inter, sans-serif', fontStyle: 'italic', color: 'rgba(26,26,46,0.4)' }}>
                  💡 Calculé sur la base du SMIC chargé 2025. Pour les conciergeries de plus de 20 logements, 1 ETP pour ~23 logements est la norme observée sur le marché. Modifie si ta situation est différente.
                </div>
              </div>

              {/* Logiciel */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(26,26,46,0.4)' }}>Logiciel</p>
                <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Coût Noé (€/logement/mois)</label>
                <Select value={noeCost} onValueChange={setNoeCost}>
                  <SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5€ Classic</SelectItem>
                    <SelectItem value="7">7€ Classic + Billing</SelectItem>
                    <SelectItem value="11.5">11.50€ Pimp my Noé</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs mt-1" style={{ color: 'rgba(26,26,46,0.35)', fontStyle: 'italic' }}>Pré-rempli avec ton offre actuelle</p>
              </div>

              {/* Custom charges */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'rgba(26,26,46,0.4)' }}>Charges variables</p>
                {customCharges.map(c => (
                  <div key={c.id} className="flex gap-2 mb-2 items-center">
                    <Input placeholder="Nom" value={c.name} onChange={e => updateCustomCharge(c.id, 'name', e.target.value)} className="flex-1" />
                    <Input type="number" placeholder="€/mois" value={c.amount || ''} onChange={e => updateCustomCharge(c.id, 'amount', Number(e.target.value))} className="w-28" />
                    <button onClick={() => removeCustomCharge(c.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="h-4 w-4 text-red-400" /></button>
                  </div>
                ))}
                <button onClick={addCustomCharge} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border" style={{ color: '#1A1A2E', borderColor: 'rgba(0,0,0,0.1)' }}>
                  <Plus className="h-3.5 w-3.5" /> Ajouter une charge
                </button>
              </div>

              {/* Calculate button */}
              <Button onClick={() => setShowResults(true)} className="w-full" style={{ background: '#FF5C1A', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, borderRadius: 12, padding: '14px' }}>
                Calculer
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Results */}
          {results && (
            <div className="mt-6 space-y-5">
              {/* Charges table */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#F8F8F8' }}>
                      <th className="text-left px-4 py-2.5 font-semibold" style={{ color: '#1A1A2E', fontSize: 12 }}>Charge</th>
                      <th className="text-right px-4 py-2.5 font-semibold" style={{ color: '#1A1A2E', fontSize: 12 }}>Mensuel total</th>
                      <th className="text-right px-4 py-2.5 font-semibold" style={{ color: '#1A1A2E', fontSize: 12 }}>Par logement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.charges.map((c, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#FFFFFF' : '#F8F8F8' }}>
                        <td className="px-4 py-2" style={{ color: '#1A1A2E' }}>{c.label}</td>
                        <td className="px-4 py-2 text-right" style={{ color: '#1A1A2E' }}>{c.monthly.toFixed(0)} €</td>
                        <td className="px-4 py-2 text-right" style={{ color: '#1A1A2E' }}>{c.perProperty.toFixed(0)} €</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#1A1A2E' }}>
                      <td className="px-4 py-2.5 font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>TOTAL</td>
                      <td className="px-4 py-2.5 text-right font-bold text-white">{results.totalMonthly.toFixed(0)} €</td>
                      <td className="px-4 py-2.5 text-right font-bold text-white">{results.totalPerProperty.toFixed(0)} €</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Properties list */}
              <div className="space-y-2">
                {results.properties.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8F8F8' }}>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#1A1A2E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.name}</p>
                      <p className="text-xs" style={{ color: 'rgba(26,26,46,0.5)' }}>Commission : {p.commission}€ · Charges : {p.charges.toFixed(0)}€</p>
                    </div>
                    {getStatusBadge(p.status)}
                  </div>
                ))}
              </div>

              {/* Global score */}
              <div className="text-center py-4">
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 28, color: '#1A1A2E' }}>
                  {results.rentableCount} / {results.totalProperties} logements rentables
                </p>
                <div className="mx-auto mt-3 h-3 rounded-full overflow-hidden" style={{ maxWidth: 400, background: '#F0F0F0' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${(results.rentableCount / results.totalProperties) * 100}%`,
                    background: results.rentableCount / results.totalProperties > 0.7 ? '#22c55e' : results.rentableCount / results.totalProperties > 0.4 ? '#f59e0b' : '#ef4444'
                  }} />
                </div>
                <p className="text-sm mt-2" style={{ color: 'rgba(26,26,46,0.5)' }}>
                  {Math.round((results.rentableCount / results.totalProperties) * 100)}% de ton portefeuille est rentable ce mois-ci.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI 2 — TRÉSO PULSE */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(107,122,232,0.03), rgba(107,122,232,0.01))', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ borderLeft: '4px solid #6B7AE8', padding: '24px' }}>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2" style={{ background: '#6B7AE8', color: '#fff', fontFamily: 'Syne, sans-serif' }}>TRÉSO PULSE</span>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1A1A2E', fontSize: 17, marginBottom: 4 }}>Gestion de trésorerie & BFR</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, color: 'rgba(26,26,46,0.55)', fontSize: 13, maxWidth: 560 }}>
            En carte G, tu reçois les flux locatifs mais tu dois les reverser aux propriétaires. Noé calcule ton besoin en fonds de roulement pour que tu ne sois jamais à découvert en début de mois.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Total flux entrants ce mois (€)</label>
              <Input type="number" value={fluxEntrants} onChange={e => setFluxEntrants(Number(e.target.value))} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Date de reversement propriétaires</label>
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
              <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Charges fixes début de mois (€)</label>
              <Input type="number" value={results ? results.totalMonthly : chargesFixesDebut} onChange={e => setChargesFixesDebut(Number(e.target.value))} />
              {results && <p className="text-[11px] mt-0.5" style={{ color: 'rgba(26,26,46,0.35)', fontStyle: 'italic' }}>Auto-rempli depuis le NOÉ SCORE</p>}
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: '#1A1A2E' }}>Trésorerie disponible aujourd'hui (€)</label>
              <Input type="number" value={tresoDisponible} onChange={e => setTresoDisponible(Number(e.target.value))} />
            </div>
          </div>

          {/* Results */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: 'BFR estimé', value: `${tresoResults.bfr.toLocaleString()} €` },
              { label: 'Jours de tréso', value: `${tresoResults.joursTreso} jours` },
              { label: 'Flux à reverser', value: `${tresoResults.fluxAReverser.toLocaleString()} €` },
            ].map((m, i) => (
              <div key={i} className="text-center p-4 rounded-xl" style={{ background: '#F8F8F8' }}>
                <p className="text-xs mb-1" style={{ color: 'rgba(26,26,46,0.5)' }}>{m.label}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, color: '#1A1A2E', fontSize: 18 }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Gauge */}
          <div className="mt-4">
            <div className="h-3 rounded-full overflow-hidden flex" style={{ background: '#F0F0F0' }}>
              <div style={{ width: '33%', background: '#ef4444', opacity: 0.7 }} />
              <div style={{ width: '34%', background: '#f59e0b', opacity: 0.7 }} />
              <div style={{ width: '33%', background: '#22c55e', opacity: 0.7 }} />
            </div>
            <div className="relative h-4 mt-1">
              <div className="absolute w-3 h-3 rounded-full border-2 border-white" style={{
                background: '#1A1A2E',
                left: `${Math.min(100, (tresoResults.joursTreso / 90) * 100)}%`,
                transform: 'translateX(-50%)',
                top: -2,
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
              }} />
            </div>
            <p className="text-xs mt-2" style={{ color: 'rgba(26,26,46,0.55)', fontStyle: 'italic' }}>
              {tresoResults.joursTreso < 30
                ? '⚠️ Attention — ta trésorerie couvre moins d\'un mois de charges. Anticipe tes encaissements.'
                : tresoResults.joursTreso < 60
                  ? '✓ Trésorerie correcte — surveille tes échéances de début de mois.'
                  : '✅ Excellente santé de trésorerie.'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI 3 — PERF INDEX */}
      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,200,66,0.03), rgba(245,200,66,0.01))', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ borderLeft: '4px solid #F5C842', padding: '24px' }}>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2" style={{ background: '#F5C842', color: '#1A1A2E', fontFamily: 'Syne, sans-serif' }}>PERF INDEX</span>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1A1A2E', fontSize: 17, marginBottom: 4 }}>Performance opérationnelle</h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, color: 'rgba(26,26,46,0.55)', fontSize: 13, maxWidth: 560 }}>
            Un score sur 100 qui mesure la qualité de ta gestion ce mois-ci. Calculé sur 4 indicateurs clés observés sur les meilleures conciergeries.
          </p>

          {/* Score circle */}
          <div className="flex justify-center mt-6">
            <div className="relative" style={{ width: 140, height: 140 }}>
              <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="54" stroke="#F0F0F0" strokeWidth="8" fill="none" />
                <circle cx="60" cy="60" r="54" stroke={getScoreColor(perfScore.total)} strokeWidth="8" fill="none"
                  strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 48, color: '#1A1A2E', lineHeight: 1 }}>{perfScore.total}</span>
                <span className="text-xs" style={{ color: 'rgba(26,26,46,0.4)' }}>/100</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm mt-2" style={{ color: 'rgba(26,26,46,0.5)' }}>Score Noé ce mois</p>

          {/* Indicators */}
          <div className="mt-6 space-y-4">
            {perfScore.indicators.map((ind, i) => {
              const pct = (ind.score / ind.max) * 100;
              const color = pct < 50 ? '#ef4444' : pct < 75 ? '#f59e0b' : '#22c55e';
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>{ind.label}</span>
                    <span className="text-sm font-bold" style={{ color: '#1A1A2E' }}>{ind.score}/{ind.max}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0F0F0' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: 'rgba(26,26,46,0.4)', fontStyle: 'italic' }}>{ind.tip}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 px-6 rounded-2xl" style={{ background: '#1A1A2E', marginTop: 32 }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 520, margin: '0 auto' }}>
          Ces indicateurs sont calculés par Noé à partir de tes données réelles. Ils ne remplacent pas un expert-comptable mais te donnent une vision opérationnelle claire de ta rentabilité.
        </p>
        <div className="flex justify-center mt-4">
          <Heart className="h-5 w-5" style={{ color: '#FF5C1A', opacity: 0.6 }} />
        </div>
      </div>
    </div>
  );
}
