import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Inbox, FileStack, ShieldAlert, X, Receipt } from "lucide-react";
import { useSession } from "@/hooks/useFacturationSession";
import { fmt } from "@/mocks/facturation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function Section({
  icon: Icon, title, count, children, defaultOpen = true,
}: { icon: typeof Inbox; title: string; count: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-white/[0.02] transition-colors"
      >
        <Icon className="h-4 w-4 text-white/55" strokeWidth={1.6} />
        <span className="text-[12.5px] font-medium text-white flex-1 text-left">{title}</span>
        {count > 0 && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold bg-white/[0.06] text-white/70">
            {count}
          </span>
        )}
        <ChevronDown className={cn("h-3.5 w-3.5 text-white/40 transition-transform", open && "rotate-180")} strokeWidth={1.5} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 flex flex-col gap-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RightPanel() {
  const { providerTodos, complementaryTodos, vigilance, setHidePanel } = useSession();

  return (
    <aside className="flex flex-col h-full rounded-[20px] bg-white/[0.025] backdrop-blur-xl ring-1 ring-inset ring-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <h3 className="text-[13px] font-medium text-white/85">Tâches en attente externe</h3>
        <button onClick={() => setHidePanel(true)} className="p-1 rounded-md hover:bg-white/5 transition-colors">
          <X className="h-3.5 w-3.5 text-white/40" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Section icon={Inbox} title="Factures prestataires reçues" count={providerTodos.length}>
          {providerTodos.map(t => (
            <div key={t.id} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/[0.04]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-white truncate">{t.providerName}</p>
                  <p className="text-[11px] text-white/45 mt-0.5">{t.hint}</p>
                </div>
                <span className="text-[12px] font-medium text-white tabular-nums shrink-0">{fmt(t.amountTtc)}</span>
              </div>
              <button
                onClick={() => toast.success(`Facture ${t.providerName} saisie`)}
                className="mt-2.5 w-full text-[11.5px] font-medium text-[#FF5C1A] hover:bg-[#FF5C1A]/10 rounded-lg py-1.5 transition-colors"
              >
                Saisir la facture →
              </button>
            </div>
          ))}
        </Section>

        <Section icon={FileStack} title="Factures complémentaires à émettre" count={complementaryTodos.length}>
          {complementaryTodos.map(c => (
            <div key={c.id} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/[0.04]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-white truncate">{c.ownerName}</p>
                  <p className="text-[11px] text-white/45 mt-0.5">{c.monthLabel}</p>
                </div>
                <span className="text-[12px] font-medium text-white tabular-nums shrink-0">{fmt(c.amount)}</span>
              </div>
              <button
                onClick={() => toast.success(`Facture complémentaire émise pour ${c.ownerName}`)}
                className="mt-2.5 w-full text-[11.5px] font-medium bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1.5"
              >
                <Receipt className="h-3 w-3" strokeWidth={1.8} />
                Émettre
              </button>
            </div>
          ))}
        </Section>

        <Section icon={ShieldAlert} title="Vigilance" count={vigilance.length}>
          {vigilance.map(v => (
            <div key={v.id} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-inset ring-white/[0.04]">
              <div className="flex items-start gap-2.5">
                <span className={cn(
                  "mt-1 h-1.5 w-1.5 rounded-full shrink-0",
                  v.level === "yellow" ? "bg-[#F5C842]" : v.level === "orange" ? "bg-[#FF5C1A]" : "bg-[#F87171]"
                )} />
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-white">{v.title}</p>
                  <p className="text-[11px] text-white/45 mt-0.5">{v.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </Section>
      </div>
    </aside>
  );
}
