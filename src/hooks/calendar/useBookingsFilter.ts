
import { useState, useEffect } from 'react';
import { Booking, Property } from './types';

export const useBookingsFilter = (
  bookings: Booking[],
  properties: Property[]
) => {
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(bookings);
  
  // Filter bookings based on selected property and search query
  useEffect(() => {
    let filtered = bookings;
    
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
  }, [selectedProperty, searchQuery, bookings, properties]);

  return {
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    filteredBookings
  };
};
