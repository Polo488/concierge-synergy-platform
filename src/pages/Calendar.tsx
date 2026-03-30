
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
import { TutorialTrigger } from '@/components/tutorial/TutorialTrigger';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Euro, Bell, Ban } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CalendarBooking, CalendarProperty, BookingChannel, BlockedPeriod } from '@/types/calendar';

const CalendarPage = () => {
  const isMobile = useIsMobile();
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
  const [selectedBooking, setSelectedBooking] = useState<CalendarBooking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [preselectedPropertyId, setPreselectedPropertyId] = useState<number | undefined>();
  const [preselectedDate, setPreselectedDate] = useState<Date | undefined>();
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [blockDialogProperty, setBlockDialogProperty] = useState<CalendarProperty | undefined>();
  const [blockDialogStartDate, setBlockDialogStartDate] = useState<Date | undefined>();
  const [blockDialogEndDate, setBlockDialogEndDate] = useState<Date | undefined>();
  const [editingBlock, setEditingBlock] = useState<BlockedPeriod | undefined>();
  const [isPriceEditOpen, setIsPriceEditOpen] = useState(false);
  const [priceEditData, setPriceEditData] = useState<{
    propertyId: number;
    startDate: Date;
    endDate: Date;
    currentPrice: number;
  } | null>(null);
  const [layers, setLayers] = useState({ showCleaning: false, showMaintenance: false });

  const handleBookingClick = (booking: CalendarBooking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleCellClick = (date: Date, propertyId: number) => {
    if (isSelecting) return;
    setPreselectedPropertyId(propertyId);
    setPreselectedDate(date);
    setIsNewBookingOpen(true);
  };

  const handlePropertyClick = (property: CalendarProperty) => {
    setSelectedPropertyForMonth(property);
    setMonthViewDate(startOfMonth(currentDate));
  };

  const handleBlockedClick = (blocked: BlockedPeriod) => {
    const property = properties.find(p => p.id === blocked.propertyId);
    setBlockDialogProperty(property);
    setEditingBlock(blocked);
    setBlockDialogStartDate(blocked.startDate);
    setBlockDialogEndDate(blocked.endDate);
    setIsBlockDialogOpen(true);
  };

  const handleOpenBlockDialog = (property?: CalendarProperty, startDate?: Date, endDate?: Date) => {
    setBlockDialogProperty(property);
    setBlockDialogStartDate(startDate || new Date());
    setBlockDialogEndDate(endDate || startDate || new Date());
    setEditingBlock(undefined);
    setIsBlockDialogOpen(true);
  };

  const handleBlockSubmit = (block: Omit<BlockedPeriod, 'id'>, shouldCreateCleaningTask: boolean) => {
    if (editingBlock) {
      toast.success('Blocage modifié avec succès');
    } else {
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

  const handleBlockDelete = (blockId: number, deleteLinkedCleaning: boolean) => {
    toast.success('Blocage supprimé');
    setIsBlockDialogOpen(false);
    setEditingBlock(undefined);
  };

  const handleCloseMonthView = () => setSelectedPropertyForMonth(null);

  const handleAddBooking = () => {
    setPreselectedPropertyId(undefined);
    setPreselectedDate(undefined);
    setIsNewBookingOpen(true);
  };

  const handleNewBookingSubmit = (bookingData: Omit<CalendarBooking, 'id'>) => {
    toast.success('Réservation créée avec succès');
  };

  const handleSync = async () => {
    await syncData();
    toast.success('Synchronisation terminée');
  };

  const getDailyPrice = (propertyId: number, date: Date): number => {
    const property = properties.find(p => p.id === propertyId);
    return property?.pricePerNight || 0;
  };

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

  const handleMonthViewPriceEdit = (propertyId: number, startDate: Date, endDate: Date, currentPrice: number) => {
    setPriceEditData({ propertyId, startDate, endDate, currentPrice });
    setIsPriceEditOpen(true);
  };

  const handlePriceUpdate = async (newPrice: number, channel: BookingChannel | 'all') => {
    if (!priceEditData) return;
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Prix mis à jour: ${newPrice}€/nuit pour ${channel === 'all' ? 'tous les canaux' : channel}`);
    clearSelection();
    setPriceEditData(null);
  };

  const selectedProperty = selectedBooking 
    ? properties.find(p => p.id === selectedBooking.propertyId) : undefined;
  const priceEditProperty = priceEditData 
    ? properties.find(p => p.id === priceEditData.propertyId) : undefined;

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      <TutorialTrigger moduleId="calendar" />
      
      {/* Header - compact on mobile */}
      <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-2 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold tracking-tight truncate">Planning</h1>
            {!isMobile && (
              <p className="text-muted-foreground text-sm">
                Visualisez et gérez les réservations de tous vos logements
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <TutorialButton moduleId="calendar" />
            {hasSelection && activeTab === 'planning' && !selectedPropertyForMonth && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 rounded-lg animate-in fade-in">
                <span className="text-sm font-medium">
                  {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''}
                </span>
                <Button size="sm" variant="secondary" onClick={handleOpenPriceEdit} className="gap-1">
                  <Euro className="w-3 h-3" />
                  Prix
                </Button>
                <Button size="sm" variant="secondary" onClick={() => {
                  if (selectionRange) {
                    const property = properties.find(p => p.id === selectionRange.propertyId);
                    handleOpenBlockDialog(property, selectionRange.startDate, selectionRange.endDate);
                    clearSelection();
                  }
                }} className="gap-1">
                  <Ban className="w-3 h-3" />
                  Bloquer
                </Button>
                <Button size="sm" variant="ghost" onClick={clearSelection}>✕</Button>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'planning' | 'pricing')}>
              <TabsList className="h-9">
                <TabsTrigger value="planning" className="gap-1.5 text-xs md:text-sm">
                  <CalendarDays className="w-4 h-4" />
                  {!isMobile && 'Réservations'}
                </TabsTrigger>
                <TabsTrigger value="pricing" className="gap-1.5 text-xs md:text-sm">
                  <Euro className="w-4 h-4" />
                  {!isMobile && 'Pricing'}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {selectedPropertyForMonth ? (
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
      ) : activeTab === 'planning' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0 px-4 md:px-6 pb-3" data-tutorial="calendar-toolbar">
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
          </div>
          <div className="flex-1 overflow-hidden px-2 md:px-6 pb-2" data-tutorial="calendar-grid">
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
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto px-4 md:px-6">
          <PricingView properties={filteredProperties} days={visibleDays} />
        </div>
      )}

      <InsightsPanel
        open={isInsightsPanelOpen}
        onOpenChange={setIsInsightsPanelOpen}
        insights={insights}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onArchive={archiveInsight}
        onAction={(action) => {
          setIsInsightsPanelOpen(false);
          if (action === 'open_pricing') setActiveTab('pricing');
        }}
        disabledTypes={disabledTypes}
        onToggleType={toggleTypeEnabled}
      />

      <BookingDetailsSheet
        booking={selectedBooking}
        property={selectedProperty}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={() => { setIsDetailsOpen(false); toast.info('Fonction de modification à venir'); }}
        onDelete={() => { setIsDetailsOpen(false); toast.info('Fonction de suppression à venir'); }}
      />

      <NewBookingDialog
        open={isNewBookingOpen}
        onOpenChange={setIsNewBookingOpen}
        properties={properties}
        preselectedPropertyId={preselectedPropertyId}
        preselectedDate={preselectedDate}
        onSubmit={handleNewBookingSubmit}
      />

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
