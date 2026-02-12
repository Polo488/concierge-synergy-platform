import { useState, useMemo, useCallback } from 'react';
import { 
  PropertyInsight, 
  InsightType, 
  InsightStatus, 
  InsightThresholds, 
  DEFAULT_THRESHOLDS 
} from '@/types/insights';
import { OnboardingProcess } from '@/types/onboarding';
import { properties } from '@/hooks/calendar/mockData';

// Generate mock insights based on rules
const generateMockInsights = (): PropertyInsight[] => {
  const now = new Date();
  
  return [
    {
      id: 'insight-1',
      propertyId: 2,
      propertyName: 'Studio 8 Avenue des Fleurs',
      type: 'occupancy',
      severity: 'warning',
      status: 'unread',
      title: 'Taux d\'occupation bas détecté',
      message: 'Studio 8 Avenue des Fleurs affiche un taux d\'occupation 18% inférieur à la moyenne du portefeuille sur les 30 derniers jours.',
      metric: {
        propertyValue: 52,
        portfolioAverage: 70,
        difference: -18,
        differencePercent: -25.7,
      },
      metricLabel: 'Taux d\'occupation',
      comparisonPeriod: '30d',
      suggestion: 'Envisagez de revoir la tarification ou les règles de durée minimum de séjour.',
      actions: [
        { id: 'a1', label: 'Ouvrir le calendrier tarifaire', action: 'open_pricing' },
        { id: 'a2', label: 'Gérer les règles', action: 'open_rules' },
      ],
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h ago
    },
    {
      id: 'insight-2',
      propertyId: 3,
      propertyName: 'Loft 72 Rue des Arts',
      type: 'pricing',
      severity: 'critical',
      status: 'unread',
      title: 'Tarif élevé vs occupation basse',
      message: 'Loft 72 Rue des Arts est tarifé 22% au-dessus de la moyenne des biens similaires, avec un taux d\'occupation inférieur.',
      metric: {
        propertyValue: 85,
        portfolioAverage: 70,
        peerGroupAverage: 68,
        difference: 17,
        differencePercent: 22.4,
      },
      metricLabel: 'Prix moyen/nuit (€)',
      comparisonPeriod: '14d',
      suggestion: 'Ajustez le prix à la baisse ou ajoutez une promotion last-minute.',
      actions: [
        { id: 'a3', label: 'Ouvrir le calendrier tarifaire', action: 'open_pricing' },
        { id: 'a4', label: 'Voir le bien', action: 'open_property' },
      ],
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5h ago
    },
    {
      id: 'insight-3',
      propertyId: 4,
      propertyName: 'Maison 23 Rue de la Paix',
      type: 'restriction',
      severity: 'warning',
      status: 'unread',
      title: 'Durée minimum trop restrictive',
      message: 'Maison 23 Rue de la Paix a une durée minimum de 4 nuits alors que des biens similaires performent mieux avec 2 nuits.',
      metric: {
        propertyValue: 4,
        portfolioAverage: 2,
        peerGroupAverage: 2,
        difference: 2,
        differencePercent: 100,
      },
      metricLabel: 'Durée min. (nuits)',
      comparisonPeriod: '30d',
      suggestion: 'Réduisez la durée minimum de séjour à 2 nuits pour augmenter les réservations.',
      actions: [
        { id: 'a5', label: 'Gérer les règles', action: 'open_rules' },
      ],
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 'insight-4',
      propertyId: 6,
      propertyName: 'Studio 15 Rue des Lilas',
      type: 'availability',
      severity: 'info',
      status: 'read',
      title: 'Nombreux jours bloqués',
      message: 'Studio 15 Rue des Lilas a 12 jours bloqués sur les 30 prochains jours, contre 4 en moyenne pour le portefeuille.',
      metric: {
        propertyValue: 12,
        portfolioAverage: 4,
        difference: 8,
        differencePercent: 200,
      },
      metricLabel: 'Jours bloqués',
      comparisonPeriod: '30d',
      suggestion: 'Vérifiez si certains blocages peuvent être libérés pour augmenter la disponibilité.',
      actions: [
        { id: 'a6', label: 'Ouvrir le calendrier', action: 'open_calendar' },
      ],
      createdAt: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
      readAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    {
      id: 'insight-5',
      propertyId: 7,
      propertyName: 'Appartement 28 Avenue Victor Hugo',
      type: 'occupancy',
      severity: 'critical',
      status: 'unread',
      title: 'Taux d\'occupation critique',
      message: 'Appartement 28 Avenue Victor Hugo n\'a que 35% d\'occupation sur les 14 derniers jours, soit 28% en dessous de la moyenne.',
      metric: {
        propertyValue: 35,
        portfolioAverage: 63,
        difference: -28,
        differencePercent: -44.4,
      },
      metricLabel: 'Taux d\'occupation',
      comparisonPeriod: '14d',
      suggestion: 'Action urgente recommandée: baisse de prix significative ou promotion last-minute.',
      actions: [
        { id: 'a7', label: 'Ouvrir le calendrier tarifaire', action: 'open_pricing' },
        { id: 'a8', label: 'Gérer les règles', action: 'open_rules' },
      ],
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1h ago
    },
  ];
};

// Generate onboarding delay alerts from processes
const generateOnboardingInsights = (processes: OnboardingProcess[]): PropertyInsight[] => {
  const now = new Date();
  const alerts: PropertyInsight[] = [];
  
  // Step delay thresholds in days
  const stepThresholds: Record<string, number> = {
    'lead': 2,
    'appointment': 7,
    'mandate': 10,
    'rib': 5,
    'preparation': 14,
    'property_creation': 5,
    'publication': 4,
    'closure': 2,
  };

  processes
    .filter(p => p.status === 'in_progress' || p.status === 'blocked')
    .forEach(process => {
      process.steps.forEach(step => {
        if (step.status !== 'in_progress' && step.status !== 'todo' && step.status !== 'blocked') return;
        if (!step.startedAt) return;

        const startedAt = new Date(step.startedAt);
        const daysElapsed = Math.floor((now.getTime() - startedAt.getTime()) / (1000 * 60 * 60 * 24));
        const threshold = stepThresholds[step.stepType] || 7;

        if (daysElapsed >= threshold) {
          const overdueDays = daysElapsed - threshold;
          const severity = overdueDays >= 7 ? 'critical' : overdueDays >= 3 ? 'warning' : 'info';

          alerts.push({
            id: `onb-${process.id}-${step.id}`,
            propertyId: 0,
            propertyName: process.propertyName,
            type: 'onboarding',
            severity: severity as 'critical' | 'warning' | 'info',
            status: 'unread',
            title: `Étape "${step.title}" en retard`,
            message: `L'onboarding de ${process.propertyName} est bloqué à l'étape "${step.title}" depuis ${daysElapsed} jours (seuil : ${threshold}j). Responsable : ${step.assigneeNames[0] || process.assignedToName}.`,
            metric: {
              propertyValue: daysElapsed,
              portfolioAverage: threshold,
              difference: overdueDays,
              differencePercent: Math.round((overdueDays / threshold) * 100),
            },
            metricLabel: 'Durée (jours)',
            comparisonPeriod: '30d',
            suggestion: step.status === 'blocked' 
              ? `Cette étape est bloquée${step.blockedReason ? ` : ${step.blockedReason}` : ''}. Contactez ${step.assigneeNames[0] || process.assignedToName} pour débloquer.`
              : `Relancez ${step.assigneeNames[0] || process.assignedToName} pour finaliser cette étape.`,
            actions: [
              { id: `onb-action-${step.id}`, label: 'Voir l\'onboarding', action: 'open_onboarding' },
            ],
            createdAt: new Date(now.getTime() - overdueDays * 24 * 60 * 60 * 1000),
          });
        }
      });

      // Global onboarding duration alert
      if (process.totalDays && process.totalDays > 30 && process.status !== 'completed') {
        alerts.push({
          id: `onb-global-${process.id}`,
          propertyId: 0,
          propertyName: process.propertyName,
          type: 'onboarding',
          severity: process.totalDays > 45 ? 'critical' : 'warning',
          status: 'unread',
          title: `Onboarding trop long (${process.totalDays}j)`,
          message: `L'onboarding de ${process.propertyName} dure depuis ${process.totalDays} jours (objectif : 30j). Progression : ${process.progress}%. Responsable : ${process.assignedToName}.`,
          metric: {
            propertyValue: process.totalDays,
            portfolioAverage: 30,
            difference: process.totalDays - 30,
            differencePercent: Math.round(((process.totalDays - 30) / 30) * 100),
          },
          metricLabel: 'Durée totale (jours)',
          comparisonPeriod: '30d',
          suggestion: `Identifiez les goulots d'étranglement et accélérez les étapes restantes.`,
          actions: [
            { id: `onb-global-action-${process.id}`, label: 'Voir l\'onboarding', action: 'open_onboarding' },
          ],
          createdAt: new Date(now.getTime() - (process.totalDays - 30) * 24 * 60 * 60 * 1000),
        });
      }
    });

  return alerts;
};

export interface UseInsightsReturn {
  insights: PropertyInsight[];
  unreadCount: number;
  thresholds: InsightThresholds;
  setThresholds: (thresholds: InsightThresholds) => void;
  markAsRead: (insightId: string) => void;
  markAllAsRead: () => void;
  archiveInsight: (insightId: string) => void;
  getInsightsForProperty: (propertyId: number) => PropertyInsight[];
  filterByType: (type: InsightType | 'all') => PropertyInsight[];
  filterByStatus: (status: InsightStatus | 'all') => PropertyInsight[];
  disabledTypes: InsightType[];
  toggleTypeEnabled: (type: InsightType) => void;
  injectOnboardingProcesses: (processes: OnboardingProcess[]) => void;
}

export function useInsights(): UseInsightsReturn {
  const [insights, setInsights] = useState<PropertyInsight[]>(generateMockInsights);
  const [thresholds, setThresholds] = useState<InsightThresholds>(DEFAULT_THRESHOLDS);
  const [disabledTypes, setDisabledTypes] = useState<InsightType[]>([]);
  const [onboardingProcesses, setOnboardingProcesses] = useState<OnboardingProcess[]>([]);

  const injectOnboardingProcesses = useCallback((processes: OnboardingProcess[]) => {
    setOnboardingProcesses(processes);
  }, []);

  const allInsights = useMemo(() => {
    const onboardingInsights = generateOnboardingInsights(onboardingProcesses);
    // Merge: base insights + onboarding insights (replace old onboarding ones)
    const baseInsights = insights.filter(i => i.type !== 'onboarding');
    return [...baseInsights, ...onboardingInsights];
  }, [insights, onboardingProcesses]);

  const unreadCount = useMemo(() => 
    allInsights.filter(i => i.status === 'unread').length,
    [allInsights]
  );

  const markAsRead = useCallback((insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, status: 'read' as InsightStatus, readAt: new Date() }
        : insight
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setInsights(prev => prev.map(insight => 
      insight.status === 'unread'
        ? { ...insight, status: 'read' as InsightStatus, readAt: new Date() }
        : insight
    ));
  }, []);

  const archiveInsight = useCallback((insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, status: 'archived' as InsightStatus, archivedAt: new Date() }
        : insight
    ));
  }, []);

  const getInsightsForProperty = useCallback((propertyId: number) => {
    return allInsights.filter(i => 
      i.propertyId === propertyId && 
      i.status !== 'archived' &&
      !disabledTypes.includes(i.type)
    );
  }, [allInsights, disabledTypes]);

  const filterByType = useCallback((type: InsightType | 'all') => {
    if (type === 'all') return allInsights.filter(i => i.status !== 'archived');
    return allInsights.filter(i => i.type === type && i.status !== 'archived');
  }, [allInsights]);

  const filterByStatus = useCallback((status: InsightStatus | 'all') => {
    if (status === 'all') return allInsights.filter(i => i.status !== 'archived');
    return allInsights.filter(i => i.status === status);
  }, [allInsights]);

  const toggleTypeEnabled = useCallback((type: InsightType) => {
    setDisabledTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  return {
    insights: allInsights,
    unreadCount,
    thresholds,
    setThresholds,
    markAsRead,
    markAllAsRead,
    archiveInsight,
    getInsightsForProperty,
    filterByType,
    filterByStatus,
    disabledTypes,
    toggleTypeEnabled,
    injectOnboardingProcesses,
  };
}
