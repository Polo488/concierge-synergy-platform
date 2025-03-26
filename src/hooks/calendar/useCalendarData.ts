
import { useState, useEffect } from 'react';
import { getBookingsForMonth } from './mockData';
import { useCalendarNavigation } from './useCalendarNavigation';
import { useBookingsFilter } from './useBookingsFilter';
import { usePropertyAvailability } from './usePropertyAvailability';
import type { CalendarContext, Property, Booking, DateRange } from './types';

// Create the hook that combines all the functionality
export function useCalendarData(): CalendarContext {
  // Get the current month's bookings from the mock data
  const [properties, setProperties] = useState<Property[]>([
    { id: 1, name: 'Appartement Bellecour', capacity: 4, pricePerNight: 150 },
    { id: 2, name: 'Loft Croix-Rousse', capacity: 2, pricePerNight: 120 },
    { id: 3, name: 'Studio Part-Dieu', capacity: 2, pricePerNight: 95 },
    { id: 4, name: 'Villa Confluence', capacity: 6, pricePerNight: 250 },
    { id: 5, name: 'Maison Vieux Lyon', capacity: 8, pricePerNight: 320 }
  ]);
  
  // Get the calendar navigation state
  const { 
    currentDate, 
    setCurrentDate, 
    currentMonthDays,
    navigateMonth
  } = useCalendarNavigation();
  
  // Initialize bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Get bookings filter state
  const {
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    filteredBookings
  } = useBookingsFilter(bookings, properties);
  
  // Get property availability state
  const {
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties
  } = usePropertyAvailability(properties, bookings);
  
  // Fetch bookings when the current month changes
  useEffect(() => {
    const newBookings = getBookingsForMonth(currentDate, properties);
    setBookings(newBookings);
  }, [currentDate, properties]);
  
  // Add a new booking
  const addBooking = (booking: Booking) => {
    setBookings([...bookings, booking]);
  };
  
  return {
    currentDate,
    setCurrentDate,
    properties,
    bookings,
    filteredBookings,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    currentMonthDays,
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties,
    navigateMonth,
    addBooking,
    setBookings
  };
}

export type { Property, Booking };
