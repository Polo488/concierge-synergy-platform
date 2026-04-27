import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { AlertTriangle, ChevronDown, RotateCcw } from "lucide-react";
import { useFacturation } from "@/hooks/useFacturation";
import { getProperty, getOwnerByProperty, type NegativeOp, type NegativeDecision, type NegativeOpType } from "@/mocks/facturation";
import { formatMoney, shortDate } from "@/lib/facturationFormat";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<NegativeOpType, string> = {
  late_cancellation: "ANNULATION TARDIVE",
  adjustment: "AJUSTEMENT",
  chargeback: "CHARGEBACK",
  manual_credit: "AVOIR MANUEL",
};

const DECISIONS: { key: NegativeDecision; label: string }[] = [
  { key: "owner", label: "Imputer au propriétaire" },
  { key: "noe", label: "Absorber sur honoraires Noé" },
  { key: "split", label: "Geste commercial — répartir 50/50" },
  { key: "custom", label: "Autre…" },
];

function NegativeCard({ op }: { op: NegativeOp }) {
  const { resolveNegative } = useFacturation();
  const [decision, setDecision] = useState<NegativeDecision>(op.recommended);
  const [custom, setCustom] = useState<number | "">("");
  const [note, setNote] = useState("");
  const property = getProperty(op.propertyId);
  const owner = getOwnerByProperty(op.propertyId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-[20px] bg-[#F5C842]/[0.04] border border-[#F5C842]/[0.12] p-7 space-y-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#F5C842]">{TYPE_LABEL[op.type]}</p>
          <h4 className="mt-2 text-base font-semibold text-white">Réservation {op.platform === "booking" ? "Booking" : "Airbnb"} #{op.ref}</h4>
        </div>
        <div
          className="text-[#F87171] font-light tabular-nums leading-none"
          style={{ fontSize: "32px", letterSpacing: "-0.02em" }}
        >
          {formatMoney(op.amount)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[13px]">
        <Info k="Voyageur" v={op.guest} />
        <Info k="Logement" v={`${property.name} • ${property.city}`} />
        <Info k="Propriétaire" v={owner.name} />
        <Info k="Survenu le" v={shortDate(op.occurredAt)} />
      </div>
      <p className="text-[13px] text-white/70 leading-relaxed">{op.details}</p>

      <div className="border-t border-white/[0.06] pt-4">
        <p className="text-xs uppercase tracking-[0.1em] text-white/45 mb-3">Comment traiter cette opération&nbsp;?</p>
        <div className="space-y-2">
          {DECISIONS.map((d) => {
            const active = decision === d.key;
            const isReco = d.key === op.recommended;
            return (
              <button
                key={d.key}
                onClick={() => setDecision(d.key)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-[12px] text-sm transition-colors",
                  active ? "bg-white/[0.06] border border-white/[0.1]" : "border border-transparent hover:bg-white/[0.03]"
                )}
              >
                <span className={cn("h-4 w-4 rounded-full border flex items-center justify-center transition-colors",
                  active ? "border-[#FF5C1A]" : "border-white/30"
                )}>
                  {active && <span className="h-2 w-2 rounded-full bg-[#FF5C1A]" />}
                </span>
                <span className="flex-1 text-left text-white/85">{d.label}</span>
                {isReco && <span className="text-[10px] uppercase tracking-[0.1em] text-[#4ADE80]">Recommandé</span>}
                {d.key === "custom" && active && (
                  <input
                    type="number"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Montant €"
                    onClick={(e) => e.stopPropagation()}
                    className="w-28 px-2 py-1 bg-white/[0.05] border border-white/[0.08] rounded-md text-xs text-white tabular-nums focus:outline-none focus:ring-1 focus:ring-[#FF5C1A]/40"
                  />
                )}
              </button>
            );
          })}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="Note interne (optionnel)"
          className="mt-3 w-full bg-white/[0.03] border border-white/[0.06] rounded-[12px] p-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#FF5C1A]/40"
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button className="px-4 py-2 rounded-[12px] text-sm text-white/70 hover:bg-white/[0.05] transition-colors">
          Reporter
        </button>
        <button
          onClick={() => resolveNegative(op.id, decision, typeof custom === "number" ? custom : undefined, note || undefined)}
          className="px-4 py-2 rounded-[12px] text-sm font-medium bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_4px_14px_rgba(255,92,26,0.3)] active:scale-[0.98] transition-all"
        >
          Valider →
        </button>
      </div>
    </motion.div>
  );
}

function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <span className="text-white/40">{k} : </span>
      <span className="text-white/85">{v}</span>
    </div>
  );
}

function ResolvedRow({ op }: { op: NegativeOp }) {
  const { reopenNegative } = useFacturation();
  const decisionLabel = DECISIONS.find((d) => d.key === op.decision)?.label ?? "—";
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-[12px] bg-[#4ADE80]/[0.04] border border-[#4ADE80]/[0.08] text-sm"
    >
      <span className="text-[10px] uppercase tracking-[0.1em] text-[#4ADE80]/80">{TYPE_LABEL[op.type]}</span>
      <span className="text-white/80 truncate flex-1">{op.guest} • {op.ref}</span>
      <span className="text-white/60 truncate hidden md:inline">{decisionLabel}</span>
      <span className="tabular-nums text-[#F87171]/90">{formatMoney(op.amount)}</span>
      <button
        onClick={() => reopenNegative(op.id)}
        className="p-1.5 rounded-full hover:bg-white/[0.06] text-white/50"
        title="Rouvrir"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </motion.div>
  );
}

export function NegativeOpsTab() {
  const { negativeOps } = useFacturation();
  const pending = negativeOps.filter((n) => n.decision === null);
  const resolved = negativeOps.filter((n) => n.decision !== null);
  const [openResolved, setOpenResolved] = useState(true);

  return (
    <div className="space-y-5">
      {pending.length > 0 ? (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-[14px] bg-[#F5C842]/[0.08] border border-[#F5C842]/[0.2]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-[#F5C842]" strokeWidth={1.5} />
            <p className="text-sm text-white/85">
              <strong className="font-semibold">{pending.length} opération{pending.length > 1 ? "s" : ""} négative{pending.length > 1 ? "s" : ""}</strong> nécessite{pending.length > 1 ? "nt" : ""} une décision avant la génération des factures.
            </p>
          </div>
          <button className="text-xs text-white/70 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/[0.06]">
            Tout traiter en lot
          </button>
        </div>
      ) : (
        <div className="px-4 py-3 rounded-[14px] bg-[#4ADE80]/[0.06] border border-[#4ADE80]/[0.15] text-sm text-white/85">
          ✓ Toutes les opérations ont été traitées. Vous pouvez générer les factures.
        </div>
      )}

      <LayoutGroup>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {pending.map((op) => <NegativeCard key={op.id} op={op} />)}
          </AnimatePresence>
        </div>

        {resolved.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setOpenResolved((o) => !o)}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white/85 transition-colors"
            >
              <ChevronDown className={cn("h-4 w-4 transition-transform", openResolved && "rotate-180")} strokeWidth={1.5} />
              Opérations traitées ({resolved.length})
            </button>
            <AnimatePresence>
              {openResolved && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden mt-3 space-y-2"
                >
                  {resolved.map((op) => <ResolvedRow key={op.id} op={op} />)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}
