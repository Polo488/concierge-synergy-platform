import { createContext, useContext, useMemo, useState, ReactNode, useCallback, useEffect } from "react";
import {
  initialBaList,
  buildInitialInvoices,
  bankTransactions as INITIAL_BANK,
  otaPayouts,
  otaTransactions,
  buildEscrowEntries,
  escrowOpeningBalance,
  type BonATirer,
  type Invoice,
  type BankTransaction,
  type EscrowMovement,
  type BaStatus,
  type InvoiceStatus,
} from "@/mocks/facturationMetier";
import { properties, owners, getOwnerByProperty } from "@/mocks/facturation";

interface MetierState {
  baList: BonATirer[];
  invoices: Invoice[];
  bankList: BankTransaction[];
  escrowMovements: EscrowMovement[];

  validateBa: (id: string) => void;
  validateAllBa: () => void;
  validateInvoice: (id: string) => void;
  validateAllInvoices: () => void;
  setNegativeDecision: (invoiceId: string, decision: "deferred" | "manual_collect") => void;

  reconcileBank: (bankId: string, payoutRef: string) => void;
  categorizeBank: (bankId: string, source: BankTransaction["source"]) => void;
  autoReconcile: () => number;

  // Computed
  baStats: { total: number; validated: number; ready: number; blocked: number };
  invoiceStats: { total: number; validated: number; ready: number; blocked: number; deferred: number; sent: number };
  reconciliation: { matched: number; unmatched: number; manual: number; total: number };
  escrow: {
    openingBalance: number;
    currentBalance: number;
    simulatedAfterSepa: number;
    simulationOk: boolean;
    sepaTotal: number;
  };
  closingChecks: {
    allBaValidated: boolean;
    allInvoicesValid: boolean;
    reconciliationDone: boolean;
    escrowOk: boolean;
    canClose: boolean;
    blockers: string[];
  };
  monthClosed: boolean;
  closeMonth: () => void;
}

const MetierCtx = createContext<MetierState | null>(null);

interface ProviderProps {
  children: ReactNode;
  // calculs externes (depuis useFacturation principal)
  cleaningTotalsByProp: Record<string, number>;
  maintenanceTotalsByProp: Record<string, number>;
  miscTotalsByProp: Record<string, number>;
  /** Net SEPA effectif par owner (pour simulation séquestre) */
  sepaTotal: number;
}

