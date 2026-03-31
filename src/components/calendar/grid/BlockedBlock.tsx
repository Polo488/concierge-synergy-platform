
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

const BAR_H = 26;
const BAR_TOP = 13;

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
  const cellWidth = cellWidthProp || 48;
  const hasVisibleEnd = isEndDay && !isEndTruncated;

  // Same width rule: end day occupies 40%
  let width: number;
  if (hasVisibleEnd) {
    width = (visibleDays - 1) * cellWidth + Math.round(cellWidth * 0.4);
  } else {
    width = visibleDays * cellWidth;
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
        "absolute flex items-center gap-1",
        onClick && "cursor-pointer hover:brightness-110"
      )}
      style={{
        top: BAR_TOP,
        height: BAR_H,
        borderRadius: 6,
        width: `${Math.max(width, 20)}px`,
        left: 0,
        backgroundColor: '#E5E7EB',
        border: '1px solid #D1D5DB',
        overflow: 'hidden',
        padding: '0 8px',
        contain: 'layout style',
        zIndex: 2,
      }}
      title={blocked.reason || 'Bloqué - Cliquez pour modifier'}
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <Ban className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6B7280' }} />

      {width > 48 && (
        <span
          className="truncate"
          style={{
            color: '#6B7280',
            fontSize: 11,
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
