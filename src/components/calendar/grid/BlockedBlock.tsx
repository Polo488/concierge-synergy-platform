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

// Calm, tinted color palette for blocked periods
const BLOCKED_COLORS = {
  bg: 'rgba(120, 125, 140, 0.12)',      // Very light neutral tint
  iconBg: 'hsl(220 10% 45%)',            // Solid grey for icon
  text: 'hsl(220 15% 35%)',              // Dark grey for text
};

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
  
  // Pure rectangle positioning (same logic as BookingBlock)
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
        "absolute top-1 bottom-1 z-10 flex items-center gap-1 px-1.5",
        "rounded-md",
        "transition-all duration-200 ease-out",
        onClick && "cursor-pointer hover:z-20"
      )}
      style={{
        width: `${Math.max(width, 20)}px`,
        left: `${leftOffset}px`,
        backgroundColor: BLOCKED_COLORS.bg,
        boxShadow: '0 1px 3px -1px rgba(0,0,0,0.06)',
      }}
      title={blocked.reason || 'Bloqué - Cliquez pour modifier'}
      onClick={handleBlockClick}
    >
      {/* Ban icon - solid, crisp */}
      <Ban 
        className="w-3.5 h-3.5 flex-shrink-0" 
        style={{ color: BLOCKED_COLORS.iconBg }}
      />
      
      {/* Reason text - dark for contrast */}
      {visibleDays > 1 && (
        <span 
          className="text-xs font-medium truncate"
          style={{ color: BLOCKED_COLORS.text }}
        >
          {truncateReason(blocked.reason)}
        </span>
      )}
      
      {/* Cleaning scheduled indicator */}
      {hasCleaningScheduled && isEndDay && !isEndTruncated && (
        <div 
          className={cn(
            "absolute -right-0.5 top-1/2 -translate-y-1/2 translate-x-1/2",
            "w-5 h-5 rounded-full bg-primary flex items-center justify-center",
            "cursor-pointer hover:scale-110 transition-transform",
            "shadow-sm border-2 border-background"
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
