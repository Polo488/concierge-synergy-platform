
import React, { useState } from 'react';
import { toast } from 'sonner';
import { startOfMonth, startOfDay, addDays } from 'date-fns';
import { useCalendarGrid } from '@/hooks/calendar/useCalendarGrid';
import { useMultiDaySelection } from '@/hooks/calendar/useMultiDaySelection';
import { useInsights } from '@/hooks/useInsights';
import { CalendarGrid } from '@/components/calendar/grid/CalendarGrid';
import { CalendarToolbar } from '@/components/calendar/grid/CalendarToolbar';
import { BookingDetailsSheet } from '@/components/calendar/dialogs/BookingDetailsSheet';
import { NewBookingDialog } from '@/components/calendar/dialogs/NewBookingDialog';
import { CreateBlockDialog } from '@/components/calendar/dialogs/CreateBlockDialog';
import { PricingView } from '@/components/calendar/pricing/PricingView';
import { PropertyMonthView } from '@/components/calendar/PropertyMonthView';
import { PriceEditModal } from '@/components/calendar/PriceEditModal';
import { InsightsPanel } from '@/components/insights/InsightsPanel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Euro, Bell, Ban } from 'lucide-react';
import type { CalendarBooking, CalendarProperty, BookingChannel, BlockedPeriod } from '@/types/calendar';

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

  // Block dialog state
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockDialogProperty, setBlockDialogProperty] = useState<CalendarProperty | undefined>();
  const [blockDialogStartDate, setBlockDialogStartDate] = useState<Date | undefined>();
  const [blockDialogEndDate, setBlockDialogEndDate] = useState<Date | undefined>();
  const [editingBlock, setEditingBlock] = useState<BlockedPeriod | undefined>();

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

  // Handle empty cell click - could be booking or block
  const handleCellClick = (date: Date, propertyId: number) => {
    // Don't open dialog if we're selecting
    if (isSelecting) return;
    
    // For now, default to new booking - could add menu to choose
    setPreselectedPropertyId(propertyId);
    setPreselectedDate(date);
    setIsNewBookingOpen(true);
  };

  // Handle property click - open month view
  const handlePropertyClick = (property: CalendarProperty) => {
    setSelectedPropertyForMonth(property);
    setMonthViewDate(startOfMonth(currentDate));
  };

  // Handle blocked period click - open block dialog for editing
  const handleBlockedClick = (blocked: BlockedPeriod) => {
    const property = properties.find(p => p.id === blocked.propertyId);
    setBlockDialogProperty(property);
    setEditingBlock(blocked);
    setBlockDialogStartDate(blocked.startDate);
    setBlockDialogEndDate(blocked.endDate);
    setIsBlockDialogOpen(true);
  };

  // Open block dialog for creating new block
  const handleOpenBlockDialog = (property?: CalendarProperty, startDate?: Date, endDate?: Date) => {
    setBlockDialogProperty(property);
    setBlockDialogStartDate(startDate || new Date());
    setBlockDialogEndDate(endDate || startDate || new Date());
    setEditingBlock(undefined);
    setIsBlockDialogOpen(true);
  };

  // Handle block creation/update
  const handleBlockSubmit = (block: Omit<BlockedPeriod, 'id'>, shouldCreateCleaningTask: boolean) => {
    if (editingBlock) {
      // Update existing block
      console.log('Update block:', { ...block, id: editingBlock.id }, shouldCreateCleaningTask);
      toast.success('Blocage modifié avec succès');
    } else {
      // Create new block
      console.log('Create block:', block, shouldCreateCleaningTask);
      toast.success('Période bloquée avec succès');
    }
    
    if (shouldCreateCleaningTask && block.cleaningSchedule?.enabled) {
      const cleaningDate = block.cleaningSchedule.dateRule === 'last_blocked_day' 
        ? block.endDate 
        : addDays(block.endDate, 1);
      toast.info(`Ménage programmé pour le ${cleaningDate.toLocaleDateString('fr-FR')}`);
    }
    
    setIsBlockDialogOpen(false);
    setEditingBlock(undefined);
  };

  // Handle block deletion
  const handleBlockDelete = (blockId: number, deleteLinkedCleaning: boolean) => {
    console.log('Delete block:', blockId, 'Delete cleaning:', deleteLinkedCleaning);
    toast.success('Blocage supprimé');
    setIsBlockDialogOpen(false);
    setEditingBlock(undefined);
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
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => {
                  if (selectionRange) {
                    const property = properties.find(p => p.id === selectionRange.propertyId);
                    handleOpenBlockDialog(property, selectionRange.startDate, selectionRange.endDate);
                    clearSelection();
                  }
                }} 
                className="gap-1"
              >
                <Ban className="w-3 h-3" />
                Bloquer
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
            onBlockedClick={handleBlockedClick}
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

      {/* Create/Edit Block Dialog */}
      <CreateBlockDialog
        open={isBlockDialogOpen}
        onOpenChange={setIsBlockDialogOpen}
        property={blockDialogProperty}
        preselectedStartDate={blockDialogStartDate}
        preselectedEndDate={blockDialogEndDate}
        existingBlock={editingBlock}
        cleaningAgents={[
          { id: '1', name: 'Marie Dubois' },
          { id: '2', name: 'Jean Martin' },
          { id: '3', name: 'Sophie Bernard' },
        ]}
        onSubmit={handleBlockSubmit}
        onDelete={handleBlockDelete}
      />
    </div>
  );
};

export default CalendarPage;
