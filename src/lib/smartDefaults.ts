/**
 * Smart Defaults — persists per-user UI preferences (filters, sorts,
 * last-used form values) in localStorage with a versioned namespace.
 */

const NS = "noe:defaults:v1";

const safe = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const smartDefaults = {
  get<T = unknown>(key: string, fallback: T): T {
    return safe(() => {
      const raw = localStorage.getItem(`${NS}:${key}`);
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    }, fallback);
  },
  set<T>(key: string, value: T): void {
    safe(() => {
      localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
      return null;
    }, null);
  },
  remove(key: string): void {
    safe(() => {
      localStorage.removeItem(`${NS}:${key}`);
      return null;
    }, null);
  },
};

/** Common keys used across the app */
export const DefaultsKeys = {
  cleaningTab: "cleaning.tab",
  maintenanceTab: "maintenance.tab",
  messagingFilter: "messaging.filter",
  reservationsFilter: "reservations.filter",
  leadsFilter: "leads.filter",
  statsPeriod: "stats.period",
  density: "ui.density",
  lastCleaningPrice: "form.lastCleaningPrice",
  lastAssignedAgent: "form.lastAssignedAgent",
  recentSearches: "search.recents",
} as const;

export default smartDefaults;
