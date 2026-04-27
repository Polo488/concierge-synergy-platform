import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFacturation, FacturationProvider } from "@/hooks/useFacturation";
import { BillingTenantProvider, useBillingTenant } from "@/hooks/useBillingTenant";
import { FacturationPeriodPill, FacturationProgress } from "@/components/billing/FacturationHeader";
import { BillingModeToggle } from "@/components/billing/BillingModeToggle";
import { KpiHero } from "@/components/billing/KpiHero";
import { FacturationTabs } from "@/components/billing/FacturationTabs";
import { ReservationsTab } from "@/components/billing/ReservationsTab";
import { NegativeOpsTab } from "@/components/billing/NegativeOpsTab";
import { ComplementsTab } from "@/components/billing/ComplementsTab";
import { ProviderCallsTab } from "@/components/billing/ProviderCallsTab";
import { InvoicesTab } from "@/components/billing/InvoicesTab";
import { SepaTab } from "@/components/billing/SepaTab";
import { ReconciliationTab } from "@/components/billing/ReconciliationTab";
import { EscrowTab } from "@/components/billing/EscrowTab";
import { FacturationMetierBridge } from "@/components/billing/FacturationMetierBridge";
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
      className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-[14px] sm:rounded-[12px] text-[15px] sm:text-sm font-semibold bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white shadow-[0_4px_14px_rgba(255,92,26,0.35)] active:scale-[0.98] transition-all min-h-[44px]"
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
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <FacturationPeriodPill />
          <FacturationProgress />
          <BillingModeToggle />
        </div>
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
          {activeTab === "provider-calls" && <ProviderCallsTab />}
          {activeTab === "reconciliation" && <ReconciliationTab />}
          {activeTab === "invoices" && <InvoicesTab />}
          {activeTab === "escrow" && <EscrowTab />}
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
      <FacturationMetierBridge>
      <section className="bill-scope relative isolate -mx-[var(--app-gutter)] -mt-[clamp(1.25rem,3vw,2rem)] -mb-[clamp(1.25rem,3vw,2rem)] min-h-[calc(100dvh-72px)] overflow-hidden bg-background px-[var(--app-gutter)] pt-[clamp(1.25rem,3vw,2rem)] pb-[clamp(1.25rem,3vw,2rem)] text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,hsl(var(--primary)/0.12),transparent_28%),radial-gradient(circle_at_86%_16%,hsl(var(--status-info)/0.10),transparent_30%),radial-gradient(circle_at_78%_78%,hsl(var(--status-success)/0.08),transparent_28%)]" />
        <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-6">
          <h1 className="font-heading font-semibold tracking-[-0.025em] text-foreground" style={{ fontSize: "clamp(28px, 4vw, 34px)", lineHeight: 1.1 }}>Facturation</h1>
          <p className="text-[14px] text-muted-foreground mt-1.5">Cockpit de facturation mensuelle des propriétaires</p>
        </div>
        <FacturationContent />
        </div>
      </section>
      </FacturationMetierBridge>
    </FacturationProvider>
  );
}
