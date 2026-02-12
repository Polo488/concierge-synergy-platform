import { useState, useMemo, useCallback } from 'react';
import { generateProperties } from '@/utils/mockPropertyGenerator';
import {
  LegalWatchProperty,
  WatchAnalysis,
  RiskLevel,
  LegalWatchFilters,
  RiskScoreHistory,
  WatchSchedule,
  RegulatoryContext,
} from '@/types/legalWatch';

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Lyon: { lat: 45.764, lng: 4.8357 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Bordeaux: { lat: 44.8378, lng: -0.5792 },
  Nice: { lat: 43.7102, lng: 7.262 },
  Toulouse: { lat: 43.6047, lng: 1.4442 },
  Strasbourg: { lat: 48.5734, lng: 7.7521 },
};

const CITY_RISK_BASE: Record<string, number> = {
  Paris: 82,
  Lyon: 58,
  Bordeaux: 65,
  Nice: 70,
  Marseille: 45,
  Toulouse: 40,
  Strasbourg: 50,
};

function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 55) return 'high';
  if (score >= 35) return 'moderate';
  return 'low';
}

function generateRiskScore(city: string, residenceType: string): number {
  const base = CITY_RISK_BASE[city] || 50;
  const residenceBonus = residenceType === 'principale' ? 10 : 0;
  const variation = Math.floor(Math.random() * 20) - 10;
  return Math.max(5, Math.min(98, base + residenceBonus + variation));
}

function generateMockContext(city: string, score: number): RegulatoryContext {
  const pressureMap: Record<string, RegulatoryContext['pressure']> = {
    Paris: 'critique',
    Lyon: 'modérée',
    Bordeaux: 'élevée',
    Nice: 'élevée',
    Marseille: 'modérée',
    Toulouse: 'faible',
    Strasbourg: 'modérée',
  };

  return {
    pressure: pressureMap[city] || 'modérée',
    recentChanges: [
      {
        id: '1',
        title: `Renforcement des contrôles à ${city}`,
        date: '2026-01-15',
        description: `La municipalité de ${city} a annoncé un renforcement des contrôles sur les meublés touristiques, avec des équipes dédiées à la vérification des numéros d'enregistrement.`,
        impact: 'negative',
        source: 'Mairie',
      },
      {
        id: '2',
        title: 'Nouvelle obligation déclarative nationale',
        date: '2025-12-01',
        description: 'Le décret n°2025-XXX impose une déclaration trimestrielle des nuitées auprès de la commune pour tous les meublés touristiques.',
        impact: 'negative',
        source: 'Journal Officiel',
      },
      {
        id: '3',
        title: 'Clarification sur le changement d\'usage',
        date: '2025-11-20',
        description: 'La cour administrative a précisé les conditions de changement d\'usage pour les résidences secondaires en location courte durée.',
        impact: 'neutral',
        source: 'Jurisprudence',
      },
    ],
    jurisprudence: [
      {
        id: '1',
        title: `Tribunal administratif de ${city} – Annulation d'autorisation`,
        date: '2026-01-08',
        court: `TA ${city}`,
        summary: 'Annulation d\'une autorisation de changement d\'usage pour non-respect des conditions de compensation. L\'exploitant doit cesser l\'activité sous 3 mois.',
        relevance: 'high',
      },
      {
        id: '2',
        title: 'Cour de cassation – Amende pour location non déclarée',
        date: '2025-10-15',
        court: 'Cour de cassation',
        summary: 'Confirmation d\'une amende de 50 000€ pour exploitation d\'un meublé touristique sans enregistrement préalable.',
        relevance: 'high',
      },
    ],
    localTrends: [
      {
        id: '1',
        direction: score > 60 ? 'durcissement' : 'stabilité',
        description: score > 60
          ? `Tendance marquée au durcissement à ${city}. Multiplication des contrôles et augmentation des sanctions financières.`
          : `Environnement réglementaire relativement stable à ${city}. Pas de changement majeur attendu à court terme.`,
        confidence: 0.8,
      },
    ],
    weakSignals: score > 50
      ? [
          'Projet de délibération municipale sur la limitation des autorisations de changement d\'usage',
          'Débat public sur la régulation des plateformes de location courte durée',
          'Augmentation des plaintes de voisinage liées aux meublés touristiques',
        ]
      : [
          'Discussions sur la simplification des démarches administratives pour les loueurs',
          'Initiative locale de dialogue avec les plateformes',
        ],
  };
}

