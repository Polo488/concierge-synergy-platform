
import React, { useState, useEffect } from 'react';
import { CalendarRange, Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { toast } from '@/components/ui/use-toast';
import { CalendarDialog } from '@/components/cleaning/CalendarDialog';
import { MonthCalendarView } from '@/components/calendar/MonthCalendarView';
import { PropertyCalendarView } from '@/components/calendar/PropertyCalendarView';
import { BookingDetailsDialog } from '@/components/calendar/BookingDetailsDialog';
import { AvailabilityDialog } from '@/components/calendar/AvailabilityDialog';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { CalendarFilters } from '@/components/calendar/CalendarFilters';
import { useCalendarData } from '@/hooks/useCalendarData';

const Calendar = () => {
  const {
    currentDate,
    setCurrentDate,
    properties,
    filteredBookings,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    currentMonthDays,
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties,
    navigateMonth
  } = useCalendarData();
  
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'month' | 'property'>('month');
  const [rangeSelectorOpen, setRangeSelectorOpen] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);

  useEffect(() => {
    document.title = 'Calendrier - GESTION BNB LYON';
  }, []);

  const handleExport = () => {
    toast({
      title: "Exportation réussie",
      description: "Les données du calendrier ont été exportées avec succès."
    });
  };

  const showBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setBookingDetailsOpen(true);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      findAvailableProperties(range);
      setShowAvailabilityDialog(true);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendrier</h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble des réservations
        </p>
      </div>
      
      <DashboardCard 
        title="Calendrier des réservations"
        actions={
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1" 
              onClick={() => setRangeSelectorOpen(true)}
            >
              <CalendarRange className="h-4 w-4" />
              Voir disponibilités
            </Button>
            <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <CalendarFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedProperty={selectedProperty}
            setSelectedProperty={setSelectedProperty}
            currentView={currentView}
            setCurrentView={setCurrentView}
            properties={properties}
          />
          
          <CalendarHeader 
            currentDate={currentDate}
            navigateMonth={navigateMonth}
            setCurrentDate={setCurrentDate}
          />
          
          {currentView === 'month' ? (
            <MonthCalendarView 
              days={currentMonthDays}
              filteredBookings={filteredBookings}
              showBookingDetails={showBookingDetails}
              properties={properties}
            />
          ) : (
            <PropertyCalendarView 
              days={currentMonthDays}
              properties={properties}
              filteredBookings={filteredBookings}
              selectedProperty={selectedProperty}
              showBookingDetails={showBookingDetails}
            />
          )}
        </div>
      </DashboardCard>

      <BookingDetailsDialog 
        open={bookingDetailsOpen}
        onOpenChange={setBookingDetailsOpen}
        selectedBooking={selectedBooking}
        properties={properties}
      />

      <AvailabilityDialog 
        open={showAvailabilityDialog}
        onOpenChange={setShowAvailabilityDialog}
        dateRange={dateRange}
        availableProperties={availableProperties}
      />

      <CalendarDialog
        open={rangeSelectorOpen}
        onOpenChange={setRangeSelectorOpen}
        selectedDateRange={dateRange}
        mode="range"
        onRangeSelect={handleRangeSelect}
        autoApply={true}
      />
    </div>
  );
};

export default Calendar;
