
import React from 'react';
import { isSameDay, differenceInDays, startOfDay, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CalendarProperty, CalendarBooking, BlockedPeriod } from '@/types/calendar';
import { BookingBlock } from './BookingBlock';
import { BlockedBlock } from './BlockedBlock';
import { PropertyInsightBadge } from '@/components/insights/PropertyInsightBadge';
import { PropertyInsight } from '@/types/insights';

interface PropertyRowProps {
  property: CalendarProperty;
  days: Date[];
  getBookingsForProperty: (propertyId: number, day: Date) => CalendarBooking[];
  getBlockedForProperty: (propertyId: number, day: Date) => BlockedPeriod | null;
  onBookingClick: (booking: CalendarBooking) => void;
  onCellClick: (date: Date, propertyId: number) => void;
  onPropertyClick?: (property: CalendarProperty) => void;
  onBlockedClick?: (blocked: BlockedPeriod) => void;
  // Multi-day selection props
  isDaySelected?: (propertyId: number, date: Date) => boolean;
  onDayMouseDown?: (propertyId: number, date: Date, event: React.MouseEvent) => void;
  onDayMouseEnter?: (propertyId: number, date: Date) => void;
  // Insights props
  propertyInsights?: PropertyInsight[];
  onInsightClick?: () => void;
  // Alternating row striping
  isOddRow?: boolean;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({
  property,
  days,
  getBookingsForProperty,
  getBlockedForProperty,
  onBookingClick,
  onCellClick,
  onPropertyClick,
  onBlockedClick,
  isDaySelected,
  onDayMouseDown,
  onDayMouseEnter,
  propertyInsights = [],
  onInsightClick,
  isOddRow = false,
}) => {
  const today = startOfDay(new Date());
  
  // Track which bookings/blocks we've already rendered to avoid duplicates
  const renderedBookingIds = new Set<number>();
  const renderedBlockedIds = new Set<number>();

  const firstVisibleDay = days[0];
  const lastVisibleDay = days[days.length - 1];

  return (
    <div className={cn(
      "flex transition-all duration-200 border-b border-border/5",
      isOddRow ? "bg-muted/[0.03]" : "bg-transparent",
      "hover:bg-accent/20"
    )}>
      {/* Property info - fixed left column */}
      <div 
        className="w-[220px] min-w-[220px] flex items-center gap-3 px-4 py-3 bg-transparent sticky left-0 z-20 cursor-pointer hover:bg-accent/30 transition-all duration-200"
        onClick={() => onPropertyClick?.(property)}
        title="Cliquez pour voir le calendrier mensuel"
      >
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 relative ring-1 ring-border/20">
          {property.thumbnail ? (
            <img
              src={property.thumbnail}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              N/A
            </div>
          )}
          {/* Insight badge on thumbnail */}
          {propertyInsights.length > 0 && (
            <div 
              className="absolute -top-1 -right-1"
              onClick={(e) => {
                e.stopPropagation();
                onInsightClick?.();
              }}
            >
              <PropertyInsightBadge 
                insights={propertyInsights} 
                compact 
              />
            </div>
          )}

        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-medium text-foreground truncate" title={property.name}>
              {property.name}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {property.capacity} pers. • {property.pricePerNight}€/nuit
          </p>
        </div>
      </div>

      {/* Days grid */}
      <div className="flex relative">
        {days.map((day, dayIndex) => {
          const isToday = isSameDay(day, today);
          const isPast = day < today && !isToday;
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const isSelected = isDaySelected?.(property.id, day) ?? false;
          
          const bookings = getBookingsForProperty(property.id, day);
          const blocked = getBlockedForProperty(property.id, day);

          // Render booking blocks - can have multiple on same day (checkout + checkin)
          const bookingBlocks: React.ReactNode[] = [];
          
          for (const booking of bookings) {
            const bookingCheckIn = startOfDay(booking.checkIn);
            const bookingCheckOut = startOfDay(booking.checkOut);
            const dayStart = startOfDay(day);
            
            // Determine if this is the check-in day or check-out day for this booking
            const isThisCheckInDay = isSameDay(dayStart, bookingCheckIn);
            const isThisCheckOutDay = isSameDay(dayStart, bookingCheckOut);
            
            // Only render if we haven't rendered this booking yet
            if (renderedBookingIds.has(booking.id)) {
              continue;
            }
            
            // Render on check-in day, OR on first visible day if booking started before
            const isCheckInVisible = bookingCheckIn >= firstVisibleDay;
            const shouldRender = isThisCheckInDay || 
              (!isCheckInVisible && dayIndex === 0 && isSameDay(day, firstVisibleDay));
            
            // Also render if this is a checkout-only day (for the left-half visual)
            const isCheckoutOnlyDay = isThisCheckOutDay && !isThisCheckInDay;
            
            if (shouldRender || (isCheckoutOnlyDay && !renderedBookingIds.has(booking.id))) {
              renderedBookingIds.add(booking.id);
              
              // Calculate the visible portion of the booking
              const visibleStart = bookingCheckIn < firstVisibleDay ? firstVisibleDay : bookingCheckIn;
              const visibleEnd = bookingCheckOut > addDays(lastVisibleDay, 1) ? addDays(lastVisibleDay, 1) : bookingCheckOut;
              const visibleDays = differenceInDays(visibleEnd, visibleStart);
              
              const isStartTruncated = bookingCheckIn < firstVisibleDay;
              const isEndTruncated = bookingCheckOut > addDays(lastVisibleDay, 1);
              
              // Is this the actual check-in day (for left diagonal)?
              const isCheckInDay = isSameDay(visibleStart, bookingCheckIn);
              // Is this the actual check-out day (for right diagonal)?
              const isCheckOutDay = isSameDay(visibleEnd, bookingCheckOut);
              
              bookingBlocks.push(
                <BookingBlock
                  key={booking.id}
                  booking={booking}
                  visibleDays={visibleDays}
                  isCheckInDay={isCheckInDay}
                  isCheckOutDay={isCheckOutDay}
                  isStartTruncated={isStartTruncated}
                  isEndTruncated={isEndTruncated}
                  isPast={booking.checkOut < today}
                  onClick={() => onBookingClick(booking)}
                />
              );
            }
          }

          // Render blocked block
          let blockedBlock = null;
          if (blocked && !renderedBlockedIds.has(blocked.id)) {
            const blockedStart = startOfDay(blocked.startDate);
            const blockedEnd = startOfDay(blocked.endDate);
            
            const isStartVisible = blockedStart >= firstVisibleDay;
            const shouldRender = isSameDay(day, blockedStart) || 
              (!isStartVisible && dayIndex === 0 && isSameDay(day, firstVisibleDay));
            
            if (shouldRender) {
              renderedBlockedIds.add(blocked.id);
              
              const visibleStart = blockedStart < firstVisibleDay ? firstVisibleDay : blockedStart;
              const visibleEnd = blockedEnd > lastVisibleDay ? addDays(lastVisibleDay, 1) : addDays(blockedEnd, 1);
              const visibleDays = differenceInDays(visibleEnd, visibleStart);
              
              const isStartTruncated = blockedStart < firstVisibleDay;
              const isEndTruncated = blockedEnd > lastVisibleDay;
              
              const isStartDay = isSameDay(visibleStart, blockedStart);
              const isEndDay = isSameDay(addDays(visibleEnd, -1), blockedEnd);
              
              blockedBlock = (
                <BlockedBlock
                  key={`blocked-${blocked.id}`}
                  blocked={blocked}
                  visibleDays={visibleDays}
                  isStartDay={isStartDay}
                  isEndDay={isEndDay}
                  isStartTruncated={isStartTruncated}
                  isEndTruncated={isEndTruncated}
                  onClick={() => onBlockedClick?.(blocked)}
                  onCleaningIndicatorClick={() => onBlockedClick?.(blocked)}
                />
              );
            }
          }

          const isEmpty = bookingBlocks.length === 0 && !blocked;

          return (
            <div
              key={dayIndex}
              className={cn(
                "w-10 min-w-[40px] h-14 relative transition-all duration-150",
                "border-r border-border/[0.08]", // Subtle vertical day separator
                isPast && !isToday && "bg-muted/[0.04]",
                isWeekend && !isToday && !isPast && "bg-muted/[0.03]",
                isEmpty && "cursor-pointer hover:bg-accent/20",
                isSelected && "ring-2 ring-inset ring-primary/40 bg-primary/10 rounded-sm"
              )}
              onMouseDown={(e) => isEmpty && onDayMouseDown?.(property.id, day, e)}
              onMouseEnter={() => onDayMouseEnter?.(property.id, day)}
              onClick={(e) => {
                if (isEmpty && !e.defaultPrevented) {
                  onCellClick(day, property.id);
                }
              }}
            >
              {/* Today indicator - very subtle background, lowest z-index */}
              {isToday && (
                <div className="absolute inset-0 bg-primary/[0.04] pointer-events-none z-0" />
              )}
              {/* Reservation blocks - higher z-index, always on top */}
              {bookingBlocks}
              {blockedBlock}
            </div>
          );
        })}
      </div>
    </div>
  );
};
