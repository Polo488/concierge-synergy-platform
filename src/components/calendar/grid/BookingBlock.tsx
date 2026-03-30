import React from 'react';
import { cn } from '@/lib/utils';
import type { CalendarBooking } from '@/types/calendar';

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

// Solid platform colors — no transparency
const CHANNEL_SOLID_COLORS: Record<string, string> = {
  airbnb: '#FF385C',
  booking: '#003580',
  vrbo: '#3D67B1',
  direct: '#16A34A',
  other: '#6366F1',
};

const BLOCKED_BG = '#6B7280';

// Channel initial in a semi-transparent white circle
const ChannelBadge: React.FC<{ channel: string }> = ({ channel }) => {
  const letter = channel === 'airbnb' ? 'A'
    : channel === 'booking' ? 'B'
    : channel === 'vrbo' ? 'V'
    : channel === 'direct' ? 'D'
    : '•';

  return (
    <span
      className="flex-shrink-0 flex items-center justify-center rounded-full"
      style={{
        width: 16,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.25)',
        fontSize: 9,
        fontWeight: 700,
        color: '#FFFFFF',
        lineHeight: 1,
      }}
    >
      {letter}
    </span>
  );
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
  const bgColor = isPast
    ? PAST_BG
    : (CHANNEL_SOLID_COLORS[booking.channel] || CHANNEL_SOLID_COLORS.other);

  const cellWidth = cellWidthProp || 40;
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

  // Smart text truncation
  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    const availableWidth = width - 36;

    if (availableWidth < 30) return '';
    if (availableWidth < 50) return name.length > 4 ? name.substring(0, 3) + '…' : name;
    if (availableWidth < 80) return name.length > 8 ? name.substring(0, 7) + '…' : name;
    if (availableWidth < 120) return name.length > 12 ? name.substring(0, 11) + '…' : name;
    return name.length > 18 ? name.substring(0, 17) + '…' : name;
  };

  const displayName = getDisplayName();
  const showBadge = width > 80;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center cursor-pointer",
        "rounded-lg",
        "transition-all duration-200 ease-out",
        "hover:z-20 hover:brightness-110",
        isPast && "opacity-55"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        backgroundColor: bgColor,
        contain: 'strict',
        overflow: 'hidden',
      }}
      title={`${booking.guestName}${booking.nightlyRate ? ` • ${booking.nightlyRate}€/nuit` : ''} • ${booking.channel}`}
      data-tutorial="calendar-booking"
    >
      <div
        className="flex items-center w-full h-full gap-1 overflow-hidden"
        style={{ padding: '0 8px' }}
      >
        {/* Guest name — always white */}
        {displayName && (
          <span
            className="truncate flex-1 min-w-0"
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pointerEvents: 'none',
            }}
          >
            {displayName}
          </span>
        )}

        {/* Channel badge — right side */}
        {showBadge && <ChannelBadge channel={booking.channel} />}
      </div>
    </div>
  );
};
