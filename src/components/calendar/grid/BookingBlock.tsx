
import React from 'react';
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
const BAR_RADIUS = 6;

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
      borderRadius: 4,
      padding: '2px 4px',
      marginRight: 6,
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

  // Smart name truncation
  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    if (finalWidth < 40) return '';
    const availableWidth = finalWidth - 40;
    if (availableWidth < 30) return '';
    if (availableWidth < 50) return name.length > 4 ? name.substring(0, 3) + '…' : name;
    if (availableWidth < 80) return name.length > 8 ? name.substring(0, 7) + '…' : name;
    if (availableWidth < 120) return name.length > 12 ? name.substring(0, 11) + '…' : name;
    return name.length > 18 ? name.substring(0, 17) + '…' : name;
  };

  const displayName = getDisplayName();
  const showBadge = finalWidth > 72;

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
        borderRadius: BAR_RADIUS,
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
      title={`${booking.guestName}${booking.nightlyRate ? ` • ${booking.nightlyRate}€/nuit` : ''} • ${booking.channel}`}
    >
      {/* Name */}
      {displayName && (
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: '#FFFFFF',
          paddingLeft: 8,
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
          lineHeight: 1,
        }}>
          {displayName}
        </span>
      )}

      {/* Channel badge */}
      <ChannelBadge channel={booking.channel} show={showBadge} />
    </div>
  );
};
