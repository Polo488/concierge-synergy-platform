import { ReactNode, useMemo } from "react";
import { useFacturation } from "@/hooks/useFacturation";
import { FacturationMetierProvider } from "@/hooks/useFacturationMetier";

/**
 * Bridge — calcule les totaux par propriété depuis le state principal de facturation
 * et alimente le provider Métier (BA, factures, séquestre, réconciliation).
 */
export function FacturationMetierBridge({ children }: { children: ReactNode }) {
  const { cleaning, maintenance, misc, reservations } = useFacturation();

  const cleaningTotalsByProp = useMemo(() => {
    const m: Record<string, number> = {};
    cleaning.forEach((c) => {
      m[c.propertyId] = (m[c.propertyId] || 0) + c.billedPrice;
    });
    return m;
  }, [cleaning]);

  const maintenanceTotalsByProp = useMemo(() => {
    const m: Record<string, number> = {};
    maintenance.forEach((mt) => {
      m[mt.propertyId] = (m[mt.propertyId] || 0) + mt.billedPrice;
    });
    return m;
  }, [maintenance]);

  const miscTotalsByProp = useMemo(() => {
    const m: Record<string, number> = {};
    misc.forEach((x) => {
      m[x.propertyId] = (m[x.propertyId] || 0) + x.amountHT * (1 + x.vatRate);
    });
    return m;
  }, [misc]);

  const sepaTotal = useMemo(
    () => reservations.reduce((a, r) => a + r.netOwner, 0),
    [reservations]
  );

  return (
    <FacturationMetierProvider
      cleaningTotalsByProp={cleaningTotalsByProp}
      maintenanceTotalsByProp={maintenanceTotalsByProp}
      miscTotalsByProp={miscTotalsByProp}
      sepaTotal={sepaTotal}
    >
      {children}
    </FacturationMetierProvider>
  );
}
