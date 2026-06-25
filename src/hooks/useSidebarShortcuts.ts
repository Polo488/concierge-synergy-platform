import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'noe.sidebar.shortcuts';
export const MAX_SHORTCUTS = 5;

export function useSidebarShortcuts() {
  const [shortcuts, setShortcuts] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setShortcuts(parsed.slice(0, MAX_SHORTCUTS));
      }
    } catch {
      /* ignore */
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((next: string[]) => {
    const trimmed = next.slice(0, MAX_SHORTCUTS);
    setShortcuts(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      /* ignore */
    }
  }, []);

  return { shortcuts, save, isLoaded };
}
