import { useEffect, useRef, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { haptic } from "@/lib/haptic";
import { LucideIcon } from "lucide-react";

export interface SwipeAction {
  label: string;
  icon?: LucideIcon;
  /** Tailwind background color class */
  color?: string;
  onAction: () => void;
}

interface SwipeRowProps {
  children: ReactNode;
  /** Actions revealed when swiping LEFT (i.e. shown on the right side) */
  leftActions?: SwipeAction[];
  /** Actions revealed when swiping RIGHT (shown on left) */
  rightActions?: SwipeAction[];
  /** If swipe exceeds 50% of width, auto-execute first leftActions item */
  fullSwipeAction?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * iOS-style swipeable row. Supports left/right reveal + full-swipe shortcut.
 * On desktop (mouse): renders a hover-revealed action strip on the right.
 */
export function SwipeRow({
  children,
  leftActions = [],
  rightActions = [],
  fullSwipeAction,
  className,
  disabled = false,
}: SwipeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const REVEAL = 80 * Math.max(leftActions.length, 1);
  const REVEAL_RIGHT = 80 * Math.max(rightActions.length, 1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (isFinePointer) return; // skip touch handlers on desktop
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    startX.current = e.touches[0].clientX - offset;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null || disabled) return;
    let next = e.touches[0].clientX - startX.current;
    const width = containerRef.current?.offsetWidth ?? 320;

    // Clamp with rubber-band beyond max
    const minOffset = -REVEAL;
    const maxOffset = REVEAL_RIGHT;
    if (next < minOffset) {
      const over = minOffset - next;
      next = minOffset - Math.sqrt(over) * 4;
    } else if (next > maxOffset) {
      const over = next - maxOffset;
      next = maxOffset + Math.sqrt(over) * 4;
    }

    setOffset(next);

    const lockThreshold = -width * 0.5;
    const willLock = !!fullSwipeAction && next < lockThreshold;
    if (willLock !== isLocked) {
      setIsLocked(willLock);
      if (willLock) haptic.impact();
    }
  };

  const onTouchEnd = () => {
    if (startX.current == null || disabled) return;
    startX.current = null;
    if (isLocked && fullSwipeAction) {
      fullSwipeAction();
      setOffset(0);
      setIsLocked(false);
      return;
    }
    // Snap to revealed position or close
    if (offset < -REVEAL * 0.4 && leftActions.length > 0) {
      setOffset(-REVEAL);
    } else if (offset > REVEAL_RIGHT * 0.4 && rightActions.length > 0) {
      setOffset(REVEAL_RIGHT);
    } else {
      setOffset(0);
    }
  };

  const close = () => {
    setOffset(0);
    setIsLocked(false);
  };

  const renderActionStrip = (actions: SwipeAction[], side: "left" | "right") => (
    <div
      className={cn(
        "absolute top-0 bottom-0 flex items-stretch",
        side === "right" ? "right-0" : "left-0"
      )}
      style={{ width: side === "right" ? REVEAL : REVEAL_RIGHT }}
    >
      {actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              haptic.tap();
              a.onAction();
              close();
            }}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 px-2 text-white text-[11px] font-medium transition-colors min-w-[64px]",
              a.color ?? "bg-primary"
            )}
            style={{ minHeight: 44 }}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="truncate max-w-full">{a.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-[inherit] group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Action strips behind the content */}
      {leftActions.length > 0 && renderActionStrip(leftActions, "right")}
      {rightActions.length > 0 && renderActionStrip(rightActions, "left")}

      {/* Foreground sliding content */}
      <div
        className={cn(
          "relative bg-card transition-transform",
          startX.current == null ? "duration-300 ease-out" : "duration-0",
          isLocked && "scale-[0.99]"
        )}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => offset !== 0 && close()}
      >
        {children}
      </div>

      {/* Desktop hover reveal — only when no touch swipe in progress */}
      {leftActions.length > 0 && offset === 0 && (
        <div
          className={cn(
            "hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 transition-opacity pointer-events-none",
            isHovered ? "opacity-100 pointer-events-auto" : "opacity-0"
          )}
        >
          {leftActions.map((a, i) => {
            const Icon = a.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  haptic.tap();
                  a.onAction();
                }}
                className={cn(
                  "h-9 px-3 rounded-full text-xs font-medium text-white shadow-sm flex items-center gap-1.5 hover:scale-105 transition-transform",
                  a.color ?? "bg-primary"
                )}
                title={a.label}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{a.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** iOS-signature swipe action color presets */
export const SwipeColors = {
  destructive: "bg-[#FF3B30]",
  archive: "bg-[#FF9500]",
  info: "bg-[#5B6CE8]",
  success: "bg-[#34C759]",
  primary: "bg-primary",
} as const;

export default SwipeRow;
