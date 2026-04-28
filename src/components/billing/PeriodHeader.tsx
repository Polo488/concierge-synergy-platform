import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, Search, PanelRightOpen } from "lucide-react";
import { useSession } from "@/hooks/useFacturationSession";
import { PERIODS } from "@/mocks/facturation";
import { cn } from "@/lib/utils";

const STATE_LABEL = {
  draft: { label: "Brouillon", cls: "bg-white/[0.06] text-white/70" },
  in_progress: { label: "En cours", cls: "bg-[#F5C842]/15 text-[#F5C842]" },
  issued: { label: "Émis", cls: "bg-[#4ADE80]/15 text-[#4ADE80]" },
  closed: { label: "Bouclé", cls: "bg-[#6B7AE8]/15 text-[#6B7AE8]" },
} as const;

export function PeriodHeader() {
  const { periodLabel, setPeriodLabel, sessionState, hidePanel, setHidePanel } = useSession();
  const [open, setOpen] = useState(false);
  const st = STATE_LABEL[sessionState];

  return (
    <header className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2.5 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.08] ring-1 ring-inset ring-white/[0.06] transition-all active:scale-[0.98]"
          >
            <Calendar className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-white tabular-nums">{periodLabel}</span>
            <ChevronDown className={cn("h-3 w-3 text-white/45 transition-transform", open && "rotate-180")} strokeWidth={1.5} />
          </button>
          <AnimatePresence>
            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 mt-2 w-52 rounded-2xl bg-[#1a1a2e]/95 backdrop-blur-2xl ring-1 ring-white/[0.08] shadow-2xl z-50 overflow-hidden"
                >
                  {PERIODS.map(p => (
                    <button
                      key={p}
                      onClick={() => { setPeriodLabel(p); setOpen(false); }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-[13px] hover:bg-white/[0.05] transition-colors",
                        p === periodLabel ? "text-[#FF5C1A] font-medium" : "text-white/80"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <span className={cn("px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-tight", st.cls)}>
          {st.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-inset ring-white/[0.06] text-[12px] text-white/65 transition-colors"
        >
          <Search className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Rechercher</span>
          <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/50 font-mono">⌘K</kbd>
        </button>
        {hidePanel && (
          <button
            onClick={() => setHidePanel(false)}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-inset ring-white/[0.06] transition-colors"
            title="Afficher les tâches en attente"
          >
            <PanelRightOpen className="h-3.5 w-3.5 text-white/60" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </header>
  );
}
