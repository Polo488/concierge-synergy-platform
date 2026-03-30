
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
  addMonths,
  subMonths,
  startOfDay,
  differenceInCalendarDays,
  getDay,
  isWithinInterval,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarLegend } from './grid/CalendarLegend';
import type { CalendarProperty, CalendarBooking, BlockedPeriod, BookingChannel } from '@/types/calendar';

interface PropertyMonthViewProps {
  property: CalendarProperty;
  bookings: CalendarBooking[];
  blockedPeriods: BlockedPeriod[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onClose: () => void;
  onBookingClick: (booking: CalendarBooking) => void;
  onCellClick: (date: Date, propertyId: number) => void;
  properties?: CalendarProperty[];
  onPropertyChange?: (property: CalendarProperty) => void;
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
  other: '?',
};

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// Convert JS getDay (0=Sun) to Mon-based (0=Mon, 6=Sun)
const dayToMonIndex = (date: Date): number => {
  const d = getDay(date);
  return d === 0 ? 6 : d - 1;
};

interface BookingBarSegment {
  booking: CalendarBooking;
  startCol: number;
  span: number;
  isStart: boolean;
  isEnd: boolean;
  row: number; // for stacking
}

interface BlockBarSegment {
  block: BlockedPeriod;
  startCol: number;
  span: number;
  isStart: boolean;
  isEnd: boolean;
  row: number;
}

// ─── MonthGrid component ───
const MonthGrid: React.FC<{
  month: Date;
  property: CalendarProperty;
  bookings: CalendarBooking[];
  blockedPeriods: BlockedPeriod[];
  onBookingClick: (b: CalendarBooking) => void;
  onCellClick: (date: Date, propertyId: number) => void;
  getDailyPrice?: (propertyId: number, date: Date) => number;
  isMobile: boolean;
}> = ({ month, property, bookings, blockedPeriods, onBookingClick, onCellClick, getDailyPrice, isMobile }) => {
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const weeks: Date[][] = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }

