
import { useState, useMemo, useCallback } from 'react';
import { addDays, startOfDay, differenceInDays, isSameDay, isWithinInterval, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, CalendarFilters, DailyPrice } from '@/types/calendar';

// Mock data for demonstration
const generateMockProperties = (): CalendarProperty[] => [
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

const generateMockBookings = (): CalendarBooking[] => {
  const d = (m: number, day: number) => new Date(2026, m - 1, day);
  return [
    // === LOGEMENT 1 — Appart. Port ===
    { id: 101, propertyId: 1, guestName: 'Marie Dubois', checkIn: d(3,16), checkOut: d(3,21), status: 'confirmed', channel: 'booking', nightlyRate: 95, guestsCount: 2, totalAmount: 375 },
    { id: 102, propertyId: 1, guestName: 'Tom Nguyen', checkIn: d(3,21), checkOut: d(3,26), status: 'confirmed', channel: 'airbnb', nightlyRate: 95, guestsCount: 2, totalAmount: 320 },
    // ↑ checkout 21/03 + checkin 21/03 → case partagée
    { id: 103, propertyId: 1, guestName: 'Clara Martin', checkIn: d(4,5), checkOut: d(4,10), status: 'confirmed', channel: 'direct', nightlyRate: 95, guestsCount: 2, totalAmount: 280 },
    // === LOGEMENT 2 — Studio 8 ===
    { id: 201, propertyId: 2, guestName: 'Karim Benzara', checkIn: d(3,18), checkOut: d(3,25), status: 'confirmed', channel: 'direct', nightlyRate: 65, guestsCount: 2, totalAmount: 420 },
    { id: 202, propertyId: 2, guestName: 'Julia Ross', checkIn: d(4,3), checkOut: d(4,9), status: 'confirmed', channel: 'airbnb', nightlyRate: 65, guestsCount: 1, totalAmount: 350 },
    { id: 203, propertyId: 2, guestName: 'Nadia Petit', checkIn: d(4,15), checkOut: d(4,20), status: 'confirmed', channel: 'booking', nightlyRate: 65, guestsCount: 2, totalAmount: 275 },
    // === LOGEMENT 3 — Loft 72 ===
    { id: 301, propertyId: 3, guestName: 'Paul Durand', checkIn: d(3,18), checkOut: d(3,23), status: 'confirmed', channel: 'direct', nightlyRate: 85, guestsCount: 2, totalAmount: 390 },
    { id: 302, propertyId: 3, guestName: 'Sarah Müller', checkIn: d(3,28), checkOut: d(4,3), status: 'confirmed', channel: 'booking', nightlyRate: 85, guestsCount: 3, totalAmount: 480 },
    { id: 303, propertyId: 3, guestName: 'Emma Wilson', checkIn: d(4,10), checkOut: d(4,15), status: 'confirmed', channel: 'airbnb', nightlyRate: 85, guestsCount: 2, totalAmount: 340 },
    // === LOGEMENT 4 — Maison 23 ===
    { id: 401, propertyId: 4, guestName: 'Famille Moreau', checkIn: d(3,18), checkOut: d(3,24), status: 'confirmed', channel: 'airbnb', nightlyRate: 120, guestsCount: 4, totalAmount: 1200 },
    { id: 402, propertyId: 4, guestName: 'Thomas Bernhardt', checkIn: d(3,28), checkOut: d(4,3), status: 'confirmed', channel: 'direct', nightlyRate: 120, guestsCount: 4, totalAmount: 840 },
    { id: 403, propertyId: 4, guestName: 'Isabelle Roy', checkIn: d(4,14), checkOut: d(4,20), status: 'confirmed', channel: 'booking', nightlyRate: 120, guestsCount: 3, totalAmount: 980 },
    // === LOGEMENT 5 — Appart. 45 ===
    { id: 501, propertyId: 5, guestName: 'Rémi Laurent', checkIn: d(3,17), checkOut: d(3,21), status: 'confirmed', channel: 'direct', nightlyRate: 90, guestsCount: 2, totalAmount: 310 },
    { id: 502, propertyId: 5, guestName: 'Mehdi Alami', checkIn: d(3,28), checkOut: d(4,2), status: 'confirmed', channel: 'direct', nightlyRate: 90, guestsCount: 3, totalAmount: 380 },
    { id: 503, propertyId: 5, guestName: 'Chloe Dubois', checkIn: d(4,6), checkOut: d(4,11), status: 'confirmed', channel: 'airbnb', nightlyRate: 90, guestsCount: 2, totalAmount: 290 },
    // === LOGEMENT 6 — Studio 15 ===
    { id: 601, propertyId: 6, guestName: 'Marco Rossi', checkIn: d(3,16), checkOut: d(3,23), status: 'confirmed', channel: 'booking', nightlyRate: 70, guestsCount: 2, totalAmount: 560 },
    { id: 602, propertyId: 6, guestName: 'Fatima Zahra', checkIn: d(3,28), checkOut: d(4,2), status: 'confirmed', channel: 'direct', nightlyRate: 70, guestsCount: 2, totalAmount: 410 },
    { id: 603, propertyId: 6, guestName: 'Oliver Smith', checkIn: d(4,10), checkOut: d(4,15), status: 'confirmed', channel: 'airbnb', nightlyRate: 70, guestsCount: 2, totalAmount: 370 },
    // === LOGEMENT 7 — Appart. 28 (Julie OUT 22 + Max IN 22 → case partagée) ===
    { id: 701, propertyId: 7, guestName: 'Julie Perrin', checkIn: d(3,17), checkOut: d(3,22), status: 'confirmed', channel: 'airbnb', nightlyRate: 110, guestsCount: 2, totalAmount: 520 },
    { id: 702, propertyId: 7, guestName: 'Max Hofmann', checkIn: d(3,22), checkOut: d(3,27), status: 'confirmed', channel: 'airbnb', nightlyRate: 110, guestsCount: 3, totalAmount: 520 },
    // ↑ checkout 22/03 + checkin 22/03 → case partagée
    { id: 703, propertyId: 7, guestName: 'Camille Noir', checkIn: d(4,1), checkOut: d(4,7), status: 'confirmed', channel: 'direct', nightlyRate: 110, guestsCount: 2, totalAmount: 460 },
    { id: 704, propertyId: 7, guestName: 'Hassan Diop', checkIn: d(4,12), checkOut: d(4,17), status: 'confirmed', channel: 'booking', nightlyRate: 110, guestsCount: 3, totalAmount: 390 },
    // === LOGEMENT 8 — Duplex 5P ===
    { id: 801, propertyId: 8, guestName: 'Jean Dupuis', checkIn: d(3,18), checkOut: d(3,25), status: 'confirmed', channel: 'booking', nightlyRate: 130, guestsCount: 3, totalAmount: 720 },
    { id: 802, propertyId: 8, guestName: 'Amira Ben Ali', checkIn: d(3,29), checkOut: d(4,4), status: 'confirmed', channel: 'direct', nightlyRate: 130, guestsCount: 2, totalAmount: 580 },
    { id: 803, propertyId: 8, guestName: 'Chris Taylor', checkIn: d(4,10), checkOut: d(4,16), status: 'confirmed', channel: 'airbnb', nightlyRate: 130, guestsCount: 4, totalAmount: 840 },
    // === LOGEMENT 9 — Studio 42 (Léa OUT 18 + Ingrid IN 18 → case partagée) ===
    { id: 901, propertyId: 9, guestName: 'Léa Bonnet', checkIn: d(3,15), checkOut: d(3,18), status: 'confirmed', channel: 'direct', nightlyRate: 75, guestsCount: 1, totalAmount: 160 },
    { id: 902, propertyId: 9, guestName: 'Ingrid Berg', checkIn: d(3,18), checkOut: d(3,24), status: 'confirmed', channel: 'booking', nightlyRate: 75, guestsCount: 2, totalAmount: 315 },
    // ↑ checkout 18/03 + checkin 18/03 → case partagée
    { id: 903, propertyId: 9, guestName: 'Ryo Yamamoto', checkIn: d(3,28), checkOut: d(4,2), status: 'confirmed', channel: 'airbnb', nightlyRate: 75, guestsCount: 2, totalAmount: 280 },
    { id: 904, propertyId: 9, guestName: 'Moussa Diallo', checkIn: d(4,7), checkOut: d(4,12), status: 'confirmed', channel: 'direct', nightlyRate: 75, guestsCount: 2, totalAmount: 260 },
    // === LOGEMENT 10 — Penthouse ===
    { id: 1001, propertyId: 10, guestName: 'Antoine Leroy', checkIn: d(3,16), checkOut: d(3,22), status: 'confirmed', channel: 'booking', nightlyRate: 250, guestsCount: 3, totalAmount: 750 },
    { id: 1002, propertyId: 10, guestName: 'Priya Sharma', checkIn: d(3,25), checkOut: d(3,31), status: 'confirmed', channel: 'airbnb', nightlyRate: 250, guestsCount: 2, totalAmount: 620 },
    { id: 1003, propertyId: 10, guestName: 'Roberto Luca', checkIn: d(4,4), checkOut: d(4,10), status: 'confirmed', channel: 'direct', nightlyRate: 250, guestsCount: 4, totalAmount: 880 },
    { id: 1004, propertyId: 10, guestName: 'Sandra Koch', checkIn: d(4,13), checkOut: d(4,19), status: 'confirmed', channel: 'booking', nightlyRate: 250, guestsCount: 3, totalAmount: 710 },
  ];
};

const generateMockBlockedPeriods = (): BlockedPeriod[] => {
  const d = (m: number, day: number) => new Date(2026, m - 1, day);
  return [
    { id: 1, propertyId: 4, startDate: d(3,15), endDate: d(3,22), reason: 'Maintenance' },
    { id: 2, propertyId: 6, startDate: d(3,21), endDate: d(3,23), reason: 'Ménage' },
    { id: 3, propertyId: 8, startDate: d(3,15), endDate: d(3,18), reason: 'Travaux' },
    { id: 4, propertyId: 10, startDate: d(3,24), endDate: d(3,25), reason: 'Check intermédiaire' },
  ];
};

interface UseCalendarGridReturn {
  // Data
  properties: CalendarProperty[];
  bookings: CalendarBooking[];
  blockedPeriods: BlockedPeriod[];
  dailyPrices: DailyPrice[];
  
  // Navigation
  currentDate: Date;
  visibleDays: Date[];
  setCurrentDate: (date: Date) => void;
  navigateWeeks: (direction: 'prev' | 'next', weeks?: number) => void;
  goToToday: () => void;
  
  // Filters
  filters: CalendarFilters;
  setFilters: (filters: Partial<CalendarFilters>) => void;
  filteredProperties: CalendarProperty[];
  
  // Booking helpers
  getBookingsForProperty: (propertyId: number, day: Date) => CalendarBooking[];
  getBlockedForProperty: (propertyId: number, day: Date) => BlockedPeriod | null;
  isDateAvailable: (propertyId: number, day: Date) => boolean;
  
  // Sync
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncData: () => Promise<void>;
}

export function useCalendarGrid(daysToShow: number = 60): UseCalendarGridReturn {
  const [currentDate, setCurrentDate] = useState<Date>(startOfDay(new Date(2026, 2, 25)));
  const [properties] = useState<CalendarProperty[]>(generateMockProperties);
  const [bookings, setBookings] = useState<CalendarBooking[]>(generateMockBookings);
  const [blockedPeriods] = useState<BlockedPeriod[]>(generateMockBlockedPeriods);
  const [dailyPrices] = useState<DailyPrice[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const [filters, setFiltersState] = useState<CalendarFilters>({
    propertySearch: '',
    status: 'all',
    channel: 'all',
  });

  // Generate visible days starting from currentDate - some days before for context
  const visibleDays = useMemo(() => {
    const startDate = addDays(currentDate, -7); // Start a week before current date
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

  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    if (!filters.propertySearch) return properties;
    const search = filters.propertySearch.toLowerCase();
    return properties.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.address?.toLowerCase().includes(search)
    );
  }, [properties, filters.propertySearch]);

  // Get bookings for a specific property and day
  // Returns all bookings that touch this day (check-in, in-progress, or check-out)
  const getBookingsForProperty = useCallback((propertyId: number, day: Date): CalendarBooking[] => {
    const dayStart = startOfDay(day);
    return bookings.filter(booking => {
      if (booking.propertyId !== propertyId) return false;
      
      // Apply status filter
      if (filters.status !== 'all' && booking.status !== filters.status) return false;
      
      // Apply channel filter
      if (filters.channel !== 'all' && booking.channel !== filters.channel) return false;
      
      const checkInStart = startOfDay(booking.checkIn);
      const checkOutStart = startOfDay(booking.checkOut);
      
      // Include if this is check-in day, check-out day, or any day in between
      // Check-out day is included for visual purposes (left half shows departure)
      return (dayStart >= checkInStart && dayStart <= checkOutStart);
    });
  }, [bookings, filters.status, filters.channel]);

  // Get blocked period for a specific property and day
  const getBlockedForProperty = useCallback((propertyId: number, day: Date): BlockedPeriod | null => {
    const dayStart = startOfDay(day);
    return blockedPeriods.find(blocked => {
      if (blocked.propertyId !== propertyId) return false;
      const startDate = startOfDay(blocked.startDate);
      const endDate = startOfDay(blocked.endDate);
      return isWithinInterval(dayStart, { start: startDate, end: endDate }) ||
             isSameDay(dayStart, startDate);
    }) || null;
  }, [blockedPeriods]);

  // Check if a date is available for a property
  const isDateAvailable = useCallback((propertyId: number, day: Date): boolean => {
    const hasBooking = getBookingsForProperty(propertyId, day).length > 0;
    const isBlocked = getBlockedForProperty(propertyId, day) !== null;
    return !hasBooking && !isBlocked;
  }, [getBookingsForProperty, getBlockedForProperty]);

  // Sync data (mock implementation)
  const syncData = useCallback(async () => {
    setIsSyncing(true);
    // Simulate API call
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
