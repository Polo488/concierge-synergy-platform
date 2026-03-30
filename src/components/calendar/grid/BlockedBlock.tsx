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
  cellWidth?: number;
}

const BLOCKED_BG = '#9CA3AF';

export const BlockedBlock: React.FC<BlockedBlockProps> = ({
  blocked,
  visibleDays,
  isStartDay,
  isEndDay,
  isStartTruncated,
  isEndTruncated,
  onClick,
  onCleaningIndicatorClick,
  cellWidth: cellWidthProp,
}) => {
  const cellWidth = cellWidthProp || 40;
  const halfCell = cellWidth / 2;

  const hasVisibleStart = isStartDay && !isStartTruncated;
  const hasVisibleEnd = isEndDay && !isEndTruncated;

  let width: number;
  let leftOffset = 0;

  if (hasVisibleStart && hasVisibleEnd) {
    width = (visibleDays - 1) * cellWidth + halfCell;
    leftOffset = halfCell;
  } else if (hasVisibleStart && !hasVisibleEnd) {
    width = visibleDays * cellWidth - halfCell;
    leftOffset = halfCell;
  } else if (!hasVisibleStart && hasVisibleEnd) {
    width = (visibleDays - 1) * cellWidth + halfCell;
    leftOffset = 0;
  } else {
    width = visibleDays * cellWidth;
    leftOffset = 0;
  }

  const hasCleaningScheduled = blocked.cleaningSchedule?.enabled;

  const truncateReason = (reason: string | undefined, maxLength: number = 12): string => {
    const text = reason || 'Bloqué';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 1) + '…';
  };

  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center gap-1",
        "rounded-lg",
        "transition-all duration-200 ease-out",
        onClick && "cursor-pointer hover:z-20 hover:brightness-110"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        backgroundColor: BLOCKED_BG,
        overflow: 'hidden',
        padding: '0 8px',
        contain: 'strict',
      }}
      title={blocked.reason || 'Bloqué - Cliquez pour modifier'}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <Ban className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#FFFFFF' }} />

      {visibleDays > 1 && (
        <span
          className="truncate"
          style={{
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {truncateReason(blocked.reason)}
        </span>
      )}

      {hasCleaningScheduled && isEndDay && !isEndTruncated && (
        <div
          className={cn(
            "absolute -right-0.5 top-1/2 -translate-y-1/2 translate-x-1/2",
            "w-5 h-5 rounded-full bg-primary flex items-center justify-center",
            "cursor-pointer hover:scale-110 transition-transform",
            "shadow-sm border-2 border-background"
          )}
          onClick={(e) => { e.stopPropagation(); onCleaningIndicatorClick?.(); }}
          title="Ménage programmé"
        >
          <Sparkles className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};
