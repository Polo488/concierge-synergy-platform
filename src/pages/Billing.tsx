import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FacturationSessionProvider, useSession } from "@/hooks/useFacturationSession";
import { Timeline } from "@/components/billing/Timeline";
import { RightPanel } from "@/components/billing/RightPanel";
import { PeriodHeader } from "@/components/billing/PeriodHeader";
import { StepSync } from "@/components/billing/StepSync";
import { StepBA } from "@/components/billing/StepBA";
import { StepDrafts } from "@/components/billing/StepDrafts";
import { StepIssue } from "@/components/billing/StepIssue";
import { StepSepa } from "@/components/billing/StepSepa";
import { StepWrap } from "@/components/billing/StepWrap";
import { cn } from "@/lib/utils";
import "@/styles/billing-light.css";

function StepRenderer() {
  const { activeStep } = useSession();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {activeStep === "sync" && <StepSync />}
        {activeStep === "ba" && <StepBA />}
        {activeStep === "drafts" && <StepDrafts />}
        {activeStep === "issue" && <StepIssue />}
        {activeStep === "sepa" && <StepSepa />}
        {activeStep === "wrap" && <StepWrap />}
      </motion.div>
    </AnimatePresence>
  );
}

function StepHeader() {
  const { steps, activeStep } = useSession();
  const s = steps.find(x => x.key === activeStep);
  if (!s) return null;
  return (
    <div className="mb-5">
      <p className="text-[10.5px] uppercase tracking-[0.18em] text-white/35 font-medium">Étape {s.number} sur 6</p>
      <h2 className="mt-1.5 text-[24px] md:text-[28px] font-semibold text-white tracking-tight">{s.title}</h2>
    </div>
  );
}

function CockpitContent() {
  const { hidePanel } = useSession();
  return (
    <div className="space-y-5">
      <PeriodHeader />

      <div className={cn(
        "grid gap-5",
        hidePanel ? "lg:grid-cols-[260px_1fr]" : "lg:grid-cols-[260px_1fr_320px]"
      )}>
        {/* Timeline */}
        <div className="rounded-[20px] bg-white/[0.025] backdrop-blur-xl ring-1 ring-inset ring-white/[0.06] p-3 lg:sticky lg:top-3 lg:self-start lg:max-h-[calc(100dvh-100px)] overflow-y-auto">
          <p className="px-3 pt-2 pb-3 text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">Session</p>
          <Timeline />
        </div>

        {/* Main */}
        <main className="min-w-0">
          <StepHeader />
          <StepRenderer />
        </main>

        {/* Right Panel */}
        {!hidePanel && (
          <div className="lg:sticky lg:top-3 lg:self-start lg:max-h-[calc(100dvh-100px)]">
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Billing() {
  useEffect(() => { document.title = "Facturation — Noé"; }, []);
  return (
    <FacturationSessionProvider>
      <section className="facturation-cockpit relative isolate -mx-[var(--app-gutter)] -mt-[clamp(1.25rem,3vw,2rem)] -mb-[clamp(1.25rem,3vw,2rem)] min-h-[calc(100dvh-72px)] overflow-hidden bg-[#0F0F1E] text-white px-[var(--app-gutter)] pt-[clamp(1.25rem,3vw,2rem)] pb-[clamp(1.25rem,3vw,2rem)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(255,92,26,0.10),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(107,122,232,0.10),transparent_32%),radial-gradient(circle_at_78%_82%,rgba(74,222,128,0.06),transparent_30%)]" />
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="mb-5">
            <h1 className="text-[28px] md:text-[34px] font-semibold tracking-tight text-white">Facturation</h1>
            <p className="text-[13.5px] text-white/55 mt-1">Session mensuelle — checklist de bout en bout</p>
          </div>
          <CockpitContent />
        </div>
      </section>
    </FacturationSessionProvider>
  );
}
