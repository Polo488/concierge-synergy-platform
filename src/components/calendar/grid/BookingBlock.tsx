
import React from 'react';
import { cn } from '@/lib/utils';
import type { CalendarBooking } from '@/types/calendar';
import { CHANNEL_COLORS } from '@/types/calendar';
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
  const channelColor = CHANNEL_COLORS[booking.channel];
  
  // Calculate width: each full day is 40px
  // Check-in day starts at half cell (right half) = position at 20px, width starts from there
  // Check-out day ends at half cell (left half) = width ends at 20px into that day
  // Full booking width = (visibleDays * 40) - 20 (for check-in half) - 20 (for check-out half) = (visibleDays - 1) * 40
  // But we need to account for truncation
  
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

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center gap-1.5 px-2 cursor-pointer transition-all",
        "hover:brightness-110 hover:shadow-lg",
        isPast && "opacity-60"
      )}
      style={{
        width: `${Math.max(width - 2, 20)}px`,
        backgroundColor: channelColor,
        left: `${leftOffset + 1}px`,
        // Beveled corners for check-in (left bevel) and check-out (right bevel)
        clipPath: getBevelClipPath(isCheckInDay && !isStartTruncated, isCheckOutDay && !isEndTruncated),
        borderRadius: getBevelBorderRadius(isStartTruncated, isEndTruncated, isCheckInDay, isCheckOutDay),
      }}
      title={`${booking.guestName} - ${booking.nightlyRate}€/nuit`}
    >
      <ChannelIcon channel={booking.channel} className="w-4 h-4 flex-shrink-0 text-white/90" />
      <span className="text-xs font-medium text-white truncate">
        {booking.guestName}
      </span>
      {booking.nightlyRate && visibleDays > 2 && (
        <span className="text-[10px] text-white/80 flex-shrink-0">
          {booking.nightlyRate}€
        </span>
      )}
    </div>
  );
};

// Creates a beveled/diagonal clip path for check-in (left bevel) and check-out (right bevel)
function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  // Bevel size as percentage - creates diagonal cut
  const bevelSize = '30%';
  
  if (hasLeftBevel && hasRightBevel) {
    // Both bevels: diagonal on both sides
    return `polygon(${bevelSize} 0%, 100% 0%, calc(100% - ${bevelSize}) 100%, 0% 100%)`;
  } else if (hasLeftBevel) {
    // Only left bevel (check-in): diagonal on left side
    return `polygon(${bevelSize} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    // Only right bevel (check-out): diagonal on right side
    return `polygon(0% 0%, 100% 0%, calc(100% - ${bevelSize}) 100%, 0% 100%)`;
  }
  
  // No bevel needed
  return 'none';
}

function getBevelBorderRadius(
  isStartTruncated: boolean, 
  isEndTruncated: boolean,
  isCheckInDay: boolean,
  isCheckOutDay: boolean
): string {
  // Only add rounded corners when truncated (block extends beyond visible area)
  const leftRadius = isStartTruncated ? '0' : (isCheckInDay ? '0' : '6px');
  const rightRadius = isEndTruncated ? '0' : (isCheckOutDay ? '0' : '6px');
  
  return `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`;
}
