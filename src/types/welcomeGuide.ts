
export interface WelcomeGuideStep {
  id: string;
  order: number;
  type: 'building_arrival' | 'key_access' | 'apartment_access' | 'welcome' | 'upsell';
  title: string;
  description: string;
  imageUrl?: string;
  validationLabel: string;
  isOptional: boolean;
  isActive: boolean;
  helpText?: string;
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
  averageCompletionTime: number; // in minutes
  upsellConversionRate: number;
  upsellRevenue: number;
  stepDropoffRates: Record<string, number>;
}
