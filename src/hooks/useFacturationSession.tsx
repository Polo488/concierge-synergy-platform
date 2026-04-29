import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react";
import {
  BAS_MARS, buildDrafts, PROVIDER_INVOICES_TODO, COMPLEMENTARY_TODO, VIGILANCE,
  PROPERTIES, OWNERS, PRO, RESERVATIONS_MARS, HISTORY,
  type BA, type Draft, type StepKey, type StepState, type SessionState,
} from "@/mocks/facturation";

export type StepDef = {
  key: StepKey;
  number: number;
  title: string;
  state: StepState;
  subtitle: string;
  counter?: number;
};

interface SessionCtx {
  // période
  periodLabel: string;
  setPeriodLabel: (s: string) => void;
  sessionState: SessionState;
  // step nav
  activeStep: StepKey;
  setActiveStep: (s: StepKey) => void;
  steps: StepDef[];
  // sync
  beds24SyncedAt: string | null;
  setBeds24SyncedAt: (s: string | null) => void;
  csvFiles: { name: string; rows: number; type: "booking" | "airbnb" }[];
  addCsv: (f: { name: string; rows: number; type: "booking" | "airbnb" }) => void;
  removeCsv: (name: string) => void;
  syncDone: boolean;
  setSyncDone: (b: boolean) => void;
  // BA
  bas: BA[];
  validateBA: (id: string) => void;
  validateBARow: (baId: string, rowId: string) => void;
  validateAllReadyBAs: () => void;
  // drafts
  drafts: Draft[];
  draftsGenerated: boolean;
  generateDrafts: () => void;
  validateDraft: (id: string) => void;
  validateAllReadyDrafts: () => void;
  resolveBlocking: (draftId: string, reason: string) => void;
  // émission
  invoicesIssued: boolean;
  issueAllInvoices: () => void;
  // SEPA
  sdrGenerated: boolean;
  sctGenerated: boolean;
  setSdrGenerated: (b: boolean) => void;
  setSctGenerated: (b: boolean) => void;
  // bilan
  wrapSeen: boolean;
  setWrapSeen: (b: boolean) => void;
  // panneau droit
  providerTodos: typeof PROVIDER_INVOICES_TODO;
  complementaryTodos: typeof COMPLEMENTARY_TODO;
  vigilance: typeof VIGILANCE;
  hidePanel: boolean;
  setHidePanel: (b: boolean) => void;
}

const Ctx = createContext<SessionCtx | null>(null);

