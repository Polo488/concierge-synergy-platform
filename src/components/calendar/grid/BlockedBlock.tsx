
import React from 'react';
import { cn } from '@/lib/utils';
import { Ban } from 'lucide-react';
import type { BlockedPeriod } from '@/types/calendar';

interface BlockedBlockProps {
  blocked: BlockedPeriod;
  visibleDays: number;
  isStartDay: boolean;
  isEndDay: boolean;
  isStartTruncated: boolean;
  isEndTruncated: boolean;
}

export const BlockedBlock: React.FC<BlockedBlockProps> = ({
  blocked,
  visibleDays,
  isStartDay,
  isEndDay,
  isStartTruncated,
  isEndTruncated,
}) => {
  let width = visibleDays * 40;
  let leftOffset = 0;
  
  // If this is the actual start day (not truncated), start from right half
  if (isStartDay && !isStartTruncated) {
    leftOffset = 20;
    width -= 20;
  }
  
  // If this is the actual end day (not truncated), end at left half
  if (isEndDay && !isEndTruncated) {
    width -= 20;
  }

  const hasLeftBevel = isStartDay && !isStartTruncated;
  const hasRightBevel = isEndDay && !isEndTruncated;

  const truncateReason = (reason: string | undefined, maxLength: number = 10): string => {
    const text = reason || 'Bloqué';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
  };

  return (
    <div
      className={cn(
        "absolute top-0.5 bottom-0.5 z-10 flex items-center gap-1 px-1.5",
        "bg-zinc-400 dark:bg-zinc-500"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        clipPath: getBevelClipPath(hasLeftBevel, hasRightBevel),
        borderRadius: hasLeftBevel && hasRightBevel ? '0' : hasLeftBevel ? '0 6px 6px 0' : hasRightBevel ? '6px 0 0 6px' : '6px',
      }}
      title={blocked.reason || 'Bloqué'}
    >
      <Ban className="w-3 h-3 text-white/80 flex-shrink-0" />
      <span className="text-xs font-medium text-white/90 truncate">
        {visibleDays > 1 ? truncateReason(blocked.reason) : ''}
      </span>
    </div>
  );
};

function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  const cut = '20px';
  
  if (hasLeftBevel && hasRightBevel) {
    return `polygon(${cut} 0%, calc(100% - ${cut}) 0%, 100% 50%, calc(100% - ${cut}) 100%, ${cut} 100%, 0% 50%)`;
  } else if (hasLeftBevel) {
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, ${cut} 100%, 0% 50%)`;
  } else if (hasRightBevel) {
    return `polygon(0% 0%, calc(100% - ${cut}) 0%, 100% 50%, calc(100% - ${cut}) 100%, 0% 100%)`;
  }
  
  return 'none';
}
