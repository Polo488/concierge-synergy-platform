
import { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { DailyCalendar } from '@/components/calendar/DailyCalendar';
import { BookingDialog } from '@/components/calendar/BookingDialog';
import { BookingDetailsDialog } from '@/components/calendar/BookingDetailsDialog';
import { AvailabilityDialog } from '@/components/calendar/AvailabilityDialog';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Booking, DateRange } from '@/hooks/calendar/types';

const CalendarPage = () => {
  const {
    properties,
    bookings,
    filteredBookings,
    currentDate,
    navigateMonth,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    currentMonthDays,
    dateRange,
    setDateRange,
    availableProperties,
    findAvailableProperties,
    addBooking,
    setBookings
  } = useCalendarData();

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isBookingDetailsDialogOpen, setIsBookingDetailsDialogOpen] = useState(false);
  const [isAvailabilityDialogOpen, setIsAvailabilityDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [view, setView] = useState<'month' | 'properties'>('month');

  // Function to handle adding a new booking
  const handleAddBooking = () => {
    setIsBookingDialogOpen(true);
  };

  // Function to handle booking click
  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailsDialogOpen(true);
  };

  // Function to handle editing a booking
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDialogOpen(true);
  };

  // Function to handle deleting a booking
  const handleDeleteBooking = (booking: Booking) => {
    // Implement your delete logic here
    console.log('Delete booking', booking);
  };

  // Handle date range change for availability check
  const handleDateRangeChange = (range: { from: Date; to?: Date }) => {
    const newDateRange: DateRange = {
      from: range.from,
      to: range.to
    };
    
    setDateRange(newDateRange);
    
    if (newDateRange.from && newDateRange.to) {
      findAvailableProperties(newDateRange);
    }
  };
  
  // Open the availability dialog with date selection
  const handleCheckAvailability = () => {
    setIsAvailabilityDialogOpen(true);
  };
  
  // Toggle between month and property views
  const toggleView = () => {
    setView(view === 'month' ? 'properties' : 'month');
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Calendrier</h2>
          <p className="text-sm text-muted-foreground">
            Suivez les réservations et la disponibilité de vos propriétés.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={toggleView}>
            Basculer vers la vue {view === 'month' ? 'Propriétés' : 'Mois'}
          </Button>
          <Button onClick={handleAddBooking}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une réservation
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="property">Propriété</Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les propriétés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les propriétés</SelectItem>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Recherche</Label>
            <Input
              id="search"
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Disponibilité</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange?.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  defaultMonth={currentDate}
                  onSelect={(range: any) => handleDateRangeChange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button size="sm" className="ml-auto mt-2 block" onClick={handleCheckAvailability}>
              Vérifier la disponibilité
            </Button>
          </div>
        </CardContent>
      </Card>

      {view === 'month' ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Button onClick={() => navigateMonth('prev')} variant="ghost">Précédent</Button>
            <CardTitle className="text-2xl font-semibold tracking-tight">{format(currentDate, 'MMMM yyyy')}</CardTitle>
            <Button onClick={() => navigateMonth('next')} variant="ghost">Suivant</Button>
          </CardHeader>
          <CardContent className="pl-2 pr-2 relative">
            <DailyCalendar
              bookings={filteredBookings}
              days={currentMonthDays}
              properties={properties}
              onBookingClick={handleBookingClick}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {property.name}
                  {property.floor && (
                    <Badge variant="secondary">
                      <MapPin className="mr-1 h-3 w-3" />
                      {property.floor}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Capacité: {property.capacity} personnes</p>
                  <p>Prix par nuit: {property.pricePerNight}€</p>
                  {filteredBookings.filter(booking => booking.propertyId === property.id).length > 0 ? (
                    <ul>
                      {filteredBookings.filter(booking => booking.propertyId === property.id).map(booking => (
                        <li key={booking.id} className="flex items-center justify-between">
                          {booking.guestName}
                          <Badge>{format(booking.checkIn, 'dd/MM')} - {format(booking.checkOut, 'dd/MM')}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Aucune réservation pour cette propriété.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button size="sm" onClick={() => handleAddBooking()}>
                  Réserver
                </Button>
                <Button size="sm" variant="outline">
                  Détails
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <BookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        properties={properties}
        onBookingSubmit={addBooking}
        selectedBooking={selectedBooking}
      />

      <BookingDetailsDialog
        open={isBookingDetailsDialogOpen}
        onOpenChange={setIsBookingDetailsDialogOpen}
        selectedBooking={selectedBooking}
      />

      <AvailabilityDialog
        open={isAvailabilityDialogOpen}
        onOpenChange={setIsAvailabilityDialogOpen}
        availableProperties={availableProperties}
        dateRange={dateRange}
      />
    </div>
  );
};

export default CalendarPage;
