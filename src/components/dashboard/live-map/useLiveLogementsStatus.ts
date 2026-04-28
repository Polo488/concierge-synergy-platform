import { useEffect, useState } from 'react';
import { LOGEMENTS, type Logement } from '@/mocks/dashboard';

/**
 * Hook live des statuts de logements.
 * V1 : retourne les mocks, polling 60s (re-trigger pour ré-évaluer les anneaux countdown).
 * V2 : brancher Supabase Realtime / WebSocket sans modifier l'API publique.
 */
export function useLiveLogementsStatus(): { logements: Logement[]; tick: number } {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 60_000);
    return () => window.clearInterval(id);
  }, []);

  return { logements: LOGEMENTS, tick };
}

/**
 * Calcule la progression de l'anneau countdown (0 → 1) sur 24h.
 * 24h = 0, 0h = 1.
 */
export function checkinProgress(checkinAtIso?: string): number {
  if (!checkinAtIso) return 0;
  const target = new Date(checkinAtIso).getTime();
  const now = Date.now();
  const remainingH = Math.max(0, (target - now) / 3_600_000);
  const clamped = Math.min(24, remainingH);
  return 1 - clamped / 24;
}

/** Seed stable pour delay de pulsation (reproductible par id) */
export function seededDelay(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000; // 0 → 1s
}