export function useLegalWatch() {
  const [filters, setFilters] = useState<LegalWatchFilters>({
    cities: [],
    arrondissements: [],
    groups: [],
    riskLevels: [],
  });

  const [analyses, setAnalyses] = useState<WatchAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<WatchSchedule[]>([
    {
      id: '1',
      scope: { type: 'city', value: 'Paris' },
      frequency: 'monthly',
      nextRun: '2026-03-01',
      isActive: true,
      threshold: 70,
    },
  ]);

  const properties = useMemo<LegalWatchProperty[]>(() => {
    const rawProps = generateProperties();
    return rawProps.map((p) => {
      const city = p.address.split(', ').pop() || 'Lyon';
      const coords = CITY_COORDS[city] || CITY_COORDS.Lyon;
      const riskScore = generateRiskScore(city, p.residenceType);
      return {
        id: p.id,
        name: p.name,
        address: p.address,
        city,
        zipCode: '69000',
        country: 'France',
        lat: coords.lat + (Math.random() - 0.5) * 0.05,
        lng: coords.lng + (Math.random() - 0.5) * 0.05,
        residenceType: p.residenceType,
        nightsCount: p.nightsCount,
        nightsLimit: p.nightsLimit,
        riskScore,
        riskLevel: getRiskLevel(riskScore),
        lastAnalysisDate: Math.random() > 0.3 ? '2026-01-15' : undefined,
      };
    });
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (filters.cities.length && !filters.cities.includes(p.city)) return false;
      if (filters.riskLevels.length && !filters.riskLevels.includes(p.riskLevel)) return false;
      return true;
    });
  }, [properties, filters]);

  const availableCities = useMemo(() => [...new Set(properties.map((p) => p.city))].sort(), [properties]);

  const cityStats = useMemo(() => {
    const stats: Record<string, { count: number; avgScore: number; level: RiskLevel }> = {};
    for (const city of availableCities) {
      const cityProps = properties.filter((p) => p.city === city);
      const avg = Math.round(cityProps.reduce((s, p) => s + p.riskScore, 0) / cityProps.length);
      stats[city] = { count: cityProps.length, avgScore: avg, level: getRiskLevel(avg) };
    }
    return stats;
  }, [properties, availableCities]);

  const globalRiskScore = useMemo(() => {
    if (!filteredProperties.length) return 0;
    return Math.round(filteredProperties.reduce((s, p) => s + p.riskScore, 0) / filteredProperties.length);
  }, [filteredProperties]);

  const riskDistribution = useMemo(() => {
    const dist = { low: 0, moderate: 0, high: 0, critical: 0 };
    for (const p of filteredProperties) dist[p.riskLevel]++;
    return dist;
  }, [filteredProperties]);

  const riskHistory = useMemo<RiskScoreHistory[]>(() => {
    const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];
    let base = globalRiskScore - 8;
    return months.map((date) => {
      base += Math.floor(Math.random() * 5) - 1;
      base = Math.max(10, Math.min(95, base));
      return { date, score: base, level: getRiskLevel(base) };
    });
  }, [globalRiskScore]);

  const launchAnalysis = useCallback(
    async (scopeType: 'global' | 'city' | 'property', scopeValue?: string) => {
      setIsAnalyzing(true);
      // Simulate API call
      await new Promise((r) => setTimeout(r, 2500));

      const city = scopeType === 'city' ? scopeValue! : scopeType === 'property'
        ? properties.find((p) => p.id === scopeValue)?.city || 'Lyon'
        : 'France';

      const score = scopeType === 'property'
        ? properties.find((p) => p.id === scopeValue)?.riskScore || 50
        : cityStats[city]?.avgScore || globalRiskScore;

      const ctx = generateMockContext(city, score);

      const analysis: WatchAnalysis = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        scope: { type: scopeType, value: scopeValue },
        scopeLabel:
          scopeType === 'global'
            ? 'Analyse globale'
            : scopeType === 'city'
            ? city
            : properties.find((p) => p.id === scopeValue)?.name || '',
        riskScore: score,
        riskLevel: getRiskLevel(score),
        context: ctx,
        summary: `L'analyse du contexte réglementaire pour ${
          scopeType === 'global' ? 'l\'ensemble du portefeuille' : city
        } révèle une pression ${ctx.pressure}. ${
          ctx.recentChanges.length
        } évolutions réglementaires récentes ont été identifiées, dont ${
          ctx.recentChanges.filter((c) => c.impact === 'negative').length
        } à impact négatif. ${
          ctx.jurisprudence.filter((j) => j.relevance === 'high').length
        } décisions de justice à forte pertinence ont été relevées.`,
        recommendations:
          score > 60
            ? [
                'Audit de conformité recommandé pour les logements à risque élevé',
                'Vérification des autorisations de changement d\'usage',
                'Mise à jour des numéros d\'enregistrement',
                'Consultation d\'un avocat spécialisé conseillée',
              ]
            : [
                'Maintenir la veille réglementaire active',
                'S\'assurer de la conformité des déclarations',
                'Suivre les évolutions législatives locales',
              ],
      };

      setAnalyses((prev) => [analysis, ...prev]);
      setIsAnalyzing(false);
      return analysis;
    },
    [properties, cityStats, globalRiskScore]
  );

  return {
    properties: filteredProperties,
    allProperties: properties,
    filters,
    setFilters,
    availableCities,
    cityStats,
    globalRiskScore,
    globalRiskLevel: getRiskLevel(globalRiskScore),
    riskDistribution,
    riskHistory,
    analyses,
    isAnalyzing,
    launchAnalysis,
    selectedScope,
    setSelectedScope,
    schedules,
    setSchedules,
  };
}
