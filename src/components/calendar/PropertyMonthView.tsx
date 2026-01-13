
import React, { useMemo } from 'react';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  format, 
  isWithinInterval,
  addDays,
  differenceInDays,
  startOfDay
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from './grid/ChannelIcon';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, CHANNEL_COLORS } from '@/types/calendar';

interface PropertyMonthViewProps {
  property: CalendarProperty;
  bookings: CalendarBooking[];
  blockedPeriods: BlockedPeriod[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onClose: () => void;
  onBookingClick: (booking: CalendarBooking) => void;
  onCellClick: (date: Date, propertyId: number) => void;
  getDailyPrice?: (propertyId: number, date: Date) => number;
}

const CHANNEL_COLORS_MAP: Record<string, string> = {
  airbnb: '#FF5A5F',
  booking: '#003580',
  vrbo: '#3D67B1',
  direct: '#10B981',
  other: '#6B7280',
};

const PAST_COLOR = '#9CA3AF';

export const PropertyMonthView: React.FC<PropertyMonthViewProps> = ({
  property,
  bookings,
  blockedPeriods,
  currentMonth,
  onMonthChange,
  onClose,
  onBookingClick,
  onCellClick,
  getDailyPrice,
}) => {
  const today = startOfDay(new Date());

  // Generate calendar days for the month grid
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  // Get property bookings for the current month view
  const propertyBookings = useMemo(() => {
    const firstDay = calendarDays[0];
    const lastDay = calendarDays[calendarDays.length - 1];
    
    return bookings.filter(b => {
      if (b.propertyId !== property.id) return false;
      const checkIn = startOfDay(b.checkIn);
      const checkOut = startOfDay(b.checkOut);
      // Include if any part of booking overlaps with visible range
      return checkIn <= lastDay && checkOut >= firstDay;
    });
  }, [bookings, property.id, calendarDays]);

  // Get blocked periods for the property
  const propertyBlocked = useMemo(() => {
    const firstDay = calendarDays[0];
    const lastDay = calendarDays[calendarDays.length - 1];
    
    return blockedPeriods.filter(b => {
      if (b.propertyId !== property.id) return false;
      const start = startOfDay(b.startDate);
      const end = startOfDay(b.endDate);
      return start <= lastDay && end >= firstDay;
    });
  }, [blockedPeriods, property.id, calendarDays]);

  // Get booking info for a specific day
  const getBookingForDay = (day: Date): CalendarBooking | null => {
    const dayStart = startOfDay(day);
    return propertyBookings.find(b => {
      const checkIn = startOfDay(b.checkIn);
      const checkOut = startOfDay(b.checkOut);
      // Include check-in to check-out day (checkout day shows departure)
      return dayStart >= checkIn && dayStart <= checkOut;
    }) || null;
  };

  // Check if day is blocked
  const isBlocked = (day: Date): BlockedPeriod | null => {
    const dayStart = startOfDay(day);
    return propertyBlocked.find(b => {
      const start = startOfDay(b.startDate);
      const end = startOfDay(b.endDate);
      return isWithinInterval(dayStart, { start, end });
    }) || null;
  };

  // Check if this is check-in day
  const isCheckInDay = (day: Date, booking: CalendarBooking): boolean => {
    return isSameDay(startOfDay(day), startOfDay(booking.checkIn));
  };

  // Check if this is check-out day
  const isCheckOutDay = (day: Date, booking: CalendarBooking): boolean => {
    return isSameDay(startOfDay(day), startOfDay(booking.checkOut));
  };

  // Get color for booking
  const getBookingColor = (booking: CalendarBooking, isPast: boolean): string => {
    if (isPast) return PAST_COLOR;
    return CHANNEL_COLORS_MAP[booking.channel] || CHANNEL_COLORS_MAP.other;
  };

  // Navigate months
  const prevMonth = () => {
    onMonthChange(addDays(startOfMonth(currentMonth), -1));
  };

  const nextMonth = () => {
    onMonthChange(addDays(endOfMonth(currentMonth), 1));
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Group days into weeks
  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  return (
    <div className="bg-primary/5 rounded-lg border border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary/10 rounded-t-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
            {property.thumbnail ? (
              <img
                src={property.thumbnail}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                N/A
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{property.name}</h2>
            <p className="text-sm text-muted-foreground">
              {property.capacity} personnes • {property.pricePerNight}€/nuit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[180px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, today);
            const isPast = day < today && !isToday;
            const booking = getBookingForDay(day);
            const blocked = isBlocked(day);
            const isEmpty = !booking && !blocked;
            
            const isCheckIn = booking ? isCheckInDay(day, booking) : false;
            const isCheckOut = booking ? isCheckOutDay(day, booking) : false;
            const isMiddle = booking && !isCheckIn && !isCheckOut;
            
            const dailyPrice = getDailyPrice ? getDailyPrice(property.id, day) : property.pricePerNight;

            // Determine bevel clip path for booking overlay
            const getBevelClipPath = () => {
              const bevelSize = 14;
              if (isCheckIn && isCheckOut) {
                // Single day booking - both bevels
                return `polygon(${bevelSize}px 0, 100% 0, calc(100% - ${bevelSize}px) 100%, 0 100%)`;
              } else if (isCheckIn) {
                // Left bevel only
                return `polygon(${bevelSize}px 0, 100% 0, 100% 100%, 0 100%)`;
              } else if (isCheckOut) {
                // Right bevel only
                return `polygon(0 0, 100% 0, calc(100% - ${bevelSize}px) 100%, 0 100%)`;
              }
              return undefined;
            };

            return (
              <div
                key={index}
                className={cn(
                  "relative min-h-[90px] border rounded-md p-1 transition-colors",
                  isCurrentMonth ? "bg-background" : "bg-muted/30",
                  isToday && "ring-2 ring-primary",
                  isEmpty && isCurrentMonth && "cursor-pointer hover:bg-accent/30",
                  !isCurrentMonth && "opacity-50"
                )}
                onClick={() => {
                  if (booking) {
                    onBookingClick(booking);
                  } else if (isEmpty && isCurrentMonth) {
                    onCellClick(day, property.id);
                  }
                }}
              >
                {/* Day number */}
                <div className={cn(
                  "text-sm font-medium",
                  isToday ? "text-primary" : "text-foreground"
                )}>
                  {format(day, 'd')}
                </div>

                {/* Booking overlay */}
                {booking && (
                  <div 
                    className={cn(
                      "absolute inset-x-0 top-7 bottom-6 flex flex-col items-start justify-center px-2 cursor-pointer transition-transform hover:scale-[1.02]",
                      isCheckIn && "ml-1",
                      isCheckOut && "mr-1"
                    )}
                    style={{
                      backgroundColor: getBookingColor(booking, isPast && booking.checkOut < today),
                      clipPath: getBevelClipPath(),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookingClick(booking);
                    }}
                  >
                    <div className="flex items-center gap-1 text-white">
                      <ChannelIcon channel={booking.channel} className="w-3 h-3" />
                      <span className="text-xs font-medium truncate max-w-[60px]">
                        {booking.guestName.split(' ')[0]}
                      </span>
                    </div>
                    {booking.guestsCount && (
                      <span className="text-[10px] text-white/80">
                        {booking.guestsCount} pers.
                      </span>
                    )}
                  </div>
                )}

                {/* Blocked overlay */}
                {blocked && !booking && (
                  <div 
                    className="absolute inset-x-1 top-7 bottom-6 flex items-center justify-center bg-muted rounded"
                  >
                    <span className="text-xs text-muted-foreground">Bloqué</span>
                  </div>
                )}

                {/* Daily price at bottom */}
                <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                  <span className={cn(
                    "text-xs font-medium",
                    booking ? "text-muted-foreground/60" : "text-muted-foreground"
                  )}>
                    {dailyPrice}€
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: CHANNEL_COLORS_MAP.airbnb }} />
          <span>Airbnb</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: CHANNEL_COLORS_MAP.booking }} />
          <span>Booking</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: CHANNEL_COLORS_MAP.direct }} />
          <span>Direct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted border" />
          <span>Bloqué</span>
        </div>
      </div>
    </div>
  );
};
