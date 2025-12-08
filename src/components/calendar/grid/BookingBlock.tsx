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
  const halfCell = cellWidth / 2;
  
  // Calculate width and position
  // visibleDays = number of nights = distance from check-in to check-out
  // The block spans from middle of check-in cell to middle of check-out cell
  let width = visibleDays * cellWidth;
  let leftOffset = 0;
  
  // Check-in day: start from right half of cell (shift right by half cell)
  if (isCheckInDay && !isStartTruncated) {
    leftOffset = halfCell;
    // DON'T reduce width - we just shift the start position
  }
  
  // Check-out day: the width already accounts for reaching the checkout cell
  // If start is truncated but end is not, we need to add half cell to reach middle of checkout
  if (isCheckOutDay && !isEndTruncated) {
    if (isStartTruncated || !isCheckInDay) {
      // Started from edge (0), need to extend to middle of checkout
      width += halfCell;
    }
    // If check-in is visible, width is already correct (middle to middle)
  }
  
  // If checkout is truncated (extends beyond view), extend to edge
  if (isEndTruncated && isCheckInDay && !isStartTruncated) {
    // Started from middle, extend to edge of last visible cell
    // No adjustment needed - visibleDays already goes to edge
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
        borderRadius: hasLeftBevel && hasRightBevel ? '0' : hasLeftBevel ? '0 6px 6px 0' : hasRightBevel ? '6px 0 0 6px' : '6px',
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

// Creates simple diagonal corner cuts (not arrow/hexagonal)
function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  // Small corner cut size
  const cut = '8px';
  
  if (hasLeftBevel && hasRightBevel) {
    // Both corners cut: parallelogram shape
    return `polygon(${cut} 0%, calc(100% - ${cut}) 0%, 100% 100%, ${cut} 100%)`;
  } else if (hasLeftBevel) {
    // Left diagonal: top-left corner cut, straight right side
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    // Right diagonal: straight left, top-right corner cut
    return `polygon(0% 0%, calc(100% - ${cut}) 0%, 100% 100%, 0% 100%)`;
  }
  
  // No bevel - straight rectangle
  return 'none';
}
