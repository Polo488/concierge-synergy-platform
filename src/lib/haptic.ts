/**
 * Haptic feedback utility — Web Vibration API with graceful fallback.
 * Respects prefers-reduced-motion and silently no-ops where unsupported (iOS Safari).
 */

const canVibrate = (): boolean => {
  if (typeof window === "undefined") return false;
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return false;
  try {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) return false;
  } catch {
    /* ignore */
  }
  return true;
};

const vibe = (pattern: number | number[]) => {
  if (!canVibrate()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
};

export const haptic = {
  /** Tap on a primary button */
  tap: () => vibe(10),
  /** Selection / toggle change */
  selection: () => vibe(8),
  /** Toggle on/off */
  toggle: () => vibe(15),
  /** Long-press triggered / pull threshold reached */
  impact: () => vibe(20),
  /** Successful action (saved, sync ok) */
  success: () => vibe([30, 80, 30]),
  /** Warning / undo dismissal */
  warning: () => vibe([20, 50, 20]),
  /** Error / invalid action */
  error: () => vibe([50, 80, 50, 80, 50]),
  /** Slider tick */
  tick: () => vibe(5),
};

export default haptic;
