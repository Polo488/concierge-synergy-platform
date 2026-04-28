import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import { useSession, propById, ownerById } from "@/hooks/useFacturationSession";
import { fmt, type BA, type BARow } from "@/mocks/facturation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MODE_LABEL = { P1: "Standard", P2: "Split", P3: "Mandant" } as const;
const MODE_CHIP = {
  P1: "bg-white/[0.06] text-white/70",
  P2: "bg-[#6B7AE8]/15 text-[#6B7AE8]",
  P3: "bg-[#FF5C1A]/15 text-[#FF5C1A]",
} as const;
const SOURCE_CHIP = {
  airbnb: "bg-[#FF5C1A]/12 text-[#FF5C1A]",
  booking: "bg-[#6B7AE8]/12 text-[#6B7AE8]",
  direct: "bg-white/[0.08] text-white/65",
} as const;

type Filter = "all" | "todo" | "ready" | "validated";

function BARowItem({ ba, row, onValidate }: { ba: BA; row: BARow; onValidate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState("late_cancel");

  if (!row.alert) {
    return (
      <tr className="border-b border-white/[0.04] last:border-0">
        <td className="py-2.5 pl-2 text-[12.5px] text-white/80 tabular-nums font-mono">{row.apiReference}</td>
        <td className="py-2.5 text-[12px] text-white/55 tabular-nums">{row.date}</td>
        <td className="py-2.5 text-[12.5px] text-white/80">{row.guest}</td>
        <td className="py-2.5"><span className={cn("inline-block px-2 py-0.5 rounded-full text-[10.5px] font-medium", SOURCE_CHIP[row.source])}>{row.source}</span></td>
        <td className="py-2.5 text-[13px] text-white tabular-nums text-right pr-2 font-medium">{fmt(row.amount)}</td>
        <td className="py-2.5 pr-2 text-right">
          {row.validated ? <CheckCircle2 className="h-3.5 w-3.5 text-[#4ADE80] inline" strokeWidth={2} /> : null}
        </td>
      </tr>
    );
  }

  const alertColor = row.alert === "negative" ? "bg-[#F87171]/8 ring-[#F87171]/20" : "bg-[#FF5C1A]/8 ring-[#FF5C1A]/20";

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} className={cn("cursor-pointer border-b border-white/[0.04]", expanded && alertColor)}>
        <td className="py-2.5 pl-2 text-[12.5px] text-white/80 tabular-nums font-mono">{row.apiReference}</td>
        <td className="py-2.5 text-[12px] text-white/55 tabular-nums">{row.date}</td>
        <td className="py-2.5 text-[12.5px] text-white/80">{row.guest}</td>
        <td className="py-2.5"><span className={cn("inline-block px-2 py-0.5 rounded-full text-[10.5px] font-medium", SOURCE_CHIP[row.source])}>{row.source}</span></td>
        <td className={cn("py-2.5 text-[13px] tabular-nums text-right pr-2 font-medium", row.amount < 0 ? "text-[#F87171]" : "text-white")}>{fmt(row.amount)}</td>
        <td className="py-2.5 pr-2 text-right">
          {row.validated ? <CheckCircle2 className="h-3.5 w-3.5 text-[#4ADE80] inline" strokeWidth={2} /> : <AlertTriangle className={cn("h-3.5 w-3.5 inline", row.alert === "negative" ? "text-[#F87171]" : "text-[#FF5C1A]")} strokeWidth={2} />}
        </td>
      </tr>
      <AnimatePresence>
        {expanded && !row.validated && (
          <tr>
            <td colSpan={6} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={cn("overflow-hidden ring-1 ring-inset rounded-lg my-1 mx-1", alertColor)}
              >
                <div className="p-4 space-y-3">
                  <p className="text-[12.5px] text-white/85">
                    <span className="font-semibold">{row.alert === "negative" ? "Ligne négative" : "Doublon détecté"} —</span> {row.alertReason}
                  </p>
                  {row.alert === "negative" && (
                    <div className="space-y-1.5">
                      <p className="text-[11.5px] text-white/55">Précise le motif :</p>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { v: "late_cancel", l: "Annulation tardive" },
                          { v: "dispute", l: "Résolution litige" },
                          { v: "ota_adj", l: "Ajustement OTA" },
                          { v: "other", l: "Autre" },
                        ].map(o => (
                          <button
                            key={o.v}
                            onClick={() => setReason(o.v)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[11.5px] font-medium transition-colors",
                              reason === o.v ? "bg-[#FF5C1A] text-white" : "bg-white/[0.06] text-white/70 hover:bg-white/[0.1]"
                            )}
                          >{o.l}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-2 pt-1">
                    <button onClick={() => setExpanded(false)} className="px-3 py-1.5 rounded-lg text-[12px] text-white/60 hover:bg-white/5 transition-colors">Reporter</button>
                    <button
                      onClick={() => { onValidate(); setExpanded(false); toast.success("Ligne validée"); }}
                      className="px-3 py-1.5 rounded-lg bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[12px] font-semibold"
                    >Valider la ligne</button>
                  </div>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}

export function StepBA() {
  const { bas, validateBA, validateBARow, validateAllReadyBAs, setActiveStep } = useSession();
  const [filter, setFilter] = useState<Filter>("todo");
  const [selectedId, setSelectedId] = useState<string>(bas.find(b => b.state === "blocked")?.id || bas[0]?.id);

  const filtered = useMemo(() => {
    if (filter === "all") return bas;
    if (filter === "todo") return bas.filter(b => b.state === "blocked");
    if (filter === "ready") return bas.filter(b => b.state === "ready");
    return bas.filter(b => b.state === "validated");
  }, [bas, filter]);

  const counts = {
    all: bas.length,
    todo: bas.filter(b => b.state === "blocked").length,
    ready: bas.filter(b => b.state === "ready").length,
    validated: bas.filter(b => b.state === "validated").length,
  };

  const selected = bas.find(b => b.id === selectedId);
  const allValidated = counts.validated === bas.length && bas.length > 0;
  const subtotalCredit = selected?.rows.filter(r => r.amount > 0).reduce((s, r) => s + r.amount, 0) || 0;
  const subtotalRefund = selected?.rows.filter(r => r.amount < 0).reduce((s, r) => s + r.amount, 0) || 0;
  const allRowsValidated = selected?.rows.every(r => r.validated);

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[40%_60%] gap-4">
        {/* Liste */}
        <div className="rounded-[18px] bg-white/[0.025] ring-1 ring-inset ring-white/[0.06] overflow-hidden flex flex-col max-h-[680px]">
          <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
            <p className="text-[12px] text-white/55">{counts.todo} BA à traiter • {counts.ready} prêts</p>
            <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {([
                ["todo", "À traiter"], ["ready", "Prêts"], ["validated", "Validés"], ["all", "Tous"],
              ] as Array<[Filter, string]>).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11.5px] font-medium whitespace-nowrap transition-colors",
                    filter === k ? "bg-white/[0.1] text-white" : "bg-white/[0.04] text-white/55 hover:text-white/80"
                  )}
                >{l} ({counts[k]})</button>
              ))}
            </div>
            {counts.ready > 0 && (
              <button
                onClick={() => { validateAllReadyBAs(); toast.success(`${counts.ready} BA validés`); }}
                className="mt-3 w-full px-3 py-2 rounded-[10px] bg-[#FF5C1A]/10 hover:bg-[#FF5C1A]/15 text-[#FF5C1A] text-[12.5px] font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />
                Valider les {counts.ready} BA propres
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(b => {
              const prop = propById(b.propertyId);
              const owner = ownerById(b.ownerId);
              const hasAlert = b.rows.some(r => r.alert !== null && !r.validated);
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={cn(
                    "relative w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors flex items-center gap-2.5",
                    selectedId === b.id && "bg-white/[0.04]"
                  )}
                >
                  {selectedId === b.id && <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-[#FF5C1A]" />}
                  <span className={cn(
                    "h-1.5 w-1.5 rounded-full shrink-0",
                    b.state === "validated" ? "bg-[#4ADE80]" : hasAlert ? (b.rows.some(r => r.alert === "negative") ? "bg-[#F87171]" : "bg-[#FF5C1A]") : "bg-white/20"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-white truncate">{prop?.name}</p>
                    <p className="text-[11px] text-white/45 truncate mt-0.5">{owner?.name} • {b.rows.length} résa{b.rows.length > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[12.5px] font-semibold text-white tabular-nums">{fmt(b.total)}</span>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", MODE_CHIP[prop!.mode])}>{MODE_LABEL[prop!.mode]}</span>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-[12.5px] text-white/40">Aucun BA dans ce filtre</div>
            )}
          </div>
        </div>

        {/* Détail */}
        {selected && (
          <div className="rounded-[18px] bg-white/[0.025] ring-1 ring-inset ring-white/[0.06] overflow-hidden flex flex-col max-h-[680px]">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-[18px] font-semibold text-white truncate">{propById(selected.propertyId)?.name}</h3>
                  <p className="text-[12px] text-white/50 mt-0.5">
                    {ownerById(selected.ownerId)?.name} • Mode {MODE_LABEL[propById(selected.propertyId)!.mode]} • Mars 2026
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[26px] font-light text-white tabular-nums leading-none">{fmt(selected.total)}</p>
                  <p className="text-[10.5px] text-white/45 mt-1">Total BA</p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <table className="w-full">
                <thead>
                  <tr className="text-[10.5px] uppercase tracking-wider text-white/40 border-b border-white/[0.06]">
                    <th className="text-left pl-2 pb-2 font-medium">N° résa</th>
                    <th className="text-left pb-2 font-medium">Date</th>
                    <th className="text-left pb-2 font-medium">Voyageur</th>
                    <th className="text-left pb-2 font-medium">Source</th>
                    <th className="text-right pb-2 font-medium pr-2">Montant</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {selected.rows.map(r => (
                    <BARowItem key={r.id} ba={selected} row={r} onValidate={() => validateBARow(selected.id, r.id)} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-between text-[12px] text-white/60 mb-3">
                <span>Σ encaissements : <span className="text-white tabular-nums">{fmt(subtotalCredit)}</span></span>
                {subtotalRefund < 0 && <span>Σ remboursements : <span className="text-[#F87171] tabular-nums">{fmt(subtotalRefund)}</span></span>}
                <span>Net : <span className="text-white font-semibold tabular-nums">{fmt(selected.total)}</span></span>
              </div>
              {selected.state !== "validated" && (
                <button
                  onClick={() => { validateBA(selected.id); toast.success("BA validé"); }}
                  disabled={!allRowsValidated}
                  className={cn(
                    "w-full py-2.5 rounded-[12px] text-[13px] font-semibold transition-all",
                    allRowsValidated
                      ? "bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white active:scale-[0.98]"
                      : "bg-white/[0.04] text-white/35 cursor-not-allowed"
                  )}
                >
                  {allRowsValidated ? "Valider le BA" : "Résoudre toutes les alertes pour valider"}
                </button>
              )}
              {selected.state === "validated" && (
                <div className="flex items-center justify-center gap-2 py-2 text-[#4ADE80] text-[12.5px] font-medium">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} /> BA validé
                </div>
              )}
            </div>
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
              <p className="text-[13.5px] text-white/85">{bas.length} BA validés pour Mars 2026</p>
            </div>
            <button
              onClick={() => setActiveStep("drafts")}
              className="px-4 py-2 rounded-[10px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold flex items-center gap-1.5 active:scale-[0.98]"
            >
              Continuer vers les brouillons
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
