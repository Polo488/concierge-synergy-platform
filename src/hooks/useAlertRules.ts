import { useState, useCallback, useMemo } from 'react';
import { 
  AlertRule, 
  RuleCategory, 
  RulePriority, 
  RuleTestResult,
  PropertyGroup 
} from '@/types/alertRules';
import { properties } from '@/hooks/calendar/mockData';

// Generate mock rules
const generateMockRules = (): AlertRule[] => {
  const now = new Date();
  return [
    {
      id: 'rule-1',
      name: 'Occupation basse vs portefeuille',
      description: "Alerte si le taux d'occupation est significativement inférieur à la moyenne",
      category: 'occupancy',
      enabled: true,
      priority: 'high',
      metric: 'occupancy_rate',
      baseline: 'portfolio_average',
      thresholdType: 'relative',
      thresholdValue: 15,
      thresholdOperator: 'below',
      severityThresholds: { warning: 10, critical: 20 },
      timeWindow: '30d',
      timeDirection: 'past',
      triggerFrequency: 'daily',
      scope: 'all',
      notificationTemplate: {
        title: "Taux d'occupation bas détecté",
        message: "{{property_name}} affiche un taux d'occupation de {{metric_value}}, soit {{delta}} par rapport à la moyenne du portefeuille ({{baseline_value}}) sur les {{period}}.",
        suggestedActions: [
          { id: 'a1', label: 'Ouvrir le calendrier tarifaire', actionType: 'open_pricing' },
          { id: 'a2', label: 'Gérer les règles', actionType: 'open_rules' },
        ],
      },
      cooldownDays: 7,
      autoArchiveDays: 30,
      snoozedPropertyIds: [],
      mutedPropertyIds: [],
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      triggerCount: 12,
    },
    {
      id: 'rule-2',
      name: 'Prix élevé vs occupation basse',
      description: 'Détecte les biens sur-tarifés avec faible occupation',
      category: 'pricing',
      enabled: true,
      priority: 'medium',
      metric: 'price_vs_market',
      baseline: 'peer_group',
      thresholdType: 'relative',
      thresholdValue: 20,
      thresholdOperator: 'above',
      severityThresholds: { warning: 15, critical: 25 },
      timeWindow: '14d',
      timeDirection: 'past',
      triggerFrequency: 'daily',
      scope: 'all',
      notificationTemplate: {
        title: 'Tarif élevé vs occupation basse',
        message: "{{property_name}} est tarifé {{delta}} au-dessus de la moyenne des biens similaires, avec un taux d'occupation inférieur.",
        suggestedActions: [
          { id: 'a3', label: 'Ouvrir le calendrier tarifaire', actionType: 'open_pricing' },
        ],
      },
      cooldownDays: 5,
      autoArchiveDays: 14,
      snoozedPropertyIds: [],
      mutedPropertyIds: [],
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      triggerCount: 5,
    },
    {
      id: 'rule-3',
      name: 'Durée minimum restrictive',
      description: 'Alerte si la durée minimum est plus élevée que les pairs performants',
      category: 'restrictions',
      enabled: true,
      priority: 'low',
      metric: 'min_stay_value',
      baseline: 'peer_group',
      thresholdType: 'absolute',
      thresholdValue: 3,
      thresholdOperator: 'above',
      timeWindow: '30d',
      timeDirection: 'past',
      triggerFrequency: 'weekly',
      scope: 'all',
      notificationTemplate: {
        title: 'Durée minimum trop restrictive',
        message: "{{property_name}} a une durée minimum de {{metric_value}} nuits alors que des biens similaires performent mieux avec {{baseline_value}} nuits.",
        suggestedActions: [
          { id: 'a4', label: 'Gérer les règles', actionType: 'open_rules' },
        ],
      },
      cooldownDays: 14,
      autoArchiveDays: 30,
      snoozedPropertyIds: [],
      mutedPropertyIds: [],
      createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      triggerCount: 3,
    },
    {
      id: 'rule-4',
      name: 'Nombreux jours bloqués',
      description: 'Alerte si trop de jours sont bloqués par rapport au portefeuille',
      category: 'availability',
      enabled: false,
      priority: 'medium',
      metric: 'blocked_days_count',
      baseline: 'portfolio_average',
      thresholdType: 'relative',
      thresholdValue: 100,
      thresholdOperator: 'above',
      timeWindow: '30d',
      timeDirection: 'future',
      triggerFrequency: 'weekly',
      scope: 'all',
      notificationTemplate: {
        title: 'Nombreux jours bloqués',
        message: "{{property_name}} a {{metric_value}} jours bloqués sur les {{period}}, contre {{baseline_value}} en moyenne pour le portefeuille.",
        suggestedActions: [
          { id: 'a5', label: 'Ouvrir le calendrier', actionType: 'open_availability' },
        ],
      },
      cooldownDays: 7,
      autoArchiveDays: 14,
      snoozedPropertyIds: [],
      mutedPropertyIds: [],
      createdAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
      triggerCount: 8,
    },
    {
      id: 'rule-5',
      name: 'RevPAR en baisse',
      description: 'Alerte si le RevPAR est significativement inférieur à la moyenne',
      category: 'revenue',
      enabled: true,
      priority: 'high',
      metric: 'revpar',
      baseline: 'portfolio_average',
      thresholdType: 'relative',
      thresholdValue: 25,
      thresholdOperator: 'below',
      severityThresholds: { warning: 15, critical: 30 },
      timeWindow: '30d',
      timeDirection: 'past',
      triggerFrequency: 'weekly',
      scope: 'all',
      notificationTemplate: {
        title: 'RevPAR en baisse',
        message: "{{property_name}} a un RevPAR de {{metric_value}}€, soit {{delta}} par rapport à la moyenne du portefeuille.",
        suggestedActions: [
          { id: 'a6', label: 'Ouvrir le calendrier tarifaire', actionType: 'open_pricing' },
          { id: 'a7', label: 'Voir le bien', actionType: 'open_property' },
        ],
      },
      cooldownDays: 7,
      autoArchiveDays: 30,
      snoozedPropertyIds: [],
      mutedPropertyIds: [],
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      triggerCount: 2,
    },
  ];
};

