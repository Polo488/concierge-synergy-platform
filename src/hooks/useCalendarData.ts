
import { useState, useEffect } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isAfter,
  isBefore,
  addMonths
} from 'date-fns';
import { DateRange } from 'react-day-picker';

// Types for the calendar data
export interface Property {
  id: number;
  name: string;
  capacity: number;
  pricePerNight: number;
}

export interface Booking {
  id: number;
  propertyId: number;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'pending' | 'completed';
  color: string;
}

// Sample data
const properties: Property[] = [
  { id: 1, name: 'Appartement 12 Rue du Port', capacity: 4, pricePerNight: 95 },
  { id: 2, name: 'Studio 8 Avenue des Fleurs', capacity: 2, pricePerNight: 65 },
  { id: 3, name: 'Loft 72 Rue des Arts', capacity: 3, pricePerNight: 85 },
  { id: 4, name: 'Maison 23 Rue de la Paix', capacity: 6, pricePerNight: 120 },
  { id: 5, name: 'Appartement 45 Boulevard Central', capacity: 4, pricePerNight: 90 },
  { id: 6, name: 'Studio 15 Rue des Lilas', capacity: 2, pricePerNight: 70 },
  { id: 7, name: 'Appartement 28 Avenue Victor Hugo', capacity: 5, pricePerNight: 110 },
];

const bookingsData: Booking[] = [
  { 
    id: 1, 
    propertyId: 1, 
    guestName: 'Martin Dupont', 
    checkIn: new Date(2024, 2, 15), 
    checkOut: new Date(2024, 2, 18),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 2, 
    propertyId: 2, 
    guestName: 'Sophie Martin', 
    checkIn: new Date(2024, 2, 16), 
    checkOut: new Date(2024, 2, 20),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 3, 
    propertyId: 3, 
    guestName: 'Jean Durand', 
    checkIn: new Date(2024, 2, 18), 
    checkOut: new Date(2024, 2, 25),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 4, 
    propertyId: 1, 
    guestName: 'Julie Petit', 
    checkIn: new Date(2024, 2, 25), 
    checkOut: new Date(2024, 2, 28),
    status: 'pending',
    color: '#FFC107'
  },
  { 
    id: 5, 
    propertyId: 4, 
    guestName: 'Thomas Bernard', 
    checkIn: new Date(2024, 2, 10), 
    checkOut: new Date(2024, 2, 15),
    status: 'completed',
    color: '#9E9E9E'
  },
  { 
    id: 6, 
    propertyId: 5, 
    guestName: 'Camille Leroy', 
    checkIn: new Date(2024, 3, 1), 
    checkOut: new Date(2024, 3, 7),
    status: 'confirmed',
    color: '#4CAF50'
  },
  { 
    id: 7, 
    propertyId: 2, 
    guestName: 'Mathieu Roux', 
    checkIn: new Date(2024, 3, 10), 
    checkOut: new Date(2024, 3, 15),
    status: 'confirmed',
    color: '#4CAF50'
  },
];

export const useCalendarData = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [availableProperties, setAvailableProperties] = useState<Property[]>([]);
  
  // Calculate the current days of the month
  const currentMonthDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Filter bookings based on selected property and search query
  useEffect(() => {
    let filtered = bookingsData;
    
    // Filter by property
    if (selectedProperty !== "all") {
      const propertyId = parseInt(selectedProperty);
      filtered = filtered.filter(booking => booking.propertyId === propertyId);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(booking => 
        booking.guestName.toLowerCase().includes(query) || 
        properties.find(p => p.id === booking.propertyId)?.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredBookings(filtered);
  }, [selectedProperty, searchQuery]);

  // Find available properties in a date range
  const findAvailableProperties = (range: DateRange) => {
    if (!range.from || !range.to) return;
    
    // Get all bookings that overlap with the selected date range
    const overlappingBookings = bookingsData.filter(booking => {
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
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(addMonths(currentDate, direction === 'prev' ? -1 : 1));
  };

  return {
    currentDate,
    setCurrentDate,
    properties,
    bookingsData,
    filteredBookings,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    currentMonthDays,
    dateRange,
    setDateRange,
    availableProperties,
    setAvailableProperties,
    findAvailableProperties,
    navigateMonth
  };
};
