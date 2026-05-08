// Mock data for the Cockpit Financier module (beta)

export type CockpitLevel = 'critique' | 'fragile' | 'acceptable' | 'solide' | 'excellent';

export interface CockpitScore {
  score: number;
  level: CockpitLevel;
  levelLabel: string;
  percentile: number;
  noeScore: number; // 0-100
  perfIndex: number; // 0-100
  tresoPulse: number; // 0-100
  flawsCount: number;
}

export function getLevelFromScore(score: number): { level: CockpitLevel; label: string } {
  if (score < 30) return { level: 'critique', label: 'Critique' };
  if (score < 50) return { level: 'fragile', label: 'Fragile' };
  if (score < 70) return { level: 'acceptable', label: 'Acceptable' };
  if (score < 85) return { level: 'solide', label: 'Solide' };
  return { level: 'excellent', label: 'Excellent' };
}

export function getCockpitScore(): CockpitScore {
  const noeScore = 76;
  const perfIndex = 73;
  const tresoPulse = 82;
  const flawsCount = 5;
  const flawsPenalty = Math.min(flawsCount * 2, 10);
  const raw = noeScore * 0.4 + perfIndex * 0.3 + tresoPulse * 0.2 + (10 - flawsPenalty);
  const score = Math.round(raw);
  const { level, label } = getLevelFromScore(score);
  return { score, level, levelLabel: label, percentile: 64, noeScore, perfIndex, tresoPulse, flawsCount };
}

// ── Onglet Vue d'ensemble ─────────────────────────────────────────────
export const overviewMock = {
  noeScore: {
    rentables: 8,
    total: 10,
    priorities: [
      { id: 'p1', label: 'T2 Cours Julien', commission: 290 },
      { id: 'p2', label: 'Studio Réformés', commission: 260 },
      { id: 'p3', label: 'T3 Bellecour', commission: 215 },
    ],
  },
  treso: {
    bfr: 12000,
    daysCash: 47,
    pendingFlow: 18500,
  },
  perf: {
    score: 73,
    sub: [
      { label: 'Réactivité', value: 85 },
      { label: 'Occupation', value: 71 },
      { label: 'Qualité', value: 80 },
      { label: 'Récurrence', value: 62 },
    ],
  },
  evolution: {
    months: ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
    noe: [62, 65, 68, 70, 72, 76],
    treso: [85, 84, 82, 80, 80, 82],
    perf: [65, 67, 69, 71, 72, 73],
  },
};

// ── Onglet Diagnostic — radar ─────────────────────────────────────────
export type FlawSeverity = 'critique' | 'important' | 'surveiller';
export interface RadarFlaw {
  id: string;
  category: string;
  property: string;
  title: string;
  diagnosis: string;
  severity: FlawSeverity;
  monthlyImpact: number; // €
  details: { you: number; market: number; unit: string };
  actions: string[];
  resolved?: boolean;
}

export function generateRadarScan(): RadarFlaw[] {
  return [
    {
      id: 'f1',
      category: 'Sous-tarification',
      property: 'T2 Cours Julien',
      title: 'Sous-tarification détectée',
      diagnosis: 'Tu factures 95 €/nuit en moyenne. Le marché local est à 130 €.',
      severity: 'critique',
      monthlyImpact: 462,
      details: { you: 95, market: 130, unit: '€/nuit' },
      actions: ['Augmenter le tarif de base', 'Activer la tarification dynamique', 'Revoir les week-ends'],
    },
    {
      id: 'f2',
      category: 'Frais de ménage mal calibré',
      property: 'Appartement Voltaire',
      title: 'Ménage sous-facturé',
      diagnosis: 'Tu factures 55 €, ton prestataire te coûte 70 €. Tu absorbes 15 € par rotation.',
      severity: 'critique',
      monthlyImpact: 320,
      details: { you: 55, market: 70, unit: '€' },
      actions: ['Réajuster le tarif facturé', 'Négocier le prestataire', 'Passer en débours'],
    },
    {
      id: 'f3',
      category: 'Charges en dérive',
      property: 'Toutes activités',
      title: 'Charges en hausse de 22 % sur 3 mois',
      diagnosis: 'Tes charges récurrentes ont augmenté de 22 % sans hausse équivalente du CA.',
      severity: 'important',
      monthlyImpact: 215,
      details: { you: 122, market: 100, unit: 'index' },
      actions: ['Auditer les abonnements', 'Renégocier 3 fournisseurs', 'Importer le relevé bancaire'],
    },
    {
      id: 'f4',
      category: 'Trop de petites locations',
      property: 'Studio République',
      title: '38 % de séjours <2 nuits',
      diagnosis: 'Les courts séjours pèsent ton coût ménage. Le seuil sain est à 25 %.',
      severity: 'important',
      monthlyImpact: 180,
      details: { you: 38, market: 25, unit: '%' },
      actions: ['Imposer minimum 2 nuits', 'Augmenter le tarif <2 nuits', 'Bloquer les week-ends courts'],
    },
    {
      id: 'f5',
      category: 'Saisonnalité non exploitée',
      property: 'Studio Réformés',
      title: 'Pic estival sous-tarifié',
      diagnosis: 'Tes prix juillet/août n\'augmentent que de 8 %. La moyenne du marché est +35 %.',
      severity: 'surveiller',
      monthlyImpact: 70,
      details: { you: 108, market: 135, unit: '€/nuit pic' },
      actions: ['Activer la saisonnalité', 'Étudier les comparables', 'Augmenter par paliers'],
    },
  ];
}

