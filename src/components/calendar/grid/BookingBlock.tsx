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

// Channel colors - Using modern, slightly desaturated tones
const CHANNEL_COLORS: Record<string, string> = {
  airbnb: 'hsl(0 84% 60%)',     // Airbnb red
  booking: 'hsl(217 91% 60%)',   // Booking blue
  vrbo: 'hsl(220 13% 55%)',      // Neutral
  direct: 'hsl(152 45% 50%)',    // Green for direct
  other: 'hsl(220 13% 55%)',     // Neutral
};

// Past bookings are gray
const PAST_COLOR = 'hsl(220 10% 65%)';
const DEFAULT_COLOR = 'hsl(220 13% 55%)';

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
  
  let width: number;
  let leftOffset = 0;
  
  const hasVisibleCheckIn = isCheckInDay && !isStartTruncated;
  const hasVisibleCheckOut = isCheckOutDay && !isEndTruncated;
  
  if (hasVisibleCheckIn && hasVisibleCheckOut) {
    width = visibleDays * cellWidth;
    leftOffset = halfCell;
  } else if (hasVisibleCheckIn && !hasVisibleCheckOut) {
    width = visibleDays * cellWidth - halfCell;
    leftOffset = halfCell;
  } else if (!hasVisibleCheckIn && hasVisibleCheckOut) {
    width = visibleDays * cellWidth + halfCell;
    leftOffset = 0;
  } else {
    width = visibleDays * cellWidth;
    leftOffset = 0;
  }

  // Determine bevel configuration
  const hasLeftBevel = isCheckInDay && !isStartTruncated;
  const hasRightBevel = isCheckOutDay && !isEndTruncated;

  // Get display name
  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    const availableWidth = width - 40;
    
    if (visibleDays <= 1 || availableWidth < 40) {
      return name.substring(0, 2) + (name.length > 2 ? '…' : '');
    } else if (visibleDays <= 2 || availableWidth < 60) {
      return name.length > 6 ? name.substring(0, 5) + '…' : name;
    } else if (visibleDays <= 3 || availableWidth < 100) {
      return name.length > 10 ? name.substring(0, 9) + '…' : name;
    } else {
      return name.length > 16 ? name.substring(0, 15) + '…' : name;
    }
  };

  const showPrice = visibleDays >= 2 && booking.nightlyRate && width > 80;
  const bevelSize = 10;
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1.5 bottom-1.5 z-10 flex items-center px-2 cursor-pointer",
        "booking-block shadow-sm"
      )}
      style={{
        width: `${Math.max(width, 24)}px`,
        backgroundColor,
        left: `${leftOffset}px`,
        clipPath: getSharpBevelClipPath(hasLeftBevel, hasRightBevel, bevelSize),
        borderRadius: hasLeftBevel || hasRightBevel ? '0' : '8px',
      }}
      title={`${booking.guestName} - ${booking.nightlyRate ? `${booking.nightlyRate}€/nuit` : ''}`}
    >
      {/* Channel icon */}
      <ChannelIcon channel={booking.channel} className="w-3.5 h-3.5 flex-shrink-0 text-white/90 mr-1.5" />
      
      {/* Guest name */}
      <span className="text-xs font-medium text-white truncate flex-1 min-w-0">
        {getDisplayName()}
      </span>
      
      {/* Price */}
      {showPrice && (
        <span className="text-[10px] text-white/80 flex-shrink-0 ml-1.5 font-medium">
          {booking.nightlyRate}€
        </span>
      )}
    </div>
  );
};

// Creates sharp diagonal bevels
function getSharpBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean, bevelSize: number): string {
  const cut = `${bevelSize}px`;
  
  if (hasLeftBevel && hasRightBevel) {
    return `polygon(${cut} 0%, calc(100% - ${cut}) 0%, 100% 100%, 0% 100%)`;
  } else if (hasLeftBevel) {
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    return `polygon(0% 0%, calc(100% - ${cut}) 0%, 100% 100%, 0% 100%)`;
  }
  
  return 'none';
}
