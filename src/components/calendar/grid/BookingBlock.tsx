
import React from 'react';
import { cn } from '@/lib/utils';
import type { CalendarBooking } from '@/types/calendar';
import { ChannelIcon } from './ChannelIcon';

interface BookingBlockProps {
  booking: CalendarBooking;
  visibleDays: number;
  isCheckInDay: boolean;
  isCheckOutDay: boolean;
  isStartTruncated: boolean;
  isEndTruncated: boolean;
  isPast: boolean;
  onClick: () => void;
}

// Channel colors for active bookings
const ACTIVE_CHANNEL_COLORS: Record<string, string> = {
  airbnb: '#FF5A5F',    // Rouge Airbnb
  booking: '#003580',   // Bleu Booking
  vrbo: '#3D67B1',
  direct: '#10B981',
  other: '#6B7280',
};

// Past bookings are gray
const PAST_COLOR = '#9CA3AF';

export const BookingBlock: React.FC<BookingBlockProps> = ({
  booking,
  visibleDays,
  isCheckInDay,
  isCheckOutDay,
  isStartTruncated,
  isEndTruncated,
  isPast,
  onClick,
}) => {
  // Use gray for past bookings, otherwise channel color
  const backgroundColor = isPast ? PAST_COLOR : (ACTIVE_CHANNEL_COLORS[booking.channel] || ACTIVE_CHANNEL_COLORS.other);
  
  // Calculate width: each full day is 40px
  let width = visibleDays * 40;
  let leftOffset = 0;
  
  // If this is the actual check-in day (not truncated), start from right half
  if (isCheckInDay && !isStartTruncated) {
    leftOffset = 20; // Start from middle of cell
    width -= 20;
  }
  
  // If this is the actual check-out day (not truncated), end at left half
  if (isCheckOutDay && !isEndTruncated) {
    width -= 20;
  }

  // Determine bevel configuration
  const hasLeftBevel = isCheckInDay && !isStartTruncated;
  const hasRightBevel = isCheckOutDay && !isEndTruncated;

  // Truncate guest name intelligently
  const truncateName = (name: string, maxLength: number = 12): string => {
    if (!name) return '...';
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength - 1) + '…';
  };

  // Get display name based on available width
  const getDisplayName = (): string => {
    if (visibleDays <= 1) {
      // Very short: just initials
      const parts = booking.guestName?.split(' ') || [];
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return booking.guestName?.[0]?.toUpperCase() || '?';
    } else if (visibleDays <= 2) {
      // Short: truncated name
      return truncateName(booking.guestName, 8);
    } else if (visibleDays <= 4) {
      return truncateName(booking.guestName, 12);
    }
    return truncateName(booking.guestName, 18);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-0.5 bottom-0.5 z-10 flex items-center gap-1 px-1.5 cursor-pointer transition-all",
        "hover:brightness-110 hover:shadow-md"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        backgroundColor,
        left: `${leftOffset}px`,
        clipPath: getBevelClipPath(hasLeftBevel, hasRightBevel),
        borderRadius: '8px',
      }}
      title={`${booking.guestName} - ${booking.nightlyRate ? `${booking.nightlyRate}€/nuit` : ''}`}
    >
      <ChannelIcon channel={booking.channel} className="w-3.5 h-3.5 flex-shrink-0 text-white/90" />
      <span className="text-xs font-medium text-white truncate flex-1 min-w-0">
        {getDisplayName()}
      </span>
      {booking.nightlyRate && visibleDays > 3 && (
        <span className="text-[10px] text-white/80 flex-shrink-0">
          {booking.nightlyRate}€
        </span>
      )}
    </div>
  );
};

// Creates a beveled/diagonal clip path for check-in (left bevel) and check-out (right bevel)
function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  // Bevel size in pixels (approximately 8-10px visual effect)
  const bevelPx = '10px';
  
  if (hasLeftBevel && hasRightBevel) {
    // Both bevels: diagonal on both sides
    return `polygon(${bevelPx} 0%, calc(100% - ${bevelPx}) 0%, 100% 50%, calc(100% - ${bevelPx}) 100%, ${bevelPx} 100%, 0% 50%)`;
  } else if (hasLeftBevel) {
    // Only left bevel (check-in): pointed left side
    return `polygon(${bevelPx} 0%, 100% 0%, 100% 100%, ${bevelPx} 100%, 0% 50%)`;
  } else if (hasRightBevel) {
    // Only right bevel (check-out): pointed right side
    return `polygon(0% 0%, calc(100% - ${bevelPx}) 0%, 100% 50%, calc(100% - ${bevelPx}) 100%, 0% 100%)`;
  }
  
  // No bevel - straight edges
  return 'none';
}
