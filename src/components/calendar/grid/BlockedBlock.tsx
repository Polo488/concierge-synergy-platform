
import React from 'react';
import { cn } from '@/lib/utils';
import { Ban } from 'lucide-react';
import type { BlockedPeriod } from '@/types/calendar';

interface BlockedBlockProps {
  blocked: BlockedPeriod;
  visibleDays: number;
  isStartTruncated: boolean;
  isEndTruncated: boolean;
}

export const BlockedBlock: React.FC<BlockedBlockProps> = ({
  blocked,
  visibleDays,
  isStartTruncated,
  isEndTruncated,
}) => {
  const width = visibleDays * 40;

  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 z-10 flex items-center gap-1.5 px-2",
        "bg-zinc-700 dark:bg-zinc-600",
        !isStartTruncated && "rounded-l-md",
        !isEndTruncated && "rounded-r-md"
      )}
      style={{
        width: `${width - 2}px`,
        left: '1px',
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
