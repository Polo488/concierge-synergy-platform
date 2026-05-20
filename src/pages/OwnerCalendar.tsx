import { useState } from 'react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCalendarGrid } from '@/hooks/calendar/useCalendarGrid';
import { useBlockRequests } from '@/hooks/useBlockRequests';
import { CalendarGrid } from '@/components/calendar/grid/CalendarGrid';
import { CalendarToolbar } from '@/components/calendar/grid/CalendarToolbar';
import { OwnerBlockRequestDialog } from '@/components/owner-portal/OwnerBlockRequestDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CalendarProperty } from '@/types/calendar';

const OwnerCalendar = () => {
  const isMobile = useIsMobile();
  const {
    properties,
    filteredProperties,
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

  const { getPendingForProperty } = useBlockRequests();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProperty, setDialogProperty] = useState<CalendarProperty | null>(null);
  const [dialogStart, setDialogStart] = useState<Date | null>(null);

  const handleCellClick = (date: Date, propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId) ?? null;
    setDialogProperty(property);
    setDialogStart(date);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="flex-shrink-0 px-4 md:px-6 pt-4 pb-2 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <h1 className="text-lg md:text-2xl font-bold tracking-tight truncate">
              Planning de mes logements
            </h1>
            {!isMobile && (
              <p className="text-muted-foreground text-sm">
                Consultez les réservations et demandez des blocages personnels.
              </p>
            )}
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <Eye className="w-3 h-3" />
            Lecture seule
          </Badge>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 px-4 md:px-6 pb-3">
          <CalendarToolbar
            currentDate={currentDate}
            filters={filters}
            onFiltersChange={setFilters}
            onNavigate={navigateWeeks}
            onGoToToday={goToToday}
            onAddBooking={() => {}}
            onSync={syncData}
            isSyncing={isSyncing}
            lastSyncTime={lastSyncTime}
            activeLayer="bookings"
            onActiveLayerChange={() => {}}
          />
        </div>
        <div className="flex-1 overflow-hidden px-2 md:px-6 pb-2">
          <CalendarGrid
            properties={filteredProperties}
            days={visibleDays}
            dailyPrices={dailyPrices}
            getBookingsForProperty={getBookingsForProperty}
            getBlockedForProperty={getBlockedForProperty}
            onBookingClick={() => {}}
            onCellClick={handleCellClick}
            readOnly
            activeLayer="bookings"
            getPendingBlockForProperty={getPendingForProperty}
          />
        </div>
      </div>

      <OwnerBlockRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        property={dialogProperty}
        startDate={dialogStart}
      />
    </div>
  );
};

export default OwnerCalendar;
