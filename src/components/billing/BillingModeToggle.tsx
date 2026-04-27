import { motion } from "framer-motion";
import { Shield, Receipt } from "lucide-react";
import { useBillingTenant } from "@/hooks/useBillingTenant";
import { cn } from "@/lib/utils";

export function BillingModeToggle() {
  const { mode, setMode } = useBillingTenant();

  return (
    <div
      role="tablist"
      aria-label="Mode de facturation"
      className="relative inline-flex items-center rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl"
    >
      {(["CARTE_G", "HONORAIRES"] as const).map((m) => {
        const active = mode === m;
        const Icon = m === "CARTE_G" ? Shield : Receipt;
        const label = m === "CARTE_G" ? "Carte G" : "Honoraires";
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => setMode(m)}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-[12.5px] font-medium transition-colors duration-200 min-h-[32px] z-[1]",
              active ? "text-white" : "text-white/55 hover:text-white/80"
            )}
          >
            {active && (
              <motion.span
                layoutId="billing-mode-active"
                className="absolute inset-0 -z-[1] rounded-[9px] bg-white/[0.10] shadow-[0_1px_2px_rgba(0,0,0,0.18)] ring-1 ring-inset ring-white/[0.06]"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            <Icon size={14} strokeWidth={1.75} />
            <span className="tracking-tight">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