const generateMockPropertyGroups = (): PropertyGroup[] => [
  {
    id: 'group-1',
    name: 'Studios Centre-Ville',
    propertyIds: [2, 6],
    criteria: { capacity: [1, 2], area: ['centre'] },
  },
  {
    id: 'group-2',
    name: 'Grands appartements',
    propertyIds: [4, 7],
    criteria: { capacity: [4, 5, 6] },
  },
];

export interface UseAlertRulesReturn {
  rules: AlertRule[];
  propertyGroups: PropertyGroup[];
  
  // CRUD operations
  addRule: (rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => void;
  updateRule: (id: string, updates: Partial<AlertRule>) => void;
  deleteRule: (id: string) => void;
  duplicateRule: (id: string) => void;
  
  // Toggle operations
  toggleRuleEnabled: (id: string) => void;
  togglePropertySnooze: (ruleId: string, propertyId: number) => void;
  togglePropertyMute: (ruleId: string, propertyId: number) => void;
  
  // Priority operations
  setRulePriority: (id: string, priority: RulePriority) => void;
  
  // Property groups
  addPropertyGroup: (group: Omit<PropertyGroup, 'id'>) => void;
  updatePropertyGroup: (id: string, updates: Partial<PropertyGroup>) => void;
  deletePropertyGroup: (id: string) => void;
  
  // Test/Preview
  testRule: (ruleId: string, propertyIds?: number[]) => RuleTestResult[];
  
  // Filters
  filterByCategory: (category: RuleCategory | 'all') => AlertRule[];
  filterByStatus: (enabled: boolean | 'all') => AlertRule[];
  filterByPriority: (priority: RulePriority | 'all') => AlertRule[];
  searchRules: (query: string) => AlertRule[];
}

export function useAlertRules(): UseAlertRulesReturn {
  const [rules, setRules] = useState<AlertRule[]>(generateMockRules);
  const [propertyGroups, setPropertyGroups] = useState<PropertyGroup[]>(generateMockPropertyGroups);

  const addRule = useCallback((ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt' | 'triggerCount'>) => {
    const newRule: AlertRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      triggerCount: 0,
    };
    setRules(prev => [...prev, newRule]);
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<AlertRule>) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, ...updates, updatedAt: new Date() }
        : rule
    ));
  }, []);

  const deleteRule = useCallback((id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
  }, []);

  const duplicateRule = useCallback((id: string) => {
    const ruleToDuplicate = rules.find(r => r.id === id);
    if (!ruleToDuplicate) return;
    
    const duplicatedRule: AlertRule = {
      ...ruleToDuplicate,
      id: `rule-${Date.now()}`,
      name: `${ruleToDuplicate.name} (copie)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      triggerCount: 0,
    };
    setRules(prev => [...prev, duplicatedRule]);
  }, [rules]);

  const toggleRuleEnabled = useCallback((id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, enabled: !rule.enabled, updatedAt: new Date() }
        : rule
    ));
  }, []);

  const togglePropertySnooze = useCallback((ruleId: string, propertyId: number) => {
    setRules(prev => prev.map(rule => {
      if (rule.id !== ruleId) return rule;
      const snoozed = rule.snoozedPropertyIds.includes(propertyId)
        ? rule.snoozedPropertyIds.filter(id => id !== propertyId)
        : [...rule.snoozedPropertyIds, propertyId];
      return { ...rule, snoozedPropertyIds: snoozed, updatedAt: new Date() };
    }));
  }, []);

  const togglePropertyMute = useCallback((ruleId: string, propertyId: number) => {
    setRules(prev => prev.map(rule => {
      if (rule.id !== ruleId) return rule;
      const muted = rule.mutedPropertyIds.includes(propertyId)
        ? rule.mutedPropertyIds.filter(id => id !== propertyId)
        : [...rule.mutedPropertyIds, propertyId];
      return { ...rule, mutedPropertyIds: muted, updatedAt: new Date() };
    }));
  }, []);

  const setRulePriority = useCallback((id: string, priority: RulePriority) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, priority, updatedAt: new Date() }
        : rule
    ));
  }, []);

  const addPropertyGroup = useCallback((groupData: Omit<PropertyGroup, 'id'>) => {
    const newGroup: PropertyGroup = {
      ...groupData,
      id: `group-${Date.now()}`,
    };
    setPropertyGroups(prev => [...prev, newGroup]);
  }, []);

  const updatePropertyGroup = useCallback((id: string, updates: Partial<PropertyGroup>) => {
    setPropertyGroups(prev => prev.map(group => 
      group.id === id ? { ...group, ...updates } : group
    ));
  }, []);

  const deletePropertyGroup = useCallback((id: string) => {
    setPropertyGroups(prev => prev.filter(group => group.id !== id));
  }, []);

  // Simulate rule testing with mock data
  const testRule = useCallback((ruleId: string, propertyIds?: number[]): RuleTestResult[] => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return [];

    const targetProperties = propertyIds 
      ? properties.filter(p => propertyIds.includes(p.id))
      : properties;

    return targetProperties.map(property => {
      // Generate mock test results
      const metricValue = Math.random() * 100;
      const baselineValue = 65;
      const delta = metricValue - baselineValue;
      const deltaPercent = (delta / baselineValue) * 100;
      
      let wouldTrigger = false;
      if (rule.thresholdType === 'relative') {
        wouldTrigger = rule.thresholdOperator === 'below'
          ? deltaPercent < -rule.thresholdValue
          : deltaPercent > rule.thresholdValue;
      } else {
        wouldTrigger = rule.thresholdOperator === 'below'
          ? metricValue < rule.thresholdValue
          : metricValue > rule.thresholdValue;
      }

      let severity: 'info' | 'warning' | 'critical' = 'info';
      if (rule.severityThresholds) {
        const absDelta = Math.abs(deltaPercent);
        if (absDelta >= rule.severityThresholds.critical) severity = 'critical';
        else if (absDelta >= rule.severityThresholds.warning) severity = 'warning';
      }

      return {
        ruleId,
        propertyId: property.id,
        propertyName: property.name,
        wouldTrigger,
        metricValue: Math.round(metricValue * 10) / 10,
        baselineValue,
        delta: Math.round(delta * 10) / 10,
        deltaPercent: Math.round(deltaPercent * 10) / 10,
        severity,
        period: rule.timeWindow === 'custom' ? 'Période personnalisée' : `${rule.timeDirection === 'past' ? 'Derniers' : 'Prochains'} ${rule.timeWindow.replace('d', '')} jours`,
      };
    });
  }, [rules]);

  const filterByCategory = useCallback((category: RuleCategory | 'all') => {
    if (category === 'all') return rules;
    return rules.filter(r => r.category === category);
  }, [rules]);

  const filterByStatus = useCallback((enabled: boolean | 'all') => {
    if (enabled === 'all') return rules;
    return rules.filter(r => r.enabled === enabled);
  }, [rules]);

  const filterByPriority = useCallback((priority: RulePriority | 'all') => {
    if (priority === 'all') return rules;
    return rules.filter(r => r.priority === priority);
  }, [rules]);

  const searchRules = useCallback((query: string) => {
    if (!query.trim()) return rules;
    const lowerQuery = query.toLowerCase();
    return rules.filter(r => 
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description?.toLowerCase().includes(lowerQuery)
    );
  }, [rules]);

  return {
    rules,
    propertyGroups,
    addRule,
    updateRule,
    deleteRule,
    duplicateRule,
    toggleRuleEnabled,
    togglePropertySnooze,
    togglePropertyMute,
    setRulePriority,
    addPropertyGroup,
    updatePropertyGroup,
    deletePropertyGroup,
    testRule,
    filterByCategory,
    filterByStatus,
    filterByPriority,
    searchRules,
  };
}
