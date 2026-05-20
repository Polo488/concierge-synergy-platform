
import React, { useMemo } from 'react';
import { isSameDay, differenceInDays, startOfDay, addDays } from 'date-fns';
import { Puzzle, ArrowDownRight } from 'lucide-react';
import type { CalendarProperty, CalendarBooking, BlockedPeriod } from '@/types/calendar';
import type { BlockRequest } from '@/types/blockRequest';
import { BookingBlock } from './BookingBlock';
import { BlockedBlock } from './BlockedBlock';
import { PendingBlockBlock } from './PendingBlockBlock';
import { PropertyInsightBadge } from '@/components/insights/PropertyInsightBadge';
import { PropertyInsight } from '@/types/insights';
import type { RMRulesState } from './RMRulesButton';


const ROW_H = 56;

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
  activeLayer?: 'bookings' | 'pricing' | 'cleaning' | 'cleaning-only';
  rmRules?: RMRulesState;
  /** Owner read-only view: hides RM hints, disables empty-cell click for new bookings (parent decides). */
  readOnly?: boolean;
  getPendingBlockForProperty?: (propertyId: number, day: Date) => BlockRequest | null;
  onPendingBlockClick?: (request: BlockRequest) => void;
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
  propColWidth = 130,
  propColCollapsed = false,
  dayCellWidth = 48,
  activeLayer = 'bookings',
  rmRules,
}) => {
  const today = startOfDay(new Date());
  const renderedBookingIds = new Set<number>();
  const renderedBlockedIds = new Set<number>();
  const firstVisibleDay = days[0];
  const lastVisibleDay = days[days.length - 1];

  // Compute RM rules info per visible cell index: gap fill + min stay release
  const cellRMInfo = useMemo(() => {
    const info = new Map<number, { type: 'gap' | 'release'; minStay: number }>();
    if (!rmRules) return info;
    const todayIdx = days.findIndex((d) => isSameDay(startOfDay(d), today));

    // Walk and find empty segments
    const occupied: boolean[] = days.map((day) =>
      getBookingsForProperty(property.id, day).length > 0 || !!getBlockedForProperty(property.id, day)
    );
    const segments: Array<{ start: number; end: number; len: number }> = [];
    let s = -1;
    for (let i = 0; i < occupied.length; i++) {
      if (!occupied[i]) {
        if (s < 0) s = i;
      } else if (s >= 0) {
        segments.push({ start: s, end: i - 1, len: i - s });
        s = -1;
      }
    }
    if (s >= 0) segments.push({ start: s, end: occupied.length - 1, len: occupied.length - s });

    segments.forEach((seg) => {
      const isInteriorGap = seg.start > 0 && seg.end < occupied.length - 1;
      for (let i = seg.start; i <= seg.end; i++) {
        let minStay = rmRules.defaultMinStay;
        let type: 'gap' | 'release' | null = null;
        if (rmRules.gapFillEnabled && isInteriorGap && seg.len < rmRules.defaultMinStay) {
          minStay = seg.len;
          type = 'gap';
        }
        if (rmRules.releaseEnabled && todayIdx >= 0) {
          const delta = i - todayIdx;
          if (delta >= 0 && delta <= rmRules.releaseDaysBefore && rmRules.releaseTarget < minStay) {
            minStay = rmRules.releaseTarget;
            type = 'release';
          }
        }
        if (type) info.set(i, { type, minStay });
      }
    });
    return info;
  }, [rmRules, days, property.id, getBookingsForProperty, getBlockedForProperty, today]);

  return (
    <div
      className="flex"
      style={{ height: ROW_H, borderBottom: '1px solid #F5F5F5', position: 'relative' }}
    >
      {/* Property info - sticky left */}
      <div
        className="flex-shrink-0 flex items-center gap-2 bg-white sticky left-0 z-[4] cursor-pointer hover:bg-gray-50 transition-colors"
        style={{
          width: propColWidth,
          minWidth: propColWidth,
          maxWidth: propColWidth,
          height: ROW_H,
          padding: '0 8px',
          borderRight: '1px solid #EEEEEE',
        }}
        onClick={() => onPropertyClick?.(property)}
        title={property.name}
      >
        <div
          className="flex-shrink-0 overflow-hidden relative"
          style={{ width: 32, height: 32, borderRadius: 6, background: '#F0F0F0' }}
        >
          {property.thumbnail ? (
            <img src={property.thumbnail} alt={property.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">N/A</div>
          )}
          {propertyInsights.length > 0 && (
            <div className="absolute -top-1 -right-1" onClick={(e) => { e.stopPropagation(); onInsightClick?.(); }}>
              <PropertyInsightBadge insights={propertyInsights} compact />
            </div>
          )}
        </div>
        {!propColCollapsed && (
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: '#1A1A2E',
            maxWidth: 80,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {property.name}
          </span>
        )}
      </div>

      {/* Days grid */}
      <div className="flex relative" style={{ height: ROW_H }}>
        {days.map((day, dayIndex) => {
          const isToday = isSameDay(day, today);
          const isPast = day < today && !isToday;
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
            // Don't render checkout-only days separately — width already covers them
            if (shouldRender) {
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
          const isCheckoutDay = bookings.some(b => isSameDay(startOfDay(b.checkOut), startOfDay(day)));

          // Layer-driven visibility rules
          const showBookings = activeLayer !== 'cleaning-only';
          const showPrice = (activeLayer === 'pricing') && property.pricePerNight != null;
          const showCleaning =
            (activeLayer === 'cleaning' || activeLayer === 'cleaning-only') && isCheckoutDay;
          const rmInfo = isEmpty && activeLayer !== 'cleaning-only'
            ? cellRMInfo.get(dayIndex)
            : undefined;

          const cellBg = isToday
            ? 'rgba(255,92,26,0.04)'
            : isSelected
            ? 'rgba(59,130,246,0.08)'
            : activeLayer === 'cleaning-only'
            ? '#FAFAFA'
            : showCleaning
            ? 'rgba(255,92,26,0.06)'
            : undefined;

          return (
            <div
              key={dayIndex}
              style={{
                width: dayCellWidth,
                minWidth: dayCellWidth,
                maxWidth: dayCellWidth,
                flexShrink: 0,
                height: ROW_H,
                borderRight: '1px solid #F8F8F8',
                position: 'relative',
                background: cellBg,
                cursor: isEmpty ? 'pointer' : undefined,
              }}
              onMouseDown={(e) => isEmpty && onDayMouseDown?.(property.id, day, e)}
              onMouseEnter={() => onDayMouseEnter?.(property.id, day)}
              onClick={(e) => { if (isEmpty && !e.defaultPrevented) onCellClick(day, property.id); }}
            >
              {isToday && (
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#FF5C1A', zIndex: 3 }} />
              )}
              {showBookings && bookingBlocks}
              {showBookings && blockedBlock}
              {showPrice && (
                <div
                  style={{
                    position: 'absolute',
                    right: 3,
                    bottom: 2,
                    fontSize: 10,
                    fontWeight: 400,
                    color: '#000',
                    pointerEvents: 'none',
                    lineHeight: 1,
                    zIndex: 5,
                    letterSpacing: '-0.2px',
                  }}
                >
                  {property.pricePerNight}€
                </div>
              )}
              {showCleaning && (
                <div
                  title="Ménage à effectuer (jour de check-out)"
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    fontSize: 14, lineHeight: 1, padding: '3px 6px', borderRadius: 10,
                    background: '#FF5C1A', color: '#fff', fontWeight: 700, pointerEvents: 'none',
                    boxShadow: '0 2px 6px rgba(255,92,26,0.5)', zIndex: 4,
                  }}
                >
                  🧹
                </div>
              )}
              {rmInfo && (
                <div
                  title={
                    rmInfo.type === 'gap'
                      ? `Règle Gap Fill — séjour minimum assoupli à ${rmInfo.minStay} nuit${rmInfo.minStay > 1 ? 's' : ''} pour combler ce trou de planning`
                      : `Relâche min stay — séjour minimum abaissé à ${rmInfo.minStay} nuit${rmInfo.minStay > 1 ? 's' : ''} (proximité de la date)`
                  }
                  style={{
                    position: 'absolute', top: 2, right: 2,
                    display: 'flex', alignItems: 'center', gap: 2,
                    fontSize: 9, lineHeight: 1, padding: '2px 4px', borderRadius: 6,
                    background: rmInfo.type === 'gap' ? 'rgba(124,58,237,0.92)' : 'rgba(245,158,11,0.92)',
                    color: '#fff', fontWeight: 700, pointerEvents: 'none', zIndex: 4,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                  }}
                >
                  {rmInfo.type === 'gap' ? <Puzzle size={9} /> : <ArrowDownRight size={9} />}
                  {rmInfo.minStay}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
