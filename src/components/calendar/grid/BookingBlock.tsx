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

// Channel colors - Premium, slightly desaturated tones
const CHANNEL_COLORS: Record<string, { bg: string; text: string }> = {
  airbnb: { bg: 'hsl(0 72% 58%)', text: 'white' },      // Soft Airbnb red
  booking: { bg: 'hsl(217 80% 52%)', text: 'white' },   // Calm Booking blue
  vrbo: { bg: 'hsl(220 14% 50%)', text: 'white' },      // Neutral
  direct: { bg: 'hsl(152 40% 45%)', text: 'white' },    // Soft green
  other: { bg: 'hsl(220 14% 50%)', text: 'white' },     // Neutral
};

// Past bookings - muted grey
const PAST_COLORS = { bg: 'hsl(220 12% 72%)', text: 'white' };
const DEFAULT_COLORS = { bg: 'hsl(220 14% 50%)', text: 'white' };

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
  // Color selection
  const colors = isPast 
    ? PAST_COLORS 
    : (CHANNEL_COLORS[booking.channel] || DEFAULT_COLORS);
  
  // Cell dimensions
  const cellWidth = 40;
  const halfCell = cellWidth / 2;
  
  // Calculate width and offset based on check-in/out visibility
  const hasVisibleCheckIn = isCheckInDay && !isStartTruncated;
  const hasVisibleCheckOut = isCheckOutDay && !isEndTruncated;
  
  let width: number;
  let leftOffset = 0;
  
  if (hasVisibleCheckIn && hasVisibleCheckOut) {
    // Both visible: start at half, end at half
    width = visibleDays * cellWidth;
    leftOffset = halfCell;
  } else if (hasVisibleCheckIn && !hasVisibleCheckOut) {
    // Only check-in visible: start at half, go to edge
    width = visibleDays * cellWidth - halfCell;
    leftOffset = halfCell;
  } else if (!hasVisibleCheckIn && hasVisibleCheckOut) {
    // Only check-out visible: start at edge, end at half
    width = visibleDays * cellWidth + halfCell;
    leftOffset = 0;
  } else {
    // Neither visible (spans full width)
    width = visibleDays * cellWidth;
    leftOffset = 0;
  }

  // Bevel configuration for diagonal cuts
  const hasLeftBevel = isCheckInDay && !isStartTruncated;
  const hasRightBevel = isCheckOutDay && !isEndTruncated;
  const bevelSize = 11;

  // Smart text truncation
  const getDisplayName = (): string => {
    const name = booking.guestName || '?';
    const availableWidth = width - 32; // Account for icon + padding
    
    if (availableWidth < 30) {
      return name.charAt(0);
    } else if (availableWidth < 50) {
      return name.length > 4 ? name.substring(0, 3) + '…' : name;
    } else if (availableWidth < 80) {
      return name.length > 8 ? name.substring(0, 7) + '…' : name;
    } else if (availableWidth < 120) {
      return name.length > 12 ? name.substring(0, 11) + '…' : name;
    } else {
      return name.length > 18 ? name.substring(0, 17) + '…' : name;
    }
  };

  // Show price only when there's enough space
  const showPrice = visibleDays >= 3 && booking.nightlyRate && width > 100;
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center cursor-pointer",
        "booking-block",
        "transition-all duration-200 ease-out",
        "hover:z-20"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        backgroundColor: colors.bg,
        clipPath: createBevelClipPath(hasLeftBevel, hasRightBevel, bevelSize),
        borderRadius: getBorderRadius(hasLeftBevel, hasRightBevel),
      }}
      title={`${booking.guestName}${booking.nightlyRate ? ` • ${booking.nightlyRate}€/nuit` : ''}`}
    >
      {/* Content container with proper padding */}
      <div className="flex items-center w-full h-full px-2 gap-1.5 overflow-hidden">
        {/* Channel icon */}
        <ChannelIcon 
          channel={booking.channel} 
          className="w-3 h-3 flex-shrink-0 opacity-90 text-white" 
        />
        
        {/* Guest name */}
        <span 
          className="text-xs font-medium truncate flex-1 min-w-0 leading-tight text-white"
        >
          {getDisplayName()}
        </span>
        
        {/* Price badge */}
        {showPrice && (
          <span className="text-[10px] flex-shrink-0 font-medium opacity-75 text-white">
            {booking.nightlyRate}€
          </span>
        )}
      </div>
    </div>
  );
};

// Creates clean diagonal bevel clip paths
function createBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean, bevelSize: number): string {
  const cut = `${bevelSize}px`;
  
  if (hasLeftBevel && hasRightBevel) {
    // Both sides beveled: parallelogram shape
    return `polygon(${cut} 0%, calc(100% - ${cut}) 0%, 100% 100%, 0% 100%)`;
  } else if (hasLeftBevel) {
    // Only left beveled
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    // Only right beveled
    return `polygon(0% 0%, calc(100% - ${cut}) 0%, 100% 100%, 0% 100%)`;
  }
  
  return 'none';
}

// Returns appropriate border radius based on bevels
function getBorderRadius(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  if (hasLeftBevel && hasRightBevel) {
    return '0';
  } else if (hasLeftBevel) {
    return '0 10px 10px 0';
  } else if (hasRightBevel) {
    return '10px 0 0 10px';
  }
  return '10px';
}
