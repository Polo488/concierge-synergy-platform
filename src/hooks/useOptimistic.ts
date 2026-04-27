import { useCallback, useRef, useState } from "react";

/**
 * React 18-compatible optimistic state.
 *
 * Usage:
 *   const [items, runOptimistic] = useOptimistic(serverItems);
 *   runOptimistic(
 *     prev => prev.filter(i => i.id !== id),  // immediate UI
 *     () => api.delete(id)                    // async work
 *   );
 *
 * If the async work throws, the UI rolls back to the previous state.
 */
export function useOptimistic<T>(initial: T) {
  const [state, setState] = useState<T>(initial);
  const baseRef = useRef<T>(initial);
  baseRef.current = state;

  const run = useCallback(
    async <R>(
      updater: (prev: T) => T,
      task: () => Promise<R>,
      options?: { onError?: (err: unknown) => void; onSuccess?: (res: R) => void }
    ): Promise<R | undefined> => {
      const previous = baseRef.current;
      const next = updater(previous);
      setState(next);
      try {
        const result = await task();
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        setState(previous);
        options?.onError?.(err);
        return undefined;
      }
    },
    []
  );

  return [state, run, setState] as const;
}

export default useOptimistic;
