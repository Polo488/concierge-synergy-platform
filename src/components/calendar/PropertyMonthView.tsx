
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { HelpCircle, CalendarDays, Euro, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
  addMonths,
  startOfDay,
  differenceInDays,
  getDay,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  onPriceEditRequest?: (propertyId: number, startDate: Date, endDate: Date, currentPrice: number) => void;
}

const CHANNEL_COLORS: Record<string, string> = {
  airbnb: '#FF385C',
  booking: '#003580',
  vrbo: '#3D67B1',
  direct: '#16A34A',
  other: '#6366F1',
};

const CHANNEL_INITIALS: Record<string, string> = {
  airbnb: 'A',
  booking: 'B',
  vrbo: 'V',
  direct: 'D',
};

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Converts JS getDay (0=Sun) to Mon=0 index
function dayToMonIndex(date: Date): number {
  const d = getDay(date);
  return d === 0 ? 6 : d - 1;
}

interface MonthData {
  month: Date;
  weeks: Date[][];
}

function buildMonthData(month: Date): MonthData {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  return { month, weeks };
}

interface BarSegment {
  booking: CalendarBooking;
  startCol: number; // 0-6
  span: number;     // 1-7
  isFirst: boolean;
  isLast: boolean;
  color: string;
}

function getBarColor(channel: string): string {
  return CHANNEL_COLORS[channel?.toLowerCase()] || CHANNEL_COLORS.other;
}

