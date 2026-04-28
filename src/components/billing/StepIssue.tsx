import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { useSession, ownerById, PRO } from "@/hooks/useFacturationSession";
import { fmt } from "@/mocks/facturation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function StepIssue() {
  const { drafts, invoicesIssued, issueAllInvoices, setActiveStep } = useSession();
  const [issuing, setIssuing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentNum, setCurrentNum] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  const totalTtc = drafts.reduce((s, d) => s + d.totalTtc, 0);
  const sepaCount = drafts.filter(d => {
    const o = ownerById(d.ownerId);
    return o?.hasMandateSEPA && o?.iban && d.net > 0;
  }).length;
  const sepaAmount = drafts.filter(d => {
    const o = ownerById(d.ownerId);
    return o?.hasMandateSEPA && o?.iban && d.net > 0;
  }).reduce((s, d) => s + d.net, 0);
  const manualCount = drafts.length - sepaCount;
  const manualAmount = totalTtc - sepaAmount;

  const launch = async () => {
    setIssuing(true);
    for (let i = 0; i < drafts.length; i++) {
      setCurrentNum(14542 + i);
      setProgress(((i + 1) / drafts.length) * 100);
      await new Promise(r => setTimeout(r, 50));
    }
    issueAllInvoices();
    setTimeout(() => { setIssuing(false); setShowConfirm(true); }, 200);
  };

  if (showConfirm || invoicesIssued) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-[24px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] p-12 max-w-[640px] mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="h-16 w-16 rounded-full bg-[#4ADE80]/15 mx-auto flex items-center justify-center"
        >
          <CheckCircle2 className="h-8 w-8 text-[#4ADE80]" strokeWidth={1.8} />
        </motion.div>
        <h2 className="mt-5 text-[28px] font-light text-white">{drafts.length} factures émises</h2>
        <p className="text-[14px] text-white/55 mt-2 tabular-nums">
          {fmt(totalTtc)} facturés • {sepaCount} prélèvements SEPA programmés
        </p>
        <div className="mt-8 space-y-2 text-left max-w-sm mx-auto text-[12.5px] text-white/70">
          <p className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> Numéros attribués ({PRO.invoicePrefix}-14542 à {PRO.invoicePrefix}-{14542 + drafts.length - 1})</p>
          <p className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> PDFs générés et archivés</p>
          <p className="flex items-center gap-2"><span className="text-[#4ADE80]">✓</span> Emails envoyés aux propriétaires</p>
        </div>
        <div className="mt-8 flex gap-2 justify-center">
          <button className="px-4 py-2 rounded-[10px] bg-white/[0.05] hover:bg-white/[0.08] text-white/75 text-[13px]">Voir les factures</button>
          <button
            onClick={() => setActiveStep("sepa")}
            className="px-4 py-2 rounded-[10px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold flex items-center gap-1.5"
          >
            Continuer vers SEPA <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-[24px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] p-10 md:p-12 max-w-[720px] mx-auto">
      <h2 className="text-[26px] md:text-[30px] font-light text-white tracking-tight">
        Prêt à émettre <span className="font-medium tabular-nums">{drafts.length}</span> factures pour Mars 2026
      </h2>

      <dl className="mt-8 space-y-3">
        <div className="flex justify-between border-b border-white/[0.06] pb-3">
          <dt className="text-[13px] text-white/55">Total à facturer (TTC)</dt>
          <dd className="text-[15px] text-white font-medium tabular-nums">{fmt(totalTtc)}</dd>
        </div>
        <div className="flex justify-between border-b border-white/[0.06] pb-3">
          <dt className="text-[13px] text-white/55">Dont prélèvements SEPA</dt>
          <dd className="text-[13px] text-white/85 tabular-nums">{sepaCount} factures ({fmt(sepaAmount)})</dd>
        </div>
        <div className="flex justify-between border-b border-white/[0.06] pb-3">
          <dt className="text-[13px] text-white/55">Dont virements manuels</dt>
          <dd className="text-[13px] text-white/85 tabular-nums">{manualCount} factures ({fmt(manualAmount)})</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[13px] text-white/55">Avoirs trop-perçu</dt>
          <dd className="text-[13px] text-white/85 tabular-nums">0</dd>
        </div>
      </dl>

      {issuing ? (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-5 w-5 text-[#FF5C1A] animate-pulse" />
            <p className="text-[13px] text-white/75 tabular-nums">Émission de la facture {currentNum - 14541}/{drafts.length} — {PRO.invoicePrefix}-{currentNum}…</p>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full bg-[#FF5C1A]" animate={{ width: `${progress}%` }} transition={{ duration: 0.05 }} />
          </div>
        </div>
      ) : (
        <button
          onClick={launch}
          className="mt-8 w-full h-14 rounded-[14px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[15px] font-semibold transition-all active:scale-[0.99] shadow-[0_6px_20px_rgba(255,92,26,0.35)]"
        >
          Émettre et envoyer les {drafts.length} factures
        </button>
      )}

      <p className="mt-3 text-center text-[11px] text-white/40">
        Les numéros de facture seront définitifs et immuables après émission.
      </p>
    </div>
  );
}
