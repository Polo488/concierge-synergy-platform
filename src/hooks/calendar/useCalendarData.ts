
import { useState } from 'react';
import { Booking, Property, CalendarContext } from './types';
import { properties, bookingsData } from './mockData';
import { useBookingsFilter } from './useBookingsFilter';
import { useCalendarNavigation } from './useCalendarNavigation';
import { usePropertyAvailability } from './usePropertyAvailability';

export { Property, Booking } from './types';

export const useCalendarData = (): CalendarContext => {
  // State for managing bookings data
  const [bookings, setBookings] = useState<Booking[]>(bookingsData);
  
  // Re-usable hooks
  const { 
    currentDate, 
    setCurrentDate, 
    currentMonthDays, 
    navigateMonth 
  } = useCalendarNavigation();
  
  const { 
    selectedProperty, 
    setSelectedProperty, 
    searchQuery, 
    setSearchQuery, 
    filteredBookings 
  } = useBookingsFilter(bookings, properties);
  
  const { 
    dateRange, 
    setDateRange, 
    availableProperties, 
    findAvailableProperties 
  } = usePropertyAvailability(properties, bookings);

  // Add a new booking
  const addBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  return {
    // Calendar navigation
    currentDate,
    setCurrentDate,
    currentMonthDays,
    navigateMonth,
    
    // Properties data
    properties,
    
    // Bookings data management
    bookings,
    setBookings,
    bookingsData,
    addBooking,
    
    // Filtering
    filteredBookings,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    
    // Availability
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties
  };
};
