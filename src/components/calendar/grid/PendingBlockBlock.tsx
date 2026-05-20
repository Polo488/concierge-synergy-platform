import React from 'react';
import { Clock } from 'lucide-react';
import type { BlockRequest } from '@/types/blockRequest';
import { MOTIF_LABELS } from '@/types/blockRequest';

const BAR_H = 26;
const BAR_TOP = 13;

interface PendingBlockBlockProps {
  request: BlockRequest;
  visibleDays: number;
  isEndDay: boolean;
  isEndTruncated: boolean;
  cellWidth: number;
  onClick?: () => void;
}

/**
 * Yellow striped overlay representing a pending owner block request.
 * Same geometry as BlockedBlock so admin/owner see consistent layout.
 */
export const PendingBlockBlock: React.FC<PendingBlockBlockProps> = ({
  request,
  visibleDays,
  isEndDay,
  isEndTruncated,
  cellWidth,
  onClick,
}) => {
  const hasVisibleEnd = isEndDay && !isEndTruncated;
  const width = hasVisibleEnd
    ? (visibleDays - 1) * cellWidth + Math.round(cellWidth * 0.4)
    : visibleDays * cellWidth;

  return (
    <div
      className="absolute flex items-center gap-1 cursor-pointer hover:brightness-105"
      style={{
        top: BAR_TOP,
        height: BAR_H,
        borderRadius: 6,
        width: `${Math.max(width, 20)}px`,
        left: 0,
        background:
          'repeating-linear-gradient(45deg, #FEF3C7, #FEF3C7 6px, #FDE68A 6px, #FDE68A 12px)',
        border: '1.5px dashed #B45309',
        overflow: 'hidden',
        padding: '0 8px',
        zIndex: 2,
      }}
      title={`Demande en attente — ${MOTIF_LABELS[request.motif]} (${request.ownerName})`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#92400E' }} />
      {width > 56 && (
        <span
          style={{
            color: '#92400E',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          En attente
        </span>
      )}
    </div>
  );
};
