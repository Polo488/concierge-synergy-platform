
import React from 'react';
import { format, isSameDay, differenceInDays, startOfDay, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CalendarProperty, CalendarBooking, BlockedPeriod } from '@/types/calendar';
import { BookingBlock } from './BookingBlock';
import { BlockedBlock } from './BlockedBlock';

interface PropertyRowProps {
  property: CalendarProperty;
  days: Date[];
  getBookingsForProperty: (propertyId: number, day: Date) => CalendarBooking[];
  getBlockedForProperty: (propertyId: number, day: Date) => BlockedPeriod | null;
  onBookingClick: (booking: CalendarBooking) => void;
  onCellClick: (date: Date, propertyId: number) => void;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({
  property,
  days,
  getBookingsForProperty,
  getBlockedForProperty,
  onBookingClick,
  onCellClick,
}) => {
  const today = startOfDay(new Date());
  
  // Track which bookings/blocks we've already rendered to avoid duplicates
  const renderedBookingIds = new Set<number>();
  const renderedBlockedIds = new Set<number>();

  const firstVisibleDay = days[0];
  const lastVisibleDay = days[days.length - 1];

  return (
    <div className="flex border-b border-border hover:bg-accent/20 transition-colors">
      {/* Property info - fixed left column */}
      <div className="w-[220px] min-w-[220px] flex items-center gap-3 px-3 py-2 border-r border-border bg-background sticky left-0 z-10">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate" title={property.name}>
            {property.name}
          </p>
          <p className="text-xs text-muted-foreground">
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
          
          const bookings = getBookingsForProperty(property.id, day);
          const blocked = getBlockedForProperty(property.id, day);

          // Render booking block only on its start date (or first visible day if booking started before)
          let bookingBlock = null;
          if (bookings.length > 0) {
            const booking = bookings[0];
            const bookingStart = startOfDay(booking.checkIn);
            const bookingEnd = startOfDay(booking.checkOut);
            
            // Only render once per booking
            if (!renderedBookingIds.has(booking.id)) {
              const isStartVisible = bookingStart >= firstVisibleDay;
              const shouldRender = isSameDay(day, bookingStart) || 
                (!isStartVisible && dayIndex === 0 && isSameDay(day, firstVisibleDay));
              
              if (shouldRender) {
                renderedBookingIds.add(booking.id);
                
                // Calculate the visible portion of the booking
                const visibleStart = bookingStart < firstVisibleDay ? firstVisibleDay : bookingStart;
                const visibleEnd = bookingEnd > addDays(lastVisibleDay, 1) ? addDays(lastVisibleDay, 1) : bookingEnd;
                const visibleDays = differenceInDays(visibleEnd, visibleStart);
                
                // Calculate offset from current cell if booking started before visible range
                const offsetDays = bookingStart < firstVisibleDay ? differenceInDays(firstVisibleDay, bookingStart) : 0;
                
                bookingBlock = (
                  <BookingBlock
                    key={booking.id}
                    booking={booking}
                    visibleDays={visibleDays}
                    isStartTruncated={bookingStart < firstVisibleDay}
                    isEndTruncated={bookingEnd > addDays(lastVisibleDay, 1)}
                    isPast={booking.checkOut < today}
                    onClick={() => onBookingClick(booking)}
                  />
                );
              }
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
              
              blockedBlock = (
                <BlockedBlock
                  key={`blocked-${blocked.id}`}
                  blocked={blocked}
                  visibleDays={visibleDays}
                  isStartTruncated={blockedStart < firstVisibleDay}
                  isEndTruncated={blockedEnd > lastVisibleDay}
                />
              );
            }
          }

          const isEmpty = bookings.length === 0 && !blocked;

          return (
            <div
              key={dayIndex}
              className={cn(
                "w-10 min-w-[40px] h-12 border-r border-border relative",
                isToday && "bg-primary/5",
                isPast && !isToday && "bg-muted/20",
                isWeekend && !isToday && "bg-muted/10",
                isEmpty && "cursor-pointer hover:bg-accent/30"
              )}
              onClick={() => isEmpty && onCellClick(day, property.id)}
            >
              {bookingBlock}
              {blockedBlock}
            </div>
          );
        })}
      </div>
    </div>
  );
};