export function FacturationMetierProvider({
  children,
  cleaningTotalsByProp,
  maintenanceTotalsByProp,
  miscTotalsByProp,
  sepaTotal,
}: ProviderProps) {
  const [baList, setBaList] = useState<BonATirer[]>(initialBaList);
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    buildInitialInvoices(initialBaList, cleaningTotalsByProp, maintenanceTotalsByProp, miscTotalsByProp)
  );
  const [bankList, setBankList] = useState<BankTransaction[]>(INITIAL_BANK);
  const [monthClosed, setMonthClosed] = useState(false);
  const [escrowMovements] = useState<EscrowMovement[]>(buildEscrowEntries());

  // Recompute invoices on totals change (without overwriting status/decisions)
  useEffect(() => {
    setInvoices((prev) => {
      const fresh = buildInitialInvoices(initialBaList, cleaningTotalsByProp, maintenanceTotalsByProp, miscTotalsByProp);
      return fresh.map((f) => {
        const existing = prev.find((p) => p.id === f.id);
        if (!existing) return f;
        return { ...f, status: existing.status, blockingReasons: existing.blockingReasons, negativeDecision: existing.negativeDecision };
      });
    });
  }, [cleaningTotalsByProp, maintenanceTotalsByProp, miscTotalsByProp]);

  // ============================================================
  // BA validation : check que tous les payouts du BA sont rapprochés banque
  // ============================================================
  const computeBaBlockers = useCallback((ba: BonATirer, currentBank: BankTransaction[]): string[] => {
    const blockers: string[] = [];
    ba.payoutIds.forEach((pid) => {
      const payout = otaPayouts.find((p) => p.id === pid);
      if (!payout) return;
      const matched = currentBank.find((b) => b.matchedPayoutId === pid);
      if (!matched) blockers.push(`Payout ${payout.reference} non rapproché banque`);
    });
    return blockers;
  }, []);

  // Recalcule les blockers BA quand la banque change
  useEffect(() => {
    setBaList((prev) => prev.map((ba) => {
      if (ba.status === "validated") return ba;
      const blockers = computeBaBlockers(ba, bankList);
      return { ...ba, blockingReasons: blockers, status: blockers.length === 0 ? "ready" : "draft" };
    }));
  }, [bankList, computeBaBlockers]);

  const validateBa = useCallback((id: string) => {
    setBaList((prev) => prev.map((ba) => {
      if (ba.id !== id) return ba;
      if (ba.blockingReasons.length > 0) return ba;
      return { ...ba, status: "validated" as BaStatus, validatedAt: new Date().toISOString(), validatedBy: "Admin" };
    }));
  }, []);

  const validateAllBa = useCallback(() => {
    setBaList((prev) => prev.map((ba) => {
      if (ba.status === "validated") return ba;
      if (ba.blockingReasons.length > 0) return ba;
      return { ...ba, status: "validated" as BaStatus, validatedAt: new Date().toISOString(), validatedBy: "Admin" };
    }));
  }, []);

  // ============================================================
  // Invoice validation : nécessite BA validé + IBAN valide
  // ============================================================
  const computeInvoiceBlockers = useCallback((inv: Invoice, currentBaList: BonATirer[]): string[] => {
    const blockers: string[] = [];
    const ba = currentBaList.find((b) => b.id === inv.baId);
    if (!ba || ba.status !== "validated") blockers.push("BA non validé");
    const owner = owners.find((o) => o.id === inv.ownerId);
    if (!owner || !owner.iban || owner.iban.length < 20) blockers.push("IBAN propriétaire manquant");
    if (inv.netOwner < 0 && inv.negativeDecision === null) {
      blockers.push("Net négatif — décision requise (report ou encaissement)");
    }
    return blockers;
  }, []);

  useEffect(() => {
    setInvoices((prev) => prev.map((inv) => {
      if (inv.status === "sent") return inv;
      const blockers = computeInvoiceBlockers(inv, baList);
      const status: InvoiceStatus =
        blockers.length > 0 ? "blocked"
        : inv.status === "validated" ? "validated"
        : "ready";
      return { ...inv, blockingReasons: blockers, status };
    }));
  }, [baList, computeInvoiceBlockers]);

  const validateInvoice = useCallback((id: string) => {
    setInvoices((prev) => prev.map((inv) => {
      if (inv.id !== id) return inv;
      if (inv.blockingReasons.length > 0) return inv;
      return { ...inv, status: "validated" as InvoiceStatus };
    }));
  }, []);

  const validateAllInvoices = useCallback(() => {
    setInvoices((prev) => prev.map((inv) => {
      if (inv.blockingReasons.length > 0) return inv;
      if (inv.status === "sent") return inv;
      return { ...inv, status: "validated" as InvoiceStatus };
    }));
  }, []);

  const setNegativeDecision = useCallback((invoiceId: string, decision: "deferred" | "manual_collect") => {
    setInvoices((prev) => prev.map((inv) => inv.id === invoiceId ? { ...inv, negativeDecision: decision } : inv));
  }, []);

  // ============================================================
  // Réconciliation
  // ============================================================
  const reconcileBank = useCallback((bankId: string, payoutRef: string) => {
    const payout = otaPayouts.find((p) => p.reference === payoutRef);
    if (!payout) return;
    setBankList((prev) => prev.map((b) =>
      b.id === bankId
        ? { ...b, matchedPayoutId: payout.id, matchedReference: payout.reference, reconciliationStatus: "matched" }
        : b
    ));
  }, []);

  const categorizeBank = useCallback((bankId: string, source: BankTransaction["source"]) => {
    setBankList((prev) => prev.map((b) =>
      b.id === bankId ? { ...b, source, reconciliationStatus: "manual" } : b
    ));
  }, []);

  const autoReconcile = useCallback(() => {
    let count = 0;
    setBankList((prev) => prev.map((b) => {
      if (b.reconciliationStatus === "matched") return b;
      // Cherche une référence (G-XXXX, BK-PAY-XXX) dans le label
      const refMatch = b.label.match(/G-\d+|BK-PAY-\d+/);
      if (!refMatch) return b;
      const payout = otaPayouts.find((p) => p.reference === refMatch[0]);
      if (!payout) return b;
      // Tolérance 0.01€
      if (Math.abs(payout.amount - b.amount) > 0.01) return b;
      count++;
      return { ...b, matchedPayoutId: payout.id, matchedReference: payout.reference, reconciliationStatus: "matched" as const };
    }));
    return count;
  }, []);

  // ============================================================
  // Computed
  // ============================================================
  const baStats = useMemo(() => ({
    total: baList.length,
    validated: baList.filter((b) => b.status === "validated").length,
    ready: baList.filter((b) => b.status === "ready").length,
    blocked: baList.filter((b) => b.status === "draft" && b.blockingReasons.length > 0).length,
  }), [baList]);

  const invoiceStats = useMemo(() => ({
    total: invoices.length,
    validated: invoices.filter((i) => i.status === "validated").length,
    ready: invoices.filter((i) => i.status === "ready").length,
    blocked: invoices.filter((i) => i.status === "blocked").length,
    deferred: invoices.filter((i) => i.negativeDecision === "deferred").length,
    sent: invoices.filter((i) => i.status === "sent").length,
  }), [invoices]);

  const reconciliation = useMemo(() => ({
    matched: bankList.filter((b) => b.reconciliationStatus === "matched").length,
    unmatched: bankList.filter((b) => b.reconciliationStatus === "unmatched").length,
    manual: bankList.filter((b) => b.reconciliationStatus === "manual").length,
    total: bankList.length,
  }), [bankList]);

  const escrow = useMemo(() => {
    const inflows = bankList.filter((b) => b.amount > 0).reduce((a, b) => a + b.amount, 0);
    const currentBalance = escrowOpeningBalance + inflows;
    // Simulation : on retire les paiements SEPA prévus (uniquement factures éligibles)
    const eligibleSepa = invoices
      .filter((i) => i.status === "validated" && i.netOwner >= 0 && i.negativeDecision !== "deferred")
      .reduce((a, i) => a + i.netOwner, 0);
    const simulatedAfterSepa = currentBalance - eligibleSepa;
    return {
      openingBalance: escrowOpeningBalance,
      currentBalance: Math.round(currentBalance * 100) / 100,
      simulatedAfterSepa: Math.round(simulatedAfterSepa * 100) / 100,
      simulationOk: simulatedAfterSepa >= 0,
      sepaTotal: Math.round(eligibleSepa * 100) / 100,
    };
  }, [bankList, invoices]);

  const closingChecks = useMemo(() => {
    const allBaValidated = baStats.total > 0 && baStats.validated === baStats.total;
    const allInvoicesValid = invoiceStats.total > 0 && invoiceStats.blocked === 0;
    const reconciliationDone = reconciliation.unmatched === 0;
    const escrowOk = escrow.simulationOk;
    const blockers: string[] = [];
    if (!allBaValidated) blockers.push(`${baStats.total - baStats.validated} BA non validés`);
    if (!allInvoicesValid) blockers.push(`${invoiceStats.blocked} facture(s) bloquée(s)`);
    if (!reconciliationDone) blockers.push(`${reconciliation.unmatched} virement(s) non rapproché(s)`);
    if (!escrowOk) blockers.push("Simulation séquestre négative");
    return {
      allBaValidated,
      allInvoicesValid,
      reconciliationDone,
      escrowOk,
      canClose: allBaValidated && allInvoicesValid && reconciliationDone && escrowOk,
      blockers,
    };
  }, [baStats, invoiceStats, reconciliation, escrow]);

  const closeMonth = useCallback(() => {
    if (!closingChecks.canClose) return;
    setMonthClosed(true);
  }, [closingChecks.canClose]);

  const value: MetierState = {
    baList,
    invoices,
    bankList,
    escrowMovements,
    validateBa,
    validateAllBa,
    validateInvoice,
    validateAllInvoices,
    setNegativeDecision,
    reconcileBank,
    categorizeBank,
    autoReconcile,
    baStats,
    invoiceStats,
    reconciliation,
    escrow,
    closingChecks,
    monthClosed,
    closeMonth,
  };

  return <MetierCtx.Provider value={value}>{children}</MetierCtx.Provider>;
}

export function useFacturationMetier() {
  const ctx = useContext(MetierCtx);
  if (!ctx) throw new Error("useFacturationMetier must be used within FacturationMetierProvider");
  return ctx;
}
