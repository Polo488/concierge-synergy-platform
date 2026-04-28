import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, AlertTriangle } from "lucide-react";
import { useSession, propById, ownerById, PRO } from "@/hooks/useFacturationSession";
import { fmt, type Draft } from "@/mocks/facturation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const REASON_LABEL: Record<string, string> = {
  iban_missing: "IBAN propriétaire manquant",
  provider_invoice_missing: "N° facture prestataire ménage manquant",
  maintenance_pending: "Intervention maintenance non statuée",
  sepa_mandate_missing: "Mandat SEPA non signé",
};

type Filter = "all" | "blocked" | "ready" | "validated";

function GenerationOverlay({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let n = 0;
    const interval = setInterval(() => {
      n += 4;
      setPct(n);
      setStep(Math.floor((n / 100) * 41));
      if (n >= 100) {
        clearInterval(interval);
        setTimeout(onDone, 300);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="rounded-[20px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] p-12 text-center"
    >
      <Sparkles className="h-8 w-8 text-[#FF5C1A] mx-auto mb-4" strokeWidth={1.5} />
      <p className="text-[16px] font-medium text-white">Génération des brouillons…</p>
      <p className="text-[12.5px] text-white/50 mt-1.5 tabular-nums">Brouillon {Math.min(step, 41)}/41</p>
      <div className="mt-6 max-w-md mx-auto h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div className="h-full bg-[#FF5C1A]" animate={{ width: `${pct}%` }} transition={{ duration: 0.1 }} />
      </div>
    </motion.div>
  );
}

function DraftPreview({ draft }: { draft: Draft }) {
  const prop = propById(draft.propertyId);
  const owner = ownerById(draft.ownerId);
  const { resolveBlocking } = useSession();

  return (
    <div className="space-y-5">
      {/* Checklist */}
      {draft.blockingReasons.length > 0 && (
        <div className="rounded-[14px] bg-[#F87171]/8 ring-1 ring-inset ring-[#F87171]/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-[#F87171]" strokeWidth={1.8} />
            <p className="text-[13px] font-semibold text-white">Points bloquants</p>
          </div>
          <div className="space-y-2">
            {draft.blockingReasons.map(r => (
              <button
                key={r}
                onClick={() => { resolveBlocking(draft.id, r); toast.success("Point résolu"); }}
                className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors group"
              >
                <span className="text-[12.5px] text-white/85">☐ {REASON_LABEL[r] || r}</span>
                <span className="text-[11px] text-[#FF5C1A] opacity-70 group-hover:opacity-100">Résoudre →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Aperçu PDF */}
      <div className="rounded-[14px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10.5px] uppercase tracking-wider text-white/40 mb-1">Facture brouillon</p>
              <h4 className="text-[15px] font-semibold text-white">{owner?.name}</h4>
              <p className="text-[11.5px] text-white/50 mt-0.5">{prop?.name} • Mode {prop?.mode}</p>
            </div>
            <div className="text-right">
              <p className="text-[10.5px] text-white/40">N° prévu</p>
              <p className="text-[12px] font-mono text-white/80">{PRO.invoicePrefix}-XXXXX</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-white/40 border-b border-white/[0.05]">
                <th className="text-left pb-2 font-medium">Désignation</th>
                <th className="text-right pb-2 font-medium w-12">Qté</th>
                <th className="text-right pb-2 font-medium w-20">PU HT</th>
                <th className="text-right pb-2 font-medium w-24">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {draft.lines.map((l, i) => (
                <tr key={i} className="border-b border-white/[0.03]">
                  <td className="py-2 text-white/85">
                    {l.label}
                    {l.modified && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[#6B7AE8]" />}
                  </td>
                  <td className="py-2 text-right text-white/70 tabular-nums">{l.qty}</td>
                  <td className="py-2 text-right text-white/70 tabular-nums">{fmt(l.unitHt)}</td>
                  <td className="py-2 text-right text-white tabular-nums">{fmt(l.qty * l.unitHt)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 space-y-1.5 max-w-xs ml-auto text-[12.5px]">
            <div className="flex justify-between text-white/60"><span>Total HT</span><span className="tabular-nums">{fmt(draft.totalHt)}</span></div>
            <div className="flex justify-between text-white/60"><span>TVA (20%)</span><span className="tabular-nums">{fmt(draft.totalVat)}</span></div>
            <div className="flex justify-between text-white pt-1.5 border-t border-white/[0.06]"><span className="font-medium">Total TTC</span><span className="tabular-nums font-semibold">{fmt(draft.totalTtc)}</span></div>
            <div className="flex justify-between text-white/55 pt-2"><span>BA déduit</span><span className="tabular-nums">−{fmt(draft.baAmount)}</span></div>
            <div className="flex justify-between text-[14px] pt-2 border-t border-white/[0.08]">
              <span className="text-white font-semibold">Solde à payer</span>
              <span className={cn("font-semibold tabular-nums", draft.net > 0 ? "text-white" : draft.net < 0 ? "text-[#F87171]" : "text-[#4ADE80]")}>
                {fmt(draft.net)}
              </span>
            </div>
          </div>

          {prop?.mode === "P3" && (
            <div className="mt-4 pt-4 border-t border-white/[0.05] text-[11px] text-white/45 space-y-1">
              <p>N° mandat de gestion : MG-2024-{draft.id.toUpperCase()}</p>
              <p>Carte G : {PRO.carteG.number} (valide jusqu'au {PRO.carteG.expiresAt})</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function StepDrafts() {
  const { drafts, draftsGenerated, generateDrafts, validateDraft, validateAllReadyDrafts, setActiveStep } = useSession();
  const [filter, setFilter] = useState<Filter>("blocked");
  const [generating, setGenerating] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!draftsGenerated && !generating) {
      setGenerating(true);
    }
  }, [draftsGenerated, generating]);

  if (generating && !draftsGenerated) {
    return <GenerationOverlay onDone={() => { generateDrafts(); setGenerating(false); }} />;
  }

  const filtered = useMemo(() => {
    if (filter === "all") return drafts;
    return drafts.filter(d => d.state === filter);
  }, [drafts, filter]);

  const counts = {
    all: drafts.length,
    blocked: drafts.filter(d => d.state === "blocked").length,
    ready: drafts.filter(d => d.state === "ready").length,
    validated: drafts.filter(d => d.state === "validated").length,
  };

  const selected = drafts.find(d => d.id === (selectedId || filtered[0]?.id));
  const allReady = counts.blocked === 0 && drafts.length > 0;
  const allValidated = counts.validated === drafts.length && drafts.length > 0;

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[40%_60%] gap-4">
        <div className="rounded-[18px] bg-white/[0.025] ring-1 ring-inset ring-white/[0.06] overflow-hidden flex flex-col max-h-[720px]">
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <p className="text-[12px] text-white/55">{counts.blocked} bloqués • {counts.ready} prêts</p>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {([
                ["blocked", "Bloqués"], ["ready", "Prêts"], ["validated", "Validés"], ["all", "Tous"],
              ] as Array<[Filter, string]>).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-colors",
                    filter === k ? "bg-white/[0.1] text-white" : "bg-white/[0.04] text-white/55 hover:text-white/80"
                  )}
                >{l} ({counts[k]})</button>
              ))}
            </div>
            {counts.ready > 0 && (
              <button
                onClick={() => { validateAllReadyDrafts(); toast.success(`${counts.ready} brouillons validés`); }}
                className="mt-3 w-full px-3 py-2 rounded-[10px] bg-[#FF5C1A]/10 hover:bg-[#FF5C1A]/15 text-[#FF5C1A] text-[12.5px] font-semibold transition-colors"
              >
                Valider les {counts.ready} brouillons prêts
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(d => {
              const prop = propById(d.propertyId);
              const owner = ownerById(d.ownerId);
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedId(d.id)}
                  className={cn(
                    "relative w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors flex items-center gap-2.5",
                    selected?.id === d.id && "bg-white/[0.04]"
                  )}
                >
                  {selected?.id === d.id && <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#FF5C1A]" />}
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    d.state === "validated" ? "bg-[#4ADE80]" : d.state === "blocked" ? "bg-[#F87171]" : "bg-white/30"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white truncate">{owner?.name}</p>
                    <p className="text-[11px] text-white/45 truncate mt-0.5">{prop?.name} • Mode {prop?.mode}</p>
                  </div>
                  <span className="text-[12.5px] font-semibold text-white tabular-nums">{fmt(d.totalTtc)}</span>
                </button>
              );
            })}
            {filtered.length === 0 && <div className="p-8 text-center text-[12.5px] text-white/40">Aucun brouillon</div>}
          </div>
        </div>

        {selected && (
          <div className="overflow-y-auto max-h-[720px]">
            <DraftPreview draft={selected} />
            {selected.state === "blocked" === false && selected.state !== "validated" && (
              <button
                onClick={() => { validateDraft(selected.id); toast.success("Brouillon validé"); }}
                className="mt-4 w-full py-2.5 rounded-[12px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold active:scale-[0.98]"
              >
                Valider ce brouillon
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {allValidated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 rounded-[16px] bg-white/[0.025] ring-1 ring-inset ring-white/[0.06] px-5 py-4 sticky bottom-3"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[#4ADE80]" strokeWidth={2} />
              <p className="text-[13.5px] text-white/85">{drafts.length} factures prêtes à émettre</p>
            </div>
            <button
              onClick={() => setActiveStep("issue")}
              className="px-4 py-2 rounded-[10px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold flex items-center gap-1.5 active:scale-[0.98]"
            >
              Continuer vers l'émission
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
