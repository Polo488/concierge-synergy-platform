// Pricing Rules & Dynamic Pricing Types

export type RuleType = 
  | 'min_stay' 
  | 'max_stay' 
  | 'closing_block' 
  | 'channel_restriction' 
  | 'promotion' 
  | 'price_override';

export type PromotionType = 
  | 'long_stay' 
  | 'last_minute' 
  | 'early_bird' 
  | 'weekend' 
  | 'weekday';

export type Channel = 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'all';

export interface PricingRule {
  id: string;
  propertyId: number | 'all';
  name: string;
  type: RuleType;
  enabled: boolean;
  priority: number;
  
  // Date range for the rule
  startDate?: Date;
  endDate?: Date;
  
  // Specific days of week (0=Sunday, 6=Saturday)
  daysOfWeek?: number[];
  
  // Channel specific
  channels?: Channel[];
  
  // Values based on type
  minStay?: number;
  maxStay?: number;
  priceOverride?: number;
  priceAdjustment?: number; // percentage: -10 = 10% off, +15 = 15% more
  
  // Promotion specific
  promotionType?: PromotionType;
  promotionDaysBeforeArrival?: number; // for last minute
  promotionMinNights?: number; // for long stay
  
  // Reason for blocks
  blockReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPricing {
  propertyId: number;
  date: Date;
  basePrice: number;
  finalPrice: number;
  adjustments: PriceAdjustment[];
  minStay: number;
  maxStay?: number;
  isBlocked: boolean;
  blockReason?: string;
  channelPrices?: Record<Channel, number>;
}

export interface PriceAdjustment {
  ruleId: string;
  ruleName: string;
  type: RuleType | PromotionType;
  adjustment: number; // can be absolute or percentage
  isPercentage: boolean;
}

export interface SeasonDefinition {
  id: string;
  name: string;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  color: string;
  priceMultiplier: number;
}

// Calendar cell note
export interface CellNote {
  id: string;
  propertyId: number;
  date: Date;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Preset seasons for France
export const DEFAULT_SEASONS: SeasonDefinition[] = [
  { id: 'haute-ete', name: 'Haute saison été', startMonth: 7, startDay: 1, endMonth: 8, endDay: 31, color: '#EF4444', priceMultiplier: 1.5 },
  { id: 'moyenne-ete', name: 'Moyenne saison été', startMonth: 6, startDay: 1, endMonth: 6, endDay: 30, color: '#F59E0B', priceMultiplier: 1.25 },
  { id: 'moyenne-automne', name: 'Moyenne saison automne', startMonth: 9, startDay: 1, endMonth: 9, endDay: 30, color: '#F59E0B', priceMultiplier: 1.25 },
  { id: 'noel', name: 'Vacances de Noël', startMonth: 12, startDay: 20, endMonth: 1, endDay: 5, color: '#EF4444', priceMultiplier: 1.4 },
  { id: 'basse', name: 'Basse saison', startMonth: 10, startDay: 1, endMonth: 5, endDay: 31, color: '#22C55E', priceMultiplier: 0.9 },
];

export const PROMOTION_LABELS: Record<PromotionType, string> = {
  long_stay: 'Long séjour',
  last_minute: 'Last minute',
  early_bird: 'Réservation anticipée',
  weekend: 'Week-end',
  weekday: 'Semaine',
};

export const RULE_TYPE_LABELS: Record<RuleType, string> = {
  min_stay: 'Durée minimum',
  max_stay: 'Durée maximum',
  closing_block: 'Blocage',
  channel_restriction: 'Restriction canal',
  promotion: 'Promotion',
  price_override: 'Prix personnalisé',
};
