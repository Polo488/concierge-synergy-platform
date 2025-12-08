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

// Channel colors - only Red (Airbnb), Blue (Booking), rest uses default
const CHANNEL_COLORS: Record<string, string> = {
  airbnb: '#FF5A5F',    // Rouge Airbnb
  booking: '#003580',   // Bleu Booking
};

// Past bookings and default are gray
const PAST_COLOR = '#D1D5DB';
const DEFAULT_COLOR = '#9CA3AF';

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
  // Past bookings are always gray, otherwise use channel color
  const backgroundColor = isPast 
    ? PAST_COLOR 
    : (CHANNEL_COLORS[booking.channel] || DEFAULT_COLOR);
  
  // Each day cell is 40px wide
  const cellWidth = 40;
  let width = visibleDays * cellWidth;
  let leftOffset = 0;
  
  // Check-in day: start from right half of cell (20px offset)
  if (isCheckInDay && !isStartTruncated) {
    leftOffset = cellWidth / 2; // 20px
    width -= cellWidth / 2;
  }
  
  // Check-out day: end at left half of cell
  if (isCheckOutDay && !isEndTruncated) {
    width -= cellWidth / 2;
  }

  // Determine bevel configuration
  const hasLeftBevel = isCheckInDay && !isStartTruncated;
  const hasRightBevel = isCheckOutDay && !isEndTruncated;

  // Get display name - always show something
  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    const availableWidth = width - 40; // Reserve space for icon and price
    
    if (visibleDays <= 1 || availableWidth < 40) {
      // Very short: just first initial or first 2 chars
      return name.substring(0, 2) + (name.length > 2 ? '…' : '');
    } else if (visibleDays <= 2 || availableWidth < 60) {
      // Short: truncated to ~6 chars
      return name.length > 6 ? name.substring(0, 5) + '…' : name;
    } else if (visibleDays <= 3 || availableWidth < 100) {
      // Medium: truncated to ~10 chars
      return name.length > 10 ? name.substring(0, 9) + '…' : name;
    } else {
      // Longer: truncated to ~16 chars
      return name.length > 16 ? name.substring(0, 15) + '…' : name;
    }
  };

  // Show price only if there's enough space
  const showPrice = visibleDays >= 2 && booking.nightlyRate && width > 80;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-0.5 bottom-0.5 z-10 flex items-center px-1.5 cursor-pointer transition-all",
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
      {/* Channel icon */}
      <ChannelIcon channel={booking.channel} className="w-3.5 h-3.5 flex-shrink-0 text-white/90 mr-1" />
      
      {/* Guest name - always visible */}
      <span className="text-xs font-medium text-white truncate flex-1 min-w-0">
        {getDisplayName()}
      </span>
      
      {/* Price on the right */}
      {showPrice && (
        <span className="text-[10px] text-white/90 flex-shrink-0 ml-1 font-medium">
          {booking.nightlyRate}€
        </span>
      )}
    </div>
  );
};

// Creates sharp diagonal cut for check-in (left) and check-out (right)
function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  // Sharp 45° diagonal cut - approximately half the block height
  const cut = '12px';
  
  if (hasLeftBevel && hasRightBevel) {
    // Both cuts: diagonal on both ends
    return `polygon(${cut} 0%, calc(100% - ${cut}) 0%, 100% 50%, calc(100% - ${cut}) 100%, ${cut} 100%, 0% 50%)`;
  } else if (hasLeftBevel) {
    // Only left cut (check-in): diagonal left, straight right
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, ${cut} 100%, 0% 50%)`;
  } else if (hasRightBevel) {
    // Only right cut (check-out): straight left, diagonal right
    return `polygon(0% 0%, calc(100% - ${cut}) 0%, 100% 50%, calc(100% - ${cut}) 100%, 0% 100%)`;
  }
  
  // No bevel - straight edges (truncated booking)
  return 'none';
}
