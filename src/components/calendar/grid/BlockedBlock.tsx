import React from 'react';
import { cn } from '@/lib/utils';
import { Ban, Sparkles } from 'lucide-react';
import type { BlockedPeriod } from '@/types/calendar';

interface BlockedBlockProps {
  blocked: BlockedPeriod;
  visibleDays: number;
  isStartDay: boolean;
  isEndDay: boolean;
  isStartTruncated: boolean;
  isEndTruncated: boolean;
  onClick?: () => void;
  onCleaningIndicatorClick?: () => void;
}

export const BlockedBlock: React.FC<BlockedBlockProps> = ({
  blocked,
  visibleDays,
  isStartDay,
  isEndDay,
  isStartTruncated,
  isEndTruncated,
  onClick,
  onCleaningIndicatorClick,
}) => {
  const cellWidth = 40;
  const halfCell = cellWidth / 2;
  let width = visibleDays * cellWidth;
  let leftOffset = 0;
  
  // Start day: shift right to start from middle
  if (isStartDay && !isStartTruncated) {
    leftOffset = halfCell;
  }
  
  // End day: extend to middle of end cell if start is truncated
  if (isEndDay && !isEndTruncated) {
    if (isStartTruncated || !isStartDay) {
      width += halfCell;
    }
  }

  const hasLeftBevel = isStartDay && !isStartTruncated;
  const hasRightBevel = isEndDay && !isEndTruncated;
  const hasCleaningScheduled = blocked.cleaningSchedule?.enabled;

  const truncateReason = (reason: string | undefined, maxLength: number = 10): string => {
    const text = reason || 'Bloqué';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
  };

  const handleCleaningClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCleaningIndicatorClick?.();
  };

  const handleBlockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <div
      className={cn(
        "absolute top-0.5 bottom-0.5 z-10 flex items-center gap-1 px-1.5",
        "bg-zinc-400 dark:bg-zinc-500",
        onClick && "cursor-pointer hover:bg-zinc-500 dark:hover:bg-zinc-400 transition-colors"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        clipPath: getBevelClipPath(hasLeftBevel, hasRightBevel),
        borderRadius: hasLeftBevel && hasRightBevel ? '0' : hasLeftBevel ? '0 6px 6px 0' : hasRightBevel ? '6px 0 0 6px' : '6px',
      }}
      title={blocked.reason || 'Bloqué - Cliquez pour modifier'}
      onClick={handleBlockClick}
    >
      <Ban className="w-3 h-3 text-white/80 flex-shrink-0" />
      <span className="text-xs font-medium text-white/90 truncate">
        {visibleDays > 1 ? truncateReason(blocked.reason) : ''}
      </span>
      
      {/* Cleaning scheduled indicator - positioned at end of block */}
      {hasCleaningScheduled && isEndDay && !isEndTruncated && (
        <div 
          className={cn(
            "absolute -right-0.5 top-1/2 -translate-y-1/2 translate-x-1/2",
            "w-5 h-5 rounded-full bg-primary flex items-center justify-center",
            "cursor-pointer hover:scale-110 transition-transform",
            "shadow-md border-2 border-background"
          )}
          onClick={handleCleaningClick}
          title="Ménage programmé"
        >
          <Sparkles className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

function getBevelClipPath(hasLeftBevel: boolean, hasRightBevel: boolean): string {
  const cut = '8px';
  
  if (hasLeftBevel && hasRightBevel) {
    return `polygon(${cut} 0%, calc(100% - ${cut}) 0%, 100% 100%, ${cut} 100%)`;
  } else if (hasLeftBevel) {
    return `polygon(${cut} 0%, 100% 0%, 100% 100%, 0% 100%)`;
  } else if (hasRightBevel) {
    return `polygon(0% 0%, calc(100% - ${cut}) 0%, 100% 100%, 0% 100%)`;
  }
  
  return 'none';
}