export function FacturationSessionProvider({ children }: { children: ReactNode }) {
  const [periodLabel, setPeriodLabel] = useState("Mars 2026");
  const [activeStep, setActiveStep] = useState<StepKey>("sync");
  const [beds24SyncedAt, setBeds24SyncedAt] = useState<string | null>(null);
  const [csvFiles, setCsvFiles] = useState<{ name: string; rows: number; type: "booking" | "airbnb" }[]>([]);
  const [syncDone, setSyncDone] = useState(false);
  const [bas, setBas] = useState<BA[]>(BAS_MARS);
  const [draftsGenerated, setDraftsGenerated] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [invoicesIssued, setInvoicesIssued] = useState(false);
  const [sdrGenerated, setSdrGenerated] = useState(false);
  const [sctGenerated, setSctGenerated] = useState(false);
  const [wrapSeen, setWrapSeen] = useState(false);
  const [hidePanel, setHidePanel] = useState(false);

  const addCsv = useCallback((f: { name: string; rows: number; type: "booking" | "airbnb" }) => {
    setCsvFiles(prev => prev.find(p => p.name === f.name) ? prev : [...prev, f]);
  }, []);
  const removeCsv = useCallback((name: string) => {
    setCsvFiles(prev => prev.filter(p => p.name !== name));
  }, []);

  const validateBARow = useCallback((baId: string, rowId: string) => {
    setBas(prev => prev.map(b => b.id !== baId ? b : {
      ...b,
      rows: b.rows.map(r => r.id === rowId ? { ...r, validated: true } : r),
    }));
  }, []);

  const validateBA = useCallback((id: string) => {
    setBas(prev => prev.map(b => b.id !== id ? b : {
      ...b,
      state: "validated",
      rows: b.rows.map(r => ({ ...r, validated: true })),
    }));
  }, []);

  const validateAllReadyBAs = useCallback(() => {
    setBas(prev => prev.map(b => b.state === "ready" ? { ...b, state: "validated" } : b));
  }, []);

  const generateDrafts = useCallback(() => {
    setDrafts(buildDrafts(bas));
    setDraftsGenerated(true);
  }, [bas]);

  const validateDraft = useCallback((id: string) => {
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, state: "ready" } : d));
  }, []);

  const validateAllReadyDrafts = useCallback(() => {
    setDrafts(prev => prev.map(d => d.state === "ready" ? { ...d, state: "validated" } : d));
  }, []);

  const resolveBlocking = useCallback((draftId: string, reason: string) => {
    setDrafts(prev => prev.map(d => d.id !== draftId ? d : {
      ...d,
      blockingReasons: d.blockingReasons.filter(r => r !== reason),
      state: d.blockingReasons.filter(r => r !== reason).length === 0 ? "ready" : "blocked",
    }));
  }, []);

  const issueAllInvoices = useCallback(() => {
    setDrafts(prev => prev.map((d, i) => ({
      ...d,
      state: "issued",
      invoiceNumber: `${PRO.invoicePrefix}-${14542 + i}`,
    })));
    setInvoicesIssued(true);
  }, []);

  // Steps states (dérivés)
  const steps = useMemo<StepDef[]>(() => {
    const baBlocked = bas.filter(b => b.state === "blocked").length;
    const baReady = bas.filter(b => b.state === "ready").length;
    const baValidated = bas.filter(b => b.state === "validated").length;
    const allBaValidated = baValidated === bas.length;
    const draftsBlocked = drafts.filter(d => d.state === "blocked").length;
    const draftsReady = drafts.filter(d => d.state === "ready").length;
    const draftsValidated = drafts.filter(d => d.state === "validated").length;
    const allDraftsValidated = draftsGenerated && draftsValidated === drafts.length && drafts.length > 0;

    const s1: StepState = syncDone ? "done" : (beds24SyncedAt || csvFiles.length > 0) ? "action" : "action";
    const s2: StepState = !syncDone ? "pending" : baBlocked > 0 ? "action" : allBaValidated ? "done" : "action";
    const s3: StepState = !allBaValidated ? "pending" : draftsBlocked > 0 ? "action" : allDraftsValidated ? "done" : (draftsGenerated ? "action" : "action");
    const s4: StepState = !allDraftsValidated ? "pending" : invoicesIssued ? "done" : "action";
    const s5: StepState = !invoicesIssued ? "pending" : (sdrGenerated && sctGenerated) ? "done" : "action";
    const s6: StepState = !(sdrGenerated || sctGenerated) ? "pending" : wrapSeen ? "done" : "action";

    return [
      { key: "sync", number: 1, title: "Synchronisation", state: s1, subtitle: syncDone ? "Données importées" : "Noé API + CSV" },
      { key: "ba", number: 2, title: "Construction des BA", state: s2, subtitle: `${baValidated}/${bas.length} validés`, counter: baBlocked || undefined },
      { key: "drafts", number: 3, title: "Brouillons de facture", state: s3, subtitle: draftsGenerated ? `${draftsValidated}/${drafts.length} prêts` : "À générer", counter: draftsBlocked || undefined },
      { key: "issue", number: 4, title: "Émission & envoi", state: s4, subtitle: invoicesIssued ? "Factures émises" : "Prêt à émettre" },
      { key: "sepa", number: 5, title: "SEPA & encaissements", state: s5, subtitle: sdrGenerated && sctGenerated ? "Fichiers transmis" : "À générer" },
      { key: "wrap", number: 6, title: "Bilan du mois", state: s6, subtitle: wrapSeen ? "Vu" : "Cinématique" },
    ];
  }, [bas, drafts, draftsGenerated, syncDone, beds24SyncedAt, csvFiles, invoicesIssued, sdrGenerated, sctGenerated, wrapSeen]);

  const sessionState: SessionState = useMemo(() => {
    if (wrapSeen && sdrGenerated) return "closed";
    if (invoicesIssued) return "issued";
    if (syncDone || beds24SyncedAt || csvFiles.length > 0) return "in_progress";
    return "draft";
  }, [wrapSeen, sdrGenerated, invoicesIssued, syncDone, beds24SyncedAt, csvFiles]);

  const value: SessionCtx = {
    periodLabel, setPeriodLabel, sessionState,
    activeStep, setActiveStep, steps,
    beds24SyncedAt, setBeds24SyncedAt,
    csvFiles, addCsv, removeCsv,
    syncDone, setSyncDone,
    bas, validateBA, validateBARow, validateAllReadyBAs,
    drafts, draftsGenerated, generateDrafts, validateDraft, validateAllReadyDrafts, resolveBlocking,
    invoicesIssued, issueAllInvoices,
    sdrGenerated, sctGenerated, setSdrGenerated, setSctGenerated,
    wrapSeen, setWrapSeen,
    providerTodos: PROVIDER_INVOICES_TODO,
    complementaryTodos: COMPLEMENTARY_TODO,
    vigilance: VIGILANCE,
    hidePanel, setHidePanel,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be used inside FacturationSessionProvider");
  return v;
}

// Helpers de lookup
export function propById(id: string) { return PROPERTIES.find(p => p.id === id); }
export function ownerById(id: string) { return OWNERS.find(o => o.id === id); }
export { PROPERTIES, OWNERS, PRO, RESERVATIONS_MARS, HISTORY };
