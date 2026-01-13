
import React, { useRef } from 'react';
import { CalendarGridHeader } from './CalendarGridHeader';
import { PropertyRow } from './PropertyRow';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, DailyPrice } from '@/types/calendar';

interface CalendarGridProps {
  properties: CalendarProperty[];
  days: Date[];
  dailyPrices?: DailyPrice[];
  getBookingsForProperty: (propertyId: number, day: Date) => CalendarBooking[];
  getBlockedForProperty: (propertyId: number, day: Date) => BlockedPeriod | null;
  onBookingClick: (booking: CalendarBooking) => void;
  onCellClick: (date: Date, propertyId: number) => void;
  onDayClick?: (date: Date) => void;
  onPropertyClick?: (property: CalendarProperty) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  properties,
  days,
  dailyPrices,
  getBookingsForProperty,
  getBlockedForProperty,
  onBookingClick,
  onCellClick,
  onDayClick,
  onPropertyClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Convert daily prices to a Map for quick lookup
  const pricesMap = React.useMemo(() => {
    if (!dailyPrices) return undefined;
    const map = new Map<string, number>();
    dailyPrices.forEach(dp => {
      const key = `${dp.date.toISOString().split('T')[0]}`;
      map.set(key, dp.price);
    });
    return map;
  }, [dailyPrices]);

  return (
    <div 
      ref={scrollContainerRef}
      className="border border-border rounded-lg overflow-auto bg-background"
      style={{ maxHeight: 'calc(100vh - 280px)' }}
    >
      <div className="min-w-max">
        <CalendarGridHeader 
          days={days} 
          dailyPrices={pricesMap}
          onDayClick={onDayClick}
        />
        
        <div className="divide-y divide-border">
          {properties.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Aucun logement trouvé
            </div>
          ) : (
            properties.map((property) => (
              <PropertyRow
                key={property.id}
                property={property}
                days={days}
                getBookingsForProperty={getBookingsForProperty}
                getBlockedForProperty={getBlockedForProperty}
                onBookingClick={onBookingClick}
                onCellClick={onCellClick}
                onPropertyClick={onPropertyClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
