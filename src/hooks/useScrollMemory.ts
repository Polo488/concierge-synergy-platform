import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Restore scroll position when returning to a route, scoped per-pathname.
 * Stores in sessionStorage so it survives soft navigations but resets on tab close.
 */
export function useScrollMemory(key?: string) {
  const location = useLocation();
  const storageKey = `scroll:${key ?? location.pathname}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const y = parseInt(raw, 10);
      if (!Number.isNaN(y)) {
        // Wait one frame to ensure content rendered
        requestAnimationFrame(() => window.scrollTo(0, y));
      }
    }
    const onScroll = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [storageKey]);
}

export default useScrollMemory;
