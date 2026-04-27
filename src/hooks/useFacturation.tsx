import { createContext, useContext, useMemo, useState, ReactNode, useCallback } from "react";
import {
  reservations as mockReservations,
  previousReservations as mockPrev,
  initialNegativeOps,
  maintenanceLines as mockMaint,
  cleaningLines as mockClean,
  miscLines as mockMisc,
  owners,
  properties,
  getOwnerByProperty,
  sum,
  currentUser,
  type Reservation,
  type NegativeOp,
  type NegativeDecision,
  type MaintenanceLine,
  type CleaningLine,
  type MiscLine,
} from "@/mocks/facturation";

export type CycleStatus = "draft" | "processing" | "validated" | "sent";
export type TabKey = "reservations" | "negatives" | "complements" | "provider-calls" | "reconciliation" | "invoices" | "escrow" | "sepa";

interface ImportedFile {
  name: string;
  rows: number;
  importedAt: Date;
}

interface FacturationState {
  // period
  periodLabel: string;
  setPeriodLabel: (v: string) => void;
  cycleStatus: CycleStatus;

  // user config
  cartG: boolean;
  setCartG: (v: boolean) => void;

  // imports
  bookingFile: ImportedFile | null;
  airbnbFile: ImportedFile | null;
  importBooking: () => void;
  importAirbnb: () => void;

  // data
  reservations: Reservation[];
  previousReservations: Reservation[];
  negativeOps: NegativeOp[];
  resolveNegative: (id: string, decision: NegativeDecision, custom?: number, note?: string) => void;
  reopenNegative: (id: string) => void;

  maintenance: MaintenanceLine[];
  setMaintenancePrice: (id: string, v: number) => void;
  cleaning: CleaningLine[];
  setCleaningPrice: (id: string, v: number) => void;
  misc: MiscLine[];
  addMisc: (line: Omit<MiscLine, "id">) => void;
  removeMisc: (id: string) => void;

  // invoices state
  invoicesGenerated: boolean;
  generateInvoices: () => void;
  invoicesSentCount: number;
  sendAllInvoices: () => Promise<void>;
  markInvoiceSent: (ownerId: string) => void;
  sentOwnerIds: Set<string>;

  // SEPA
  sepaGenerated: boolean;
  generateSepa: () => string; // returns xml content
  sepaTransmitted: boolean;
  markSepaTransmitted: () => void;

  // navigation
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;

  // computed
  totals: {
    grossCurrent: number;
    grossPrev: number;
    grossDelta: number;
    noeFee: number;
    noeFeePct: number;
    netOwnersTotal: number;
    ownersCount: number;
    negPending: number;
  };
}

const Ctx = createContext<FacturationState | null>(null);

