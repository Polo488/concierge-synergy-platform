
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
  isDaySelected?: (propertyId: number, date: Date) => boolean;
  onDayMouseDown?: (propertyId: number, date: Date, event: React.MouseEvent) => void;
  onDayMouseEnter?: (propertyId: number, date: Date) => void;
  propertyInsights?: PropertyInsight[];
  onInsightClick?: () => void;
  isOddRow?: boolean;
  propColWidth?: number;
  propColCollapsed?: boolean;
  dayCellWidth?: number;
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
  propColWidth = 220,
  propColCollapsed = false,
  dayCellWidth = 40,
}) => {
  const today = startOfDay(new Date());
  const renderedBookingIds = new Set<number>();
  const renderedBlockedIds = new Set<number>();
  const firstVisibleDay = days[0];
  const lastVisibleDay = days[days.length - 1];
  const rowHeight = dayCellWidth >= 52 ? 64 : 56;

  return (
    <div className={cn(
      "flex transition-all duration-200",
      isOddRow ? "bg-muted/[0.02]" : "bg-transparent",
      "hover:bg-accent/10"
    )}>
      {/* Property info - sticky left column */}
      <div 
        className="flex-shrink-0 flex items-center gap-2 px-2 bg-card/80 backdrop-blur-sm sticky left-0 z-20 cursor-pointer hover:bg-accent/30 transition-all duration-200 border-r border-border/20"
        style={{ width: propColWidth, minWidth: propColWidth, height: rowHeight }}
        onClick={() => onPropertyClick?.(property)}
        title={property.name}
      >
        <div className={cn(
          "rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 relative ring-1 ring-border/20",
          propColCollapsed ? "w-8 h-8" : "w-10 h-10"
        )}>
          {property.thumbnail ? (
            <img src={property.thumbnail} alt={property.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
              N/A
            </div>
          )}
          {propertyInsights.length > 0 && (
            <div className="absolute -top-1 -right-1" onClick={(e) => { e.stopPropagation(); onInsightClick?.(); }}>
              <PropertyInsightBadge insights={propertyInsights} compact />
            </div>
          )}
        </div>
        {!propColCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate line-clamp-2 leading-tight" title={property.name}>
              {property.name}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
              {property.capacity} pers. • {property.pricePerNight}€
            </p>
          </div>
        )}
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

          const bookingBlocks: React.ReactNode[] = [];
          
          for (const booking of bookings) {
            const bookingCheckIn = startOfDay(booking.checkIn);
            const bookingCheckOut = startOfDay(booking.checkOut);
            const dayStart = startOfDay(day);
            const isThisCheckInDay = isSameDay(dayStart, bookingCheckIn);
            const isThisCheckOutDay = isSameDay(dayStart, bookingCheckOut);
            
            if (renderedBookingIds.has(booking.id)) continue;
            
            const isCheckInVisible = bookingCheckIn >= firstVisibleDay;
            const shouldRender = isThisCheckInDay || 
              (!isCheckInVisible && dayIndex === 0 && isSameDay(day, firstVisibleDay));
            const isCheckoutOnlyDay = isThisCheckOutDay && !isThisCheckInDay;
            
            if (shouldRender || (isCheckoutOnlyDay && !renderedBookingIds.has(booking.id))) {
              renderedBookingIds.add(booking.id);
              const visibleStart = bookingCheckIn < firstVisibleDay ? firstVisibleDay : bookingCheckIn;
              const visibleEnd = bookingCheckOut > addDays(lastVisibleDay, 1) ? addDays(lastVisibleDay, 1) : bookingCheckOut;
              const visibleDays = differenceInDays(visibleEnd, visibleStart);
              const isStartTruncated = bookingCheckIn < firstVisibleDay;
              const isEndTruncated = bookingCheckOut > addDays(lastVisibleDay, 1);
              const isCheckInDay = isSameDay(visibleStart, bookingCheckIn);
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
                  cellWidth={dayCellWidth}
                />
              );
            }
          }

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
                  cellWidth={dayCellWidth}
                />
              );
            }
          }

          const isEmpty = bookingBlocks.length === 0 && !blocked;

          return (
            <div
              key={dayIndex}
              className={cn(
                "relative transition-all duration-150",
                "border-r border-border/35",
                isPast && !isToday && "bg-muted/[0.03]",
                isWeekend && !isToday && !isPast && "bg-muted/[0.02]",
                isEmpty && "cursor-pointer hover:bg-accent/10",
                isSelected && "ring-2 ring-inset ring-primary/30 bg-primary/[0.08] rounded-sm"
              )}
              style={{ width: dayCellWidth, minWidth: dayCellWidth, height: rowHeight }}
              onMouseDown={(e) => isEmpty && onDayMouseDown?.(property.id, day, e)}
              onMouseEnter={() => onDayMouseEnter?.(property.id, day)}
              onClick={(e) => { if (isEmpty && !e.defaultPrevented) onCellClick(day, property.id); }}
            >
              {isToday && <div className="absolute inset-0 bg-primary/[0.04] pointer-events-none z-0" />}
              {bookingBlocks}
              {blockedBlock}
            </div>
          );
        })}
      </div>
    </div>
  );
};
