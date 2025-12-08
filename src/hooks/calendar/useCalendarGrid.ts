
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
  const today = startOfDay(new Date());
  
  // Create specific test dates for December 2024
  const dec6 = new Date(2024, 11, 6); // December 6, 2024
  const dec11 = new Date(2024, 11, 11); // December 11, 2024
  const dec13 = new Date(2024, 11, 13); // December 13, 2024
  const dec15 = new Date(2024, 11, 15); // December 15, 2024
  const dec20 = new Date(2024, 11, 20); // December 20, 2024
  
  return [
    // Test consecutive bookings on property 1: Dec 6-11 then Dec 11-13
    { id: 100, propertyId: 1, guestName: 'Pierre Durand', checkIn: dec6, checkOut: dec11, status: 'confirmed', channel: 'airbnb', nightlyRate: 95, guestsCount: 2, totalAmount: 475 },
    { id: 101, propertyId: 1, guestName: 'Marie Lambert', checkIn: dec11, checkOut: dec13, status: 'confirmed', channel: 'booking', nightlyRate: 95, guestsCount: 3, totalAmount: 190 },
    
    // More test bookings
    { id: 102, propertyId: 1, guestName: 'Jacques Martin', checkIn: dec15, checkOut: dec20, status: 'confirmed', channel: 'airbnb', nightlyRate: 95, guestsCount: 2, totalAmount: 475 },
    
    // Other properties
    { id: 1, propertyId: 2, guestName: 'Martin Dupont', checkIn: addDays(today, -2), checkOut: addDays(today, 3), status: 'confirmed', channel: 'airbnb', nightlyRate: 95, guestsCount: 2, totalAmount: 475 },
    { id: 2, propertyId: 2, guestName: 'Sophie Martin', checkIn: addDays(today, 3), checkOut: addDays(today, 7), status: 'confirmed', channel: 'booking', nightlyRate: 65, guestsCount: 2, totalAmount: 260 },
    { id: 3, propertyId: 3, guestName: 'Jean Durand', checkIn: addDays(today, 4), checkOut: addDays(today, 10), status: 'confirmed', channel: 'airbnb', nightlyRate: 85, guestsCount: 3, totalAmount: 510 },
    { id: 4, propertyId: 4, guestName: 'Julie Petit', checkIn: addDays(today, 5), checkOut: addDays(today, 8), status: 'pending', channel: 'booking', nightlyRate: 95, guestsCount: 4, totalAmount: 285 },
    { id: 5, propertyId: 4, guestName: 'Thomas Bernard', checkIn: addDays(today, -5), checkOut: addDays(today, -1), status: 'completed', channel: 'airbnb', nightlyRate: 120, guestsCount: 5, totalAmount: 480 },
    { id: 6, propertyId: 5, guestName: 'Camille Leroy', checkIn: addDays(today, 8), checkOut: addDays(today, 14), status: 'confirmed', channel: 'booking', nightlyRate: 90, guestsCount: 4, totalAmount: 540 },
    { id: 7, propertyId: 6, guestName: 'Mathieu Roux', checkIn: addDays(today, 2), checkOut: addDays(today, 6), status: 'confirmed', channel: 'airbnb', nightlyRate: 70, guestsCount: 2, totalAmount: 280 },
    { id: 8, propertyId: 7, guestName: 'Emma Laurent', checkIn: addDays(today, -3), checkOut: addDays(today, 2), status: 'confirmed', channel: 'booking', nightlyRate: 110, guestsCount: 3, totalAmount: 550 },
    { id: 9, propertyId: 8, guestName: 'Lucas Moreau', checkIn: addDays(today, 10), checkOut: addDays(today, 15), status: 'confirmed', channel: 'airbnb', nightlyRate: 130, guestsCount: 4, totalAmount: 650 },
    { id: 10, propertyId: 9, guestName: 'Léa Girard', checkIn: addDays(today, 0), checkOut: addDays(today, 3), status: 'confirmed', channel: 'booking', nightlyRate: 75, guestsCount: 2, totalAmount: 225 },
    { id: 11, propertyId: 10, guestName: 'Hugo Blanc', checkIn: addDays(today, 6), checkOut: addDays(today, 12), status: 'confirmed', channel: 'airbnb', nightlyRate: 250, guestsCount: 6, totalAmount: 1500 },
  ];
};

const generateMockBlockedPeriods = (): BlockedPeriod[] => {
  const today = startOfDay(new Date());
  return [
    { id: 1, propertyId: 4, startDate: addDays(today, 0), endDate: addDays(today, 4), reason: 'Maintenance' },
    { id: 2, propertyId: 2, startDate: addDays(today, 12), endDate: addDays(today, 16), reason: 'Travaux' },
    { id: 3, propertyId: 10, startDate: addDays(today, -4), endDate: addDays(today, -1), reason: 'Propriétaire' },
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
  const [currentDate, setCurrentDate] = useState<Date>(startOfDay(new Date()));
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
