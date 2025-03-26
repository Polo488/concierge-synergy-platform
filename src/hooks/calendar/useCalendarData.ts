
import { useState, useEffect } from 'react';
import { bookingsData, properties as mockProperties } from './mockData';
import { useCalendarNavigation } from './useCalendarNavigation';
import { useBookingsFilter } from './useBookingsFilter';
import { usePropertyAvailability } from './usePropertyAvailability';
import type { CalendarContext, Property, Booking, DateRange } from './types';

// Function to get bookings for a specific month
const getBookingsForMonth = (date: Date, properties: Property[]): Booking[] => {
  // For now, we'll just return all bookings from the mock data
  // In a real app, this would filter by the month
  return bookingsData;
};

// Create the hook that combines all the functionality
export function useCalendarData(): CalendarContext {
  // Get the current month's bookings from the mock data
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  
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
