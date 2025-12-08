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
  
  // visibleDays = number of nights (e.g., 5 nights from Dec 6 to Dec 11)
  // Block goes from middle of check-in cell to middle of check-out cell
  // Width calculation:
  // - Full cells between check-in and check-out: (visibleDays - 1) cells = (visibleDays - 1) * 40px
  // - Right half of check-in cell: 20px (if visible)
  // - Left half of check-out cell: 20px (if visible)
  
  let width: number;
  let leftOffset = 0;
  
  const hasVisibleCheckIn = isCheckInDay && !isStartTruncated;
  const hasVisibleCheckOut = isCheckOutDay && !isEndTruncated;
  
  if (hasVisibleCheckIn && hasVisibleCheckOut) {
    // Both ends visible: middle to middle
    // = halfCell + (visibleDays - 1) * cellWidth + halfCell = visibleDays * cellWidth
    width = visibleDays * cellWidth;
    leftOffset = halfCell;
  } else if (hasVisibleCheckIn && !hasVisibleCheckOut) {
    // Check-in visible, checkout truncated: middle to right edge
    width = visibleDays * cellWidth - halfCell;
    leftOffset = halfCell;
  } else if (!hasVisibleCheckIn && hasVisibleCheckOut) {
    // Check-in truncated, checkout visible: left edge to middle
    width = visibleDays * cellWidth + halfCell;
    leftOffset = 0;
  } else {
    // Both truncated: edge to edge
    width = visibleDays * cellWidth;
    leftOffset = 0;
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
        borderRadius: hasLeftBevel && hasRightBevel ? '2px' : hasLeftBevel ? '2px 4px 4px 2px' : hasRightBevel ? '4px 2px 2px 4px' : '4px',
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

// Creates diagonal bevels on left/right edges
function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  // Bevel size - diagonal cut across the full height
  const cut = '10px';
  
  if (hasLeftBevel && hasRightBevel) {
    // Both sides beveled: parallelogram shape (diagonal left and right)
    return `polygon(${cut} 0%, 100% 0%, calc(100% - ${cut}) 100%, 0% 100%)`;
  } else if (hasLeftBevel) {
    // Left diagonal only: starts narrow at top-left, full width at bottom
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    // Right diagonal only: full width at top, narrows at bottom-right
    return `polygon(0% 0%, 100% 0%, calc(100% - ${cut}) 100%, 0% 100%)`;
  }
  
  // No bevel - straight rectangle
  return 'none';
}