  // Filter bookings for this property + month range
  const propBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.propertyId !== property.id) return false;
      const ci = startOfDay(b.checkIn);
      const co = startOfDay(b.checkOut);
      return ci <= calEnd && co >= calStart;
    });
  }, [bookings, property.id, calStart, calEnd]);

  const propBlocked = useMemo(() => {
    return blockedPeriods.filter(b => {
      if (b.propertyId !== property.id) return false;
      const s = startOfDay(b.startDate);
      const e = startOfDay(b.endDate);
      return s <= calEnd && e >= calStart;
    });
  }, [blockedPeriods, property.id, calStart, calEnd]);

  // For each week, compute bar segments
  const getSegments = useCallback((week: Date[]): { bookingSegs: BookingBarSegment[]; blockSegs: BlockBarSegment[] } => {
    const weekStart = startOfDay(week[0]);
    const weekEnd = startOfDay(week[6]);

    const bookingSegs: BookingBarSegment[] = [];
    for (const b of propBookings) {
      const ci = startOfDay(b.checkIn);
      const co = startOfDay(b.checkOut);
      // Booking occupies from checkIn to checkOut-1 (last night)
      const lastNight = startOfDay(new Date(co.getTime() - 86400000));
      if (lastNight < weekStart || ci > weekEnd) continue;

      const segStart = ci < weekStart ? weekStart : ci;
      const segEnd = lastNight > weekEnd ? weekEnd : lastNight;
      const startCol = dayToMonIndex(segStart);
      const endCol = dayToMonIndex(segEnd);
      const span = endCol - startCol + 1;

      bookingSegs.push({
        booking: b,
        startCol,
        span,
        isStart: isSameDay(segStart, ci),
        isEnd: isSameDay(segEnd, lastNight),
        row: 0,
      });
    }

    const blockSegs: BlockBarSegment[] = [];
    for (const bl of propBlocked) {
      const s = startOfDay(bl.startDate);
      const e = startOfDay(bl.endDate);
      if (e < weekStart || s > weekEnd) continue;

      const segStart = s < weekStart ? weekStart : s;
      const segEnd = e > weekEnd ? weekEnd : e;
      const startCol = dayToMonIndex(segStart);
      const endCol = dayToMonIndex(segEnd);
      const span = endCol - startCol + 1;

      // Check if any booking covers these days
      const isOverlapped = propBookings.some(b => {
        const ci = startOfDay(b.checkIn);
        const lastNight = startOfDay(new Date(startOfDay(b.checkOut).getTime() - 86400000));
        return ci <= segEnd && lastNight >= segStart;
      });
      if (isOverlapped) continue;

      blockSegs.push({
        block: bl,
        startCol,
        span,
        isStart: isSameDay(segStart, s),
        isEnd: isSameDay(segEnd, e),
        row: 0,
      });
    }

    // Simple stacking: assign rows to avoid overlap
    const allSegs = [...bookingSegs.map((s, i) => ({ idx: i, type: 'b' as const, startCol: s.startCol, span: s.span })),
                     ...blockSegs.map((s, i) => ({ idx: i, type: 'bl' as const, startCol: s.startCol, span: s.span }))];
    allSegs.sort((a, b) => a.startCol - b.startCol || b.span - a.span);

    const rows: { end: number }[] = [];
    for (const seg of allSegs) {
      let placed = false;
      for (let r = 0; r < rows.length; r++) {
        if (rows[r].end <= seg.startCol) {
          rows[r].end = seg.startCol + seg.span;
          if (seg.type === 'b') bookingSegs[seg.idx].row = r;
          else blockSegs[seg.idx].row = r;
          placed = true;
          break;
        }
      }
      if (!placed) {
        const r = rows.length;
        rows.push({ end: seg.startCol + seg.span });
        if (seg.type === 'b') bookingSegs[seg.idx].row = r;
        else blockSegs[seg.idx].row = r;
      }
    }

    return { bookingSegs, blockSegs };
  }, [propBookings, propBlocked]);

  // Check if a day is covered by a booking or block
  const isDayCovered = useCallback((day: Date): boolean => {
    const d = startOfDay(day);
    for (const b of propBookings) {
      const ci = startOfDay(b.checkIn);
      const lastNight = startOfDay(new Date(startOfDay(b.checkOut).getTime() - 86400000));
      if (d >= ci && d <= lastNight) return true;
    }
    for (const bl of propBlocked) {
      if (d >= startOfDay(bl.startDate) && d <= startOfDay(bl.endDate)) return true;
    }
    return false;
  }, [propBookings, propBlocked]);

  const cellH = isMobile ? 60 : 72;
  const barH = isMobile ? 22 : 28;
  const barTop = isMobile ? 26 : 32;
  const barFontSize = isMobile ? 10 : 12;
  const dayFontSize = isMobile ? 11 : 13;

  return (
    <div className="w-full">
      {/* Month title */}
      <div style={{ margin: '24px 16px 12px 16px', fontSize: 20, fontWeight: 700, color: '#1A1A2E' }}>
        {format(month, 'MMM yyyy', { locale: fr }).replace(/^./, c => c.toUpperCase())}
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 w-full" style={{ borderBottom: '1px solid #EEEEEE' }}>
        {WEEK_DAYS.map(d => (
          <div key={d} style={{ height: 28, fontSize: 11, color: '#9A9AAF', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Week rows */}
      {weeks.map((week, wi) => {
        const { bookingSegs, blockSegs } = getSegments(week);
        const maxRow = Math.max(0, ...bookingSegs.map(s => s.row), ...blockSegs.map(s => s.row));
        const extraRows = maxRow > 0 ? maxRow : 0;
        const rowH = cellH + extraRows * (barH + 4);

        return (
          <div key={wi} className="grid grid-cols-7 w-full relative" style={{ minHeight: rowH, borderBottom: '1px solid #F0F0F0' }}>
            {/* Day cells */}
            {week.map((day, di) => {
              const inMonth = isSameMonth(day, month);
              const isToday = isSameDay(day, today);
              const covered = isDayCovered(day);
              const price = getDailyPrice ? getDailyPrice(property.id, day) : property.pricePerNight;

              return (
                <div
                  key={di}
                  style={{
                    minHeight: rowH,
                    borderRight: di < 6 ? '1px solid #F0F0F0' : undefined,
                    padding: '6px 4px',
                    boxSizing: 'border-box',
                    position: 'relative',
                    background: !inMonth ? '#FAFAFA' : isToday ? 'rgba(255,92,26,0.04)' : '#FFFFFF',
                    cursor: inMonth && !covered ? 'pointer' : 'default',
                  }}
                  onClick={() => {
                    if (inMonth && !covered) onCellClick(day, property.id);
                  }}
                >
                  {/* Day number */}
                  {isToday ? (
                    <div style={{
                      position: 'absolute', top: 6, left: 6,
                      width: 24, height: 24, borderRadius: '50%',
                      backgroundColor: '#FF5C1A', color: '#FFFFFF',
                      fontSize: dayFontSize, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {format(day, 'd')}
                    </div>
                  ) : (
                    <div style={{
                      position: 'absolute', top: 6, left: 6,
                      fontSize: dayFontSize, fontWeight: 600,
                      color: inMonth ? '#1A1A2E' : '#CCCCCC',
                    }}>
                      {format(day, 'd')}
                    </div>
                  )}

                  {/* Price on free days (desktop only) */}
                  {!isMobile && inMonth && !covered && (
                    <div style={{
                      position: 'absolute', bottom: 4, left: 0, right: 0,
                      textAlign: 'center', fontSize: 10, color: '#9A9AAF',
                    }}>
                      {price}€
                    </div>
                  )}
                </div>
              );
            })}

            {/* Booking bars - absolutely positioned */}
            {bookingSegs.map((seg, si) => {
              const color = CHANNEL_COLORS[seg.booking.channel] || CHANNEL_COLORS.other;
              const initial = CHANNEL_INITIALS[seg.booking.channel] || '?';
              const widthPercent = (seg.span / 7) * 100;
              const leftPercent = (seg.startCol / 7) * 100;

              const borderRadius = [
                seg.isStart ? 6 : 0,
                seg.isEnd ? 6 : 0,
                seg.isEnd ? 6 : 0,
                seg.isStart ? 6 : 0,
              ].map(v => v + 'px').join(' ');

              return (
                <div
                  key={`b-${si}`}
                  onClick={(e) => { e.stopPropagation(); onBookingClick(seg.booking); }}
                  style={{
                    position: 'absolute',
                    top: barTop + seg.row * (barH + 4),
                    left: `calc(${leftPercent}% + 2px)`,
                    width: `calc(${widthPercent}% - 4px)`,
                    height: barH,
                    backgroundColor: color,
                    borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    zIndex: 2,
                    cursor: 'pointer',
                    borderLeft: seg.isStart ? '3px solid rgba(0,0,0,0.2)' : undefined,
                    borderRight: seg.isEnd ? '3px solid rgba(0,0,0,0.2)' : undefined,
                  }}
                >
                  <span style={{
                    color: '#FFFFFF', fontSize: barFontSize, fontWeight: 600,
                    paddingLeft: 8, whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', flex: 1, minWidth: 0,
                  }}>
                    {seg.booking.guestName}
                  </span>
                  {widthPercent > 15 && (
                    <span style={{
                      width: 16, height: 16, borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: '#FFFFFF',
                      marginRight: 6, flexShrink: 0,
                    }}>
                      {initial}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Block bars */}
            {blockSegs.map((seg, si) => {
              const widthPercent = (seg.span / 7) * 100;
              const leftPercent = (seg.startCol / 7) * 100;
              const borderRadius = [
                seg.isStart ? 6 : 0, seg.isEnd ? 6 : 0,
                seg.isEnd ? 6 : 0, seg.isStart ? 6 : 0,
              ].map(v => v + 'px').join(' ');

              return (
                <div
                  key={`bl-${si}`}
                  style={{
                    position: 'absolute',
                    top: barTop + seg.row * (barH + 4),
                    left: `calc(${leftPercent}% + 2px)`,
                    width: `calc(${widthPercent}% - 4px)`,
                    height: barH,
                    backgroundColor: '#9CA3AF',
                    borderRadius,
                    display: 'flex',
                    alignItems: 'center',
                    overflow: 'hidden',
                    zIndex: 2,
                  }}
                >
                  <span style={{
                    color: '#FFFFFF', fontSize: barFontSize, fontWeight: 600,
                    paddingLeft: 8, whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', flex: 1,
                  }}>
                    Bloqué
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ─── Main full-screen component ───
export const PropertyMonthView: React.FC<PropertyMonthViewProps> = ({
  property,
  bookings,
  blockedPeriods,
  currentMonth,
  onMonthChange,
  onClose,
  onBookingClick,
  onCellClick,
  properties,
  onPropertyChange,
  getDailyPrice,
  onPriceEditRequest,
}) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Generate months: 2 past + current + 2 future initially, grow on scroll
  const [monthRange, setMonthRange] = useState<{ past: number; future: number }>({ past: 2, future: 2 });

  const months = useMemo(() => {
    const result: Date[] = [];
    const now = new Date();
    for (let i = -monthRange.past; i <= monthRange.future; i++) {
      result.push(startOfMonth(addMonths(now, i)));
    }
    return result;
  }, [monthRange]);

  // Scroll to current month on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      currentMonthRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer to load more months
  const bottomSentinel = useRef<HTMLDivElement>(null);
  const topSentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (entry.target === bottomSentinel.current) {
            setMonthRange(prev => ({ ...prev, future: prev.future + 2 }));
          }
        }
      }
    }, { rootMargin: '200px' });

    if (bottomSentinel.current) observer.observe(bottomSentinel.current);
    return () => observer.disconnect();
  }, []);

  const allProperties = properties || [property];

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      {/* Sticky header */}
      <div
        className="flex items-center justify-between flex-shrink-0"
        style={{
          height: isMobile ? 48 : 56,
          borderBottom: '1px solid #EEEEEE',
          padding: '0 16px',
          backgroundColor: '#FFFFFF',
          zIndex: 20,
        }}
      >
        {/* Left: back button */}
        <button
          onClick={onClose}
          style={{
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ChevronLeft style={{ width: 20, height: 20, color: '#1A1A2E' }} />
        </button>

        {/* Center: property selector */}
        <div className="relative" style={{ flex: '0 1 auto', minWidth: 0 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#F7F7F9', border: '1px solid #EEEEEE',
              borderRadius: 99, height: 36, padding: '0 12px',
              cursor: 'pointer', maxWidth: 260,
            }}
          >
            {property.thumbnail && (
              <img src={property.thumbnail} alt="" style={{ width: 24, height: 24, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
            )}
            <span style={{
              fontSize: 13, fontWeight: 600, color: '#1A1A2E',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              maxWidth: 160,
            }}>
              {property.name}
            </span>
            <ChevronDown style={{ width: 16, height: 16, color: '#9A9AAF', flexShrink: 0 }} />
          </button>

          {/* Dropdown */}
          {dropdownOpen && onPropertyChange && (
            <div
              className="absolute top-full left-1/2 mt-1"
              style={{
                transform: 'translateX(-50%)',
                backgroundColor: '#FFFFFF',
                border: '1px solid #EEEEEE',
                borderRadius: 12,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 50,
                maxHeight: 300,
                overflowY: 'auto',
                width: 260,
              }}
            >
              {allProperties.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onPropertyChange(p);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 12px', width: '100%',
                    background: p.id === property.id ? '#F7F7F9' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1A1A2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: placeholder for action icons */}
        <div style={{ width: 40 }} />
      </div>

      {/* Scrollable months container */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: 80,
        }}
      >
        <div ref={topSentinel} style={{ height: 1 }} />

        {months.map((m, i) => {
          const isCurrentMonth = isSameMonth(m, new Date());
          return (
            <div key={format(m, 'yyyy-MM')} ref={isCurrentMonth ? currentMonthRef : undefined}>
              <MonthGrid
                month={m}
                property={property}
                bookings={bookings}
                blockedPeriods={blockedPeriods}
                onBookingClick={onBookingClick}
                onCellClick={onCellClick}
                getDailyPrice={getDailyPrice}
                isMobile={isMobile}
              />
            </div>
          );
        })}

        <div ref={bottomSentinel} style={{ height: 1 }} />
      </div>

      {/* Legend */}
      <CalendarLegend />

      {/* Close dropdown on outside click */}
      {dropdownOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 49 }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};
