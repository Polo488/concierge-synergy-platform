
import { useState } from 'react';
import {
  isAfter,
  isBefore
} from 'date-fns';
import { Property, Booking, DateRange } from './types';

export const usePropertyAvailability = (
  properties: Property[],
  bookings: Booking[]
) => {
  const [dateRange, setDateRange] = useState<DateRange>();
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  
  // Find available properties in a date range
  const findAvailableProperties = (range: DateRange) => {
    if (!range.from || !range.to) return;
    
    // Get all bookings that overlap with the selected date range
    const overlappingBookings = bookings.filter(booking => {
      const bookingStart = booking.checkIn;
      const bookingEnd = booking.checkOut;
      
      return (
        (isAfter(bookingStart, range.from) && isBefore(bookingStart, range.to)) ||
        (isAfter(bookingEnd, range.from) && isBefore(bookingEnd, range.to)) ||
        (isBefore(bookingStart, range.from) && isAfter(bookingEnd, range.to))
      );
    });
    
    // Get the IDs of properties that are booked in this period
    const bookedPropertyIds = new Set(overlappingBookings.map(b => b.propertyId));
    
    // Filter out the properties that are booked
    const available = properties.filter(p => !bookedPropertyIds.has(p.id));
    
    setAvailableProperties(available);
  };

  return {
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties
  };
};
