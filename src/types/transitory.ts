
export type CommercializationStatus = 'vente' | 'relocation' | 'mixte';
export type SuspensionReason = 'compromis_signe' | 'offre_acceptee' | 'bail_signe' | 'agent_desactivation';
export type TransitoryPropertyStatus = 'active' | 'suspended' | 'completed';

export interface TransitoryProperty {
  id: string;
  propertyName: string;
  propertyAddress: string;
  agencyName: string;
  regionName: string;
  commercializationStatus: CommercializationStatus;
  transitoryStatus: TransitoryPropertyStatus;
  activatedAt: string;
  suspendedAt?: string;
  suspensionReason?: SuspensionReason;
  suspendedBy?: string;
  activatedBy: string;
  // LCD transitoire settings
  minStayNights: number;
  noticePeriodDays: number;
  rollingHorizonDays: number;
  blockOnVisit: boolean;
  // Performance
  totalRevenue: number;
  netMargin: number;
  nightsOccupied: number;
  nightsAvailable: number;
  occupancyRate: number;
  avgMonthlyRevenue: number;
  bookingsCount: number;
  daysInCommercialization: number;
  // Comparatif
  vacancyWithoutLCD: number; // revenue lost if no LCD
  vacancyWithLCD: number; // actual vacancy cost
  revenueRecovered: number; // revenue gained from vacancy
}

export interface TransitoryBooking {
  id: string;
  propertyId: string;
  guestName: string;
  channel: 'airbnb' | 'booking' | 'vrbo' | 'direct';
  checkIn: string;
  checkOut: string;
  amount: number;
  commission: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}

export interface TransitoryEvent {
  id: string;
  propertyId: string;
  type: 'activated' | 'suspended' | 'booking_created' | 'visit_blocked' | 'auto_cancelled';
  description: string;
  timestamp: string;
  actor: string;
}

export interface TransitoryNetworkKPIs {
  totalActiveProperties: number;
  totalTransitoryRevenue: number;
  percentPropertiesGeneratingRevenue: number;
  avgRevenuePerProperty: number;
  totalRevenueRecovered: number;
  avgOccupancyRate: number;
  avgDaysInCommercialization: number;
}

export interface TransitoryMonthlyData {
  month: string;
  revenue: number;
  propertiesActive: number;
  revenueRecovered: number;
}

export const COMMERCIALIZATION_LABELS: Record<CommercializationStatus, string> = {
  vente: 'Vente active',
  relocation: 'Relocation longue durée',
  mixte: 'Mixte (Vente + LCD)',
};

export const SUSPENSION_LABELS: Record<SuspensionReason, string> = {
  compromis_signe: 'Compromis signé',
  offre_acceptee: 'Offre acceptée',
  bail_signe: 'Bail longue durée signé',
  agent_desactivation: 'Désactivation manuelle',
};

export const STATUS_LABELS: Record<TransitoryPropertyStatus, string> = {
  active: 'Actif',
  suspended: 'Suspendu',
  completed: 'Terminé',
};