// ── Onglet Ménage ─────────────────────────────────────────────────────
export type CleaningStatus = 'sous-facture' | 'equilibre' | 'marge' | 'a-valider';
export interface CleaningProperty {
  id: string;
  name: string;
  facture: number;
  prestataire: number;
  rotations: number;
  status: CleaningStatus;
}

export function getCleaningAnalysis(): CleaningProperty[] {
  const data: Array<[string, number, number, number]> = [
    ['Appartement Voltaire', 55, 70, 40],
    ['T2 Cours Julien', 70, 70, 36],
    ['Studio Réformés', 50, 65, 28],
    ['T3 Bellecour', 80, 75, 22],
    ['Loft Confluence', 75, 90, 18],
    ['Studio République', 55, 55, 32],
    ['T2 Croix-Rousse', 65, 80, 24],
    ['T3 Part-Dieu', 85, 80, 19],
    ['Studio Vieux Lyon', 50, 60, 30],
    ['T2 Saxe-Gambetta', 60, 60, 26],
    ['Loft Vaise', 90, 95, 14],
    ['Studio Brotteaux', 55, 70, 22],
  ];
  return data.map(([name, facture, prestataire, rotations], i) => {
    let status: CleaningStatus = 'equilibre';
    const diff = facture - prestataire;
    if (diff < -3) status = 'sous-facture';
    else if (diff > 3) status = 'marge';
    if (i === 11) status = 'a-valider';
    return { id: `c${i}`, name, facture, prestataire, rotations, status };
  });
}

// ── Onglet Charges réelles — CSV ─────────────────────────────────────
export type CSVCategory = 'essentielle' | 'non-essentielle' | 'a-valider';
export interface CSVLine {
  id: string;
  date: string;
  label: string;
  amount: number;
  category: CSVCategory;
  subCategory: string;
}

export function getCSVImportMock(): CSVLine[] {
  const lines: Array<[string, string, number, CSVCategory, string]> = [
    ['12/05/2026', 'VIRT URSSAF COTISATIONS', -890, 'essentielle', 'Salaires / RH'],
    ['10/05/2026', 'LOYER LOCAL COMMERCIAL', -650, 'essentielle', 'Loyer'],
    ['08/05/2026', 'PRESTATAIRE MÉNAGE LYON', -780, 'essentielle', 'Ménage'],
    ['06/05/2026', 'BLANCHISSERIE PROPRE', -180, 'essentielle', 'Blanchisserie'],
    ['05/05/2026', 'AMAZON FOURNITURES', -124, 'essentielle', 'Fournitures logements'],
    ['04/05/2026', 'IGLOOHOME ABONNEMENT', -42, 'essentielle', 'Abonnements métier'],
    ['03/05/2026', 'AIRBNB COMMISSIONS', -280, 'essentielle', 'Plateformes'],
    ['02/05/2026', 'BNP PARIBAS FRAIS', -18, 'a-valider', 'Frais bancaires'],
    ['01/05/2026', 'NETFLIX', -17, 'non-essentielle', 'Abonnements perso'],
    ['30/04/2026', 'RESTAURANT LE PETIT', -68, 'non-essentielle', 'Restauration'],
    ['28/04/2026', 'STATION ESSENCE TOTAL', -75, 'a-valider', 'Carburant'],
    ['25/04/2026', 'FREE MOBILE', -22, 'essentielle', 'Téléphonie'],
    ['22/04/2026', 'EDF ÉLECTRICITÉ', -145, 'essentielle', 'Énergie'],
    ['20/04/2026', 'CARREFOUR ALIMENTATION', -94, 'non-essentielle', 'Vie perso'],
    ['18/04/2026', 'OVH HÉBERGEMENT', -28, 'essentielle', 'Abonnements métier'],
    ['15/04/2026', 'COMPTABLE EXPERT', -250, 'essentielle', 'Honoraires'],
    ['13/04/2026', 'UBER EATS', -32, 'a-valider', 'Restauration'],
  ];
  return lines.map(([date, label, amount, category, subCategory], i) => ({
    id: `l${i}`, date, label, amount, category, subCategory,
  }));
}

// ── Onglet Audit ──────────────────────────────────────────────────────
export interface AuditSlot {
  date: string;
  weekday: string;
  slots: string[];
}

export function getAuditSlots(): AuditSlot[] {
  const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  const today = new Date();
  const result: AuditSlot[] = [];
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    result.push({
      date: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
      weekday: days[d.getDay() - 1],
      slots: ['09:30', '11:00', '14:00', '16:30'],
    });
  }
  return result;
}

export const auditTestimonials = [
  {
    name: 'Camille L.',
    company: 'Côté Cocon — Lyon',
    quote: 'L\'audit a identifié 3 logements sous-tarifés. +1 200 €/mois récupérés en 6 semaines.',
    gain: '+14 400 €/an',
  },
  {
    name: 'Thomas R.',
    company: 'Maison & Vous — Bordeaux',
    quote: 'J\'ai compris pourquoi je travaillais autant pour si peu. Maintenant je pilote.',
    gain: '+9 600 €/an',
  },
  {
    name: 'Léa M.',
    company: 'Atypik Stays — Marseille',
    quote: 'Les leviers ménage seuls m\'ont fait gagner 540 €/mois. Sans changer mes prestataires.',
    gain: '+6 480 €/an',
  },
];
