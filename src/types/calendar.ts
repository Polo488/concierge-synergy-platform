
export type BookingChannel = 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'other';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'blocked' | 'completed';

export interface CalendarProperty {
  id: number;
  name: string;
  thumbnail?: string;
  capacity: number;
  pricePerNight: number;
  address?: string;
}

export interface CalendarBooking {
  id: number;
  propertyId: number;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatus;
  channel: BookingChannel;
  nightlyRate?: number;
  totalAmount?: number;
  guestsCount?: number;
  notes?: string;
  phone?: string;
  email?: string;
}

export interface BlockedPeriod {
  id: number;
  propertyId: number;
  startDate: Date;
  endDate: Date;
  reason?: string;
}

export interface DailyPrice {
  propertyId: number;
  date: Date;
  price: number;
}

export interface CalendarFilters {
  propertySearch: string;
  status: BookingStatus | 'all';
  channel: BookingChannel | 'all';
  dateRange?: { from: Date; to: Date };
}

export const CHANNEL_COLORS: Record<BookingChannel, string> = {
  airbnb: '#FF5A5F',
  booking: '#003580',
  vrbo: '#3D67B1',
  direct: '#10B981',
  other: '#6B7280',
};

export const CHANNEL_NAMES: Record<BookingChannel, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  vrbo: 'VRBO',
  direct: 'Direct',
  other: 'Autre',
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Confirmée',
  pending: 'En attente',
  cancelled: 'Annulée',
  blocked: 'Bloquée',
  completed: 'Terminée',
};
