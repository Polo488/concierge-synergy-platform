
export type MessageChannel = 'airbnb' | 'booking' | 'direct' | 'vrbo' | 'expedia' | 'email' | 'sms' | 'whatsapp';

export type ConversationStatus = 'open' | 'pending' | 'resolved';

export type MessageSender = 'guest' | 'team' | 'system';

export type ConversationTag = 
  | 'check-in-issue' 
  | 'check-out-issue' 
  | 'upsell' 
  | 'complaint' 
  | 'maintenance' 
  | 'cleaning' 
  | 'urgent' 
  | 'vip';

export interface GuestProfile {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  language: string;
  totalStays: number;
  averageRating?: number;
  notes?: string;
}

export interface ReservationContext {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  channel: MessageChannel;
  totalAmount: number;
  paidAmount: number;
  accessCode?: string;
  wifiPassword?: string;
  wifiNetwork?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  timestamp: Date;
  channel: MessageChannel;
  isRead: boolean;
  isInternal: boolean; // Internal notes
  isAutomated: boolean; // Sent via automation rules
  automationRuleId?: string;
  automationRuleName?: string;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'other';
  size: number;
}

export interface LinkedTask {
  id: string;
  type: 'cleaning' | 'maintenance' | 'repasse' | 'agenda';
  title: string;
  status: string;
  createdAt: Date;
}

export type SLAStatus = 'ok' | 'warning' | 'critical';

export interface SLAInfo {
  status: SLAStatus;
  minutesSinceLastGuestMessage: number | null;
  lastGuestMessageAt: Date | null;
  isAwaitingResponse: boolean;
}

export interface Conversation {
  id: string;
  guestId: string;
  guest: GuestProfile;
  reservationId: string;
  reservation: ReservationContext;
  messages: Message[];
  status: ConversationStatus;
  tags: ConversationTag[];
  assignedTo?: string;
  assignedToName?: string;
  isUnread: boolean;
  isPriority: boolean;
  lastMessageAt: Date;
  lastMessagePreview: string;
  linkedTasks: LinkedTask[];
  sla?: SLAInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuickReplyTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
}

export interface MessagingFilters {
  search: string;
  status: ConversationStatus | 'all';
  channel: MessageChannel | 'all';
  propertyId: string | 'all';
  assignedTo: string | 'all';
  tags: ConversationTag[];
  unreadOnly: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const CHANNEL_ICONS: Record<MessageChannel, string> = {
  airbnb: '🏠',
  booking: '🅱️',
  direct: '📧',
  vrbo: '🏡',
  expedia: '✈️',
  email: '📨',
  sms: '💬',
  whatsapp: '📱',
};

export const CHANNEL_COLORS: Record<MessageChannel, string> = {
  airbnb: 'bg-rose-100 text-rose-700 border-rose-200',
  booking: 'bg-blue-100 text-blue-700 border-blue-200',
  direct: 'bg-gray-100 text-gray-700 border-gray-200',
  vrbo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  expedia: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  email: 'bg-slate-100 text-slate-700 border-slate-200',
  sms: 'bg-green-100 text-green-700 border-green-200',
  whatsapp: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export const TAG_LABELS: Record<ConversationTag, string> = {
  'check-in-issue': 'Problème check-in',
  'check-out-issue': 'Problème check-out',
  'upsell': 'Upsell',
  'complaint': 'Réclamation',
  'maintenance': 'Maintenance',
  'cleaning': 'Ménage',
  'urgent': 'Urgent',
  'vip': 'VIP',
};

export const TAG_COLORS: Record<ConversationTag, string> = {
  'check-in-issue': 'bg-orange-100 text-orange-700',
  'check-out-issue': 'bg-purple-100 text-purple-700',
  'upsell': 'bg-emerald-100 text-emerald-700',
  'complaint': 'bg-red-100 text-red-700',
  'maintenance': 'bg-amber-100 text-amber-700',
  'cleaning': 'bg-cyan-100 text-cyan-700',
  'urgent': 'bg-red-100 text-red-700',
  'vip': 'bg-yellow-100 text-yellow-700',
};

export const STATUS_LABELS: Record<ConversationStatus, string> = {
  open: 'Ouvert',
  pending: 'En attente',
  resolved: 'Résolu',
};

export const STATUS_COLORS: Record<ConversationStatus, string> = {
  open: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-gray-100 text-gray-700',
};
