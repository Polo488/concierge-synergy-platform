
import { useState } from 'react';
import {
  isAfter,
  isBefore,
  isEqual
} from 'date-fns';
import { Property, Booking, DateRange } from './types';

export const usePropertyAvailability = (
  properties: Property[],
  bookings: Booking[]
) => {
  // Initialize with undefined to match the type
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  
  // Find available properties in a date range
  const findAvailableProperties = (range: DateRange) => {
    if (!range.from || !range.to) {
      setAvailableProperties([]);
      return;
    }
    
    console.log("Finding available properties for range:", range);
    
    // Get all bookings that overlap with the selected date range
    const overlappingBookings = bookings.filter(booking => {
      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      
      // A booking overlaps if:
      // 1. The booking start date is within the range
      // 2. The booking end date is within the range
      // 3. The booking spans the entire range
      return (
        (isAfter(bookingStart, range.from) && isBefore(bookingStart, range.to)) ||
        (isAfter(bookingEnd, range.from) && isBefore(bookingEnd, range.to)) ||
        (isBefore(bookingStart, range.from) && isAfter(bookingEnd, range.to)) ||
        isEqual(bookingStart, range.from) ||
        isEqual(bookingEnd, range.to)
      );
    });
    
    console.log("Overlapping bookings:", overlappingBookings);
    
    // Get the IDs of properties that are booked in this period
    const bookedPropertyIds = new Set(overlappingBookings.map(b => b.propertyId));
    
    // Filter out the properties that are booked
    const available = properties.filter(p => !bookedPropertyIds.has(p.id));
    console.log("Available properties:", available);
    
    setAvailableProperties(available);
  };

  return {
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties
  };
};
