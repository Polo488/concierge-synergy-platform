
export interface Property {
  id: number;
  name: string;
  capacity: number;
  pricePerNight: number;
  // Access information fields
  bacCode?: string;
  wifiCode?: string;
  floor?: string;
  youtubeLink?: string;
  // Agent notes
  agentNotes?: string;
  // Linked files (manuals, etc.)
  attachments?: Array<{id: number, name: string, url: string, type: string}>;
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

export interface CalendarContext {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  properties: Property[];
  bookings: Booking[];
  filteredBookings: Booking[];
  selectedProperty: string;
  setSelectedProperty: (propertyId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentMonthDays: Date[];
  dateRange?: DateRange;
  setDateRange: (range: DateRange | undefined) => void;
  availableProperties: Property[];
  findAvailableProperties: (range: DateRange) => void;
  navigateMonth: (direction: 'prev' | 'next') => void;
  addBooking: (booking: Booking) => void;
  setBookings: (bookings: Booking[]) => void;
}

// React Day Picker type
export interface DateRange {
  from?: Date;
  to?: Date;
}
