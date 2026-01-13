
import React, { useState } from 'react';
import { toast } from 'sonner';
import { startOfMonth, startOfDay } from 'date-fns';
import { useCalendarGrid } from '@/hooks/calendar/useCalendarGrid';
import { useMultiDaySelection } from '@/hooks/calendar/useMultiDaySelection';
import { useInsights } from '@/hooks/useInsights';
import { CalendarGrid } from '@/components/calendar/grid/CalendarGrid';
import { CalendarToolbar } from '@/components/calendar/grid/CalendarToolbar';
import { BookingDetailsSheet } from '@/components/calendar/dialogs/BookingDetailsSheet';
import { NewBookingDialog } from '@/components/calendar/dialogs/NewBookingDialog';
import { PricingView } from '@/components/calendar/pricing/PricingView';
import { PropertyMonthView } from '@/components/calendar/PropertyMonthView';
import { PriceEditModal } from '@/components/calendar/PriceEditModal';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Euro, Bell } from 'lucide-react';
import type { CalendarBooking, CalendarProperty, BookingChannel } from '@/types/calendar';

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
  } = useCalendarGrid(90);

  // Multi-day selection hook for global view
  const {
    selectedDays,
    selectionRange,
    isSelecting,
    isDaySelected,
    handleDayMouseDown,
    handleDayMouseEnter,
    handleDayMouseUp,
    clearSelection,
    hasSelection,
  } = useMultiDaySelection();

  // Insights hook
  const {
    insights,
    unreadCount,
    getInsightsForProperty,
    markAsRead,
    markAllAsRead,
    archiveInsight,
    disabledTypes,
    toggleTypeEnabled,
  } = useInsights();

  const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'planning' | 'pricing'>('planning');
  const [selectedPropertyForMonth, setSelectedPropertyForMonth] = useState<CalendarProperty | null>(null);
  const [monthViewDate, setMonthViewDate] = useState<Date>(startOfMonth(new Date()));

  // Dialog states
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [preselectedPropertyId, setPreselectedPropertyId] = useState<number | undefined>();
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>();

  // Price edit modal state
  const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
  const [priceEditData, setPriceEditData] = useState<{
    propertyId: number;
    startDate: Date;
    endDate: Date;
    currentPrice: number;
  } | null>(null);

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

  // Handle empty cell click
  const handleCellClick = (date: Date, propertyId: number) => {
    // Don't open new booking dialog if we're selecting
    if (isSelecting) return;
    setPreselectedPropertyId(propertyId);
    setPreselectedDate(date);
    setIsNewBookingOpen(true);
  };

  // Handle property click - open month view
  const handlePropertyClick = (property: CalendarProperty) => {
    setSelectedPropertyForMonth(property);
    setMonthViewDate(startOfMonth(currentDate));
  };

  // Close month view
  const handleCloseMonthView = () => {
    setSelectedPropertyForMonth(null);
  };

  // Handle add booking button
  const handleAddBooking = () => {
    setPreselectedPropertyId(undefined);
    setPreselectedDate(undefined);
    setIsNewBookingOpen(true);
  };

  // Handle new booking submit
  const handleNewBookingSubmit = (bookingData: Omit<CalendarBooking, 'id'>) => {
    console.log('New booking:', bookingData);
    toast.success('Réservation créée avec succès');
  };

  // Handle sync
  const handleSync = async () => {
    await syncData();
    toast.success('Synchronisation terminée');
  };

  // Get daily price for property month view
  const getDailyPrice = (propertyId: number, date: Date): number => {
    const property = properties.find(p => p.id === propertyId);
    // Could look up in dailyPrices array if available
    return property?.pricePerNight || 0;
  };

  // Open price edit modal for global view selection
  const handleOpenPriceEdit = () => {
    if (!selectionRange) return;
    const property = properties.find(p => p.id === selectionRange.propertyId);
    const currentPrice = property?.pricePerNight || 0;
    
    setPriceEditData({
      propertyId: selectionRange.propertyId,
      startDate: selectionRange.startDate,
      endDate: selectionRange.endDate,
      currentPrice,
    });
    setIsPriceEditOpen(true);
  };

  // Open price edit modal from month view
  const handleMonthViewPriceEdit = (propertyId: number, startDate: Date, endDate: Date, currentPrice: number) => {
    setPriceEditData({ propertyId, startDate, endDate, currentPrice });
    setIsPriceEditOpen(true);
  };

  // Handle price update submission (would integrate with Channex API)
  const handlePriceUpdate = async (newPrice: number, channel: BookingChannel | 'all') => {
    if (!priceEditData) return;
    
    // Simulate API call to Channex
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Price update:', {
      propertyId: priceEditData.propertyId,
      startDate: priceEditData.startDate,
      endDate: priceEditData.endDate,
      newPrice,
      channel,
    });
    
    toast.success(`Prix mis à jour: ${newPrice}€/nuit pour ${channel === 'all' ? 'tous les canaux' : channel}`);
    clearSelection();
    setPriceEditData(null);
  };

  // Get property for selected booking
  const selectedProperty = selectedBooking 
    ? properties.find(p => p.id === selectedBooking.propertyId)
    : undefined;

  // Get property for price edit
  const priceEditProperty = priceEditData 
    ? properties.find(p => p.id === priceEditData.propertyId)
    : undefined;

  return (
    <div className="h-full flex flex-col gap-4 p-6">
      {/* Page header with tabs */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Planning</h1>
          <p className="text-muted-foreground">
            Visualisez et gérez les réservations de tous vos logements
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Selection actions for global view */}
          {hasSelection && activeTab === 'planning' && !selectedPropertyForMonth && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 rounded-lg animate-in fade-in slide-in-from-right-2">
              <span className="text-sm font-medium">
                {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''} sélectionné{selectedDays.length > 1 ? 's' : ''}
              </span>
              <Button size="sm" variant="secondary" onClick={handleOpenPriceEdit} className="gap-1">
                <Euro className="w-3 h-3" />
                Modifier prix
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                Annuler
              </Button>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'planning' | 'pricing')}>
            <TabsList>
              <TabsTrigger value="planning" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                Réservations
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-2">
                <Euro className="w-4 h-4" />
                Règles & Pricing
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {activeTab === 'planning' ? (
        <>
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

          {/* Property Month View - shown when a property is selected */}
          {selectedPropertyForMonth && (
            <PropertyMonthView
              property={selectedPropertyForMonth}
              bookings={bookings}
              blockedPeriods={blockedPeriods}
              currentMonth={monthViewDate}
              onMonthChange={setMonthViewDate}
              onClose={handleCloseMonthView}
              onBookingClick={handleBookingClick}
              onCellClick={handleCellClick}
              getDailyPrice={getDailyPrice}
              onPriceEditRequest={handleMonthViewPriceEdit}
            />
          )}

          {/* Calendar Grid - always visible */}
          <CalendarGrid
            properties={filteredProperties}
            days={visibleDays}
            dailyPrices={dailyPrices}
            getBookingsForProperty={getBookingsForProperty}
            getBlockedForProperty={getBlockedForProperty}
            onBookingClick={handleBookingClick}
            onCellClick={handleCellClick}
            onPropertyClick={handlePropertyClick}
            isDaySelected={isDaySelected}
            onDayMouseDown={handleDayMouseDown}
            onDayMouseEnter={handleDayMouseEnter}
            onDayMouseUp={handleDayMouseUp}
            isSelecting={isSelecting}
            getInsightsForProperty={getInsightsForProperty}
            onInsightClick={() => setIsInsightsPanelOpen(true)}
          />
        </>
      ) : (
        <PricingView properties={filteredProperties} days={visibleDays} />
      )}

      {/* Insights Panel */}
      <InsightsPanel
        open={isInsightsPanelOpen}
        onOpenChange={setIsInsightsPanelOpen}
        insights={insights}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onArchive={archiveInsight}
        onAction={(action, propertyId) => {
          setIsInsightsPanelOpen(false);
          if (action === 'open_pricing') {
            setActiveTab('pricing');
          }
        }}
        disabledTypes={disabledTypes}
        onToggleType={toggleTypeEnabled}
      />


      {/* Booking Details Sheet */}
      <BookingDetailsSheet
        booking={selectedBooking}
        property={selectedProperty}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={(booking) => {
          setIsDetailsOpen(false);
          toast.info('Fonction de modification à venir');
        }}
        onDelete={(booking) => {
          setIsDetailsOpen(false);
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

      {/* Price Edit Modal */}
      <PriceEditModal
        open={isPriceEditOpen}
        onOpenChange={setIsPriceEditOpen}
        selectionRange={priceEditData ? {
          propertyId: priceEditData.propertyId,
          startDate: priceEditData.startDate,
          endDate: priceEditData.endDate,
        } : null}
        property={priceEditProperty}
        currentPrice={priceEditData?.currentPrice || 0}
        onSubmit={handlePriceUpdate}
      />
    </div>
  );
};

export default CalendarPage;
