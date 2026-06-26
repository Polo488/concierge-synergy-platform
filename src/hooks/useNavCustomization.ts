import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'noe.nav.customization.v1';
const DEFAULT_TOP = ['/app']; // Dashboard always pinned at top out-of-category

type State = {
  top: string[];
  sections: Record<string, string[]>; // overrides per section
};

const DEFAULT_STATE: State = { top: DEFAULT_TOP, sections: {} };

export function useNavCustomization() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.top) && parsed.sections) {
          setState({ top: parsed.top, sections: parsed.sections });
        }
      }
    } catch {
      /* ignore */
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((next: State) => {
    setState(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const moveItem = useCallback(
    (path: string, toContainer: string, toIndex: number) => {
      setState(prev => {
        const top = prev.top.filter(p => p !== path);
        const sections: Record<string, string[]> = {};
        Object.entries(prev.sections).forEach(([sid, paths]) => {
          sections[sid] = paths.filter(p => p !== path);
        });

        if (toContainer === '__top__') {
          const i = Math.max(0, Math.min(toIndex, top.length));
          top.splice(i, 0, path);
        } else {
          const arr = sections[toContainer] ?? [];
          const i = Math.max(0, Math.min(toIndex, arr.length));
          arr.splice(i, 0, path);
          sections[toContainer] = arr;
        }
        const next = { top, sections };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => persist(DEFAULT_STATE), [persist]);

  return { state, isLoaded, moveItem, reset };
}

/** Compute final ordered items per container, given default sections and customization state. */
export function computeNavLayout<T extends { path: string }>(
  defaultSections: { id: string; items: T[] }[],
  state: { top: string[]; sections: Record<string, string[]> }
) {
  const allByPath = new Map<string, { item: T; defaultSid: string }>();
  defaultSections.forEach(s => {
    s.items.forEach(it => allByPath.set(it.path, { item: it, defaultSid: s.id }));
  });

  const placedElsewhere = new Set<string>(state.top);
  Object.values(state.sections).forEach(arr => arr.forEach(p => placedElsewhere.add(p)));

  const resolveList = (paths: string[]) =>
    paths.map(p => allByPath.get(p)?.item).filter((x): x is T => Boolean(x));

  const top = resolveList(state.top);

  const sections = defaultSections.map(s => {
    const override = state.sections[s.id];
    let items: T[];
    if (override) {
      // Use explicit override; append any default items not placed anywhere
      const inOverride = new Set(override);
      const defaultExtras = s.items.filter(it => !placedElsewhere.has(it.path) && !inOverride.has(it.path));
      items = [...resolveList(override).filter(it => allByPath.get(it.path)?.defaultSid !== undefined), ...defaultExtras];
    } else {
      // Default order, minus anything user moved away
      items = s.items.filter(it => !placedElsewhere.has(it.path));
    }
    return { ...s, items };
  });

  // Build container lookup
  const containerByPath = new Map<string, string>();
  state.top.forEach(p => containerByPath.set(p, '__top__'));
  sections.forEach(s => s.items.forEach(it => {
    if (!containerByPath.has(it.path)) containerByPath.set(it.path, s.id);
  }));

  return { top, sections, containerByPath };
}
