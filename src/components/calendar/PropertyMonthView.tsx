
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
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
  startOfDay,
  isBefore,
  isAfter
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChannelIcon } from './grid/ChannelIcon';
import type { CalendarProperty, CalendarBooking, BlockedPeriod } from '@/types/calendar';

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
  // Multi-day selection callback
  onPriceEditRequest?: (propertyId: number, startDate: Date, endDate: Date, currentPrice: number) => void;
}

const CHANNEL_COLORS_MAP: Record<string, string> = {
  airbnb: '#FF385C',
  booking: '#003580',
  vrbo: '#3D67B1',
  direct: '#16A34A',
  other: '#6366F1',
};

const PAST_COLOR = '#9CA3AF';

interface DaySelection {
  date: Date;
}

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
  onPriceEditRequest,
}) => {
  const today = startOfDay(new Date());

  // Multi-day selection state
  const [selectedDays, setSelectedDays] = useState<DaySelection[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const selectionStartRef = useRef<Date | null>(null);
  const lastClickedRef = useRef<Date | null>(null);

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

  // Selection helpers
  const isDaySelected = useCallback((date: Date): boolean => {
    const dayStart = startOfDay(date);
    return selectedDays.some(s => isSameDay(startOfDay(s.date), dayStart));
  }, [selectedDays]);

  const getSelectionRange = useCallback((start: Date, end: Date): DaySelection[] => {
    const startDate = startOfDay(start);
    const endDate = startOfDay(end);
    
    const [rangeStart, rangeEnd] = isBefore(startDate, endDate) 
      ? [startDate, endDate] 
      : [endDate, startDate];
    
    const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
    return days.map(date => ({ date }));
  }, []);

  const handleDayMouseDown = useCallback((day: Date, isEmpty: boolean, event: React.MouseEvent) => {
    if (!isEmpty) return;
    event.preventDefault();
    
    const dayStart = startOfDay(day);
    
    if (!event.shiftKey) {
      selectionStartRef.current = dayStart;
      setIsSelecting(true);
      setSelectedDays([{ date: dayStart }]);
    }
  }, []);

  const handleDayMouseEnter = useCallback((day: Date) => {
    if (!isSelecting || !selectionStartRef.current) return;
    
    const dayStart = startOfDay(day);
    const newSelection = getSelectionRange(selectionStartRef.current, dayStart);
    setSelectedDays(newSelection);
  }, [isSelecting, getSelectionRange]);

  const handleDayMouseUp = useCallback(() => {
    if (isSelecting) {
      setIsSelecting(false);
      if (selectedDays.length > 0) {
        lastClickedRef.current = selectedDays[0].date;
      }
    }
  }, [isSelecting, selectedDays]);

  const handleDayClick = useCallback((day: Date, isEmpty: boolean, event: React.MouseEvent) => {
    if (!isEmpty) return;
    
    const dayStart = startOfDay(day);
    
    if (event.shiftKey && lastClickedRef.current) {
      const rangeSelection = getSelectionRange(lastClickedRef.current, dayStart);
      setSelectedDays(rangeSelection);
    } else if (!isSelecting) {
      setSelectedDays([{ date: dayStart }]);
      lastClickedRef.current = dayStart;
    }
  }, [getSelectionRange, isSelecting]);

  // Global mouseup listener
  useEffect(() => {
    if (isSelecting) {
      const handleGlobalMouseUp = () => handleDayMouseUp();
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isSelecting, handleDayMouseUp]);

  // Handle price edit button click
  const handleEditPrices = () => {
    if (selectedDays.length === 0 || !onPriceEditRequest) return;
    
    const sortedDays = [...selectedDays].sort((a, b) => a.date.getTime() - b.date.getTime());
    const startDate = sortedDays[0].date;
    const endDate = sortedDays[sortedDays.length - 1].date;
    const currentPrice = getDailyPrice ? getDailyPrice(property.id, startDate) : property.pricePerNight;
    
    onPriceEditRequest(property.id, startDate, endDate, currentPrice);
  };

  const clearSelection = () => {
    setSelectedDays([]);
    selectionStartRef.current = null;
    lastClickedRef.current = null;
  };

  return (
    <div className="bg-primary/5 rounded-lg border border-primary/20 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-border bg-primary/10 rounded-t-lg gap-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {property.thumbnail ? (
              <img src={property.thumbnail} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">N/A</div>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm md:text-lg font-semibold truncate">{property.name}</h2>
            <p className="text-xs text-muted-foreground">
              {property.capacity} pers. • {property.pricePerNight}€/nuit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedDays.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/20 rounded-lg">
              <span className="text-xs font-medium">
                {selectedDays.length} jour{selectedDays.length > 1 ? 's' : ''}
              </span>
              <Button size="sm" variant="secondary" onClick={handleEditPrices} className="gap-1 h-7 text-xs">
                <Euro className="w-3 h-3" />
                Prix
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection} className="h-7 text-xs">✕</Button>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9 min-h-[44px] min-w-[44px]">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm md:text-lg font-medium min-w-[100px] md:min-w-[180px] text-center capitalize">
              {format(currentMonth, 'MMM yyyy', { locale: fr })}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9 min-h-[44px] min-w-[44px]">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 min-h-[44px] min-w-[44px]">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-2 md:p-4">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-[11px] font-medium text-muted-foreground uppercase py-1.5">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7 gap-0.5">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = isSameDay(day, today);
            const isPast = day < today && !isToday;
            const booking = getBookingForDay(day);
            const blocked = isBlocked(day);
            const isEmpty = !booking && !blocked;
            const isSelected = isDaySelected(day);
            
            const isCheckIn = booking ? isCheckInDay(day, booking) : false;
            const isCheckOut = booking ? isCheckOutDay(day, booking) : false;
            
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
                  "relative min-h-[56px] md:min-h-[90px] border rounded-md p-0.5 md:p-1 transition-colors",
                  isCurrentMonth ? "bg-background" : "bg-muted/30",
                  isToday && "ring-2 ring-primary",
                  isEmpty && isCurrentMonth && "cursor-pointer hover:bg-accent/30",
                  !isCurrentMonth && "opacity-50",
                  isSelected && isEmpty && "ring-2 ring-inset ring-primary bg-primary/20"
                )}
                onMouseDown={(e) => handleDayMouseDown(day, isEmpty && isCurrentMonth, e)}
                onMouseEnter={() => handleDayMouseEnter(day)}
                onClick={(e) => {
                  if (booking) {
                    onBookingClick(booking);
                  } else if (isEmpty && isCurrentMonth) {
                    handleDayClick(day, true, e);
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
                      "absolute inset-x-0 top-7 bottom-6 flex items-center cursor-pointer transition-transform hover:scale-[1.02] overflow-hidden",
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
                    <div className="flex items-center gap-1 w-full h-full overflow-hidden" style={{ padding: '0 8px' }}>
                      <span 
                        className="truncate flex-1 min-w-0"
                        style={{
                          color: '#FFFFFF',
                          fontSize: 11,
                          fontWeight: 600,
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {booking.guestName.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Blocked overlay */}
                {blocked && !booking && (
                  <div 
                    className="absolute inset-x-1 top-7 bottom-6 flex items-center justify-center rounded overflow-hidden"
                    style={{ backgroundColor: '#9CA3AF' }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF' }}>Bloqué</span>
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
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#9CA3AF', borderRadius: 2 }} />
          <span>Bloqué</span>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <div className="w-3 h-3 rounded ring-2 ring-primary bg-primary/20" />
          <span>Sélectionné (glisser ou Shift+clic)</span>
        </div>
      </div>
    </div>
  );
};
