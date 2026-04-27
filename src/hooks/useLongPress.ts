import { useCallback, useEffect, useRef } from "react";
import { haptic } from "@/lib/haptic";

interface LongPressOptions {
  /** Trigger after this many ms held. Default 500. */
  delay?: number;
  /** Movement tolerance in px before cancelling. Default 8. */
  movementTolerance?: number;
  /** Disable on desktop pointer (mouse). Default false. */
  disabledOnFinePointer?: boolean;
  onLongPress: (e: PointerEvent | MouseEvent) => void;
}

/**
 * Long-press detection (web). Also fires on right-click (contextmenu) for desktop parity.
 * Returns spreadable handlers + a contextmenu handler.
 */
export function useLongPress({
  delay = 500,
  movementTolerance = 8,
  disabledOnFinePointer = false,
  onLongPress,
}: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const triggeredRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = null;
  }, []);

  useEffect(() => () => clear(), [clear]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabledOnFinePointer && e.pointerType === "mouse") return;
    triggeredRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY };
    const native = e.nativeEvent;
    timerRef.current = setTimeout(() => {
      triggeredRef.current = true;
      haptic.impact();
      onLongPress(native);
    }, delay);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!startRef.current || !timerRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > movementTolerance) clear();
  };

  const onPointerUp = () => clear();
  const onPointerLeave = () => clear();
  const onPointerCancel = () => clear();

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    triggeredRef.current = true;
    onLongPress(e.nativeEvent);
  };

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave,
      onPointerCancel,
      onContextMenu,
    },
    /** Use this in onClick to check if the click was suppressed by a long-press */
    wasLongPress: () => triggeredRef.current,
  };
}

export default useLongPress;
