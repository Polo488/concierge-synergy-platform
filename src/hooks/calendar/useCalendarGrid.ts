import { useState, useMemo, useCallback } from 'react';
import { addDays, startOfDay, differenceInDays, isSameDay, isWithinInterval } from 'date-fns';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, CalendarFilters, DailyPrice } from '@/types/calendar';

const createDate = (month: number, day: number) => new Date(2026, month - 1, day);

const DEMO_PROPERTIES: CalendarProperty[] = [
  { id: 1, name: 'Appartement 12 Rue du Port', thumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop', capacity: 4, pricePerNight: 95, address: '12 Rue du Port, 75001 Paris' },
  { id: 2, name: 'Studio 8 Avenue des Fleurs', thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100&h=100&fit=crop', capacity: 2, pricePerNight: 65, address: '8 Avenue des Fleurs, 75002 Paris' },
  { id: 3, name: 'Loft 72 Rue des Arts', thumbnail: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop', capacity: 3, pricePerNight: 85, address: '72 Rue des Arts, 75003 Paris' },
  { id: 4, name: 'Maison 23 Rue de la Paix', thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop', capacity: 6, pricePerNight: 120, address: '23 Rue de la Paix, 75004 Paris' },
  { id: 5, name: 'Appartement 45 Boulevard Central', thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=100&fit=crop', capacity: 4, pricePerNight: 90, address: '45 Boulevard Central, 75005 Paris' },
  { id: 6, name: 'Studio 15 Rue des Lilas', thumbnail: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=100&h=100&fit=crop', capacity: 2, pricePerNight: 70, address: '15 Rue des Lilas, 75006 Paris' },
  { id: 7, name: 'Appartement 28 Avenue Victor Hugo', thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=100&fit=crop', capacity: 5, pricePerNight: 110, address: '28 Avenue Victor Hugo, 75007 Paris' },
  { id: 8, name: 'Duplex 5 Place de la République', thumbnail: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=100&h=100&fit=crop', capacity: 4, pricePerNight: 130, address: '5 Place de la République, 75008 Paris' },
  { id: 9, name: 'Studio 42 Rue Montmartre', thumbnail: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=100&h=100&fit=crop', capacity: 2, pricePerNight: 75, address: '42 Rue Montmartre, 75009 Paris' },
  { id: 10, name: 'Penthouse 1 Avenue Foch', thumbnail: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=100&h=100&fit=crop', capacity: 8, pricePerNight: 250, address: '1 Avenue Foch, 75016 Paris' },
];

const DEMO_RESERVATIONS: CalendarBooking[] = [
  { id: 101, propertyId: 1, guestName: 'Marie Dubois', channel: 'booking', checkIn: createDate(3, 16), checkOut: createDate(3, 21), nightlyRate: 95, guestsCount: 2, totalAmount: 375, status: 'confirmed' },
  { id: 102, propertyId: 1, guestName: 'Tom Nguyen', channel: 'airbnb', checkIn: createDate(3, 21), checkOut: createDate(3, 26), nightlyRate: 95, guestsCount: 2, totalAmount: 320, status: 'confirmed' },
  { id: 103, propertyId: 1, guestName: 'Clara Martin', channel: 'direct', checkIn: createDate(4, 5), checkOut: createDate(4, 10), nightlyRate: 95, guestsCount: 2, totalAmount: 280, status: 'confirmed' },

  { id: 201, propertyId: 2, guestName: 'Karim Benzara', channel: 'direct', checkIn: createDate(3, 18), checkOut: createDate(3, 25), nightlyRate: 65, guestsCount: 2, totalAmount: 420, status: 'confirmed' },
  { id: 202, propertyId: 2, guestName: 'Julia Ross', channel: 'airbnb', checkIn: createDate(4, 3), checkOut: createDate(4, 9), nightlyRate: 65, guestsCount: 1, totalAmount: 350, status: 'confirmed' },
  { id: 203, propertyId: 2, guestName: 'Nadia Petit', channel: 'booking', checkIn: createDate(4, 15), checkOut: createDate(4, 20), nightlyRate: 65, guestsCount: 2, totalAmount: 275, status: 'confirmed' },

  { id: 301, propertyId: 3, guestName: 'Paul Durand', channel: 'direct', checkIn: createDate(3, 18), checkOut: createDate(3, 23), nightlyRate: 85, guestsCount: 2, totalAmount: 390, status: 'confirmed' },
  { id: 302, propertyId: 3, guestName: 'Sarah Müller', channel: 'booking', checkIn: createDate(3, 28), checkOut: createDate(4, 3), nightlyRate: 85, guestsCount: 3, totalAmount: 480, status: 'confirmed' },
  { id: 303, propertyId: 3, guestName: 'Emma Wilson', channel: 'airbnb', checkIn: createDate(4, 10), checkOut: createDate(4, 15), nightlyRate: 85, guestsCount: 2, totalAmount: 340, status: 'confirmed' },

  { id: 401, propertyId: 4, guestName: 'Famille Moreau', channel: 'airbnb', checkIn: createDate(3, 18), checkOut: createDate(3, 24), nightlyRate: 120, guestsCount: 4, totalAmount: 1200, status: 'confirmed' },
  { id: 402, propertyId: 4, guestName: 'Thomas Bernhardt', channel: 'direct', checkIn: createDate(3, 28), checkOut: createDate(4, 3), nightlyRate: 120, guestsCount: 4, totalAmount: 840, status: 'confirmed' },
  { id: 403, propertyId: 4, guestName: 'Isabelle Roy', channel: 'booking', checkIn: createDate(4, 14), checkOut: createDate(4, 20), nightlyRate: 120, guestsCount: 3, totalAmount: 980, status: 'confirmed' },

  { id: 501, propertyId: 5, guestName: 'Rémi Laurent', channel: 'direct', checkIn: createDate(3, 17), checkOut: createDate(3, 21), nightlyRate: 90, guestsCount: 2, totalAmount: 310, status: 'confirmed' },
  { id: 502, propertyId: 5, guestName: 'Mehdi Alami', channel: 'direct', checkIn: createDate(3, 28), checkOut: createDate(4, 2), nightlyRate: 90, guestsCount: 3, totalAmount: 380, status: 'confirmed' },
  { id: 503, propertyId: 5, guestName: 'Chloe Dubois', channel: 'airbnb', checkIn: createDate(4, 6), checkOut: createDate(4, 11), nightlyRate: 90, guestsCount: 2, totalAmount: 290, status: 'confirmed' },

  { id: 601, propertyId: 6, guestName: 'Marco Rossi', channel: 'booking', checkIn: createDate(3, 16), checkOut: createDate(3, 23), nightlyRate: 70, guestsCount: 2, totalAmount: 560, status: 'confirmed' },
  { id: 602, propertyId: 6, guestName: 'Fatima Zahra', channel: 'direct', checkIn: createDate(3, 28), checkOut: createDate(4, 2), nightlyRate: 70, guestsCount: 2, totalAmount: 410, status: 'confirmed' },
  { id: 603, propertyId: 6, guestName: 'Oliver Smith', channel: 'airbnb', checkIn: createDate(4, 10), checkOut: createDate(4, 15), nightlyRate: 70, guestsCount: 2, totalAmount: 370, status: 'confirmed' },

  { id: 701, propertyId: 7, guestName: 'Julie Perrin', channel: 'airbnb', checkIn: createDate(3, 17), checkOut: createDate(3, 22), nightlyRate: 110, guestsCount: 2, totalAmount: 520, status: 'confirmed' },
  { id: 702, propertyId: 7, guestName: 'Max Hofmann', channel: 'airbnb', checkIn: createDate(3, 22), checkOut: createDate(3, 27), nightlyRate: 110, guestsCount: 3, totalAmount: 520, status: 'confirmed' },
  { id: 703, propertyId: 7, guestName: 'Camille Noir', channel: 'direct', checkIn: createDate(4, 1), checkOut: createDate(4, 7), nightlyRate: 110, guestsCount: 2, totalAmount: 460, status: 'confirmed' },
  { id: 704, propertyId: 7, guestName: 'Hassan Diop', channel: 'booking', checkIn: createDate(4, 12), checkOut: createDate(4, 17), nightlyRate: 110, guestsCount: 3, totalAmount: 390, status: 'confirmed' },

  { id: 801, propertyId: 8, guestName: 'Jean Dupuis', channel: 'booking', checkIn: createDate(3, 18), checkOut: createDate(3, 25), nightlyRate: 130, guestsCount: 3, totalAmount: 720, status: 'confirmed' },
  { id: 802, propertyId: 8, guestName: 'Amira Ben Ali', channel: 'direct', checkIn: createDate(3, 29), checkOut: createDate(4, 4), nightlyRate: 130, guestsCount: 2, totalAmount: 580, status: 'confirmed' },
  { id: 803, propertyId: 8, guestName: 'Chris Taylor', channel: 'airbnb', checkIn: createDate(4, 10), checkOut: createDate(4, 16), nightlyRate: 130, guestsCount: 4, totalAmount: 840, status: 'confirmed' },

  { id: 901, propertyId: 9, guestName: 'Léa Bonnet', channel: 'direct', checkIn: createDate(3, 15), checkOut: createDate(3, 18), nightlyRate: 75, guestsCount: 1, totalAmount: 160, status: 'confirmed' },
  { id: 902, propertyId: 9, guestName: 'Ingrid Berg', channel: 'booking', checkIn: createDate(3, 18), checkOut: createDate(3, 24), nightlyRate: 75, guestsCount: 2, totalAmount: 315, status: 'confirmed' },
  { id: 903, propertyId: 9, guestName: 'Ryo Yamamoto', channel: 'airbnb', checkIn: createDate(3, 28), checkOut: createDate(4, 2), nightlyRate: 75, guestsCount: 2, totalAmount: 280, status: 'confirmed' },
  { id: 904, propertyId: 9, guestName: 'Moussa Diallo', channel: 'direct', checkIn: createDate(4, 7), checkOut: createDate(4, 12), nightlyRate: 75, guestsCount: 2, totalAmount: 260, status: 'confirmed' },

  { id: 1001, propertyId: 10, guestName: 'Antoine Leroy', channel: 'booking', checkIn: createDate(3, 16), checkOut: createDate(3, 22), nightlyRate: 250, guestsCount: 3, totalAmount: 750, status: 'confirmed' },
  { id: 1002, propertyId: 10, guestName: 'Priya Sharma', channel: 'airbnb', checkIn: createDate(3, 25), checkOut: createDate(3, 31), nightlyRate: 250, guestsCount: 2, totalAmount: 620, status: 'confirmed' },
  { id: 1003, propertyId: 10, guestName: 'Roberto Luca', channel: 'direct', checkIn: createDate(4, 4), checkOut: createDate(4, 10), nightlyRate: 250, guestsCount: 4, totalAmount: 880, status: 'confirmed' },
  { id: 1004, propertyId: 10, guestName: 'Sandra Koch', channel: 'booking', checkIn: createDate(4, 13), checkOut: createDate(4, 19), nightlyRate: 250, guestsCount: 3, totalAmount: 710, status: 'confirmed' },
];

const DEMO_BLOCKED_PERIODS: BlockedPeriod[] = [
  { id: 1, propertyId: 4, startDate: createDate(3, 15), endDate: createDate(3, 22), reason: 'Maintenance' },
  { id: 2, propertyId: 6, startDate: createDate(3, 21), endDate: createDate(3, 23), reason: 'Ménage' },
  { id: 3, propertyId: 8, startDate: createDate(3, 15), endDate: createDate(3, 18), reason: 'Travaux' },
  { id: 4, propertyId: 10, startDate: createDate(3, 24), endDate: createDate(3, 25), reason: 'Check intermédiaire' },
];

interface UseCalendarGridReturn {
  properties: CalendarProperty[];
  bookings: CalendarBooking[];
  blockedPeriods: BlockedPeriod[];
  dailyPrices: DailyPrice[];
  currentDate: Date;
  visibleDays: Date[];
  setCurrentDate: (date: Date) => void;
  navigateWeeks: (direction: 'prev' | 'next', weeks?: number) => void;
  goToToday: () => void;
  filters: CalendarFilters;
  setFilters: (filters: Partial<CalendarFilters>) => void;
  filteredProperties: CalendarProperty[];
  getBookingsForProperty: (propertyId: number, day: Date) => CalendarBooking[];
  getBlockedForProperty: (propertyId: number, day: Date) => BlockedPeriod | null;
  isDateAvailable: (propertyId: number, day: Date) => boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncData: () => Promise<void>;
}

export function useCalendarGrid(daysToShow: number = 60): UseCalendarGridReturn {
  const [currentDate, setCurrentDate] = useState<Date>(startOfDay(new Date(2026, 2, 25)));
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const properties = DEMO_PROPERTIES;
  const bookings = DEMO_RESERVATIONS;
  const blockedPeriods = DEMO_BLOCKED_PERIODS;
  const dailyPrices: DailyPrice[] = [];
  
  const [filters, setFiltersState] = useState<CalendarFilters>({
    propertySearch: '',
    status: 'all',
    channel: 'all',
  });

  const visibleDays = useMemo(() => {
    const startDate = addDays(currentDate, -7);
    return Array.from({ length: daysToShow }, (_, i) => addDays(startDate, i));
  }, [currentDate, daysToShow]);

  const navigateWeeks = useCallback((direction: 'prev' | 'next', weeks: number = 2) => {
    const daysToMove = weeks * 7;
    setCurrentDate(prev => addDays(prev, direction === 'next' ? daysToMove : -daysToMove));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentDate(startOfDay(new Date()));
  }, []);

  const setFilters = useCallback((newFilters: Partial<CalendarFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const filteredProperties = useMemo(() => {
    if (!filters.propertySearch) return properties;
    const search = filters.propertySearch.toLowerCase();
    return properties.filter(p =>
      p.name.toLowerCase().includes(search) ||
      p.address?.toLowerCase().includes(search)
    );
  }, [properties, filters.propertySearch]);

  const getBookingsForProperty = useCallback((propertyId: number, day: Date): CalendarBooking[] => {
    const dayStart = startOfDay(day);
    return bookings.filter(booking => {
      if (booking.propertyId !== propertyId) return false;
      if (filters.status !== 'all' && booking.status !== filters.status) return false;
      if (filters.channel !== 'all' && booking.channel !== filters.channel) return false;

      const checkInStart = startOfDay(booking.checkIn);
      const checkOutStart = startOfDay(booking.checkOut);
      return dayStart >= checkInStart && dayStart <= checkOutStart;
    });
  }, [bookings, filters.status, filters.channel]);

  const getBlockedForProperty = useCallback((propertyId: number, day: Date): BlockedPeriod | null => {
    const dayStart = startOfDay(day);
    return blockedPeriods.find(blocked => {
      if (blocked.propertyId !== propertyId) return false;
      const startDate = startOfDay(blocked.startDate);
      const endDate = startOfDay(blocked.endDate);
      return isWithinInterval(dayStart, { start: startDate, end: endDate }) || isSameDay(dayStart, startDate);
    }) || null;
  }, [blockedPeriods]);

  const isDateAvailable = useCallback((propertyId: number, day: Date): boolean => {
    const hasBooking = getBookingsForProperty(propertyId, day).length > 0;
    const isBlocked = getBlockedForProperty(propertyId, day) !== null;
    return !hasBooking && !isBlocked;
  }, [getBookingsForProperty, getBlockedForProperty]);

  const syncData = useCallback(async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastSyncTime(new Date());
    setIsSyncing(false);
  }, []);

  return {
    properties,
    bookings,
    blockedPeriods,
    dailyPrices,
    currentDate,
    visibleDays,
    setCurrentDate,
    navigateWeeks,
    goToToday,
    filters,
    setFilters,
    filteredProperties,
    getBookingsForProperty,
    getBlockedForProperty,
    isDateAvailable,
    isSyncing,
    lastSyncTime,
    syncData,
  };
}
