
export interface WelcomeGuideStep {
  id: string;
  order: number;
  type: 'building_arrival' | 'key_access' | 'apartment_access' | 'welcome' | 'upsell' | 'custom';
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  validationLabel: string;
  isOptional: boolean;
  isActive: boolean;
  helpText?: string;
  contextHint?: string;
}

export interface WelcomeGuideUpsell {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface WelcomeGuideLandingConfig {
  heroImage?: string;
  showHostBadge: boolean;
  showNightsBadge: boolean;
  showPropertyCard: boolean;
  showDates: boolean;
}

export interface WelcomeGuideTemplate {
  id: string;
  name: string;
  propertyId?: string;
  propertyName?: string;
  groupId?: string;
  steps: WelcomeGuideStep[];
  upsells: WelcomeGuideUpsell[];
  welcomeMessage: string;
  wifiName?: string;
  wifiPassword?: string;
  houseRules?: string[];
  landingConfig?: WelcomeGuideLandingConfig;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WelcomeGuideSession {
  id: string;
  templateId: string;
  reservationId: string;
  guestName: string;
  propertyName: string;
  token: string;
  checkIn: Date;
  checkOut: Date;
  completedSteps: string[];
  stepTimestamps: Record<string, { startedAt: Date; completedAt?: Date }>;
  upsellsViewed: string[];
  upsellsAccepted: string[];
  abandonedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface WelcomeGuideAnalytics {
  totalSessions: number;
  completionRate: number;
  averageCompletionTime: number;
  upsellConversionRate: number;
  upsellRevenue: number;
  stepDropoffRates: Record<string, number>;
}
