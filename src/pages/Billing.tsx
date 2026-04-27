import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFacturation, FacturationProvider } from "@/hooks/useFacturation";
import { FacturationPeriodPill, FacturationProgress } from "@/components/billing/FacturationHeader";
import { KpiHero } from "@/components/billing/KpiHero";
import { FacturationTabs } from "@/components/billing/FacturationTabs";
import { ReservationsTab } from "@/components/billing/ReservationsTab";
import { NegativeOpsTab } from "@/components/billing/NegativeOpsTab";
import { ComplementsTab } from "@/components/billing/ComplementsTab";
import { InvoicesTab } from "@/components/billing/InvoicesTab";
import { SepaTab } from "@/components/billing/SepaTab";
import { toast } from "sonner";

function PrimaryCta() {
  const { bookingFile, airbnbFile, totals, invoicesGenerated, sentOwnerIds, cartG, sepaGenerated, setActiveTab, generateInvoices, importBooking, importAirbnb } = useFacturation();

  const ctx = useMemo(() => {
    if (!bookingFile && !airbnbFile) return { label: "Importer les CSV", action: () => { importBooking(); importAirbnb(); toast.success("CSV importés"); setActiveTab("reservations"); } };
    if (totals.negPending > 0) return { label: `Traiter les cohérences (${totals.negPending})`, action: () => setActiveTab("negatives") };
    if (!invoicesGenerated) return { label: "Générer les factures", action: () => { generateInvoices(); setActiveTab("invoices"); toast.success("Factures générées"); } };
    if (sentOwnerIds.size === 0) return { label: "Envoyer aux propriétaires", action: () => setActiveTab("invoices") };
    if (cartG && !sepaGenerated) return { label: "Télécharger le XML SEPA", action: () => setActiveTab("sepa") };
    return { label: "Cycle complet ✓", action: () => setActiveTab("invoices") };
  }, [bookingFile, airbnbFile, totals.negPending, invoicesGenerated, sentOwnerIds.size, cartG, sepaGenerated]);

  return (
    <motion.button
      layout
      onClick={ctx.action}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="px-5 py-2.5 rounded-[12px] text-sm font-semibold bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_4px_14px_rgba(255,92,26,0.35)] active:scale-[0.98] transition-all"
    >
      <AnimatePresence mode="wait">
        <motion.span key={ctx.label} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
          {ctx.label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function FacturationContent() {
  const { activeTab } = useFacturation();
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <FacturationPeriodPill />
        <FacturationProgress />
        <PrimaryCta />
      </header>

      <KpiHero />

      <FacturationTabs />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {activeTab === "reservations" && <ReservationsTab />}
          {activeTab === "negatives" && <NegativeOpsTab />}
          {activeTab === "complements" && <ComplementsTab />}
          {activeTab === "invoices" && <InvoicesTab />}
          {activeTab === "sepa" && <SepaTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function Billing() {
  useEffect(() => { document.title = "Facturation — Noé"; }, []);
  return (
    <FacturationProvider>
      <section className="relative isolate -mx-[var(--app-gutter)] -mt-[clamp(1.25rem,3vw,2rem)] -mb-[clamp(1.25rem,3vw,2rem)] min-h-[calc(100dvh-72px)] overflow-hidden bg-background px-[var(--app-gutter)] pt-[clamp(1.25rem,3vw,2rem)] pb-[clamp(1.25rem,3vw,2rem)] text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,hsl(var(--primary)/0.12),transparent_28%),radial-gradient(circle_at_86%_16%,hsl(var(--status-info)/0.10),transparent_30%),radial-gradient(circle_at_78%_78%,hsl(var(--status-success)/0.08),transparent_28%)]" />
        <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-foreground">Facturation</h1>
          <p className="text-sm text-muted-foreground mt-1">Cockpit de facturation mensuelle des propriétaires</p>
        </div>
        <FacturationContent />
        </div>
      </section>
    </FacturationProvider>
  );
}
