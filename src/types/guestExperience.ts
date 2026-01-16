
// Guest Experience Module Types

export type TriggerType = 'time-based' | 'event-based' | 'manual';

export type TimeRelativeTo = 'checkin' | 'checkout' | 'booking_date';

export type EventType = 
  | 'reservation_created' 
  | 'checkin_completed' 
  | 'checkout_completed' 
  | 'guest_message_received'
  | 'upsell_requested'
  | 'cleaning_completed'
  | 'issue_created'
  | 'extra_request_received';

export type RuleStatus = 'active' | 'inactive' | 'draft';

export type MessageChannel = 'airbnb' | 'booking' | 'direct' | 'email' | 'sms' | 'whatsapp';

export type PropertyScope = 'all' | 'selected' | 'groups';

export type TemplateCategory = 
  | 'before_booking' 
  | 'before_checkin' 
  | 'during_stay' 
  | 'after_checkout' 
  | 'upsell' 
  | 'review_request';

export type MessageLogStatus = 'sent' | 'failed' | 'skipped' | 'pending';

export interface TimeTrigger {
  relativeTo: TimeRelativeTo;
  dayOffset: number; // negative = before, positive = after, 0 = same day
  time: string; // HH:mm format
}

export interface EventTrigger {
  eventType: EventType;
  delayMinutes?: number;
}

export interface RuleCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'is_true' | 'is_false';
  value: string | number | boolean;
}

export interface MessagingRule {
  id: string;
  name: string;
  description?: string;
  status: RuleStatus;
  triggerType: TriggerType;
  timeTrigger?: TimeTrigger;
  eventTrigger?: EventTrigger;
  propertyScope: PropertyScope;
  selectedPropertyIds?: string[];
  propertyGroupIds?: string[];
  channels: MessageChannel[];
  templateId?: string;
  customMessage?: string;
  conditions?: RuleCondition[];
  preventDuplicates: boolean;
  allowManualOverride: boolean;
  delayMinutes?: number;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt?: Date;
  executionCount: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  subject?: string;
  content: string;
  variables: string[];
  embeddedBlocks?: string[];
  language: string;
  translations?: Record<string, { subject?: string; content: string }>;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface EmbeddedBlock {
  id: string;
  name: string;
  content: string;
  description?: string;
}

export interface UpsellOffer {
  id: string;
  name: string;
  description: string;
  price?: number;
  currency?: string;
  trigger: 'after_booking' | 'before_arrival' | 'during_stay' | 'manual';
  linkedRuleId?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  conversionCount: number;
  viewCount: number;
}

export interface MessageLog {
  id: string;
  ruleId?: string;
  ruleName?: string;
  templateId?: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestEmail?: string;
  channel: MessageChannel;
  subject?: string;
  content: string;
  status: MessageLogStatus;
  errorMessage?: string;
  skippedReason?: string;
  sentAt?: Date;
  createdAt: Date;
  bookingId?: string;
}

export interface GuestExperienceSettings {
  defaultLanguage: string;
  enableAutoMessages: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  defaultSenderName: string;
  defaultReplyTo?: string;
  enableReadReceipts: boolean;
  retryFailedMessages: boolean;
  maxRetries: number;
}

// Available template variables
export const TEMPLATE_VARIABLES = [
  '{{guest_first_name}}',
  '{{guest_last_name}}',
  '{{guest_full_name}}',
  '{{property_name}}',
  '{{property_address}}',
  '{{checkin_date}}',
  '{{checkout_date}}',
  '{{checkin_time}}',
  '{{checkout_time}}',
  '{{access_code}}',
  '{{wifi_name}}',
  '{{wifi_password}}',
  '{{booking_total}}',
  '{{nights_count}}',
  '{{guests_count}}',
  '{{host_name}}',
  '{{host_phone}}',
  '{{emergency_contact}}',
] as const;

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  reservation_created: 'Nouvelle réservation créée',
  checkin_completed: 'Check-in effectué',
  checkout_completed: 'Check-out effectué',
  guest_message_received: 'Message reçu du voyageur',
  upsell_requested: 'Upsell demandé',
  cleaning_completed: 'Ménage terminé',
  issue_created: 'Problème signalé',
  extra_request_received: 'Demande spéciale reçue',
};

export const CHANNEL_LABELS: Record<MessageChannel, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  direct: 'Direct',
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
};

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  before_booking: 'Avant réservation',
  before_checkin: 'Avant arrivée',
  during_stay: 'Pendant le séjour',
  after_checkout: 'Après départ',
  upsell: 'Upsell',
  review_request: 'Demande d\'avis',
};
