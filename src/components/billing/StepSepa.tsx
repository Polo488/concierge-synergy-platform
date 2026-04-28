import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowRight, CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";
import { useSession, ownerById, propById, PRO } from "@/hooks/useFacturationSession";
import { fmt } from "@/mocks/facturation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function fakeHash() {
  return "sha256:" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
}

function GenerationCard({
  title, count, amount, type, onMarkTransmitted,
}: { title: string; count: number; amount: number; type: "SDD" | "SCT"; onMarkTransmitted: () => void }) {
  const [hash, setHash] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const launch = async () => {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1200));
    setHash(fakeHash());
    setGeneratedAt(new Date().toLocaleString("fr-FR"));
    setGenerating(false);
    toast.success(`Fichier ${type} généré`);
  };

  return (
    <div className="rounded-[18px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[15px] font-semibold text-white">{title} — {count} {type === "SDD" ? "factures" : "virements"}</h3>
          <p className="text-[12px] text-white/50 mt-1 tabular-nums">{fmt(amount)} • exécution prévue J+5</p>
        </div>
        {hash && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4ADE80]/12 text-[#4ADE80] text-[10.5px] font-medium">
            <CheckCircle2 className="h-3 w-3" strokeWidth={2} /> Généré
          </span>
        )}
      </div>

      {hash ? (
        <div className="mt-4 space-y-2 text-[11.5px] text-white/55">
          <p><span className="text-white/40">Hash :</span> <span className="font-mono text-white/75 break-all">{hash}</span></p>
          <p><span className="text-white/40">Généré le :</span> {generatedAt}</p>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { onMarkTransmitted(); toast.success("Marqué comme transmis"); }}
              className="flex-1 px-3 py-2 rounded-lg bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[12px] font-semibold"
            >
              Marquer comme transmis
            </button>
            <button className="px-3 py-2 rounded-lg bg-white/[0.05] text-white/70 text-[12px]">
              Re-télécharger
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={launch}
          disabled={generating}
          className={cn(
            "mt-5 w-full px-4 py-2.5 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-all",
            generating ? "bg-white/[0.05] text-white/50" : "bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 active:scale-[0.98]"
          )}
        >
          <Download className="h-4 w-4" strokeWidth={1.8} />
          {generating ? "Génération…" : `Générer le fichier XML SEPA ${type}`}
        </button>
      )}
    </div>
  );
}

export function StepSepa() {
  const { drafts, sdrGenerated, sctGenerated, setSdrGenerated, setSctGenerated, setActiveStep } = useSession();

  const sddDrafts = drafts.filter(d => {
    const o = ownerById(d.ownerId);
    return o?.hasMandateSEPA && o?.iban && d.net > 0;
  });
  const sctDrafts = drafts.filter(d => {
    const p = propById(d.propertyId);
    return p?.mode === "P3" || d.net < 0;
  });

  const sddTotal = sddDrafts.reduce((s, d) => s + d.net, 0);
  const sctTotal = Math.abs(sctDrafts.reduce((s, d) => s + d.net, 0));
  const escrowProjected = 12340;

  const oneGenerated = sdrGenerated || sctGenerated;

  return (
    <div className="space-y-5 max-w-[920px] mx-auto">
      <GenerationCard title="Prélèvements SEPA" count={sddDrafts.length} amount={sddTotal} type="SDD" onMarkTransmitted={() => setSdrGenerated(true)} />
      <GenerationCard title="Virements SEPA" count={sctDrafts.length} amount={sctTotal} type="SCT" onMarkTransmitted={() => setSctGenerated(true)} />

      <div className="rounded-[18px] bg-white/[0.03] ring-1 ring-inset ring-white/[0.06] p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-xl bg-[#6B7AE8]/12 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-[#6B7AE8]" strokeWidth={1.6} />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-white">Séquestre (mandant)</h3>
            <p className="text-[11px] text-white/45">IBAN : {PRO.ibanSequestre}</p>
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3">
          <span className="text-[12.5px] text-white/65">Solde projeté après virements</span>
          <span className={cn("text-[16px] font-semibold tabular-nums", escrowProjected >= 0 ? "text-[#4ADE80]" : "text-[#F87171]")}>
            {fmt(escrowProjected)}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {oneGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 rounded-[16px] bg-white/[0.025] ring-1 ring-inset ring-white/[0.06] px-5 py-4 sticky bottom-3"
          >
            <div className="flex items-center gap-2.5">
              <FileCheck className="h-4 w-4 text-[#4ADE80]" strokeWidth={2} />
              <p className="text-[13.5px] text-white/85">Mouvements SEPA générés</p>
            </div>
            <button
              onClick={() => setActiveStep("wrap")}
              className="px-4 py-2 rounded-[10px] bg-[#FF5C1A] hover:bg-[#FF5C1A]/90 text-white text-[13px] font-semibold flex items-center gap-1.5"
            >
              Voir le bilan du mois
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
