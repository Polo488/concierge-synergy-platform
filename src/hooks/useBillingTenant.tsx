import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type BillingMode = "CARTE_G" | "HONORAIRES";

interface BillingTenantState {
  mode: BillingMode;
  setMode: (m: BillingMode) => void;
  escrowIban: string;
  escrowBic: string;
  carteGNumber: string;
  defaultCommissionRate: number;
}

const Ctx = createContext<BillingTenantState | null>(null);

const STORAGE_KEY = "noe.billing.mode";

export function BillingTenantProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<BillingMode>(() => {
    if (typeof window === "undefined") return "CARTE_G";
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "HONORAIRES" ? "HONORAIRES" : "CARTE_G";
  });

  const setMode = (m: BillingMode) => {
    setModeState(m);
    try { localStorage.setItem(STORAGE_KEY, m); } catch {}
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setModeState(e.newValue === "HONORAIRES" ? "HONORAIRES" : "CARTE_G");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value: BillingTenantState = {
    mode,
    setMode,
    escrowIban: "FR76 3000 4000 5000 6000 7000 189",
    escrowBic: "BNPAFRPP",
    carteGNumber: "CPI 7501 2026 000 012345",
    defaultCommissionRate: 20,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBillingTenant() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBillingTenant must be used within BillingTenantProvider");
  return ctx;
}
