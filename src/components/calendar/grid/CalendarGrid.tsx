
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { isSameDay, startOfDay } from 'date-fns';
import { CalendarGridHeader } from './CalendarGridHeader';
import { PropertyRow } from './PropertyRow';
import { CalendarLegend } from './CalendarLegend';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, DailyPrice } from '@/types/calendar';
import { PropertyInsight } from '@/types/insights';

const DAY_W = 48;
const ROW_H = 64;
const PROP_COL_W = 160;
const PROP_COL_W_MOBILE = 120;
const PROP_COL_COLLAPSED = 44;

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
  const [collapsed, setCollapsed] = useState(isMobile);

  const propColWidth = collapsed ? PROP_COL_COLLAPSED : (isMobile ? PROP_COL_W_MOBILE : PROP_COL_W);

  const pricesMap = useMemo(() => {
    if (!dailyPrices) return undefined;
    const map = new Map<string, number>();
    dailyPrices.forEach(dp => {
      map.set(dp.date.toISOString().split('T')[0], dp.price);
    });
    return map;
  }, [dailyPrices]);

  // Scroll to today on mount
  const todayIndex = useMemo(() => {
    const today = startOfDay(new Date());
    return days.findIndex(d => isSameDay(d, today));
  }, [days]);

  useEffect(() => {
    if (scrollContainerRef.current && todayIndex >= 0) {
      scrollContainerRef.current.scrollLeft = Math.max(0, todayIndex * DAY_W - 80);
    }
  }, [todayIndex]);

  useEffect(() => {
    if (isSelecting && onDayMouseUp) {
      const handleGlobalMouseUp = () => onDayMouseUp();
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isSelecting, onDayMouseUp]);

  return (
    <div className="flex flex-col h-full overflow-hidden rounded-xl border border-border/30 bg-card">
      {/* Sticky header */}
      <div className="flex-shrink-0 sticky top-0 z-[5]" style={{ borderBottom: '1px solid #EEEEEE', background: '#FFFFFF' }}>
        <CalendarGridHeader
          days={days}
          dailyPrices={pricesMap}
          onDayClick={onDayClick}
          propColWidth={propColWidth}
          dayCellWidth={DAY_W}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Scrollable body */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto select-none"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <div style={{ minWidth: propColWidth + days.length * DAY_W }}>
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
                propColCollapsed={collapsed}
                dayCellWidth={DAY_W}
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
