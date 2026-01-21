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
}

// Channel colors - Soft, desaturated with transparency for calm aesthetic
const CHANNEL_COLORS: Record<string, { bg: string; iconBg: string; text: string }> = {
  airbnb: { 
    bg: 'rgba(255, 90, 95, 0.18)',      // Soft Airbnb red tint
    iconBg: 'hsl(0 72% 55%)',            // Solid Airbnb red for icon
    text: 'hsl(0 45% 35%)'               // Dark red-brown for text
  },
  booking: { 
    bg: 'rgba(0, 53, 128, 0.15)',        // Soft navy tint
    iconBg: 'hsl(217 100% 25%)',         // Solid deep navy for icon
    text: 'hsl(217 50% 25%)'             // Dark navy for text
  },
  vrbo: { 
    bg: 'rgba(100, 110, 130, 0.12)',     // Neutral grey-blue tint
    iconBg: 'hsl(220 14% 40%)',          // Solid grey
    text: 'hsl(220 20% 30%)'             // Dark grey
  },
  direct: { 
    bg: 'rgba(60, 140, 100, 0.14)',      // Soft green tint
    iconBg: 'hsl(152 40% 38%)',          // Solid green
    text: 'hsl(152 35% 25%)'             // Dark green
  },
  other: { 
    bg: 'rgba(100, 110, 130, 0.12)',     
    iconBg: 'hsl(220 14% 40%)',          
    text: 'hsl(220 20% 30%)'             
  },
};

// Past/blocked - Very light neutral
const PAST_COLORS = { 
  bg: 'rgba(140, 145, 160, 0.10)', 
  iconBg: 'hsl(220 8% 60%)', 
  text: 'hsl(220 10% 45%)' 
};
const DEFAULT_COLORS = { 
  bg: 'rgba(100, 110, 130, 0.12)', 
  iconBg: 'hsl(220 14% 40%)', 
  text: 'hsl(220 20% 30%)' 
};

// Channel icons - Solid, crisp, primary indicator
const ChannelIcon: React.FC<{ channel: string; color: string }> = ({ channel, color }) => {
  const iconClass = "w-3.5 h-3.5 flex-shrink-0 font-bold";
  
  switch (channel) {
    case 'airbnb':
      return (
        <span className={iconClass} style={{ color }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12.001 18.5c-1.5 0-2.8-.6-3.7-1.7-.5-.6-.5-1.4 0-2 .9-1.1 2.2-1.7 3.7-1.7s2.8.6 3.7 1.7c.5.6.5 1.4 0 2-.9 1.1-2.2 1.7-3.7 1.7zm0-12c2.5 0 4.6 1.5 5.5 3.7.2.4.3.9.3 1.3 0 2.2-1.8 4-4 4h-3.6c-2.2 0-4-1.8-4-4 0-.4.1-.9.3-1.3.9-2.2 3-3.7 5.5-3.7zm0-2c-3.4 0-6.3 2-7.6 5-.3.6-.4 1.3-.4 2 0 3.3 2.7 6 6 6h3.6c3.3 0 6-2.7 6-6 0-.7-.1-1.4-.4-2-1.3-3-4.2-5-7.6-5h.4z"/>
          </svg>
        </span>
      );
    case 'booking':
      return (
        <span 
          className={cn(iconClass, "flex items-center justify-center text-[10px] font-bold")} 
          style={{ color }}
        >
          B
        </span>
      );
    case 'vrbo':
      return (
        <span 
          className={cn(iconClass, "flex items-center justify-center text-[10px] font-bold")} 
          style={{ color }}
        >
          V
        </span>
      );
    case 'direct':
      return (
        <span 
          className={cn(iconClass, "flex items-center justify-center text-[10px] font-bold")} 
          style={{ color }}
        >
          D
        </span>
      );
    default:
      return (
        <span 
          className={cn(iconClass, "flex items-center justify-center text-[10px] font-bold")} 
          style={{ color }}
        >
          •
        </span>
      );
  }
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
}) => {
  // Color selection
  const colors = isPast 
    ? PAST_COLORS 
    : (CHANNEL_COLORS[booking.channel] || DEFAULT_COLORS);
  
  // Cell dimensions
  const cellWidth = 40;
  const halfCell = cellWidth / 2;
  
  // Pure rectangle positioning
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
    
    if (availableWidth < 30) return name.charAt(0);
    if (availableWidth < 50) return name.length > 4 ? name.substring(0, 3) + '…' : name;
    if (availableWidth < 80) return name.length > 8 ? name.substring(0, 7) + '…' : name;
    if (availableWidth < 120) return name.length > 12 ? name.substring(0, 11) + '…' : name;
    return name.length > 18 ? name.substring(0, 17) + '…' : name;
  };

  const showPrice = visibleDays >= 3 && booking.nightlyRate && width > 100;
  
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center cursor-pointer",
        "rounded-md",
        "transition-all duration-200 ease-out",
        "hover:z-20"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        backgroundColor: colors.bg,
        boxShadow: '0 1px 3px -1px rgba(0,0,0,0.06)',
      }}
      title={`${booking.guestName}${booking.nightlyRate ? ` • ${booking.nightlyRate}€/nuit` : ''}`}
      data-tutorial="calendar-booking"
    >
      <div className="flex items-center w-full h-full px-1.5 gap-1 overflow-hidden">
        {/* Channel icon - solid, crisp, primary indicator */}
        <ChannelIcon channel={booking.channel} color={colors.iconBg} />
        
        {/* Guest name - dark for contrast */}
        <span 
          className="text-xs font-medium truncate flex-1 min-w-0 leading-tight"
          style={{ color: colors.text }}
        >
          {getDisplayName()}
        </span>
        
        {/* Price - smaller, lighter, secondary */}
        {showPrice && (
          <span 
            className="text-[10px] flex-shrink-0 font-normal opacity-60"
            style={{ color: colors.text }}
          >
            {booking.nightlyRate}€
          </span>
        )}
      </div>
    </div>
  );
};
