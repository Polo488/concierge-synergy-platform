
import React, { useState } from 'react';
import { toast } from 'sonner';
import { useCalendarGrid } from '@/hooks/calendar/useCalendarGrid';
import { CalendarGrid } from '@/components/calendar/grid/CalendarGrid';
import { CalendarToolbar } from '@/components/calendar/grid/CalendarToolbar';
import { BookingDetailsSheet } from '@/components/calendar/dialogs/BookingDetailsSheet';
import { NewBookingDialog } from '@/components/calendar/dialogs/NewBookingDialog';
import type { CalendarBooking } from '@/types/calendar';

const CalendarPage = () => {
  const {
    properties,
    filteredProperties,
    bookings,
    blockedPeriods,
    dailyPrices,
    currentDate,
    visibleDays,
    navigateWeeks,
    goToToday,
    filters,
    setFilters,
    getBookingsForProperty,
    getBlockedForProperty,
    isSyncing,
    lastSyncTime,
    syncData,
  } = useCalendarGrid(90); // Show 90 days

  // Dialog states
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [preselectedPropertyId, setPreselectedPropertyId] = useState<number | undefined>();
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>();

  // Layers state
  const [layers, setLayers] = useState({
    showCleaning: false,
    showMaintenance: false,
  });

  // Handle booking click
  const handleBookingClick = (booking: CalendarBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  // Handle empty cell click - open new booking dialog
  const handleCellClick = (date: Date, propertyId: number) => {
    setPreselectedPropertyId(propertyId);
    setPreselectedDate(date);
    setIsNewBookingOpen(true);
  };

  // Handle add booking button
  const handleAddBooking = () => {
    setPreselectedPropertyId(undefined);
    setPreselectedDate(undefined);
    setIsNewBookingOpen(true);
  };

  // Handle new booking submit
  const handleNewBookingSubmit = (bookingData: Omit<CalendarBooking, 'id'>) => {
    // In a real app, this would call an API
    console.log('New booking:', bookingData);
    toast.success('Réservation créée avec succès');
  };

  // Handle sync
  const handleSync = async () => {
    await syncData();
    toast.success('Synchronisation terminée');
  };

  // Get property for selected booking
  const selectedProperty = selectedBooking 
    ? properties.find(p => p.id === selectedBooking.propertyId)
    : undefined;

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      {/* Page header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Planning</h1>
        <p className="text-muted-foreground">
          Visualisez et gérez les réservations de tous vos logements
        </p>
      </div>

      {/* Toolbar */}
      <CalendarToolbar
        currentDate={currentDate}
        filters={filters}
        onFiltersChange={setFilters}
        onNavigate={navigateWeeks}
        onGoToToday={goToToday}
        onAddBooking={handleAddBooking}
        onSync={handleSync}
        isSyncing={isSyncing}
        lastSyncTime={lastSyncTime}
        layers={layers}
        onLayersChange={setLayers}
      />

      {/* Calendar Grid */}
      <CalendarGrid
        properties={filteredProperties}
        days={visibleDays}
        dailyPrices={dailyPrices}
        getBookingsForProperty={getBookingsForProperty}
        getBlockedForProperty={getBlockedForProperty}
        onBookingClick={handleBookingClick}
        onCellClick={handleCellClick}
      />

      {/* Booking Details Sheet */}
      <BookingDetailsSheet
        booking={selectedBooking}
        property={selectedProperty}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={(booking) => {
          setIsDetailsOpen(false);
          // Handle edit
          toast.info('Fonction de modification à venir');
        }}
        onDelete={(booking) => {
          setIsDetailsOpen(false);
          // Handle delete
          toast.info('Fonction de suppression à venir');
        }}
      />

      {/* New Booking Dialog */}
      <NewBookingDialog
        open={isNewBookingOpen}
        onOpenChange={setIsNewBookingOpen}
        properties={properties}
        preselectedPropertyId={preselectedPropertyId}
        preselectedDate={preselectedDate}
        onSubmit={handleNewBookingSubmit}
      />
    </div>
  );
};

export default CalendarPage;
