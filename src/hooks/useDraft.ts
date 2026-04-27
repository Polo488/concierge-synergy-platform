import { useEffect, useRef } from "react";
import { smartDefaults } from "@/lib/smartDefaults";

interface DraftOptions<T> {
  /** Unique storage key for this form */
  key: string;
  /** Current form value */
  value: T;
  /** Setter to restore from draft */
  onRestore: (v: T) => void;
  /** Save interval in ms. Default 3000 */
  interval?: number;
  /** Skip if equal to this initial value */
  initial?: T;
  /** Disable auto-save (e.g., after submit) */
  disabled?: boolean;
}

const NS = "draft";

/**
 * Auto-save form drafts to localStorage every N ms.
 * On mount, prompts the consumer to restore via onRestore() if a draft exists.
 *
 * Returns helpers: { clear, hasDraft }
 */
export function useDraft<T>({
  key,
  value,
  onRestore,
  interval = 3000,
  initial,
  disabled = false,
}: DraftOptions<T>) {
  const restoredRef = useRef(false);
  const fullKey = `${NS}:${key}`;

  // Restore once on mount
  useEffect(() => {
    if (restoredRef.current || disabled) return;
    restoredRef.current = true;
    const draft = smartDefaults.get<T | null>(fullKey, null);
    if (draft != null && JSON.stringify(draft) !== JSON.stringify(initial)) {
      onRestore(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Periodic save
  useEffect(() => {
    if (disabled) return;
    const t = setInterval(() => {
      try {
        if (initial !== undefined && JSON.stringify(value) === JSON.stringify(initial)) {
          return;
        }
        smartDefaults.set(fullKey, value);
      } catch {
        /* ignore */
      }
    }, interval);
    return () => clearInterval(t);
  }, [value, interval, fullKey, initial, disabled]);

  const clear = () => smartDefaults.remove(fullKey);
  const hasDraft = () => smartDefaults.get<T | null>(fullKey, null) != null;

  return { clear, hasDraft };
}

export default useDraft;
