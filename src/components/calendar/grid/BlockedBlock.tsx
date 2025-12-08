
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

  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center gap-1.5 px-2",
        "bg-zinc-700 dark:bg-zinc-600"
      )}
      style={{
        width: `${Math.max(width - 2, 20)}px`,
        left: `${leftOffset + 1}px`,
        clipPath: getBevelClipPath(isStartDay && !isStartTruncated, isEndDay && !isEndTruncated),
        borderRadius: getBevelBorderRadius(isStartTruncated, isEndTruncated, isStartDay, isEndDay),
      }}
      title={blocked.reason || 'Bloqué'}
    >
      <Ban className="w-3 h-3 text-white/80 flex-shrink-0" />
      <span className="text-xs font-medium text-white/90 truncate">
        {blocked.reason || 'Bloqué'}
      </span>
    </div>
  );
};

function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  const bevelSize = '30%';
  
  if (hasLeftBevel && hasRightBevel) {
    return `polygon(${bevelSize} 0%, 100% 0%, calc(100% - ${bevelSize}) 100%, 0% 100%)`;
  } else if (hasLeftBevel) {
    return `polygon(${bevelSize} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    return `polygon(0% 0%, 100% 0%, calc(100% - ${bevelSize}) 100%, 0% 100%)`;
  }
  
  return 'none';
}

function getBevelBorderRadius(
  isStartTruncated: boolean, 
  isEndTruncated: boolean,
  isStartDay: boolean,
  isEndDay: boolean
): string {
  const leftRadius = isStartTruncated ? '0' : (isStartDay ? '0' : '6px');
  const rightRadius = isEndTruncated ? '0' : (isEndDay ? '0' : '6px');
  
  return `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`;
}
