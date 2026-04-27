import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar } from "lucide-react";
import { useFacturation, type CycleStatus } from "@/hooks/useFacturation";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<CycleStatus, { label: string; cls: string }> = {
  draft: { label: "Brouillon", cls: "bg-white/8 text-white/70" },
  processing: { label: "En traitement", cls: "bg-[#F5C842]/15 text-[#F5C842]" },
  validated: { label: "Validé", cls: "bg-[#4ADE80]/15 text-[#4ADE80]" },
  sent: { label: "Envoyé", cls: "bg-[#6B7AE8]/15 text-[#6B7AE8]" },
};

const PERIODS = ["Août 2026", "Septembre 2026", "Octobre 2026", "Novembre 2026"];

export function FacturationPeriodPill() {
  const { periodLabel, setPeriodLabel, cycleStatus } = useFacturation();
  const [open, setOpen] = useState(false);
  const status = STATUS_LABEL[cycleStatus];

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.06] transition-all duration-200 active:scale-[0.98]"
      >
        <Calendar className="h-4 w-4 text-white/60" strokeWidth={1.5} />
        <span className="text-sm font-medium text-white">{periodLabel}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-white/50 transition-transform", open && "rotate-180")} strokeWidth={1.5} />
      </button>
      <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-medium tracking-tight", status.cls)}>
        {status.label}
      </span>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl z-50 overflow-hidden"
            >
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPeriodLabel(p); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.05] transition-colors",
                    p === periodLabel ? "text-[#FF5C1A] font-medium" : "text-white/80"
                  )}
                >
                  {p}
                </button>
              ))}
              <div className="border-t border-white/[0.06]">
                <button className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:bg-white/[0.05]">
                  Période personnalisée…
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const STEPS = [
  { key: "imported", label: "Données importées" },
  { key: "coherence", label: "Cohérences traitées" },
  { key: "complements", label: "Compléments validés" },
  { key: "sent", label: "Factures envoyées" },
];

export function FacturationProgress() {
  const { bookingFile, airbnbFile, totals, invoicesGenerated, sentOwnerIds, setActiveTab } = useFacturation();
  const dataDone = !!(bookingFile || airbnbFile);
  const cohDone = dataDone && totals.negPending === 0;
  const compDone = cohDone && invoicesGenerated;
  const sentDone = compDone && sentOwnerIds.size > 0;
  const states = [dataDone, cohDone, compDone, sentDone];
  const targets: Array<"reservations" | "negatives" | "complements" | "invoices"> = [
    "reservations", "negatives", "complements", "invoices",
  ];

  return (
    <div className="hidden md:flex items-center gap-3">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(targets[i])}
            title={s.label}
            className="group relative flex items-center justify-center"
          >
            <span
              className={cn(
                "block h-2 w-2 rounded-full transition-all duration-300",
                states[i] ? "bg-[#FF5C1A] shadow-[0_0_12px_rgba(255,92,26,0.5)]" : "bg-white/15"
              )}
            />
            <span className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-white/0 group-hover:text-white/70 transition-colors">
              {s.label}
            </span>
          </button>
          {i < STEPS.length - 1 && (
            <span className={cn("h-px w-6", states[i] ? "bg-[#FF5C1A]/30" : "bg-white/8")} />
          )}
        </div>
      ))}
    </div>
  );
}
