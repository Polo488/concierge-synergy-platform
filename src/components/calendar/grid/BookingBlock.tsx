
import React from 'react';
import { Users } from 'lucide-react';
import type { CalendarBooking } from '@/types/calendar';

const PLATFORM_COLORS: Record<string, { dark: string; light: string; text: string }> = {
  airbnb:        { dark: '#E8002A', light: '#FFB3C1', text: '#9D0018' },
  booking:       { dark: '#00358B', light: '#B3CAFE', text: '#002060' },
  'booking.com': { dark: '#00358B', light: '#B3CAFE', text: '#002060' },
  direct:        { dark: '#15803D', light: '#BBF7D0', text: '#14532D' },
  vrbo:          { dark: '#00358B', light: '#B3CAFE', text: '#002060' },
  other:         { dark: '#4F46E5', light: '#C7D2FE', text: '#3730A3' },
};

const BAR_H = 26;
const BAR_TOP = 13;
const CHECKIN_BLOCK_W = 48;

interface BookingBlockProps {
  booking: CalendarBooking;
  visibleDays: number;
  isCheckInDay: boolean;
  isCheckOutDay: boolean;
  isStartTruncated: boolean;
  isEndTruncated: boolean;
  isPast: boolean;
  onClick: () => void;
  cellWidth?: number;
}

export const BookingBlock: React.FC<BookingBlockProps> = ({
  booking,
  visibleDays,
  isCheckInDay,
  isCheckOutDay,
  isStartTruncated,
  isEndTruncated,
  isPast,
  onClick,
  cellWidth: cellWidthProp,
}) => {
  const cellWidth = cellWidthProp || 48;
  const checkoutFraction = 0.4;

  const platform = String(
    (booking as any).platform || (booking as any).source || booking.channel || (booking as any).ota || ''
  ).toLowerCase();

  const colors = PLATFORM_COLORS[platform] || PLATFORM_COLORS.other;

  const hasVisibleCheckIn = isCheckInDay && !isStartTruncated;
  const hasVisibleCheckOut = isCheckOutDay && !isEndTruncated;

  // Width: checkout day always occupies 40% of its cell
  let width: number;
  if (hasVisibleCheckOut) {
    width = (visibleDays - 1) * cellWidth + Math.round(cellWidth * checkoutFraction);
  } else {
    width = visibleDays * cellWidth;
  }

  const finalWidth = Math.max(width, 16);
  const leftOffset = 0; // Always start at left edge of first visible cell

  // Checkin dark block width
  const showCheckinBlock = hasVisibleCheckIn;
  const checkinBlockW = showCheckinBlock
    ? Math.min(CHECKIN_BLOCK_W, finalWidth)
    : 0;

  // Body (light part) width
  const bodyWidth = finalWidth - checkinBlockW;
  const showBody = bodyWidth > 0;

  // Content visibility based on body width
  const showName = bodyWidth >= 50;
  const showBadge = bodyWidth >= 90;
  const showPrice = bodyWidth >= 130;
  const showGuests = bodyWidth >= 170;

  const guests = booking.guestsCount;
  const totalPrice = booking.totalAmount;

  const badgeLetter = platform === 'airbnb' ? 'A.'
    : (platform === 'booking' || platform === 'booking.com') ? 'B.'
    : platform === 'direct' ? 'D.'
    : '•';

  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    if (bodyWidth < 70) return name.length > 6 ? name.substring(0, 5) + '…' : name;
    if (bodyWidth < 100) return name.length > 10 ? name.substring(0, 9) + '…' : name;
    if (bodyWidth < 140) return name.length > 14 ? name.substring(0, 13) + '…' : name;
    return name.length > 20 ? name.substring(0, 19) + '…' : name;
  };

  // z-index: checkin bars overlay checkout bars
  const zIndex = hasVisibleCheckIn ? 3 : 2;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        position: 'absolute',
        top: BAR_TOP,
        left: leftOffset,
        width: finalWidth,
        height: BAR_H,
        display: 'flex',
        overflow: 'hidden',
        borderRadius: 6,
        zIndex,
        cursor: 'pointer',
        opacity: isPast ? 0.55 : 1,
        contain: 'layout style',
        transition: 'filter 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.08)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
      title={`${booking.guestName}${guests ? ` • ${guests} pers.` : ''}${totalPrice ? ` • ${totalPrice}€` : ''} • ${platform}`}
    >
      {/* Part 1: Checkin dark block */}
      {showCheckinBlock && (
        <div style={{
          width: checkinBlockW,
          height: '100%',
          background: colors.dark,
          flexShrink: 0,
          borderRadius: !showBody ? 6 : undefined,
        }} />
      )}

      {/* Part 2: Light body */}
      {showBody && (
        <div style={{
          flex: 1,
          height: '100%',
          background: hasVisibleCheckIn ? colors.light : colors.light,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          // If no checkin block, apply left border-radius too
          borderRadius: !showCheckinBlock ? 6 : undefined,
        }}>
          {showName && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: colors.text,
              paddingLeft: 6,
              flex: 1,
              minWidth: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pointerEvents: 'none',
              lineHeight: 1,
            }}>
              {getDisplayName()}
            </span>
          )}

          {showPrice && totalPrice && (
            <span style={{
              flexShrink: 0,
              fontSize: 10,
              fontWeight: 700,
              color: colors.text,
              marginRight: 3,
              pointerEvents: 'none',
              lineHeight: 1,
            }}>
              {totalPrice}€
            </span>
          )}

          {showGuests && guests && (
            <span style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              marginRight: 3,
              pointerEvents: 'none',
              opacity: 0.8,
            }}>
              <Users size={10} color={colors.text} />
              <span style={{ fontSize: 10, color: colors.text, lineHeight: 1 }}>{guests}</span>
            </span>
          )}

          {showBadge && (
            <span style={{
              flexShrink: 0,
              fontSize: 9,
              fontWeight: 700,
              color: '#FFFFFF',
              background: colors.dark,
              borderRadius: 3,
              padding: '1px 4px',
              marginRight: 6,
              lineHeight: 1,
            }}>
              {badgeLetter}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
