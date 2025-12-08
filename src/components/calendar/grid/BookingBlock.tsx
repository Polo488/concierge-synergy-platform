
import React from 'react';
import { cn } from '@/lib/utils';
import type { CalendarBooking } from '@/types/calendar';
import { CHANNEL_COLORS } from '@/types/calendar';
import { ChannelIcon } from './ChannelIcon';

interface BookingBlockProps {
  booking: CalendarBooking;
  visibleDays: number;
  isStartTruncated: boolean;
  isEndTruncated: boolean;
  isPast: boolean;
  onClick: () => void;
}

export const BookingBlock: React.FC<BookingBlockProps> = ({
  booking,
  visibleDays,
  isStartTruncated,
  isEndTruncated,
  isPast,
  onClick,
}) => {
  const channelColor = CHANNEL_COLORS[booking.channel];
  const width = visibleDays * 40; // 40px per day cell

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center gap-1.5 px-2 cursor-pointer transition-all",
        "hover:brightness-110 hover:shadow-lg",
        isPast && "opacity-60",
        !isStartTruncated && "rounded-l-md",
        !isEndTruncated && "rounded-r-md"
      )}
      style={{
        width: `${width - 2}px`,
        backgroundColor: channelColor,
        left: '1px',
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