function computeBarSegments(
  week: Date[],
  bookings: CalendarBooking[],
  blockedPeriods: BlockedPeriod[],
  propertyId: number
): BarSegment[] {
  const segments: BarSegment[] = [];
  const weekStart = startOfDay(week[0]);
  const weekEnd = startOfDay(week[6]);

  // Bookings
  const propBookings = bookings.filter(b => b.propertyId === propertyId);
  for (const booking of propBookings) {
    const bStart = startOfDay(booking.checkIn);
    const bEnd = startOfDay(booking.checkOut);

    // Skip if no overlap (checkOut is departure day, don't show bar on checkout day)
    const effectiveEnd = new Date(bEnd.getTime() - 86400000); // last night
    if (effectiveEnd < weekStart || bStart > weekEnd) continue;

    const visStart = bStart < weekStart ? weekStart : bStart;
    const visEnd = effectiveEnd > weekEnd ? weekEnd : effectiveEnd;

    const startCol = dayToMonIndex(visStart);
    const endCol = dayToMonIndex(visEnd);
    const span = endCol - startCol + 1;

    if (span <= 0) continue;

    segments.push({
      booking,
      startCol,
      span,
      isFirst: isSameDay(visStart, bStart),
      isLast: isSameDay(visEnd, effectiveEnd),
      color: getBarColor(booking.channel),
    });
  }

  // Blocked periods as fake bookings
  const propBlocked = blockedPeriods.filter(b => b.propertyId === propertyId);
  for (const blocked of propBlocked) {
    const bStart = startOfDay(blocked.startDate);
    const bEnd = startOfDay(blocked.endDate);
    if (bEnd < weekStart || bStart > weekEnd) continue;

    const visStart = bStart < weekStart ? weekStart : bStart;
    const visEnd = bEnd > weekEnd ? weekEnd : bEnd;
    const startCol = dayToMonIndex(visStart);
    const endCol = dayToMonIndex(visEnd);
    const span = endCol - startCol + 1;
    if (span <= 0) continue;

    segments.push({
      booking: {
        id: blocked.id,
        propertyId: blocked.propertyId,
        guestName: blocked.reason || 'Bloqué',
        checkIn: blocked.startDate,
        checkOut: blocked.endDate,
        channel: 'blocked' as any,
        status: 'confirmed',
        totalPrice: 0,
        color: '#9CA3AF',
      } as CalendarBooking,
      startCol,
      span,
      isFirst: isSameDay(visStart, bStart),
      isLast: isSameDay(visEnd, bEnd),
      color: '#9CA3AF',
    });
  }

  return segments;
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
}) => {
  const today = startOfDay(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Build months: current -2 to current +2, expandable
  const [monthRange, setMonthRange] = useState<{ start: number; end: number }>({ start: -2, end: 2 });

  const months = useMemo(() => {
    const result: MonthData[] = [];
    for (let i = monthRange.start; i <= monthRange.end; i++) {
      result.push(buildMonthData(addMonths(currentMonth, i)));
    }
    return result;
  }, [currentMonth, monthRange]);

  // IntersectionObserver to load more months
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMonthRange(prev => ({ ...prev, end: prev.end + 2 }));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  const navigateMonth = (dir: number) => {
    onMonthChange(addMonths(currentMonth, dir));
  };

  return (
    <div className="flex flex-col w-full bg-white" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-white border-b" style={{ borderColor: '#EEEEEE' }}>
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 min-w-0">
              {property.thumbnail && (
                <img
                  src={property.thumbnail}
                  alt={property.name}
                  className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                />
              )}
              <span className="font-semibold text-sm truncate" style={{ color: '#1A1A2E' }}>
                {property.name}
              </span>
            </div>
          </div>
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-center gap-2 pb-2">
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="h-9 w-9">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold capitalize min-w-[120px] text-center" style={{ color: '#1A1A2E' }}>
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="h-9 w-9">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week day headers */}
        <div className="grid grid-cols-7">
          {WEEK_DAYS.map(d => (
            <div
              key={d}
              className="text-center py-1"
              style={{ fontSize: 11, fontWeight: 500, color: '#9A9AAF', textTransform: 'uppercase' }}
            >
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable months */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden px-0">
        {months.map((md, mi) => (
          <MonthBlock
            key={format(md.month, 'yyyy-MM')}
            monthData={md}
            today={today}
            bookings={bookings}
            blockedPeriods={blockedPeriods}
            propertyId={property.id}
            onBookingClick={onBookingClick}
            onCellClick={(date) => onCellClick(date, property.id)}
            showTitle={mi > 0}
          />
        ))}
        <div ref={sentinelRef} className="h-8" />
      </div>

      {/* Legend */}
      <div
        className="flex-shrink-0 flex items-center justify-center gap-4 bg-white"
        style={{ height: 36, borderTop: '1px solid #EEEEEE' }}
      >
        {[
          { color: '#FF385C', label: 'Airbnb' },
          { color: '#003580', label: 'Booking' },
          { color: '#16A34A', label: 'Direct' },
          { color: '#9CA3AF', label: 'Bloqué' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="flex-shrink-0"
              style={{
                width: 10,
                height: 10,
                borderRadius: item.label === 'Bloqué' ? 2 : '50%',
                backgroundColor: item.color,
              }}
            />
            <span style={{ fontSize: 11, color: '#7A7A8C' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- MonthBlock ----------
interface MonthBlockProps {
  monthData: MonthData;
  today: Date;
  bookings: CalendarBooking[];
  blockedPeriods: BlockedPeriod[];
  propertyId: number;
  onBookingClick: (b: CalendarBooking) => void;
  onCellClick: (date: Date) => void;
  showTitle: boolean;
}

const MonthBlock: React.FC<MonthBlockProps> = React.memo(({
  monthData,
  today,
  bookings,
  blockedPeriods,
  propertyId,
  onBookingClick,
  onCellClick,
  showTitle,
}) => {
  return (
    <div className="pb-4">
      {showTitle && (
        <div className="px-3 pt-6 pb-2">
          <span className="font-bold capitalize" style={{ fontSize: 18, color: '#1A1A2E' }}>
            {format(monthData.month, 'MMMM yyyy', { locale: fr })}
          </span>
        </div>
      )}

      {monthData.weeks.map((week, wi) => {
        const segments = computeBarSegments(week, bookings, blockedPeriods, propertyId);

        return (
          <div key={wi} className="relative" style={{ minHeight: 70 }}>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {week.map((day, di) => {
                const isCurrentMonth = isSameMonth(day, monthData.month);
                const isToday = isSameDay(day, today);

                return (
                  <div
                    key={di}
                    className="relative"
                    style={{
                      minHeight: 70,
                      borderRight: di < 6 ? '1px solid #F0F0F0' : undefined,
                      borderBottom: '1px solid #F0F0F0',
                      backgroundColor: isCurrentMonth ? '#FFFFFF' : '#FAFAFA',
                      padding: '4px 4px',
                      boxSizing: 'border-box',
                      cursor: isCurrentMonth ? 'pointer' : undefined,
                    }}
                    onClick={() => isCurrentMonth && onCellClick(day)}
                  >
                    {isToday ? (
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: '50%',
                          backgroundColor: '#1A1A2E',
                          color: '#FFFFFF',
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {format(day, 'd')}
                      </div>
                    ) : (
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isCurrentMonth ? '#1A1A2E' : '#CCCCCC',
                        }}
                      >
                        {format(day, 'd')}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Reservation bar segments */}
            {segments.map((seg, si) => {
              const borderRadius = seg.isFirst && seg.isLast
                ? '6px'
                : seg.isFirst
                  ? '6px 0 0 6px'
                  : seg.isLast
                    ? '0 6px 6px 0'
                    : '0';

              const channel = (seg.booking.channel || '').toLowerCase();
              const initial = CHANNEL_INITIALS[channel];
              const barWidthPx = seg.span * (100 / 7); // approximate

              return (
                <div
                  key={`${seg.booking.id}-${si}`}
                  style={{
                    position: 'absolute',
                    top: 30,
                    height: 30,
                    left: `calc(${seg.startCol} * (100% / 7) + 2px)`,
                    width: `calc(${seg.span} * (100% / 7) - 4px)`,
                    backgroundColor: seg.color,
                    borderRadius,
                    zIndex: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (channel !== 'blocked') {
                      onBookingClick(seg.booking);
                    }
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      paddingLeft: 8,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minWidth: 0,
                    }}
                  >
                    {seg.booking.guestName}
                  </span>
                  {initial && seg.span >= 2 && (
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginRight: 6,
                      }}
                    >
                      {initial}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

MonthBlock.displayName = 'MonthBlock';
