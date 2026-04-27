import { motion } from "framer-motion";
import { useFacturation, type TabKey } from "@/hooks/useFacturation";
import { useFacturationMetier } from "@/hooks/useFacturationMetier";
import { cn } from "@/lib/utils";

interface TabDef { key: TabKey; label: string; counter?: number; counterTone?: "warn" | "danger" | "info"; }

export function FacturationTabs() {
  const { activeTab, setActiveTab, totals, cartG } = useFacturation();
  const { reconciliation, invoiceStats, closingChecks } = useFacturationMetier();
  const tabs: TabDef[] = [
    { key: "reservations", label: "Réservations" },
    { key: "negatives", label: "Opérations négatives", counter: totals.negPending || undefined, counterTone: "warn" },
    { key: "complements", label: "Compléments" },
    { key: "reconciliation", label: "Réconciliation", counter: reconciliation.unmatched || undefined, counterTone: "warn" },
    { key: "invoices", label: "Factures", counter: invoiceStats.blocked || undefined, counterTone: "danger" },
    ...(cartG ? [{ key: "escrow" as TabKey, label: "Séquestre", counter: closingChecks.canClose ? undefined : closingChecks.blockers.length || undefined, counterTone: "info" as const }] : []),
    ...(cartG ? [{ key: "sepa" as TabKey, label: "Virements SEPA" }] : []),
  ];

  return (
    <div className="-mx-[var(--app-gutter)] sm:mx-0 px-[var(--app-gutter)] sm:px-0 overflow-x-auto sm:overflow-visible scrollbar-hide">
      <div className="inline-flex sm:flex sm:flex-wrap min-w-full gap-1 rounded-[14px] bg-white/[0.04] border border-white/[0.04] p-1">
        {tabs.map((t) => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={cn(
                "relative whitespace-nowrap sm:flex-1 sm:min-w-fit px-3.5 sm:px-4 py-2.5 rounded-[10px] text-[13.5px] sm:text-sm font-medium",
                "transition-colors duration-200 min-h-[40px]",
                active ? "text-white" : "text-white/50 hover:text-white/80"
              )}
            >
              {active && (
                <motion.span
                  layoutId="fact-tab-active"
                  className="absolute inset-0 rounded-[10px] bg-white/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span className="relative inline-flex items-center gap-2">
                {t.label}
                {t.counter !== undefined && (
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold",
                    t.counterTone === "danger" ? "bg-[#F87171]/20 text-[#F87171]"
                    : t.counterTone === "info" ? "bg-[#6B7AE8]/20 text-[#6B7AE8]"
                    : "bg-[#F5C842]/20 text-[#F5C842]"
                  )}>
                    {t.counter}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
