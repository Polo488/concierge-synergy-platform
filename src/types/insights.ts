// Smart Comparative Notifications Types

export type InsightType = 'occupancy' | 'pricing' | 'availability' | 'restriction' | 'onboarding';

export type InsightSeverity = 'warning' | 'critical' | 'info';

export type InsightStatus = 'unread' | 'read' | 'archived';

export interface InsightMetric {
  propertyValue: number;
  portfolioAverage: number;
  peerGroupAverage?: number;
  difference: number;
  differencePercent: number;
}

export interface InsightAction {
  id: string;
  label: string;
  action: 'open_pricing' | 'open_rules' | 'open_property' | 'open_calendar' | 'open_onboarding';
}

export interface PropertyInsight {
  id: string;
  propertyId: number;
  propertyName: string;
  type: InsightType;
  severity: InsightSeverity;
  status: InsightStatus;
  title: string;
  message: string;
  metric: InsightMetric;
  metricLabel: string;
  comparisonPeriod: '7d' | '14d' | '30d';
  suggestion: string;
  actions: InsightAction[];
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
}

export interface InsightThresholds {
  occupancyDifferencePercent: number; // Alert if below avg by this %
  pricingDifferencePercent: number; // Alert if above avg by this %
  minStayComparisonEnabled: boolean;
  closedDaysThreshold: number; // Number of closed days to trigger
}

export const DEFAULT_THRESHOLDS: InsightThresholds = {
  occupancyDifferencePercent: 10,
  pricingDifferencePercent: 15,
  minStayComparisonEnabled: true,
  closedDaysThreshold: 7,
};

export const INSIGHT_TYPE_LABELS: Record<InsightType, string> = {
  occupancy: 'Taux d\'occupation',
  pricing: 'Tarification',
  availability: 'Disponibilité',
  restriction: 'Restrictions',
  onboarding: 'Onboarding',
};

export const INSIGHT_SEVERITY_CONFIG: Record<InsightSeverity, { color: string; bgColor: string; label: string }> = {
  critical: { color: 'text-red-600', bgColor: 'bg-red-100', label: 'Critique' },
  warning: { color: 'text-amber-600', bgColor: 'bg-amber-100', label: 'Attention' },
  info: { color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Info' },
};
