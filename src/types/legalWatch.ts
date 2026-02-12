export interface LegalWatchProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  zipCode: string;
  arrondissement?: string;
  area?: string;
  country: string;
  lat: number;
  lng: number;
  residenceType: 'principale' | 'secondaire';
  nightsCount: number;
  nightsLimit: number;
  riskScore: number;
  riskLevel: RiskLevel;
  lastAnalysisDate?: string;
  groupId?: string;
}

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface RegulatoryContext {
  pressure: 'faible' | 'modérée' | 'élevée' | 'critique';
  recentChanges: RegulatoryChange[];
  jurisprudence: JurisprudenceItem[];
  localTrends: LocalTrend[];
  weakSignals: string[];
}

export interface RegulatoryChange {
  id: string;
  title: string;
  date: string;
  description: string;
  impact: 'positive' | 'neutral' | 'negative';
  source: string;
}

export interface JurisprudenceItem {
  id: string;
  title: string;
  date: string;
  court: string;
  summary: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface LocalTrend {
  id: string;
  direction: 'durcissement' | 'stabilité' | 'assouplissement';
  description: string;
  confidence: number;
}

export interface WatchAnalysis {
  id: string;
  date: string;
  scope: WatchScope;
  scopeLabel: string;
  riskScore: number;
  riskLevel: RiskLevel;
  context: RegulatoryContext;
  summary: string;
  recommendations: string[];
}

export interface WatchScope {
  type: 'global' | 'city' | 'arrondissement' | 'property';
  value?: string;
  propertyIds?: string[];
}

export interface RiskScoreHistory {
  date: string;
  score: number;
  level: RiskLevel;
}

export interface LegalWatchFilters {
  cities: string[];
  arrondissements: string[];
  groups: string[];
  riskLevels: RiskLevel[];
}

export interface WatchSchedule {
  id: string;
  scope: WatchScope;
  frequency: 'monthly' | 'quarterly';
  nextRun: string;
  isActive: boolean;
  threshold?: number;
}
