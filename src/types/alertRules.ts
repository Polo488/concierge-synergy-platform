// Alert Rules Configuration Types

export type RuleCategory = 
  | 'occupancy' 
  | 'pricing' 
  | 'restrictions' 
  | 'availability' 
  | 'revenue' 
  | 'other';

export type MetricType = 
  | 'occupancy_rate'
  | 'adr'  // Average Daily Rate
  | 'revpar'  // Revenue Per Available Room
  | 'lead_time'
  | 'booking_pace'
  | 'closed_nights_count'
  | 'min_stay_value'
  | 'max_stay_value'
  | 'blocked_days_count'
  | 'price_vs_market';

export type BaselineType = 
  | 'portfolio_average'
  | 'peer_group'  // same capacity, area, type
  | 'area_group'
  | 'custom_group';

export type ThresholdType = 'absolute' | 'relative';

export type TimeWindow = '7d' | '14d' | '30d' | '60d' | '90d' | 'custom';

export type TimeDirection = 'past' | 'future';

export type TriggerFrequency = 'realtime' | 'daily' | 'weekly';

export type RulePriority = 'high' | 'medium' | 'low';

export type RuleScope = 'all' | 'selected' | 'group';

export interface AlertRule {
  id: string;
  name: string;
  description?: string;
  category: RuleCategory;
  enabled: boolean;
  priority: RulePriority;
  
  // Metric configuration
  metric: MetricType;
  baseline: BaselineType;
  customGroupId?: string;
  
  // Threshold configuration
  thresholdType: ThresholdType;
  thresholdValue: number;
  thresholdOperator: 'above' | 'below';
  
  // Severity thresholds
  severityThresholds?: {
    warning: number;
    critical: number;
  };
  
  // Time configuration
  timeWindow: TimeWindow;
  timeDirection: TimeDirection;
  customStartDate?: Date;
  customEndDate?: Date;
  triggerFrequency: TriggerFrequency;
  
  // Scope
  scope: RuleScope;
  selectedPropertyIds?: number[];
  propertyGroupId?: string;
  
  // Notification template
  notificationTemplate: {
    title: string;
    message: string;
    suggestedActions: SuggestedAction[];
  };
  
  // Lifecycle settings
  cooldownDays: number;  // Don't re-notify for X days
  autoArchiveDays: number;
  snoozedPropertyIds: number[];
  mutedPropertyIds: number[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
  triggerCount: number;
}

export interface SuggestedAction {
  id: string;
  label: string;
  actionType: 'open_pricing' | 'open_rules' | 'open_availability' | 'open_property';
}

export interface PropertyGroup {
  id: string;
  name: string;
  propertyIds: number[];
  criteria?: {
    capacity?: number[];
    area?: string[];
    propertyType?: string[];
  };
}

export interface RuleTestResult {
  ruleId: string;
  propertyId: number;
  propertyName: string;
  wouldTrigger: boolean;
  metricValue: number;
  baselineValue: number;
  delta: number;
  deltaPercent: number;
  severity: 'info' | 'warning' | 'critical';
  period: string;
}

export const RULE_CATEGORY_LABELS: Record<RuleCategory, string> = {
  occupancy: 'Occupation',
  pricing: 'Tarification',
  restrictions: 'Restrictions',
  availability: 'Disponibilité',
  revenue: 'Revenus',
  other: 'Autre',
};

export const METRIC_LABELS: Record<MetricType, string> = {
  occupancy_rate: "Taux d'occupation",
  adr: 'Prix moyen/nuit (ADR)',
  revpar: 'RevPAR',
  lead_time: 'Délai de réservation',
  booking_pace: 'Rythme de réservation',
  closed_nights_count: 'Nuits bloquées',
  min_stay_value: 'Durée minimum',
  max_stay_value: 'Durée maximum',
  blocked_days_count: 'Jours bloqués',
  price_vs_market: 'Prix vs marché',
};

export const BASELINE_LABELS: Record<BaselineType, string> = {
  portfolio_average: 'Moyenne du portefeuille',
  peer_group: 'Groupe de pairs (même capacité/zone)',
  area_group: 'Groupe géographique',
  custom_group: 'Groupe personnalisé',
};

export const TIME_WINDOW_LABELS: Record<TimeWindow, string> = {
  '7d': '7 jours',
  '14d': '14 jours',
  '30d': '30 jours',
  '60d': '60 jours',
  '90d': '90 jours',
  'custom': 'Personnalisé',
};

export const PRIORITY_CONFIG: Record<RulePriority, { label: string; color: string; bgColor: string }> = {
  high: { label: 'Haute', color: 'text-red-600', bgColor: 'bg-red-100' },
  medium: { label: 'Moyenne', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  low: { label: 'Basse', color: 'text-blue-600', bgColor: 'bg-blue-100' },
};

// Template variables for notification messages
export const TEMPLATE_VARIABLES = [
  { key: '{{property_name}}', label: 'Nom du bien', example: 'Studio Centre' },
  { key: '{{metric_value}}', label: 'Valeur métrique', example: '45%' },
  { key: '{{baseline_value}}', label: 'Valeur de référence', example: '65%' },
  { key: '{{delta}}', label: 'Écart', example: '-20%' },
  { key: '{{period}}', label: 'Période', example: '30 derniers jours' },
  { key: '{{metric_name}}', label: 'Nom de la métrique', example: "Taux d'occupation" },
];
