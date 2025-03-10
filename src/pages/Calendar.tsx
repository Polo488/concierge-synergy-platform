import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Building, 
  Check
} from 'lucide-react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { toast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Données fictives pour les logements
const properties = [
  { id: 1, name: 'Appartement 12 Rue du Port' },
  { id: 2, name: 'Studio 8 Avenue des Fleurs' },
  { id: 3, name: 'Loft 72 Rue des Arts' },
  { id: 4, name: 'Maison 23 Rue de la Paix' },
  { id: 5, name: 'Appartement 45 Boulevard Central' },
  { id: 6, name: 'Studio 15 Rue des Lilas' },
  { id: 7, name: 'Appartement 28 Avenue Victor Hugo' },
];

// Données fictives pour les réservations
const bookingsData = [
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

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProperty, setSelectedProperty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'month' | 'property'>('month');

  useEffect(() => {
    document.title = 'Calendrier - GESTION BNB LYON';
  }, []);

  // Filtrage des réservations
  useEffect(() => {
    let filtered = bookingsData;
    
    // Filtre par propriété
    if (selectedProperty !== "all") {
      const propertyId = parseInt(selectedProperty);
      filtered = filtered.filter(booking => booking.propertyId === propertyId);
    }
    
    // Filtre par recherche
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(booking => 
        booking.guestName.toLowerCase().includes(query) || 
        properties.find(p => p.id === booking.propertyId)?.name.toLowerCase().includes(query)
      );
    }
    
    setFilteredBookings(filtered);
  }, [selectedProperty, searchQuery]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(addMonths(currentDate, -1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 rounded-full">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-full">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-full">Terminé</Badge>;
      default:
        return null;
    }
  };

  // Rendu du calendrier mensuel
  const renderMonthCalendar = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return (
      <div className="mt-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
            <div key={idx} className="text-center font-medium text-sm py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: new Date(monthStart).getDay() === 0 ? 6 : new Date(monthStart).getDay() - 1 }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-24 bg-gray-50 rounded-md"></div>
          ))}
          
          {days.map((day, idx) => {
            // Trouver les réservations pour ce jour
            const dayBookings = filteredBookings.filter(booking => 
              isWithinInterval(day, { start: booking.checkIn, end: addDays(booking.checkOut, -1) })
            );
            
            return (
              <div 
                key={idx}
                className={cn(
                  "h-24 border border-border/40 rounded-md p-1 overflow-hidden transition-colors",
                  isSameDay(day, new Date()) ? "bg-blue-50" : "bg-card"
                )}
              >
                <div className="text-right text-xs font-medium mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayBookings.map((booking) => {
                    const property = properties.find(p => p.id === booking.propertyId);
                    const isCheckIn = isSameDay(day, booking.checkIn);
                    const isCheckOut = isSameDay(day, booking.checkOut);
                    
                    return (
                      <div 
                        key={booking.id}
                        onClick={() => showBookingDetails(booking)}
                        className="text-xs p-1 rounded cursor-pointer truncate text-white"
                        style={{ 
                          backgroundColor: booking.color,
                          borderLeft: isCheckIn ? '3px solid black' : undefined,
                          borderRight: isCheckOut ? '3px solid black' : undefined
                        }}
                      >
                        {property?.name} - {booking.guestName}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Rendu du calendrier par propriété
  const renderPropertyCalendar = () => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Jours du mois courant
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const filteredProperties = selectedProperty === "all" 
      ? properties 
      : properties.filter(p => p.id === parseInt(selectedProperty));
    
    return (
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-max">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${days.length}, minmax(30px, 1fr))` }}>
            {/* En-têtes des jours */}
            <div className="bg-muted font-medium py-2 px-4 border-b">Logement</div>
            {days.map((day, idx) => (
              <div key={idx} className={cn(
                "text-center text-xs font-medium py-2 border-b",
                isSameDay(day, new Date()) ? "bg-blue-50" : "bg-muted"
              )}>
                {format(day, 'E dd', { locale: fr })}
              </div>
            ))}
            
            {/* Lignes par propriété */}
            {filteredProperties.map(property => {
              return (
                <React.Fragment key={property.id}>
                  <div className="py-2 px-4 border-b font-medium truncate">
                    {property.name}
                  </div>
                  
                  {days.map((day, idx) => {
                    const dayBookings = filteredBookings.filter(booking => 
                      booking.propertyId === property.id && 
                      isWithinInterval(day, { start: booking.checkIn, end: addDays(booking.checkOut, -1) })
                    );
                    
                    const isCheckIn = dayBookings.some(b => isSameDay(day, b.checkIn));
                    const isCheckOut = dayBookings.some(b => isSameDay(day, b.checkOut));
                    
                    return (
                      <div 
                        key={idx}
                        className={cn(
                          "border-b min-h-[40px] relative",
                          isSameDay(day, new Date()) ? "bg-blue-50" : "",
                          dayBookings.length > 0 ? "cursor-pointer" : ""
                        )}
                        onClick={() => dayBookings.length > 0 && showBookingDetails(dayBookings[0])}
                      >
                        {dayBookings.length > 0 && (
                          <div 
                            className="absolute inset-0 flex items-center justify-center text-white text-xs"
                            style={{ 
                              backgroundColor: dayBookings[0].color,
                              borderLeft: isCheckIn ? '3px solid black' : undefined,
                              borderRight: isCheckOut ? '3px solid black' : undefined
                            }}
                          >
                            {dayBookings[0].guestName}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    );
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
            <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2 max-w-sm flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher un logement ou client..." 
                className="h-9" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Tous les logements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les logements</SelectItem>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-1 bg-muted rounded-md p-1">
                <Button 
                  size="sm" 
                  variant={currentView === 'month' ? 'default' : 'ghost'} 
                  className="h-7"
                  onClick={() => setCurrentView('month')}
                >
                  Mois
                </Button>
                <Button 
                  size="sm" 
                  variant={currentView === 'property' ? 'default' : 'ghost'} 
                  className="h-7"
                  onClick={() => setCurrentView('property')}
                >
                  Logements
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy', { locale: fr })}</h2>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="h-8" onClick={() => setCurrentDate(new Date())}>
                Aujourd'hui
              </Button>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Confirmé</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>En attente</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span>Terminé</span>
              </div>
            </div>
          </div>
          
          {currentView === 'month' ? renderMonthCalendar() : renderPropertyCalendar()}
        </div>
      </DashboardCard>

      <Dialog open={bookingDetailsOpen} onOpenChange={setBookingDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="py-4 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {properties.find(p => p.id === selectedBooking.propertyId)?.name}
                </h3>
                <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
              </div>
              
              <div>
                <p className="font-medium text-sm">Client:</p>
                <p className="mt-1">{selectedBooking.guestName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm">Arrivée:</p>
                  <p className="mt-1">{format(selectedBooking.checkIn, 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Départ:</p>
                  <p className="mt-1">{format(selectedBooking.checkOut, 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div>
                <p className="font-medium text-sm">Durée:</p>
                <p className="mt-1">
                  {Math.ceil((selectedBooking.checkOut - selectedBooking.checkIn) / (1000 * 60 * 60 * 24))} nuits
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setBookingDetailsOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Calendar;
