import { useEffect, useRef, useState } from "react";
import { haptic } from "@/lib/haptic";

interface Options {
  onRefresh: () => Promise<unknown> | unknown;
  /** Threshold in px to trigger refresh. Default 80 */
  threshold?: number;
  /** Disable on desktop (pointer:fine). Default true */
  disabledOnDesktop?: boolean;
  /** Container ref. If omitted, uses window/document */
  containerRef?: React.RefObject<HTMLElement>;
}

/**
 * Pull-to-refresh hook with rubber-band feel and haptic milestones.
 * Returns { pull, isRefreshing, ready } so callers can render an indicator.
 */
export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  disabledOnDesktop = true,
  containerRef,
}: Options) {
  const [pull, setPull] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ready, setReady] = useState(false);
  const startY = useRef<number | null>(null);
  const lastReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (disabledOnDesktop && window.matchMedia("(pointer: fine)").matches) return;

    const target: HTMLElement | Window = containerRef?.current ?? window;
    const getScrollTop = () =>
      containerRef?.current ? containerRef.current.scrollTop : window.scrollY;

    const onTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      if (getScrollTop() > 0) {
        startY.current = null;
        return;
      }
      startY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startY.current == null || isRefreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPull(0);
        return;
      }
      // Rubber band — sqrt resistance after threshold
      const resisted = delta < threshold ? delta : threshold + Math.sqrt(delta - threshold) * 6;
      setPull(resisted);
      const isReady = resisted >= threshold;
      if (isReady !== lastReadyRef.current) {
        lastReadyRef.current = isReady;
        setReady(isReady);
        if (isReady) haptic.impact();
      }
    };

    const onTouchEnd = async () => {
      if (startY.current == null) return;
      startY.current = null;
      if (lastReadyRef.current && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
          haptic.success();
        } catch {
          haptic.error();
        } finally {
          setIsRefreshing(false);
          setPull(0);
          setReady(false);
          lastReadyRef.current = false;
        }
      } else {
        setPull(0);
        setReady(false);
        lastReadyRef.current = false;
      }
    };

    (target as HTMLElement).addEventListener("touchstart", onTouchStart as EventListener, {
      passive: true,
    });
    (target as HTMLElement).addEventListener("touchmove", onTouchMove as EventListener, {
      passive: true,
    });
    (target as HTMLElement).addEventListener("touchend", onTouchEnd as EventListener, {
      passive: true,
    });

    return () => {
      (target as HTMLElement).removeEventListener("touchstart", onTouchStart as EventListener);
      (target as HTMLElement).removeEventListener("touchmove", onTouchMove as EventListener);
      (target as HTMLElement).removeEventListener("touchend", onTouchEnd as EventListener);
    };
  }, [onRefresh, threshold, disabledOnDesktop, containerRef, isRefreshing]);

  return { pull, isRefreshing, ready };
}

export default usePullToRefresh;
