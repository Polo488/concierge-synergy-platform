import { useState, useEffect, useCallback } from 'react';

export type PropertyColumnKey =
  | 'number'
  | 'address'
  | 'type'
  | 'owner'
  | 'commission'
  | 'nights'
  | 'bedrooms'
  | 'size'
  | 'status';

export type PropertyColumnDef = {
  key: PropertyColumnKey;
  label: string;
};

export const ALL_PROPERTY_COLUMNS: PropertyColumnDef[] = [
  { key: 'number', label: 'N°' },
  { key: 'address', label: 'Adresse' },
  { key: 'type', label: 'Type' },
  { key: 'owner', label: 'Propriétaire' },
  { key: 'commission', label: 'Commission' },
  { key: 'nights', label: 'Nuits' },
  { key: 'bedrooms', label: 'Chambres' },
  { key: 'size', label: 'Surface' },
  { key: 'status', label: 'Statut' },
];

export type PropertyColumnsConfig = {
  order: PropertyColumnKey[];
  visible: PropertyColumnKey[];
};

const DEFAULT_CONFIG: PropertyColumnsConfig = {
  order: ['number', 'address', 'type', 'owner', 'commission'],
  visible: ['number', 'address', 'type', 'owner', 'commission'],
};

const STORAGE_KEY = 'noe.properties.columns';

export function usePropertyColumns() {
  const [config, setConfig] = useState<PropertyColumnsConfig>(DEFAULT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PropertyColumnsConfig;
        if (parsed?.order && parsed?.visible) {
          setConfig(parsed);
        }
      }
    } catch {
      /* ignore */
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((next: PropertyColumnsConfig) => {
    setConfig(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const reset = useCallback(() => save(DEFAULT_CONFIG), [save]);

  return { config, save, reset, isLoaded, defaults: DEFAULT_CONFIG };
}
