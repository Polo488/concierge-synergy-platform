
export type BookingChannel = 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'other' | 'all';
export type SeasonType = 'low' | 'mid' | 'high' | 'peak' | 'all';

export interface StayRule {
  id: string;
  propertyId: number | 'all';
  propertyName?: string;
  channel: BookingChannel;
  season: SeasonType;
  minNights: number;
  maxNights: number;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockingRule {
  id: string;
  propertyId: number | 'all';
  propertyName?: string;
  type: 'fixed' | 'recurring';
  // For fixed dates
  startDate?: Date;
  endDate?: Date;
  // For recurring
  recurringDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  reason?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ChannelRestriction {
  id: string;
  propertyId: number | 'all';
  propertyName?: string;
  channel: BookingChannel;
  minNights: number;
  maxNights: number;
  noCheckInDays: number[]; // Days where check-in is not allowed
  noCheckOutDays: number[]; // Days where check-out is not allowed
  cancellationPolicy: 'flexible' | 'moderate' | 'strict' | 'non_refundable';
  isActive: boolean;
  createdAt: Date;
}

export interface Promotion {
  id: string;
  name: string;
  propertyId: number | 'all';
  propertyName?: string;
  channel: BookingChannel;
  startDate: Date;
  endDate: Date;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  conditions: PromotionCondition[];
  isActive: boolean;
  createdAt: Date;
}

export interface PromotionCondition {
  type: 'min_nights' | 'max_nights' | 'last_minute' | 'early_bird' | 'occupancy';
  value: number;
}

export interface PricingRule {
  id: string;
  name: string;
  propertyId: number | 'all';
  propertyName?: string;
  channel: BookingChannel;
  type: 'base' | 'occupancy' | 'booking_window' | 'seasonality' | 'custom';
  adjustment: number; // percentage or fixed value
  adjustmentType: 'percentage' | 'fixed';
  priority: number;
  conditions: PricingCondition[];
  isActive: boolean;
  createdAt: Date;
}

export interface PricingCondition {
  type: 'occupancy_above' | 'occupancy_below' | 'days_before_arrival' | 'season' | 'day_of_week';
  value: number | string;
}

export const SEASON_LABELS: Record<SeasonType, string> = {
  low: 'Basse saison',
  mid: 'Moyenne saison',
  high: 'Haute saison',
  peak: 'Très haute saison',
  all: 'Toutes saisons',
};

export const CHANNEL_LABELS: Record<BookingChannel, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  vrbo: 'VRBO',
  direct: 'Direct',
  other: 'Autre',
  all: 'Tous les canaux',
};

export const WEEKDAY_LABELS: Record<number, string> = {
  0: 'Dimanche',
  1: 'Lundi',
  2: 'Mardi',
  3: 'Mercredi',
  4: 'Jeudi',
  5: 'Vendredi',
  6: 'Samedi',
};
