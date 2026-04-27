import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Link2, AlertTriangle, CheckCircle2, ChevronDown } from "lucide-react";
import { useFacturationMetier } from "@/hooks/useFacturationMetier";
import { otaPayouts } from "@/mocks/facturationMetier";
import { formatMoney, shortDate } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SOURCE_LABEL: Record<string, { label: string; cls: string }> = {
  ota_airbnb: { label: "Airbnb", cls: "bg-[#FF5A5F]/15 text-[#FF5A5F]" },
  ota_booking: { label: "Booking", cls: "bg-[#6B7AE8]/15 text-[#6B7AE8]" },
  direct: { label: "Direct", cls: "bg-[#4ADE80]/15 text-[#4ADE80]" },
  midterm: { label: "Moyenne durée", cls: "bg-[#F5C842]/15 text-[#F5C842]" },
  other: { label: "Autre", cls: "bg-white/[0.08] text-white/65" },
};

export function ReconciliationTab() {
  const { bankList, reconciliation, autoReconcile, reconcileBank, categorizeBank } = useFacturationMetier();
  const [exceptionId, setExceptionId] = useState<string | null>(null);

  const exceptions = bankList.filter((b) => b.reconciliationStatus === "unmatched");

  return (
    <div className="space-y-5">
      {/* Bannière de statut */}
      <div className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] border",
        reconciliation.unmatched > 0
          ? "bg-[#F5C842]/[0.08] border-[#F5C842]/[0.2]"
          : "bg-[#4ADE80]/[0.06] border-[#4ADE80]/[0.15]"
      )}>
        <div className="flex items-center gap-3">
          {reconciliation.unmatched > 0 ? (
            <AlertTriangle className="h-4 w-4 text-[#F5C842]" strokeWidth={1.5} />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-[#4ADE80]" strokeWidth={1.5} />
          )}
          <p className="text-sm text-white/85">
            {reconciliation.unmatched > 0 ? (
              <>
                <strong className="font-semibold">{reconciliation.unmatched} virement{reconciliation.unmatched > 1 ? "s" : ""}</strong> non rapproché{reconciliation.unmatched > 1 ? "s" : ""} — bloque la validation des BA concernés.
              </>
            ) : (
              <>Tous les virements OTA sont rapprochés.</>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            const n = autoReconcile();
            toast.success(n > 0 ? `${n} virement${n > 1 ? "s" : ""} rapproché${n > 1 ? "s" : ""}` : "Aucun rapprochement automatique possible");
          }}
          className="inline-flex items-center gap-1.5 text-xs text-white/85 hover:text-white px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06]"
        >
          <Wand2 className="h-3.5 w-3.5" strokeWidth={1.5} /> Lancer le rapprochement auto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Rapprochés auto" value={`${reconciliation.matched}`} accent="green" />
        <Stat label="Catégorisés manuel" value={`${reconciliation.manual}`} accent="violet" />
        <Stat label="Exceptions" value={`${reconciliation.unmatched}`} accent={reconciliation.unmatched > 0 ? "yellow" : "neutral"} />
      </div>

      {/* Tableau du relevé bancaire */}
      <div className="rounded-[20px] bg-white/[0.02] border border-white/[0.04] overflow-hidden">
        <div className="px-6 py-3 border-b border-white/[0.05]">
          <h3 className="text-sm font-semibold text-white">Relevé séquestre — Octobre 2026</h3>
          <p className="text-[11px] text-white/45 mt-0.5">Compte Carte G · BNP Paribas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.08em] text-white/45 border-b border-white/[0.06]">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Libellé</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium text-right">Montant</th>
                <th className="px-6 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {bankList.map((b, i) => {
                const isException = b.reconciliationStatus === "unmatched";
                return (
                  <tr key={b.id}
                    className={cn(
                      "border-t border-white/[0.04]",
                      i % 2 === 1 && "bg-white/[0.015]",
                      isException && "bg-[#F5C842]/[0.04]"
                    )}>
                    <td className="px-6 py-3 text-white/70">{shortDate(b.date)}</td>
                    <td className="px-4 py-3 text-white/85 font-mono text-xs">{b.label}</td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-full text-[10.5px] font-medium", SOURCE_LABEL[b.source].cls)}>
                        {SOURCE_LABEL[b.source].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/65 font-mono text-xs">{b.matchedReference ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-white font-semibold">{formatMoney(b.amount)}</td>
                    <td className="px-6 py-3">
                      {b.reconciliationStatus === "matched" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#4ADE80]">
                          <CheckCircle2 className="h-3 w-3" strokeWidth={2} /> Rapproché
                        </span>
                      )}
                      {b.reconciliationStatus === "manual" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-white/65">
                          <Link2 className="h-3 w-3" strokeWidth={1.5} /> Catégorisé
                        </span>
                      )}
                      {b.reconciliationStatus === "unmatched" && (
                        <button
                          onClick={() => setExceptionId(b.id)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#F5C842] hover:text-[#F5C842] px-2 py-1 rounded-full bg-[#F5C842]/15 hover:bg-[#F5C842]/25"
                        >
                          <AlertTriangle className="h-3 w-3" strokeWidth={2} /> À traiter
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-white/45 leading-relaxed pt-1 max-w-3xl">
        Clé de rapprochement : <strong className="text-white/65">payout_reference</strong> (G-XXXX) pour Airbnb, <strong className="text-white/65">statement_descriptor</strong> (BK-PAY-XXX) pour Booking. Montants comparés à 0,01 € près. Les flux non OTA (direct, moyenne durée) doivent être catégorisés manuellement.
      </p>

      {/* Modal de traitement d'exception */}
      <ExceptionDialog
        bankId={exceptionId}
        onClose={() => setExceptionId(null)}
        onReconcile={(ref) => { reconcileBank(exceptionId!, ref); setExceptionId(null); toast.success("Virement rapproché manuellement"); }}
        onCategorize={(src) => { categorizeBank(exceptionId!, src); setExceptionId(null); toast.success("Virement catégorisé"); }}
      />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: "green" | "yellow" | "violet" | "neutral" }) {
  const colorMap = {
    green: "text-[#4ADE80]",
    yellow: "text-[#F5C842]",
    violet: "text-[#6B7AE8]",
    neutral: "text-white",
  };
  return (
    <div className="rounded-[16px] bg-white/[0.03] border border-white/[0.04] p-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className={cn("text-2xl font-semibold tabular-nums mt-1", colorMap[accent])}>{value}</p>
    </div>
  );
}

function ExceptionDialog({
  bankId, onClose, onReconcile, onCategorize,
}: {
  bankId: string | null;
  onClose: () => void;
  onReconcile: (ref: string) => void;
  onCategorize: (src: "direct" | "midterm" | "other") => void;
}) {
  const { bankList } = useFacturationMetier();
  const bank = bankList.find((b) => b.id === bankId);
  const [tab, setTab] = useState<"reconcile" | "categorize">("reconcile");
  const [pickedRef, setPickedRef] = useState<string>("");

  if (!bank) return null;
  // Suggestion : payouts dont le montant est proche
  const suggestions = otaPayouts
    .map((p) => ({ p, diff: Math.abs(p.amount - bank.amount) }))
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 5);

  return (
    <AnimatePresence>
      {bank && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-2xl rounded-[24px] bg-[#1a1a2e]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl overflow-hidden"
          >
            <div className="px-7 py-5 border-b border-white/[0.06]">
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/45">Exception bancaire</p>
              <h3 className="text-base font-semibold text-white mt-1">{bank.label}</h3>
              <p className="text-sm text-white/60 mt-1">{shortDate(bank.date)} · <span className="tabular-nums font-semibold text-white">{formatMoney(bank.amount)}</span></p>
            </div>
            <div className="px-7 py-3 border-b border-white/[0.06] flex gap-1">
              <TabBtn active={tab === "reconcile"} onClick={() => setTab("reconcile")}>Rapprocher à un payout OTA</TabBtn>
              <TabBtn active={tab === "categorize"} onClick={() => setTab("categorize")}>Catégoriser (flux non OTA)</TabBtn>
            </div>
            <div className="p-7 max-h-[60vh] overflow-y-auto">
              {tab === "reconcile" ? (
                <div className="space-y-2">
                  <p className="text-xs text-white/55 mb-2">Suggestions ordonnées par écart de montant :</p>
                  {suggestions.map((s) => {
                    const ok = s.diff < 0.01;
                    return (
                      <button
                        key={s.p.id}
                        onClick={() => setPickedRef(s.p.reference)}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 p-3 rounded-[12px] border text-left transition-colors",
                          pickedRef === s.p.reference
                            ? "bg-white/[0.06] border-white/[0.12]"
                            : "bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-white font-mono">{s.p.reference}</p>
                          <p className="text-[11px] text-white/55 mt-0.5">{s.p.platform === "airbnb" ? "Airbnb" : "Booking"} · attendu {shortDate(s.p.bankDate)}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm tabular-nums text-white">{formatMoney(s.p.amount)}</p>
                          <p className={cn("text-[11px] tabular-nums mt-0.5", ok ? "text-[#4ADE80]" : "text-[#F5C842]")}>
                            {ok ? "Match parfait ✓" : `Écart ${formatMoney(bank.amount - s.p.amount)}`}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                  <div className="flex justify-end gap-2 pt-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-[12px] text-sm text-white/70 hover:bg-white/[0.05]">Annuler</button>
                    <button
                      disabled={!pickedRef}
                      onClick={() => onReconcile(pickedRef)}
                      className="px-4 py-2 rounded-[12px] text-sm font-semibold bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_4px_14px_rgba(255,92,26,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Rapprocher
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-white/55 mb-2">Catégorisez ce flux qui n'est pas un payout OTA :</p>
                  {[
                    { key: "direct" as const, label: "Réservation directe propriétaire" },
                    { key: "midterm" as const, label: "Loyer moyenne durée" },
                    { key: "other" as const, label: "Autre (à tracer hors facturation)" },
                  ].map((c) => (
                    <button
                      key={c.key}
                      onClick={() => onCategorize(c.key)}
                      className="w-full flex items-center justify-between p-3 rounded-[12px] bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] text-left text-sm text-white/85"
                    >
                      {c.label}
                      <ChevronDown className="h-4 w-4 -rotate-90 text-white/40" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "px-3 py-2 text-xs font-medium rounded-[10px] transition-colors",
      active ? "bg-white/[0.08] text-white" : "text-white/55 hover:text-white/85"
    )}>{children}</button>
  );
}
