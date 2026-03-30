
import React, { useRef, useEffect, useState } from 'react';
import { CalendarGridHeader } from './CalendarGridHeader';
import { PropertyRow } from './PropertyRow';
import { CalendarLegend } from './CalendarLegend';
import { useIsMobile, useIsTablet } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, DailyPrice } from '@/types/calendar';
import { PropertyInsight } from '@/types/insights';

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
  onBlockedClick?: (blocked: BlockedPeriod) => void;
  isDaySelected?: (propertyId: number, date: Date) => boolean;
  onDayMouseDown?: (propertyId: number, date: Date, event: React.MouseEvent) => void;
  onDayMouseEnter?: (propertyId: number, date: Date) => void;
  onDayMouseUp?: () => void;
  isSelecting?: boolean;
  getInsightsForProperty?: (propertyId: number) => PropertyInsight[];
  onInsightClick?: () => void;
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
  onBlockedClick,
  isDaySelected,
  onDayMouseDown,
  onDayMouseEnter,
  onDayMouseUp,
  isSelecting,
  getInsightsForProperty,
  onInsightClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [propertyColCollapsed, setPropertyColCollapsed] = useState(isMobile);

  const pricesMap = React.useMemo(() => {
    if (!dailyPrices) return undefined;
    const map = new Map<string, number>();
    dailyPrices.forEach(dp => {
      const key = `${dp.date.toISOString().split('T')[0]}`;
      map.set(key, dp.price);
    });
    return map;
  }, [dailyPrices]);

  useEffect(() => {
    if (isSelecting && onDayMouseUp) {
      const handleGlobalMouseUp = () => onDayMouseUp();
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isSelecting, onDayMouseUp]);

  // Responsive property column width
  const propColWidth = propertyColCollapsed 
    ? (isMobile ? 44 : 56)
    : (isMobile ? 110 : isTablet ? 180 : 220);

  // Day cell width
  const dayCellWidth = isMobile ? 44 : 52;

  return (
    <div 
      ref={scrollContainerRef}
      className="glass-panel rounded-2xl overflow-auto select-none h-full relative"
      style={{ touchAction: 'pan-x pan-y' }}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setPropertyColCollapsed(!propertyColCollapsed)}
        className="absolute top-2 z-30 bg-card border rounded-full p-1 shadow-sm hover:bg-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        style={{ left: propColWidth - 14 }}
      >
        {propertyColCollapsed 
          ? <ChevronRight className="w-3 h-3" /> 
          : <ChevronLeft className="w-3 h-3" />
        }
      </button>

      <div style={{ minWidth: propColWidth + days.length * dayCellWidth }}>
        <CalendarGridHeader 
          days={days} 
          dailyPrices={pricesMap}
          onDayClick={onDayClick}
          propColWidth={propColWidth}
          dayCellWidth={dayCellWidth}
        />
        
        <div className="divide-y divide-border/35">
          {properties.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Aucun logement trouvé
            </div>
          ) : (
            properties.map((property, index) => (
              <PropertyRow
                key={property.id}
                property={property}
                days={days}
                getBookingsForProperty={getBookingsForProperty}
                getBlockedForProperty={getBlockedForProperty}
                onBookingClick={onBookingClick}
                onCellClick={onCellClick}
                onPropertyClick={onPropertyClick}
                onBlockedClick={onBlockedClick}
                isDaySelected={isDaySelected}
                onDayMouseDown={onDayMouseDown}
                onDayMouseEnter={onDayMouseEnter}
                propertyInsights={getInsightsForProperty?.(property.id)}
                onInsightClick={onInsightClick}
                isOddRow={index % 2 === 1}
                propColWidth={propColWidth}
                propColCollapsed={propertyColCollapsed}
                dayCellWidth={dayCellWidth}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <CalendarLegend />
    </div>
  );
};
