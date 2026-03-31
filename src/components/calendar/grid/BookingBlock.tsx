
import React from 'react';
import { Users } from 'lucide-react';
import type { CalendarBooking } from '@/types/calendar';

const CHANNEL_SOLID_COLORS: Record<string, string> = {
  airbnb: '#FF385C',
  booking: '#003580',
  'booking.com': '#003580',
  vrbo: '#3D67B1',
  direct: '#16A34A',
  blocked: '#6B7280',
  block: '#6B7280',
  other: '#6366F1',
};

const BAR_H = 28;
const BAR_TOP = 14;

const ChannelBadge: React.FC<{ channel: string; show: boolean }> = ({ channel, show }) => {
  if (!show) return null;
  const letter = channel === 'airbnb' ? 'A.'
    : channel === 'booking' ? 'B.'
    : channel === 'vrbo' ? 'V.'
    : channel === 'direct' ? 'D.'
    : '•';

  return (
    <span style={{
      flexShrink: 0,
      fontSize: 9,
      fontWeight: 700,
      color: '#FFFFFF',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: 3,
      padding: '1px 4px',
      marginRight: 8,
      lineHeight: 1,
    }}>
      {letter}
    </span>
  );
};

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

/**
 * Chevron clip-path cases:
 * A: both check-in & check-out visible → notch left + arrow right
 * B: truncated start, check-out visible → flat left + arrow right
 * C: check-in visible, truncated end → notch left + flat right
 * D: both truncated → flat rectangle
 */
const getClipPath = (hasVisibleCheckIn: boolean, hasVisibleCheckOut: boolean): string | undefined => {
  if (hasVisibleCheckIn && hasVisibleCheckOut) {
    // Case A: inward notch left + inward notch right
    return 'polygon(8px 0%, 100% 0%, calc(100% - 12px) 50%, 100% 100%, 8px 100%, 0% 50%)';
  }
  if (!hasVisibleCheckIn && hasVisibleCheckOut) {
    // Case B: flat left + inward notch right
    return 'polygon(0% 0%, 100% 0%, calc(100% - 12px) 50%, 100% 100%, 0% 100%)';
  }
  if (hasVisibleCheckIn && !hasVisibleCheckOut) {
    // Case C: inward notch left + flat right
    return 'polygon(8px 0%, 100% 0%, 100% 100%, 8px 100%, 0% 50%)';
  }
  // Case D: both truncated → no clip-path
  return undefined;
};

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
  const platform = String(
    (booking as any).platform || (booking as any).source || booking.channel || (booking as any).ota || ''
  ).toLowerCase();

  const bgColor = CHANNEL_SOLID_COLORS[platform] || CHANNEL_SOLID_COLORS.other;
  const cellWidth = cellWidthProp || 48;
  const halfCell = cellWidth / 2;

  const hasVisibleCheckIn = isCheckInDay && !isStartTruncated;
  const hasVisibleCheckOut = isCheckOutDay && !isEndTruncated;

  let width: number;
  let leftOffset = 0;

  if (hasVisibleCheckIn && hasVisibleCheckOut) {
    width = (visibleDays - 1) * cellWidth + halfCell;
    leftOffset = halfCell;
  } else if (hasVisibleCheckIn && !hasVisibleCheckOut) {
    width = visibleDays * cellWidth - halfCell;
    leftOffset = halfCell;
  } else if (!hasVisibleCheckIn && hasVisibleCheckOut) {
    width = (visibleDays - 1) * cellWidth + halfCell;
    leftOffset = 0;
  } else {
    width = visibleDays * cellWidth;
    leftOffset = 0;
  }

  const finalWidth = Math.max(width, 20);
  const clipPath = getClipPath(hasVisibleCheckIn, hasVisibleCheckOut);

  // Content visibility rules based on width
  const showName = finalWidth >= 40;
  const showBadge = finalWidth > 72;
  const showGuests = finalWidth > 100;
  const showPrice = finalWidth > 140;

  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    if (!showName) return '';
    const availableWidth = finalWidth - (showBadge ? 50 : 20) - (showGuests ? 30 : 0) - (showPrice ? 40 : 0);
    if (availableWidth < 20) return '';
    if (availableWidth < 40) return name.length > 4 ? name.substring(0, 3) + '…' : name;
    if (availableWidth < 60) return name.length > 8 ? name.substring(0, 7) + '…' : name;
    if (availableWidth < 100) return name.length > 12 ? name.substring(0, 11) + '…' : name;
    return name.length > 18 ? name.substring(0, 17) + '…' : name;
  };

  const displayName = getDisplayName();
  const guests = booking.guestsCount;
  const totalPrice = booking.totalAmount;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        position: 'absolute',
        top: BAR_TOP,
        left: leftOffset,
        width: finalWidth,
        height: BAR_H,
        background: bgColor,
        color: '#FFFFFF',
        clipPath: clipPath,
        zIndex: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        contain: 'strict',
        opacity: isPast ? 0.55 : 1,
        transition: 'filter 0.15s',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.filter = 'none'; }}
      title={`${booking.guestName}${guests ? ` • ${guests} pers.` : ''}${totalPrice ? ` • ${totalPrice}€` : ''} • ${booking.channel}`}
    >
      {/* Name */}
      {displayName && (
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#FFFFFF',
          paddingLeft: hasVisibleCheckIn ? 12 : 8,
          flex: 1,
          minWidth: 0,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
          lineHeight: 1,
        }}>
          {displayName}
        </span>
      )}

      {/* Total price */}
      {showPrice && totalPrice && (
        <span style={{
          flexShrink: 0,
          fontSize: 10,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.95)',
          marginRight: 4,
          pointerEvents: 'none',
          lineHeight: 1,
        }}>
          {totalPrice}€
        </span>
      )}

      {/* Guests count */}
      {showGuests && guests && (
        <span style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginRight: 4,
          pointerEvents: 'none',
        }}>
          <Users size={10} color="rgba(255,255,255,0.85)" />
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>{guests}</span>
        </span>
      )}

      {/* Channel badge */}
      <ChannelBadge channel={booking.channel} show={showBadge} />
    </div>
  );
};