export function FacturationProvider({ children }: { children: ReactNode }) {
  const [periodLabel, setPeriodLabel] = useState("Octobre 2026");
  const [cartG, setCartG] = useState(currentUser.cartG);
  const [activeTab, setActiveTab] = useState<TabKey>("reservations");

  const [bookingFile, setBookingFile] = useState<ImportedFile | null>({
    name: "booking_oct_2026.csv",
    rows: 47,
    importedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  });
  const [airbnbFile, setAirbnbFile] = useState<ImportedFile | null>({
    name: "airbnb_oct_2026.csv",
    rows: 31,
    importedAt: new Date(Date.now() - 90 * 60 * 1000),
  });

  const [reservations] = useState<Reservation[]>(mockReservations);
  const [previousReservations] = useState<Reservation[]>(mockPrev);
  const [negativeOps, setNegativeOps] = useState<NegativeOp[]>(initialNegativeOps);
  const [maintenance, setMaintenance] = useState<MaintenanceLine[]>(mockMaint);
  const [cleaning, setCleaning] = useState<CleaningLine[]>(mockClean);
  const [misc, setMisc] = useState<MiscLine[]>(mockMisc);

  const [invoicesGenerated, setInvoicesGenerated] = useState(false);
  const [sentOwnerIds, setSentOwnerIds] = useState<Set<string>>(new Set());
  const [invoicesSentCount, setInvoicesSentCount] = useState(0);
  const [sepaGenerated, setSepaGenerated] = useState(false);
  const [sepaTransmitted, setSepaTransmitted] = useState(false);

  const importBooking = useCallback(() => {
    setBookingFile({ name: `booking_oct_2026.csv`, rows: 47, importedAt: new Date() });
  }, []);
  const importAirbnb = useCallback(() => {
    setAirbnbFile({ name: `airbnb_oct_2026.csv`, rows: 31, importedAt: new Date() });
  }, []);

  const resolveNegative = useCallback((id: string, decision: NegativeDecision, custom?: number, note?: string) => {
    setNegativeOps((prev) => prev.map((n) => n.id === id ? { ...n, decision, customAmount: custom, note, resolvedAt: new Date().toISOString() } : n));
  }, []);
  const reopenNegative = useCallback((id: string) => {
    setNegativeOps((prev) => prev.map((n) => n.id === id ? { ...n, decision: null, resolvedAt: undefined } : n));
  }, []);

  const setMaintenancePrice = useCallback((id: string, v: number) => {
    setMaintenance((prev) => prev.map((m) => m.id === id ? { ...m, billedPrice: v } : m));
  }, []);
  const setCleaningPrice = useCallback((id: string, v: number) => {
    setCleaning((prev) => prev.map((c) => c.id === id ? { ...c, billedPrice: v } : c));
  }, []);
  const addMisc = useCallback((line: Omit<MiscLine, "id">) => {
    setMisc((prev) => [...prev, { ...line, id: `x${Date.now()}` }]);
  }, []);
  const removeMisc = useCallback((id: string) => {
    setMisc((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const generateInvoices = useCallback(() => setInvoicesGenerated(true), []);
  const markInvoiceSent = useCallback((ownerId: string) => {
    setSentOwnerIds((prev) => new Set(prev).add(ownerId));
    setInvoicesSentCount((c) => c + 1);
  }, []);
  const sendAllInvoices = useCallback(async () => {
    for (const o of owners) {
      await new Promise((r) => setTimeout(r, 120));
      setSentOwnerIds((prev) => new Set(prev).add(o.id));
      setInvoicesSentCount((c) => c + 1);
    }
  }, []);

  const generateSepa = useCallback(() => {
    setSepaGenerated(true);
    const date = new Date().toISOString();
    const msgId = `NOE${Date.now()}`;
    const txs = owners.map((o, i) => `
    <CdtTrfTxInf>
      <PmtId><EndToEndId>NOE-${i + 1}</EndToEndId></PmtId>
      <Amt><InstdAmt Ccy="EUR">${(1500 + i * 250).toFixed(2)}</InstdAmt></Amt>
      <CdtrAgt><FinInstnId><BIC>${o.bic}</BIC></FinInstnId></CdtrAgt>
      <Cdtr><Nm>${o.name}</Nm></Cdtr>
      <CdtrAcct><Id><IBAN>${o.iban.replace(/\s/g, "")}</IBAN></Id></CdtrAcct>
      <RmtInf><Ustrd>Reversement ${periodLabel}</Ustrd></RmtInf>
    </CdtTrfTxInf>`).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03">
  <CstmrCdtTrfInitn>
    <GrpHdr><MsgId>${msgId}</MsgId><CreDtTm>${date}</CreDtTm><NbOfTxs>${owners.length}</NbOfTxs></GrpHdr>
    <PmtInf>${txs}
    </PmtInf>
  </CstmrCdtTrfInitn>
</Document>`;
  }, [periodLabel]);
  const markSepaTransmitted = useCallback(() => setSepaTransmitted(true), []);

  const totals = useMemo(() => {
    const grossCurrent = sum(reservations, (r) => r.gross);
    const grossPrev = sum(previousReservations, (r) => r.gross);
    const grossDelta = grossPrev > 0 ? ((grossCurrent - grossPrev) / grossPrev) * 100 : 0;
    const noeFee = sum(reservations, (r) => r.noeFee);
    const noeFeePct = grossCurrent > 0 ? (noeFee / grossCurrent) * 100 : 0;
    const netOwnersTotal = sum(reservations, (r) => r.netOwner);
    const ownersWithRes = new Set(reservations.map((r) => getOwnerByProperty(r.propertyId).id));
    const negPending = negativeOps.filter((n) => n.decision === null).length;
    return {
      grossCurrent,
      grossPrev,
      grossDelta,
      noeFee,
      noeFeePct,
      netOwnersTotal,
      ownersCount: ownersWithRes.size,
      negPending,
    };
  }, [reservations, previousReservations, negativeOps]);

  const cycleStatus: CycleStatus = sentOwnerIds.size === owners.length && owners.length > 0
    ? "sent"
    : invoicesGenerated
      ? "validated"
      : totals.negPending > 0
        ? "processing"
        : bookingFile || airbnbFile
          ? "processing"
          : "draft";

  const value: FacturationState = {
    periodLabel,
    setPeriodLabel,
    cycleStatus,
    cartG,
    setCartG,
    bookingFile,
    airbnbFile,
    importBooking,
    importAirbnb,
    reservations,
    previousReservations,
    negativeOps,
    resolveNegative,
    reopenNegative,
    maintenance,
    setMaintenancePrice,
    cleaning,
    setCleaningPrice,
    misc,
    addMisc,
    removeMisc,
    invoicesGenerated,
    generateInvoices,
    invoicesSentCount,
    sendAllInvoices,
    markInvoiceSent,
    sentOwnerIds,
    sepaGenerated,
    generateSepa,
    sepaTransmitted,
    markSepaTransmitted,
    activeTab,
    setActiveTab,
    totals,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFacturation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFacturation must be used within FacturationProvider");
  return ctx;
}
